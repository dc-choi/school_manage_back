import { Builder } from 'builder-pattern';

import { IStudent } from '@/@types/student';

import { prune } from '@/lib/utils';

import { Student } from '@/models/student.model';

export default class StudentDTO {
    public student: IStudent;

    constructor(param: Student) {
        const build = Builder<IStudent>()
            ._id(param._id)
            .societyName(param.society_name)
            .catholicName(param.catholic_name)
            .age(param.age)
            .contact(param.contact)
            .description(param.description)
            .groupId(param.group_id)
            .baptizedAt(param.baptized_at)
            .build();

        this.student = prune(build);
    }
}
