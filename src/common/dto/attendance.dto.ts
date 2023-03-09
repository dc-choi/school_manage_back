import { Builder } from 'builder-pattern';

import { IAttendance } from '@/@types/attendance';

import { prune } from '@/lib/utils';

import { Attendance } from '@/models/attendance.model';

export default class AttendanceDTO {
    public attendance: IAttendance;

    constructor(param: Attendance) {
        const build = Builder<IAttendance>()
            ._id(param._id)
            .content(param.content)
            .date(param.date)
            .studentId(param.student_id)
            .build();

        this.attendance = prune(build);
    }
}
