// import { env } from '../../env';

// import logger from '../../lib/logger';
// import ApiCodes from '../../lib/api.codes';
import ApiMessages from '../../lib/api.messages';
// import ApiError from '../../lib/errors';

import GroupService from '../group/group.service';
import StudentService from '../student/student.service';
import AttendanceRepository from './attendance.repository';

export default class AttendanceService {
    public initAttendance = async(_id) => {
        const year = new Date().getFullYear();
        const { groups } = await new GroupService().getGroups(_id);

        return {
            message: ApiMessages.OK,
            year,
            groups
        };
    };

    public getAttendanceByGroup = async ({ groupId, year }) => {
        const month = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ,11, 12 ];
		const sunday = [];
        const saturday = [];
        const studentsCode = [];

        // 토, 일요일에 해당하는 날을 구하는 로직
		month.forEach(e => {
			const tempSunday = [];
			const tempSaturday = [];
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
    };

    public createBlankAttendance = async ({ year, attendance }) => {
        for (let idx = 0; idx < attendance.length; idx++) { // forEach 안 돌아가서 for문 사용
			const { code, time } = await this.separateAttendance({ idx, attendance });
			const fullTime = await this.getFullTime({ year, time });

			const checkAttendance = await new AttendanceRepository().getAttendance({ code, fullTime });
			if (checkAttendance !== null) {
                await new AttendanceRepository().deleteAttendance({ code, fullTime });
			}
		}

        return {
            message: ApiMessages.OK,
        };
    };

    public createFullAttendance = async ({ year, attendance }) => {
        for (let idx = 0; idx < attendance.length; idx++) { // forEach 안 돌아가서 for문 사용
            const { code, time, data } = await this.separateAttendance({ idx, attendance });
            const fullTime = await this.getFullTime({ year, time });

			const checkAttendance = await new AttendanceRepository().getAttendance({ code, fullTime });
            if (checkAttendance === null) {
                await new AttendanceRepository().createAttendance({ code, fullTime, data });
			} else {
                await new AttendanceRepository().updateAttendance({ code, fullTime, data });
			}
		}

        return {
            message: ApiMessages.OK,
        };
    };

    private separateAttendance = async ({ idx, attendance }) => {
		const str = attendance[idx].str.split('-');
        const code = str[0];
		const time = str[1].split('.');
        const data = attendance[idx].data;

        return {
            code,
            time,
            data
        }
    };

    private getFullTime = async ({ year, time }) => {
        let fullTime;

        if (time[0] < 10 && time[1] < 10)
            fullTime = `${year}${time[0].padStart(2, '0')}${time[1].padStart(2, '0')}`;
        else if (time[0] < 10)
            fullTime = `${year}${time[0].padStart(2, '0')}${time[1]}`;
        else if (time[1] < 10)
            fullTime = `${year}${time[0]}${time[1].padStart(2, '0')}`;
        else
            fullTime = `${year}${time[0]}${time[1]}`;

        return fullTime;
    };
}
