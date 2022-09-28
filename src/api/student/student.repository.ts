import { Sequelize, Op } from 'sequelize';

import logger from '../../lib/logger'
import { mysql } from '../../lib/mysql';

import { Group } from '../../models/group.model';
import { Student } from '../../models/student.model';

export default class StudentRepository {
    public getTotalRow = async({ searchOption, searchWord, groupsCode }) => {
        let totalRow;

        if (searchWord !== '') {
            switch (searchOption) {
                case 'societyName':
                    totalRow = await Student.findOne({
                        attributes: [
                            [Sequelize.fn('COUNT', Sequelize.col('_id')), 'count']
                        ],
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
                    totalRow = await Student.findOne({
                        attributes: [
                            [Sequelize.fn('COUNT', Sequelize.col('_id')), 'count']
                        ],
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
                    totalRow = await Student.findOne({
                        attributes: [
                            [Sequelize.fn('COUNT', Sequelize.col('_id')), 'count']
                        ],
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
            totalRow = await Student.findOne({
                attributes: [
                    [Sequelize.fn('COUNT', Sequelize.col('_id')), 'count']
                ],
                where: {
                    group__id: { [Op.in]: groupsCode },
                    delete_at: {
                        [Op.eq]: null,
                    },
                },
            });
        }

        return totalRow;
    };

    public getStudents = async({ searchOption, searchWord, startRow, rowPerPage, groupsCode }) => {
        let students;

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
    };

    public getStudentsByGroup = async(groupId) => {
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
    };

    public getStudent = async(studentId) => {
        return await Student.findOne({
            where: {
                _id: studentId,
                delete_at: {
                    [Op.eq]: null,
                },
            }
        })
    };

    public createStudent = async({ societyName, catholicName, age, contact, description, group }) => {
        const transaction = await mysql.transaction();

        try {
            await Student.create({
                student_society_name: societyName,
                student_catholic_name: catholicName,
                student_age: age,
                student_contact: contact,
                student_description: description,
                group__id: group,
            }, { transaction });

            await transaction.commit();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
            logger.error(e);
            await transaction.rollback();
        }
    };

    public updateStudent = async({ societyName, catholicName, age, contact, description, group, studentId }) => {
        const transaction = await mysql.transaction();

        try {
            await Student.update(
                {
                    student_society_name: societyName,
                    student_catholic_name: catholicName,
                    student_age: age,
                    student_contact: contact,
                    student_description: description,
                    group__id: group
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
    };

    public deleteStudent = async(studentId) => {
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
    };
}
