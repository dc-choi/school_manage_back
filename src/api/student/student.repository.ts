/* eslint-disable @typescript-eslint/no-explicit-any */
import { Sequelize, Op } from 'sequelize';

import { IStudent } from '@/@types/student';

import logger from '@/lib/logger'
import { mysql } from '@/lib/mysql';

import { Group } from '@/models/group.model';
import { Student } from '@/models/student.model';

export default class StudentRepository {
    async count(where: any): Promise<number> {
        return await Student.count({
            where,
        });
    }

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
    async list(page: number, size: number, where: any): Promise<any> {
        return await Student.findAll({
            include: [
                {
                    model: Group,
                    as: 'group',
                    required: true,
                }
            ],
            attributes: [
                '_id',
                'student_society_name',
                'student_catholic_name',
                'student_age',
                [ Sequelize.col('group.group_name'), 'group_name' ],
                'student_contact',
            ],
            where,
            raw: true,
            offset: (page - 1) * size,
            limit: size,
            order: [ ['student_age', 'ASC'], ['student_society_name', 'ASC'] ],
        });
    }

    async listByGroup(groupId: number): Promise<Student[]> {
        return await Student.findAll({
			attributes: [
                '_id',
				'student_society_name',
				'student_catholic_name',
                'student_age',
                'student_contact',
                'student_description',
                'group__id',
			],
			where: {
                group__id: groupId,
                delete_at: {
                    [Op.eq]: null,
                },
            },
			order: [ ['student_age', 'ASC'], ['student_society_name', 'ASC'] ],
		});
    }

    async listByAge(age: number): Promise<Student[]> {
        return await Student.findAll({
			attributes: [
                '_id',
				'student_society_name',
				'student_catholic_name',
                'student_age',
                'student_contact',
                'student_description',
                'group__id',
			],
			where: {
                student_age: age,
                delete_at: {
                    [Op.eq]: null,
                },
            },
			order: [ ['student_society_name', 'ASC'] ],
		});
    }

    async get(studentId: number): Promise<Student> {
        return await Student.findOne({
            where: {
                _id: studentId,
                delete_at: {
                    [Op.eq]: null,
                },
            }
        })
    }

    async create(param: IStudent): Promise<Student> {
        const transaction = await mysql.transaction();
        let student: Student;

        try {
            student = await Student.create({
                student_society_name: param.studentSocietyName,
                student_catholic_name: param.studentCatholicName,
                student_age: param.studentAge,
                student_contact: param.studentContact,
                student_description: param.studentDescription,
                group__id: param.groupId,
            }, { transaction });

            await transaction.commit();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
            logger.error(e);
            await transaction.rollback();
            student = null;
        }

        return student;
    }

    async update(param: IStudent): Promise<[affectedCount: number]> {
        const transaction = await mysql.transaction();
        let student: [affectedCount: number];

        try {
            student = await Student.update(
                {
                    student_society_name: param.studentSocietyName,
                    student_catholic_name: param.studentCatholicName,
                    student_age: param.studentAge,
                    student_contact: param.studentContact,
                    student_description: param.studentDescription,
                    group__id: param.groupId
                },
                {
                    where: {
                        _id: param._id
                    },
                    transaction
                },
            );

            await transaction.commit();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
            logger.error(e);
            await transaction.rollback();
            student = [ 0 ];
        }

        return student;
    }

    async delete(studentId: number): Promise<[affectedCount: number]> {
        const transaction = await mysql.transaction();
        let student: [affectedCount: number];

        try {
            student = await Student.update(
                {
                    delete_at: Sequelize.literal('CURRENT_TIMESTAMP')
                },
                {
                    where: {
                        _id: studentId
                    },
                    transaction
                }
            );

            await transaction.commit();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
            logger.error(e);
            await transaction.rollback();
            student = [ 0 ];
        }

        return student;
    }
}
