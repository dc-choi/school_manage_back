import { Sequelize, Op } from 'sequelize';

import logger from '../../lib/logger'
import { mysql } from '../../lib/mysql';

import { Group } from '../../models/group.model';
import { Student } from '../../models/student.model';

export default class StudentRepository {
    async getTotalRow(searchOption: string, searchWord: string, groupsCode: Array<number>): Promise<number> {
        let totalRow: number;

        if (searchWord !== '') {
            switch (searchOption) {
                case 'societyName':
                    totalRow = await Student.count({
                        where: {
                            student_society_name: searchWord,
                            group__id: { [Op.in]: groupsCode },
                            delete_at: {
                                [Op.eq]: null,
                            },
                        },
                    });
                    break;
                case 'catholicName':
                    totalRow = await Student.count({
                        where: {
                            student_catholic_name: searchWord,
                            group__id: { [Op.in]: groupsCode },
                            delete_at: {
                                [Op.eq]: null,
                            },
                        },
                    });
                    break;
                default:
                    totalRow = await Student.count({
                        where: {
                            group__id: { [Op.in]: groupsCode },
                            delete_at: {
                                [Op.eq]: null,
                            },
                        },
                    });
                    break;
            }
        } else {
            totalRow = await Student.count({
                where: {
                    group__id: { [Op.in]: groupsCode },
                    delete_at: {
                        [Op.eq]: null,
                    },
                },
            });
        }

        return totalRow;
    }

    async getStudents(searchOption: string, searchWord: string, startRow: number, rowPerPage: number, groupsCode: Array<number>): Promise<Student[]> {
        let students: Student[];

        if (searchWord !== '') {
            switch (searchOption) {
                case 'societyName':
                    students = await Student.findAll({
                        include: [
                            { model: Group, as: 'group', attributes: [] }
                        ],
                        attributes: [
                            '_id',
                            'student_society_name',
                            'student_catholic_name',
                            'student_age',
                            [ Sequelize.col('group.group_name'), 'group_name' ],
                            'student_contact',
                        ],
                        where: {
                            student_society_name: searchWord,
                            group__id: { [Op.in]: groupsCode },
                            delete_at: {
                                [Op.eq]: null,
                            },
                        },
                        offset: startRow,
                        limit: rowPerPage,
                        order: [ ['student_age', 'ASC'], ['student_society_name', 'ASC'] ],
                    });
                    break;
                case 'catholicName':
                    students = await Student.findAll({
                        include: [
                            { model: Group, as: 'group', attributes: [] }
                        ],
                        attributes: [
                            '_id',
                            'student_society_name',
                            'student_catholic_name',
                            'student_age',
                            [ Sequelize.col('group.group_name'), 'group_name' ],
                            'student_contact',
                        ],
                        where: {
                            student_catholic_name: searchWord,
                            group__id: { [Op.in]: groupsCode },
                            delete_at: {
                                [Op.eq]: null,
                            },
                        },
                        offset: startRow,
                        limit: rowPerPage,
                        order: [ ['student_age', 'ASC'], ['student_society_name', 'ASC'] ],
                    });
                    break;
                default:
                    students = await Student.findAll({
                        include: [
                            { model: Group, as: 'group', attributes: [] }
                        ],
                        attributes: [
                            '_id',
                            'student_society_name',
                            'student_catholic_name',
                            'student_age',
                            [ Sequelize.col('group.group_name'), 'group_name' ],
                            'student_contact',
                        ],
                        where: {
                            group__id: { [Op.in]: groupsCode },
                            delete_at: {
                                [Op.eq]: null,
                            },
                        },
                        offset: startRow,
                        limit: rowPerPage,
                        order: [ ['student_age', 'ASC'], ['student_society_name', 'ASC'] ],
                    });
                    break;
            }
        } else {
            students = await Student.findAll({
                include: [
                    { model: Group, as: 'group', attributes: [] }
                ],
                attributes: [
                    '_id',
                    'student_society_name',
                    'student_catholic_name',
                    'student_age',
                    [ Sequelize.col('group.group_name'), 'group_name' ],
                    'student_contact',
                ],
                where: {
                    group__id: { [Op.in]: groupsCode },
                    delete_at: {
                        [Op.eq]: null,
                    },
                },
                offset: startRow,
                limit: rowPerPage,
                order: [ ['student_age', 'ASC'], ['student_society_name', 'ASC'] ],
            });
        }

        return students;
    }

    async getStudentsByGroup(groupId: number) {
        return await Student.findAll({
			attributes: [
                '_id',
				'student_society_name',
				'student_catholic_name',
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

    async getStudent(studentId: number) {
        return await Student.findOne({
            where: {
                _id: studentId,
                delete_at: {
                    [Op.eq]: null,
                },
            }
        })
    }

    async createStudent(societyName: string, catholicName: string, age: number, contact: number, description: string, groupId: number): Promise<void> {
        const transaction = await mysql.transaction();

        try {
            await Student.create({
                student_society_name: societyName,
                student_catholic_name: catholicName,
                student_age: age,
                student_contact: contact,
                student_description: description,
                group__id: groupId,
            }, { transaction });

            await transaction.commit();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
            logger.error(e);
            await transaction.rollback();
        }
    }

    async updateStudent(societyName: string, catholicName: string, age: number, contact: number, description: string, groupId: number, studentId: number): Promise<void> {
        const transaction = await mysql.transaction();

        try {
            await Student.update(
                {
                    student_society_name: societyName,
                    student_catholic_name: catholicName,
                    student_age: age,
                    student_contact: contact,
                    student_description: description,
                    group__id: groupId
                },
                {
                    where: {
                        _id: studentId
                    },
                    transaction
                },
            );

            await transaction.commit();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
            logger.error(e);
            await transaction.rollback();
        }
    }

    async deleteStudent(studentId: number): Promise<void> {
        const transaction = await mysql.transaction();

        try {
            await Student.update(
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
        }
    }
}
