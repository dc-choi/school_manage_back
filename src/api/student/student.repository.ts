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
    async getStudents(searchOption: string, searchWord: string, startRow: number, rowPerPage: number, groupsCode: Array<number>) {
        let students;

        if (searchWord !== '') {
            switch (searchOption) {
                case 'societyName':
                    students = await Student.findAll({
                        include: [
                            { model: Group, as: 'group', required: true, attributes: [] }
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
                        raw: true,
                        offset: startRow,
                        limit: rowPerPage,
                        order: [ ['student_age', 'ASC'], ['student_society_name', 'ASC'] ],
                    });
                    break;
                case 'catholicName':
                    students = await Student.findAll({
                        include: [
                            { model: Group, as: 'group', required: true, attributes: [] }
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
                        raw: true,
                        offset: startRow,
                        limit: rowPerPage,
                        order: [ ['student_age', 'ASC'], ['student_society_name', 'ASC'] ],
                    });
                    break;
                default:
                    students = await Student.findAll({
                        include: [
                            { model: Group, as: 'group', required: true, attributes: [] }
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
                        raw: true,
                        offset: startRow,
                        limit: rowPerPage,
                        order: [ ['student_age', 'ASC'], ['student_society_name', 'ASC'] ],
                    });
                    break;
            }
        } else {
            students = await Student.findAll({
                include: [
                    { model: Group, as: 'group', required: true, attributes: [] }
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
                raw: true,
                offset: startRow,
                limit: rowPerPage,
                order: [ ['student_age', 'ASC'], ['student_society_name', 'ASC'] ],
            });
        }

        return students;
    }

    async getStudentsByGroup(groupId: number): Promise<Student[]> {
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

    async getStudent(studentId: number): Promise<Student> {
        return await Student.findOne({
            where: {
                _id: studentId,
                delete_at: {
                    [Op.eq]: null,
                },
            }
        })
    }

    async createStudent(societyName: string, catholicName: string, age: number, contact: number, description: string, groupId: number): Promise<Student> {
        const transaction = await mysql.transaction();
        let student: Student;

        try {
            student = await Student.create({
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
            student = null;
        }

        return student;
    }

    async updateStudent(societyName: string, catholicName: string, age: number, contact: number, description: string, groupId: number, studentId: number): Promise<[affectedCount: number]> {
        const transaction = await mysql.transaction();
        let student: [affectedCount: number];

        try {
            student = await Student.update(
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
            student = [ 0 ];
        }

        return student;
    }

    async deleteStudent(studentId: number): Promise<[affectedCount: number]> {
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
