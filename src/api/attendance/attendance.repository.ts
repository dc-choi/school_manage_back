﻿/* eslint-disable @typescript-eslint/no-explicit-any */
import { Attendance } from '@/models/attendance.model';
import BaseRepository from '@/common/base/base.repository';
import { IAttendance } from '@/@types/attendance';

export default class AttendanceRepository extends BaseRepository<Attendance> {
    async findAndCountAll(where: any): Promise<{ rows: any; count: number; }> {
        return await Attendance.findAndCountAll({
			attributes: [
				'_id',
				'date',
				'content',
				'student_id',
			],
			where,
			// order: [ ['a_date', 'ASC'] ],
		});
    }

    findAll(): Promise<Attendance[]> {
        throw new Error('Method not implemented.');
    }

    /**
     * 한 학생에 해당하는 출석정보를 가져옴.
     *
     * @returns
     */
    async findOne(): Promise<Attendance> {
        return await Attendance.findOne({
            attributes: [
                '_id',
				'date',
				'content',
				'student_id',
            ],
            where: {
                student_id: this._id,
            }
        });
    }

    /**
     * 한 학생이 언제 출석했는지 가져옴.
     *
     * @param date
     * @returns
     */
    async get(date: string): Promise<Attendance> {
        return await Attendance.findOne({
            where: {
                student_id: this._id,
                date,
            },
        });
    }

    async create(param: IAttendance): Promise<Attendance> {
        return await Attendance.create({
            date: param.date,
            content: param.content,
            student_id: this._id,
        }, { transaction: this.transaction });
    }

    /**
     * 수정만 하는 메서드
     *
     * @param {IAttendance} param
     * @returns
     */
    async modify(param: IAttendance): Promise<number> {
        const [ attendance ] = await Attendance.update(
            {
                content: param.content,
            },
            {
                where: {
                    date: param.date,
                    student_id: this._id,
                },
                transaction: this.transaction,
            }
        );
        return attendance;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async update(param: IAttendance): Promise<Attendance> {
        throw new Error('Method not implemented.');
    }

    /**
     * 출석정보의 물리적 삭제
     *
     * @param date
     * @returns
     */
    async destroy(date: string): Promise<Attendance> {
        const attendance: Attendance = await this.setId(this._id).get(date);
        await Attendance.destroy({
            where: {
                date,
                student_id: this._id,
            },
            transaction: this.transaction
        });
        return attendance;
    }

    delete(): Promise<Attendance> {
        throw new Error('Method not implemented.');
    }
}
