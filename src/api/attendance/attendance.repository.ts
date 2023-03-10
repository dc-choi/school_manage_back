import { Op } from 'sequelize';

import logger from '@/lib/logger'
import { mysql } from '@/lib/mysql';

import { Attendance } from '@/models/attendance.model';

export default class AttendanceRepository {
    async list(studentsCode: Array<number>): Promise<Attendance[]> {
        return await Attendance.findAll({
			attributes: [
				'_id',
				'date',
				'content',
				'student_id',
			],
			where: {
				student_id: { [Op.in]: studentsCode },
			},
			// order: [ ['a_date', 'ASC'] ],
		});
    }

    async get(id: number, date: string): Promise<Attendance> {
        return await Attendance.findOne({
            where: {
                student_id: id,
                date,
            },
        });
    }

    async create(id: number, date: string, content: string): Promise<Attendance> {
        const transaction = await mysql.transaction();
        let attendance;

        try {
            attendance = await Attendance.create({
                date,
                content,
                student_id: id,
            }, { transaction });

            await transaction.commit();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
            logger.error(e);
            await transaction.rollback();
            attendance = null;
        }

        return attendance;
    }

    async update(id: number, date: string, content: string): Promise<[affectedCount: number]> {
        const transaction = await mysql.transaction();
        let attendance: [affectedCount: number];

        try {
            attendance = await Attendance.update(
                {
                    content,
                },
                {
                    where: {
                        date,
                        student_id: id,
                    },
                    transaction
                }
            );

            await transaction.commit();

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
            logger.error(e);
            await transaction.rollback();
            attendance = [ 0 ];
        }

        return attendance;
    }

    async delete(id: number, date: string): Promise<number> {
        const transaction = await mysql.transaction();
        let attendance: number;

        try {
            attendance = await Attendance.destroy({
                where: {
                    date,
                    student_id: id,
                },
                transaction
            });

            await transaction.commit();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
            logger.error(e);
            await transaction.rollback();
            attendance = 0;
        }

        return attendance;
    }
}
