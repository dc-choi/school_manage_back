/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-case-declarations */
import { Builder } from 'builder-pattern';

import StudentRepository from './student.repository';

import { IGroup } from '@/@types/group'
import { IStudent } from '@/@types/student';

import ApiCodes from '@/common/api.codes';
import ApiError from '@/common/api.error';
import { StudentsDTO, StudentsDTOBuilder } from '@/common/dto/student.dto';

import logger from '@/lib/logger';

import { Student } from '@/models/student.model';

import GroupService from '@/api/group/group.service';

export default class StudentService {
    async list(page: number, where: any): Promise<StudentsDTO> {
        const size = 10; // 페이지당 학생 출력 수
        const count: number = await new StudentRepository().count(where); // 학생 총 인원 수
        const maxPage = Math.ceil(count / size); // 학생 출력할 총 페이지

        // TODO: any타입을 사용하지않고 타입 에러를 내지않도록 해야함...
        // TODO: React로 변경하는 경우 searchOption, searchWord을 굳이 서버에서 처리하지않고 프론트에서 처리하기.
        const students = await new StudentRepository().list(page, size, where);
        const studentsBuilder: IStudent[] = [];
        students.forEach(item => {
            studentsBuilder.push(
                Builder<IStudent>()
                    ._id(item._id)
                    .studentSocietyName(item.student_society_name)
                    .studentCatholicName(item.student_catholic_name)
                    .studentAge(item.student_age)
                    .studentContact(item.student_contact)
                    .groupId(item.group__id)
                    // any가 아니면 이곳에서 에러가 무조건 발생...
                    .groupName(item.group_name)
                    .build()
            );
		});

        return new StudentsDTOBuilder()
            .setNowPage(page, size)
            .setTotalPage(count, maxPage)
            .setStudents(studentsBuilder)
            .build();
    }

    async listByGroup(groupId: number): Promise<IStudent[]> {
        const students: Student[] = await new StudentRepository().listByGroup(groupId);
        const studentsBuilder: IStudent[] = [];
        students.forEach(item => {
            studentsBuilder.push(
                Builder<IStudent>()
                    ._id(item._id)
                    .studentSocietyName(item.student_society_name)
                    .studentCatholicName(item.student_catholic_name)
                    .studentAge(item.student_age)
                    .studentContact(item.student_contact)
                    .studentDescription(item.student_description)
                    .groupId(item.group__id)
                    .build()
            );
		});

        return studentsBuilder;
    }

    async listByAge(age: number): Promise<IStudent[]> {
        const students: Student[] = await new StudentRepository().listByAge(age);
        const studentsBuilder: IStudent[] = [];
        students.forEach(item => {
            studentsBuilder.push(
                Builder<IStudent>()
                    ._id(item._id)
                    .studentSocietyName(item.student_society_name)
                    .studentCatholicName(item.student_catholic_name)
                    .studentAge(item.student_age)
                    .studentContact(item.student_contact)
                    .studentDescription(item.student_description)
                    .groupId(item.group__id)
                    .build()
            );
		});

        return studentsBuilder;
    }

    async get(studentId: number): Promise<IStudent> {
        const student: Student = await new StudentRepository().get(studentId);
        if (!student) throw new ApiError(ApiCodes.NOT_FOUND, `NOT_FOUND: STUDENT NOT_FOUND`);

        return Builder<IStudent>()
            ._id(student._id)
            .studentSocietyName(student.student_society_name)
            .studentCatholicName(student.student_catholic_name)
            .studentAge(student.student_age)
            .studentContact(student.student_contact)
            .studentDescription(student.student_description)
            .groupId(student.group__id)
            .build();
    }

    async create(societyName: string, catholicName: string, age: number, contact: number, description: string, groupId: number): Promise<IStudent> {
        const student: Student = await new StudentRepository().create(societyName, catholicName, age, contact, description, groupId);

        return Builder<IStudent>()
            ._id(student._id)
            .studentSocietyName(student.student_society_name)
            .studentCatholicName(student.student_catholic_name)
            .studentAge(student.student_age)
            .studentContact(student.student_contact)
            .studentDescription(student.student_description)
            .groupId(student.group__id)
            .build();
    }

    async update(societyName: string, catholicName: string, age: number, contact: number, description: string, groupId: number, studentId: number): Promise<number> {
        const [ affectedCount ] = await new StudentRepository().update(societyName, catholicName, age, contact, description, groupId, studentId);
        return affectedCount;
    }

    async delete(studentId: number): Promise<number> {
        const [ affectedCount ] = await new StudentRepository().delete(studentId);
        return affectedCount;
    }

    async graduate(accountId: number, accountName: string): Promise<number> {
        let result = 0;

        switch (accountName) {
            case '초등부':
                result = await this.elementaryGraduation(accountId);
                break;
            case '중고등부':
                result = await this.middleHighGraduation();
                break;
            default:
                throw new ApiError(ApiCodes.UNAUTHORIZED, `UNAUTHORIZED: Invalid accountName`);
        }

        return result;
    }

    /**
     * TODO: 추후에 반드시 리팩터링이 필요함.
     *
     * @param accountId
     * @returns
     */
    private async elementaryGraduation(accountId: number): Promise<number> {
        const groups: IGroup[] = await new GroupService().listByAccount(accountId);
        logger.log('졸업, 종업하는 초등부 학생들', groups);
        const _14Group = await new GroupService().getByName('예비 중1');
        const _8Group = groups.filter(item => { return item.groupName === '1학년' });
        const _9Group = groups.filter(item => { return item.groupName === '2학년' });
        const _10Group = groups.filter(item => { return item.groupName === '3학년' });
        const _11Group = groups.filter(item => { return item.groupName === '4학년' });
        const _12Group = groups.filter(item => { return item.groupName === '5학년' });
        const _13Group = groups.filter(item => { return item.groupName === '6학년' });
        let result = 0;

        for (const group of groups) {
            const students = await this.listByGroup(group._id);
            logger.log('졸업, 종업하는 초등부 학생들', students);
            switch (group.groupName) {
                case '유치부':
                    for (const student of students) {
                        if (student.studentAge >= 8) {
                            result += await this.update(
                                student.studentSocietyName,
                                student.studentCatholicName,
                                student.studentAge,
                                student.studentContact,
                                student.studentDescription,
                                _8Group[0]._id,
                                student._id
                            )
                        }
                    }
                    break;
                case '1학년':
                    for (const student of students) {
                        result += await this.update(
                            student.studentSocietyName,
                            student.studentCatholicName,
                            student.studentAge,
                            student.studentContact,
                            student.studentDescription,
                            _9Group[0]._id,
                            student._id
                        )
                    }
                    break;
                case '2학년':
                    for (const student of students) {
                        result += await this.update(
                            student.studentSocietyName,
                            student.studentCatholicName,
                            student.studentAge,
                            student.studentContact,
                            student.studentDescription,
                            _10Group[0]._id,
                            student._id
                        )
                    }
                    break;
                case '3학년':
                    for (const student of students) {
                        result += await this.update(
                            student.studentSocietyName,
                            student.studentCatholicName,
                            student.studentAge,
                            student.studentContact,
                            student.studentDescription,
                            _11Group[0]._id,
                            student._id
                        )
                    }
                    break;
                case '4학년':
                    for (const student of students) {
                        result += await this.update(
                            student.studentSocietyName,
                            student.studentCatholicName,
                            student.studentAge,
                            student.studentContact,
                            student.studentDescription,
                            _12Group[0]._id,
                            student._id
                        )
                    }
                    break;
                case '5학년':
                    for (const student of students) {
                        result += await this.update(
                            student.studentSocietyName,
                            student.studentCatholicName,
                            student.studentAge,
                            student.studentContact,
                            student.studentDescription,
                            _13Group[0]._id,
                            student._id
                        )
                    }
                    break;
                case '6학년':
                    for (const student of students) {
                        result += await this.update(
                            student.studentSocietyName,
                            student.studentCatholicName,
                            student.studentAge,
                            student.studentContact,
                            student.studentDescription,
                            _14Group._id,
                            student._id
                        )
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
                result += await this.update(
                    student.studentSocietyName,
                    student.studentCatholicName,
                    student.studentAge,
                    student.studentContact,
                    student.studentDescription,
                    adult._id,
                    student._id
                );
            }
        }
        students = await this.listByAge(19);
        logger.log('고3인 학생들', students);
        if (students.length > 0) {
            for (const student of students) {
                result += await this.update(
                    student.studentSocietyName,
                    student.studentCatholicName,
                    student.studentAge,
                    student.studentContact,
                    student.studentDescription,
                    _19Group._id,
                    student._id
                );
            }
        }

        return result;
    }
}
