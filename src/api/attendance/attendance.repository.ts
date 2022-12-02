import { Op } from 'sequelize';

import logger from '../../lib/logger'
import { mysql } from '../../lib/mysql';

import { Attendance } from '../../models/attendance.model';

export default class AttendanceRepository {
    public getAttendances = async(studentsCode: Array<number>) => {
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

    public getAttendance = async(id: number, fullTime: string) => {
        return await Attendance.findOne({
            where: {
                student__id: id,
                attendance_date: fullTime,
            },
        });
    };

    public createAttendance = async(id: number, fullTime: string, data: string) => {
        const transaction = await mysql.transaction();

        try {
            await Attendance.create({
                attendance_date: fullTime,
                attendance_content: data,
                student__id: id,
            }, { transaction });

            await transaction.commit();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
            logger.error(e);
            await transaction.rollback();
        }
    };

    public updateAttendance = async(id: number, fullTime: string, data: string) => {
        const transaction = await mysql.transaction();

        try {
            await Attendance.update(
                {
                    attendance_content: data,
                },
                {
                    where: {
                        attendance_date: fullTime,
                        student__id: id,
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

    public deleteAttendance = async(id: number, fullTime: string) => {
        const transaction = await mysql.transaction();

        try {
            await Attendance.destroy({
                where: {
                    attendance_date: fullTime,
                    student__id: id,
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
