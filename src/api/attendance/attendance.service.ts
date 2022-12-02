/* eslint-disable @typescript-eslint/no-explicit-any */
// import { env } from '../../env';

// import logger from '../../lib/logger';
// import ApiCodes from '../../lib/api.codes';
import ApiMessages from '../../lib/api.messages';
// import ApiError from '../../lib/errors';

import GroupService from '../group/group.service';
import StudentService from '../student/student.service';
import AttendanceRepository from './attendance.repository';

export default class AttendanceService {
    async initAttendance(_id: number) {
        const year = new Date().getFullYear();
        const { groups } = await new GroupService().getGroups(_id);

        return {
            message: ApiMessages.OK,
            year,
            groups
        };
    }

    async getAttendanceByGroup(groupId: number, year: number) {
        const month = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ,11, 12 ];
		const sunday: Array<any> = [];
        const saturday: Array<any> = [];
        const studentsCode: Array<number> = [];

        // 토, 일요일에 해당하는 날을 구하는 로직
		month.forEach(e => {
			const tempSunday: Array<number> = [];
			const tempSaturday: Array<number> = [];
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

        const { students } = await new StudentService().getStudentsByGroup(groupId);
        students.forEach(e => {
			studentsCode.push(e.getDataValue('_id'));
		});

        const attendances = await new AttendanceRepository().getAttendances(studentsCode);

        return {
            message: ApiMessages.OK,
            sunday,
            saturday,
            students,
            attendances
        };
    }

    async createBlankAttendance(year: number, attendance: Array<any>) {
        for (let idx = 0; idx < attendance.length; idx++) { // forEach 안 돌아가서 for문 사용
			const { id, time } = await this.separateAttendance(idx, attendance);
			const fullTime = await this.getFullTime(year, time);

			const checkAttendance = await new AttendanceRepository().getAttendance(id, fullTime);
			if (checkAttendance !== null) {
                await new AttendanceRepository().deleteAttendance(id, fullTime);
			}
		}

        return {
            message: ApiMessages.OK,
        };
    }

    async createFullAttendance(year: number, attendance: Array<any>) {
        for (let idx = 0; idx < attendance.length; idx++) { // forEach 안 돌아가서 for문 사용
            const { id, time, data } = await this.separateAttendance(idx, attendance);
            const fullTime = await this.getFullTime(year, time);

			const checkAttendance = await new AttendanceRepository().getAttendance(id, fullTime);
            if (checkAttendance === null) {
                await new AttendanceRepository().createAttendance(id, fullTime, data);
			} else {
                await new AttendanceRepository().updateAttendance(id, fullTime, data);
			}
		}

        return {
            message: ApiMessages.OK,
        };
    }

    private async separateAttendance(idx: number, attendance: Array<any>) {
		const str = attendance[idx].str.split('-');
        const id = str[0];
		const time = str[1].split('.');
        const data = attendance[idx].data;

        return {
            id,
            time,
            data
        }
    }

    private async getFullTime(year: number, time: Array<any>) {
        let fullTime: string;

        if (time[0] < 10 && time[1] < 10)
            fullTime = `${year}${time[0].padStart(2, '0')}${time[1].padStart(2, '0')}`;
        else if (time[0] < 10)
            fullTime = `${year}${time[0].padStart(2, '0')}${time[1]}`;
        else if (time[1] < 10)
            fullTime = `${year}${time[0]}${time[1].padStart(2, '0')}`;
        else
            fullTime = `${year}${time[0]}${time[1]}`;

        return fullTime;
    }
}
