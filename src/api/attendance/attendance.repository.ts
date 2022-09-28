import { Op } from 'sequelize';

import logger from '../../lib/logger'
import { mysql } from '../../lib/mysql';

import { Attendance } from '../../models/attendance.model';

export default class AttendanceRepository {
    public getAttendances = async(studentsCode) => {
        return await Attendance.findAll({
			attributes: [
				'_id',
				'attendance_date',
				'attendance_content',
				'student__id',
			],
			where: {
				student__id: { [Op.in]: studentsCode },
			},
			// order: [ ['a_date', 'ASC'] ],
		});
    };

    public getAttendance = async({ code, fullTime }) => {
        return await Attendance.findOne({
            where: {
                student__id: code,
                attendance_date: fullTime,
            },
        });
    };

    public createAttendance = async({ code, fullTime, data }) => {
        const transaction = await mysql.transaction();

        try {
            await Attendance.create({
                attendance_date: fullTime,
                attendance_content: data,
                student__id: code,
            }, { transaction });

            await transaction.commit();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
            logger.error(e);
            await transaction.rollback();
        }
    };

    public updateAttendance = async({ code, fullTime, data }) => {
        const transaction = await mysql.transaction();

        try {
            await Attendance.update(
                {
                    attendance_content: data,
                },
                {
                    where: {
                        attendance_date: fullTime,
                        student__id: code,
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

    public deleteAttendance = async({ code, fullTime }) => {
        const transaction = await mysql.transaction();

        try {
            await Attendance.destroy({
                where: {
                    attendance_date: fullTime,
                    student__id: code,
                },
                transaction
            });

            await transaction.commit();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
            logger.error(e);
            await transaction.rollback();
        }
    };
}
