/* eslint-disable @typescript-eslint/no-explicit-any */
import { Sequelize, Op } from 'sequelize';

import { IStudent } from '@/@types/student';

import BaseRepository from '@/common/base/base.repository';

import { Group } from '@/models/group.model';
import { Student } from '@/models/student.model';

export default class StudentRepository extends BaseRepository<Student> {
    /**
     * TODO: typescript의 문제점때문에 막힘.
     *
     * sequelize에서 join을 하고 불러오게 되면 실제 객체상으로는 불러와지는데,
     * Service단에서 호출시 여기서 Student[]으로 타입을 지정해주면 타입때문에 막힘.
     *
     * Student Entity에는 group_name이 없어서 타입상 무조건 막힘...
     *
     * 추후에 이 문제를 해결해야함...
     */
    async findAndCountAll(where: any): Promise<{ rows: any; count: number; }> {
        return await Student.findAndCountAll({
            include: [
                {
                    model: Group,
                    as: 'group',
                    required: true,
                }
            ],
            attributes: [
                '_id',
                'society_name',
                'catholic_name',
                'age',
                [ Sequelize.col('group.name'), 'group_name' ],
                'contact',
                'baptized_at',
            ],
            where,
            raw: true,
            offset: (this.page - 1) * this.size,
            limit: this.size,
            order: [ ['age', 'ASC'], ['society_name', 'ASC'] ],
        });
    }

    async findAll(): Promise<Student[]> {
        return await Student.findAll({
			attributes: [
                '_id',
				'society_name',
				'catholic_name',
                'age',
                'contact',
                'description',
                'group_id',
                'baptized_at',
			],
			where: {
                group_id: this._id,
                delete_at: {
                    [Op.eq]: null,
                },
            },
			order: [ ['age', 'ASC'], ['society_name', 'ASC'] ],
		});
    }

    async findAllByAge(age: number): Promise<Student[]> {
        return await Student.findAll({
			attributes: [
                '_id',
				'society_name',
				'catholic_name',
                'age',
                'contact',
                'description',
                'group_id',
                'baptized_at',
			],
			where: {
                age,
                delete_at: {
                    [Op.eq]: null,
                },
            },
			order: [ ['society_name', 'ASC'] ],
		});
    }

    async findOne(): Promise<Student> {
        return await Student.findOne({
            where: {
                _id: this._id,
                delete_at: {
                    [Op.eq]: null,
                },
            }
        })
    }

    async create(param: IStudent): Promise<Student> {
        return await Student.create({
            society_name: param.societyName,
            catholic_name: param.catholicName,
            age: param.age,
            contact: param.contact,
            description: param.description,
            group_id: param.groupId,
            baptized_at: param.baptizedAt,
        }, { transaction: this.transaction });
    }

    async update(param: IStudent): Promise<Student> {
        const student: Student = await this.setId(param._id).findOne();
        student.society_name = param.societyName;
        student.catholic_name = param.catholicName;
        student.age = param.age;
        student.contact = param.contact;
        student.description = param.description;
        student.group_id = param.groupId;
        student.baptized_at = param.baptizedAt;

        await student.save({
            transaction: this.transaction,
            fields: [
                'society_name',
                'catholic_name',
                'age',
                'contact',
                'description',
                'group_id',
                'baptized_at'
            ]
        });

        return student;
    }

    async delete(): Promise<Student> {
        const student: Student = await this.findOne();
        student.delete_at = new Date();

        await student.save({
            transaction: this.transaction,
            fields: [ 'delete_at' ]
        });

        return student;
    }
}
