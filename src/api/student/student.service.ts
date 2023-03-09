/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-case-declarations */
/* eslint-disable no-extra-boolean-cast */
import { Op } from 'sequelize';

import StudentRepository from './student.repository';

import { IGroup } from '@/@types/group'
import { IStudent } from '@/@types/student';

import ApiCode from '@/common/api.code';
import ApiError from '@/common/api.error';
import StudentDTO from '@/common/dto/student.dto';
import StudentBuilder from '@/common/builder/student.builder';
import BaseService from '@/common/base/base.service';

import logger from '@/lib/logger';

import { Student } from '@/models/student.model';

import GroupService from '@/api/group/group.service';

export default class StudentService extends BaseService<IStudent> {
    async setWhere(searchOption: string, searchWord: string): Promise<any> {
        // 계정에 소속된 그룹의 PK를 가져온다.
        const groups = await new GroupService().setId(this._id).list();
        const where = {
            society_name: null,
            catholic_name: null,
            group_id: {
                [Op.in]: groups.map(item => { return item._id })
            },
            delete_at: {
                [Op.eq]: null,
            },
        };

        // searchWord가 비어있으면 삭제
        switch (searchOption) {
            case 'societyName':
                !!!searchWord ? delete where.society_name : where.society_name = searchWord;
                delete where.catholic_name
                break;
            case 'catholicName':
                !!!searchWord ? delete where.catholic_name : where.catholic_name = searchWord;
                delete where.society_name
                break;
            default:
                delete where.society_name
                delete where.catholic_name
                break;
        }
        logger.log('where:', where);

        return where;
    }

    /**
     * 페이지네이션을 위한 학생 리스트를 가져온다.
     *
     * @param where
     * @returns
     */
    async findAll(where: any): Promise<StudentBuilder> {
        // TODO: any타입을 사용하지않고 타입 에러를 내지않도록 해야함...
        // TODO: React로 변경하는 경우 searchOption, searchWord을 굳이 서버에서 처리하지않고 프론트에서 처리하기.
        const { rows, count } = await new StudentRepository().setPage(this.page).setSize(this.size).findAndCountAll(where);
        const studentDTOs: IStudent[] = [];
        rows.forEach(item => {
            const { student } = new StudentDTO(item);
            student.groupName = item.group_name; // any가 아니면 이곳에서 에러가 무조건 발생...
            studentDTOs.push(student);
		});

        return new StudentBuilder()
            .setPage(this.page, this.size)
            .setTotalPage(Math.ceil(count / this.size))
            .setStudents(studentDTOs);
    }

    /**
     * 그룹에 소속된 학생들을 조회한다.
     * @returns
     */
    async list(): Promise<IStudent[]> {
        const students: Student[] = await new StudentRepository().setId(this._id).findAll();
        const studentDTOs: IStudent[] = [];
        students.forEach(item => {
            studentDTOs.push(new StudentDTO(item).student);
		});

        return studentDTOs;
    }

    async listByAge(age: number): Promise<IStudent[]> {
        const students: Student[] = await new StudentRepository().findAllByAge(age);
        const studentDTOs: IStudent[] = [];
        students.forEach(item => {
            studentDTOs.push(new StudentDTO(item).student);
		});

        return studentDTOs;
    }

    async get(): Promise<IStudent> {
        const student: Student = await new StudentRepository().setId(this._id).findOne();
        if (!student) throw new ApiError(ApiCode.NOT_FOUND, `NOT_FOUND: STUDENT NOT_FOUND`);

        return new StudentDTO(student).student;
    }

    async add(param: IStudent): Promise<IStudent> {
        const transaction = await new StudentRepository().setTransaction();
        const student: Student = await transaction.create(param);

        return new StudentDTO(student).student;
    }

    async modify(param: IStudent): Promise<number> {
        const transaction = await new StudentRepository().setTransaction();
        return await transaction.update(param);
    }

    async remove(): Promise<number> {
        const transaction = await new StudentRepository().setId(this._id).setTransaction();
        return await transaction.delete();
    }

    async graduate(accountName: string): Promise<number> {
        let result = 0;

        switch (accountName) {
            case '초등부':
                result = await this.elementaryGraduation();
                break;
            case '중고등부':
                result = await this.middleHighGraduation();
                break;
            default:
                // 현재 초등부, 중고등부를 제외하면 관리자임. 관리자는 전부 졸업처리가 가능하도록 하기.
                // throw new ApiError(ApiCode.UNAUTHORIZED, `UNAUTHORIZED: Invalid accountName`);
                break;
        }

        return result;
    }

    /**
     * TODO: 추후에 반드시 리팩터링이 필요함.
     *
     * @returns
     */
    private async elementaryGraduation(): Promise<number> {
        const groups: IGroup[] = await new GroupService().setId(this._id).listByAccount();
        logger.log('졸업, 종업하는 초등부 학생들', groups);
        const _14Group = await new GroupService().getByName('예비 중1');
        const _8Group = groups.filter(item => { return item.name === '1학년' });
        const _9Group = groups.filter(item => { return item.name === '2학년' });
        const _10Group = groups.filter(item => { return item.name === '3학년' });
        const _11Group = groups.filter(item => { return item.name === '4학년' });
        const _12Group = groups.filter(item => { return item.name === '5학년' });
        const _13Group = groups.filter(item => { return item.name === '6학년' });
        let result = 0;

        for (const group of groups) {
            const students = await this.setId(group._id).list();
            logger.log('졸업, 종업하는 초등부 학생들', students);
            switch (group.name) {
                case '유치부':
                    for (const student of students) {
                        if (student.age >= 8) {
                            student.groupId = _8Group[0]._id
                            result += await this.modify(student);
                        }
                    }
                    break;
                case '1학년':
                    for (const student of students) {
                        student.groupId = _9Group[0]._id
                        result += await this.modify(student);
                    }
                    break;
                case '2학년':
                    for (const student of students) {
                        student.groupId = _10Group[0]._id;
                        result += await this.modify(student);
                    }
                    break;
                case '3학년':
                    for (const student of students) {
                        student.groupId = _11Group[0]._id;
                        result += await this.modify(student);
                    }
                    break;
                case '4학년':
                    for (const student of students) {
                        student.groupId = _12Group[0]._id;
                        result += await this.modify(student);
                    }
                    break;
                case '5학년':
                    for (const student of students) {
                        student.groupId = _13Group[0]._id;
                        result += await this.modify(student);
                    }
                    break;
                case '6학년':
                    for (const student of students) {
                        student.groupId = _14Group[0]._id;
                        result += await this.modify(student);
                    }
                    break;
                default:
                    break;
            }
        }

        return result;
    }

    private async middleHighGraduation(): Promise<number> {
        const adult = await new GroupService().getByName('성인');
        const _19Group = await new GroupService().getByName('고3');
        let result = 0;

        let students: IStudent[];
        students = await this.listByAge(20);
        logger.log('졸업하는 학생들', students);
        if (students.length > 0) {
            for (const student of students) {
                student.groupId = adult._id;
                result += await this.modify(student);
            }
        }
        students = await this.listByAge(19);
        logger.log('고3인 학생들', students);
        if (students.length > 0) {
            for (const student of students) {
                student.groupId = _19Group._id;
                result += await this.modify(student);
            }
        }

        return result;
    }
}
