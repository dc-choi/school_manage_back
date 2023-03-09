/* eslint-disable @typescript-eslint/no-explicit-any */
import { Sequelize, Op } from 'sequelize';

import { IStudent } from '@/@types/student';

import BaseRepository from '@/common/base/base.repository';

import logger from '@/lib/logger'

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
        let student: Student;

        try {
            student = await Student.create({
                society_name: param.societyName,
                catholic_name: param.catholicName,
                age: param.age,
                contact: param.contact,
                description: param.description,
                group_id: param.groupId,
                baptized_at: param.baptizedAt,
            }, { transaction: this.transaction });

            await this.transaction.commit();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
            logger.error(e);
            await this.transaction.rollback();
            student = null;
        }

        return student;
    }

    async update(param: IStudent): Promise<number> {
        let student: number;

        try {
            [ student ] = await Student.update(
                {
                    society_name: param.societyName,
                    catholic_name: param.catholicName,
                    age: param.age,
                    contact: param.contact,
                    description: param.description,
                    group_id: param.groupId,
                    baptized_at: param.baptizedAt,
                },
                {
                    where: {
                        _id: param._id
                    },
                    transaction: this.transaction
                },
            );

            await this.transaction.commit();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
            logger.error(e);
            await this.transaction.rollback();
            student = 0;
        }

        return student;
    }

    async delete(): Promise<number> {
        let student: number;

        try {
            [ student ] = await Student.update(
                {
                    delete_at: Sequelize.literal('CURRENT_TIMESTAMP')
                },
                {
                    where: {
                        _id: this._id
                    },
                    transaction: this.transaction
                }
            );

            await this.transaction.commit();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
            logger.error(e);
            await this.transaction.rollback();
            student = 0;
        }

        return student;
    }
}
