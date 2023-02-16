import { Builder } from 'builder-pattern';

import AttendanceRepository from './attendance.repository';

import { IGroup } from '@/@types/group';
import { IStudent } from '@/@types/student';
import { IAttendance } from '@/@types/attendance';

import { AttendancesDTO, AttendancesDTOBuilder } from '@/common/dto/attendance.dto';

import { Attendance } from '@/models/attendance.model';

import GroupService from '@/api/group/group.service';
import StudentService from '@/api/student/student.service';

export default class AttendanceService {
    /**
     * 초기 화면 설정시 필요한 데이터를 내려줌
     *
     * @param _id
     * @returns
     */
    async setAttendance(_id: number): Promise<AttendancesDTO> {
        const year = new Date().getFullYear();
        const groups: IGroup[] = await new GroupService().getGroupsByAccount(_id);

        return new AttendancesDTOBuilder()
            .setDate(year)
            .setGroups(groups)
            .build();
    }

    /**
     * 그룹별 학생들의 출석 데이터를 가져옴
     *
     * @param groupId
     * @param year
     * @returns
     */
    async getAttendanceByGroup(groupId: number, year: number): Promise<AttendancesDTO> {
        const month = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ,11, 12 ];
		const sunday: Array<number[]> = []; // 1년중 일요일에 해당하는 날
        const saturday: Array<number[]> = []; // 1년중 토요일에 해당하는 날
        const studentsCode: number[] = []; // 학생들의 pk를 담기위한 변수

        // 토, 일요일에 해당하는 날을 구하는 로직
		month.forEach(e => {
			const tempSunday: number[] = [];
			const tempSaturday: number[] = [];
			const lastDay = new Date(year, e, 0).getDate();

			for (let i = 1; i <= lastDay; i++) {
				const date = new Date(year, e - 1, i);
				if (date.getDay() === 0) {
					tempSunday.push(i);
				}
                if (date.getDay() === 6) {
					tempSaturday.push(i);
				}
			}
			sunday.push(tempSunday);
            saturday.push(tempSaturday);
		});

        // 그룹에 해당되는 학생들의 정보 가져오기
        const students: IStudent[] = await new StudentService().getStudentsByGroup(groupId);
        students.forEach(item => {
			studentsCode.push(item._id);
		});

        // Entity를 DTO로 변환하는 과정, 학생들의 출석정보를 가져온다.
        const attendances: Attendance[] = await new AttendanceRepository().getAttendances(studentsCode);
        const attendancesBuilder: IAttendance[] = [];
        attendances.forEach(item => {
            attendancesBuilder.push(
                Builder<IAttendance>()
                    ._id(item._id)
                    .attendanceContent(item.attendance_content)
                    .attendanceDate(item.attendance_date)
                    .studentId(item.student__id)
                    .build()
            );
        });

        return new AttendancesDTOBuilder()
            .setDate(year, sunday, saturday)
            .setStudents(students)
            .setAttendances(attendancesBuilder)
            .build();
    }

    /**
     * 출석부의 공백에 대한 처리
     *
     * @param year
     * @param attendance
     * @returns deleteAttendance: 기존에 출석이 있다가 없어진 갯수
     */
    async createBlankAttendance(year: number, attendance: Array<{ str: string, data: string }>): Promise<number> {
        let deleteRow = 0;

        for (let idx = 0; idx < attendance.length; idx++) { // forEach 안 돌아가서 for문 사용
			const { id, time } = await this.separateAttendance(attendance[idx]);
			const fullTime = await this.getFullTime(year, time);

			const checkAttendance = await new AttendanceRepository().getAttendance(id, fullTime);
			if (checkAttendance !== null) {
                deleteRow += await new AttendanceRepository().deleteAttendance(id, fullTime);
			}
		}

        return deleteRow;
    }

    /**
     * 출석부 입력한 부분에 대한 처리
     *
     * @param year
     * @param attendance - [ { str: string, data: string }, ... ]
     * @returns
     */
    async createFullAttendance(year: number, attendance: Array<{ str: string, data: string }>): Promise<number> {
        let createRow = 0;
        let checkNull = null;

        for (let idx = 0; idx < attendance.length; idx++) { // forEach 안 돌아가서 for문 사용
            const { id, time, data } = await this.separateAttendance(attendance[idx]);
            const fullTime = await this.getFullTime(year, time);

			const checkAttendance = await new AttendanceRepository().getAttendance(id, fullTime);
            if (checkAttendance === null) {
                checkNull = await new AttendanceRepository().createAttendance(id, fullTime, data);
                if (checkNull) createRow++;
			} else {
                const [ affectedCount ] = await new AttendanceRepository().updateAttendance(id, fullTime, data);
                createRow += affectedCount
			}
		}

        return createRow;
    }

    /**
     * 배열의 인덱스 부분에 접근해서 출석 데이터를 추출한다.
     *
     * @param object 배열의 몇번째 인덱스의 데이터
     * @returns
     */
    private async separateAttendance({ str, data }): Promise<{id: number, time: string[], data: string}> {
		const splitStr = str.split('-');
        const id = splitStr[0];
		const time = splitStr[1].split('.');

        return {
            id,
            time,
            data
        }
    }

    /**
     * 학생이 출석한 날짜와 선생님이 실제로 출석체크하는 날짜가 다를 수 있기에 따로 학생이 출석한 날짜를 생성
     *
     * @param year
     * @param time
     * @returns
     */
    private async getFullTime(year: number, time: string[]) {
        const month = Number(time[0]);
        const day = Number(time[1]);
        let fullTime: string;

        if (month < 10 && day < 10)
            fullTime = `${year}${time[0].padStart(2, '0')}${time[1].padStart(2, '0')}`;
        else if (month < 10)
            fullTime = `${year}${time[0].padStart(2, '0')}${time[1]}`;
        else if (day < 10)
            fullTime = `${year}${time[0]}${time[1].padStart(2, '0')}`;
        else
            fullTime = `${year}${time[0]}${time[1]}`;

        return fullTime;
    }
}
