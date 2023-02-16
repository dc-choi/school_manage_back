/* eslint-disable @typescript-eslint/no-explicit-any */
import { IGroup } from '@/@types/group';
import { IStudent } from '@/@types/student';
import { IAttendance } from '@/@types/attendance';

export class AttendancesDTO {
    constructor(
        public year?: number,
        public sunday?: Array<number[]>,
        public saturday?: Array<number[]>,
        public groups?: IGroup[],
        public students?: IStudent[],
        public attendances?: IAttendance[],
    ) {}
}

// 생성자에 너무 많은 매개변수를 넣을 경우 Builder Patten으로 생성하도록 함.
export class AttendancesDTOBuilder {
    private year?: number;
    private sunday?: any[];
    private saturday?: any[];
    private groups?: IGroup[];
    private students?: IStudent[];
    private attendances?: IAttendance[];

    setDate(year: number, sunday?: Array<number[]>, saturday?: Array<number[]>) {
        this.year = year;
        this.sunday = sunday;
        this.saturday = saturday;
        return this;
    }

    setGroups(groups: IGroup[]) {
        this.groups = groups;
        return this;
    }

    setStudents(students: IStudent[]) {
        this.students = students;
        return this;
    }

    setAttendances(attendances: IAttendance[]) {
        this.attendances = attendances;
        return this;
    }

    build() {
        return new AttendancesDTO(
            this.year,
            this.sunday,
            this.saturday,
            this.groups,
            this.students,
            this.attendances
        )
    }
}
