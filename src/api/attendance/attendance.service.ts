import AttendanceRepository from './attendance.repository';

import { IStudent } from '@/@types/student';
import { IAttendance } from '@/@types/attendance';

import AttendanceDTO from '@/common/dto/attendance.dto'
import AttendanceBuilder from '@/common/builder/attendance.builder'

import { getYearDate, getFullTime } from '@/lib/utils'

import { Attendance } from '@/models/attendance.model';

import StudentService from '@/api/student/student.service';

export default class AttendanceService {
    /**
     * 그룹별 학생들의 출석 데이터를 가져옴
     *
     * @param groupId
     * @param year
     * @returns
     */
    async list(groupId: number, year: number): Promise<AttendanceBuilder> {
        const { saturday, sunday } = await getYearDate(year);

        // 그룹에 해당되는 학생들의 정보 가져오기
        const students: IStudent[] = await new StudentService().setId(groupId).list();
        const studentsCode: number[] = []; // 학생들의 pk를 담기위한 변수
        students.forEach(item => {
			studentsCode.push(item._id);
		});

        // Entity를 DTO로 변환하는 과정, 학생들의 출석정보를 가져온다.
        const attendances: Attendance[] = await new AttendanceRepository().list(studentsCode);
        const attendanceDTOs: IAttendance[] = [];
        attendances.forEach(item => attendanceDTOs.push(new AttendanceDTO(item).attendance));

        return new AttendanceBuilder()
            .setDate(year, sunday, saturday)
            .setStudents(students)
            .setAttendances(attendanceDTOs);
    }

    /**
     * 출석부 입력한 부분에 대한 처리
     *
     * @param year
     * @param attendance - [ {"_id":46,"month":2,"day":19,"data":"○"}, ... ]
     * @returns createRow: 출석이 생성되거나 갱신된 갯수
     */
    async update(year: number, attendance: Array<{ _id: number; month: number; day: number; data: string }>): Promise<number> {
        let createRow = 0;
        let checkNull = null;

        for (let idx = 0; idx < attendance.length; idx++) { // forEach 안 돌아가서 for문 사용
            const fullTime = await getFullTime(year, attendance[idx].month, attendance[idx].day);
			const check = await new AttendanceRepository().get(attendance[idx]._id, fullTime);
            if (check === null) {
                checkNull = await new AttendanceRepository().create(attendance[idx]._id, fullTime, attendance[idx].data);
                if (checkNull) createRow++;
			} else {
                const [ affectedCount ] = await new AttendanceRepository().update(attendance[idx]._id, fullTime, attendance[idx].data);
                createRow += affectedCount
			}
		}

        return createRow;
    }

    /**
     * 출석부의 공백에 대한 처리
     *
     * @param year
     * @param attendance
     * @returns deleteRow: 기존에 출석이 있다가 없어진 갯수
     */
    async delete(year: number, attendance: Array<{ _id: number; month: number; day: number; data: string }>): Promise<number> {
        let deleteRow = 0;

        for (let idx = 0; idx < attendance.length; idx++) { // forEach 안 돌아가서 for문 사용
			const fullTime = await getFullTime(year, attendance[idx].month, attendance[idx].day);
			const check = await new AttendanceRepository().get(attendance[idx]._id, fullTime);
			if (check !== null) {
                deleteRow += await new AttendanceRepository().delete(attendance[idx]._id, fullTime);
			}
		}

        return deleteRow;
    }
}
