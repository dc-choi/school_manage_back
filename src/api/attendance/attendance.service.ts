/* eslint-disable @typescript-eslint/no-explicit-any */
import { Op } from 'sequelize';
import { Builder } from 'builder-pattern';

import AttendanceRepository from './attendance.repository';

import { IStudent } from '@/@types/student';
import { IAttendance } from '@/@types/attendance';

import ApiCode from '@/common/api.code';
import ApiError from '@/common/api.error';
import AttendanceDTO from '@/common/dto/attendance.dto'
import AttendanceBuilder from '@/common/builder/attendance.builder'
import BaseService from '@/common/base/base.service';

import logger from '@/lib/logger';
import { getYearDate, getFullTime } from '@/lib/utils'

import { Attendance } from '@/models/attendance.model';

import StudentService from '@/api/student/student.service';

export default class AttendanceService extends BaseService<AttendanceBuilder> {
    list(): Promise<AttendanceBuilder[]> {
        throw new Error('Method not implemented.');
    }

    /**
     * 그룹별 학생들의 출석 데이터를 가져옴
     *
     * @param groupId
     * @param year
     * @returns
     */
    async findAllByGroup(): Promise<AttendanceBuilder> {
        const { saturday, sunday } = await getYearDate(this.year);

        // 그룹에 해당되는 학생들의 정보 가져오기
        const students: IStudent[] = await new StudentService().setId(this._id).list();
        const studentsCode: number[] = []; // 학생들의 pk를 담기위한 변수
        students.forEach(item => {
			studentsCode.push(item._id);
		});

        // Entity를 DTO로 변환하는 과정, 학생들의 출석정보를 가져온다.
        const where = {
            student_id: { [Op.in]: studentsCode },
        };
        const { rows } = await new AttendanceRepository().findAndCountAll(where);
        const attendanceDTOs: IAttendance[] = [];
        rows.forEach((item: Attendance) => attendanceDTOs.push(new AttendanceDTO(item).attendance));

        return new AttendanceBuilder()
            .setDate(this.year, sunday, saturday)
            .setStudents(students)
            .setAttendances(attendanceDTOs);
    }

    get(): Promise<AttendanceBuilder> {
        throw new Error('Method not implemented.');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    add(param: any): Promise<AttendanceBuilder> {
        throw new Error('Method not implemented.');
    }

    /**
     * 출석부 입력한 부분에 대한 처리
     *
     * @param year
     * @param attendance - [ {"_id":46,"month":2,"day":19,"data":"○"}, ... ]
     * @returns createRow: 출석이 생성되거나 갱신된 갯수
     */
    async update(attendance: Array<{ _id: number; month: number; day: number; data: string }>): Promise<number> {
        let createRow = 0;
        let checkNull = null;
        const transaction = await new AttendanceRepository().setTransaction();

        try {
            for (let idx = 0; idx < attendance.length; idx++) { // forEach 안 돌아가서 for문 사용
                const fullTime = await getFullTime(this.year, attendance[idx].month, attendance[idx].day);
                const check = await transaction.setId(attendance[idx]._id).get(fullTime);
                if (check === null) {
                    const param = Builder<IAttendance>()
                        .date(fullTime)
                        .content(attendance[idx].data)
                        .build();

                    checkNull = await transaction.create(param);
                    if (checkNull) createRow++;
                } else {
                    const param = Builder<IAttendance>()
                        .date(fullTime)
                        .content(attendance[idx].data)
                        .build();

                    createRow += await transaction.modify(param);
                }
            }
            await transaction.commit();
            return createRow;
        } catch(e: any) {
            logger.err(e);
            logger.error(e);
            await transaction.rollback();
            throw new ApiError(ApiCode.INTERNAL_SERVER_ERROR, `${e}`);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    modify(param: any): Promise<AttendanceBuilder> {
        throw new Error('Method not implemented.');
    }

    /**
     * 출석부의 공백에 대한 처리
     *
     * @param year
     * @param attendance
     * @returns deleteRow: 기존에 출석이 있다가 없어진 갯수
     */
    async delete(attendance: Array<{ _id: number; month: number; day: number; data: string }>): Promise<number> {
        let deleteRow = 0;
        let checkNull = null;

        const transaction = await new AttendanceRepository().setTransaction();

        try {
            for (let idx = 0; idx < attendance.length; idx++) { // forEach 안 돌아가서 for문 사용
                const fullTime = await getFullTime(this.year, attendance[idx].month, attendance[idx].day);
                const check = await transaction.setId(attendance[idx]._id).get(fullTime);
                if (check !== null) {
                    checkNull = await transaction.destroy(fullTime);
                    if (checkNull) deleteRow++;
                }
            }
            await transaction.commit();
            return deleteRow;
        } catch(e: any) {
            logger.err(e);
            logger.error(e);
            await transaction.rollback();
            throw new ApiError(ApiCode.INTERNAL_SERVER_ERROR, `${e}`);
        }
    }

    remove(): Promise<AttendanceBuilder> {
        throw new Error('Method not implemented.');
    }
}
