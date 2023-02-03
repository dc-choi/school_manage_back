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
    async getStudents(nowPage: number, searchOption: string, searchWord: string, groupsCode: Array<number>): Promise<StudentsDTO> {
        const rowPerPage = 10; // 페이지당 학생 출력 수
        const totalRow: number = await new StudentRepository().getTotalRow(searchOption, searchWord, groupsCode); // 학생 총 인원 수
        const totalPage = Math.ceil(totalRow / rowPerPage); // 학생 출력할 총 페이지
        const startRow = (nowPage - 1) * rowPerPage; // DB에서 가져올 데이터 위치

        // TODO: any타입을 사용하지않고 타입 에러를 내지않도록 해야함...
        const students = await new StudentRepository().getStudents(searchOption, searchWord, startRow, rowPerPage, groupsCode);
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
            .setNowPage(nowPage)
            .setRowPerPage(rowPerPage)
            .setTotalRow(totalRow)
            .setTotalPage(totalPage)
            .setStudents(studentsBuilder)
            .build();
    }

    async getStudentsByGroup(groupId: number): Promise<IStudent[]> {
        const students: Student[] = await new StudentRepository().getStudentsByGroup(groupId);
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

    async getStudent(studentId: number): Promise<IStudent> {
        const student: Student = await new StudentRepository().getStudent(studentId);
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

    async createStudent(societyName: string, catholicName: string, age: number, contact: number, description: string, groupId: number): Promise<IStudent> {
        const student: Student = await new StudentRepository().createStudent(societyName, catholicName, age, contact, description, groupId);

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

    async updateStudent(societyName: string, catholicName: string, age: number, contact: number, description: string, groupId: number, studentId: number): Promise<number> {
        const [ affectedCount ] = await new StudentRepository().updateStudent(societyName, catholicName, age, contact, description, groupId, studentId);
        const row = affectedCount;

        return row;
    }

    async deleteStudent(studentId: number): Promise<number> {
        const [ affectedCount ] = await new StudentRepository().deleteStudent(studentId);
        const row = affectedCount;

        return row;
    }

    async graduateStudent(accountId: number, accountName: string): Promise<void> {
        switch (accountName) {
            case '초등부':
                await this.elementaryGraduation(accountId);
                break;
            case '중고등부':
                await this.middleHighGraduation();
                break;
            default:
                throw new ApiError(ApiCodes.UNAUTHORIZED, `UNAUTHORIZED: Invalid accountName`);
        }
    }

    async elementaryGraduation(accountId: number) {
        const groups: IGroup[] = await new GroupService().getGroupsByAccount(accountId);
        const _14Group = await new GroupService().getGroupByName('예비 중1');

        for (const group of groups) {
            logger.log('elementaryGraduation group');
            const result = await this.getStudentsByGroup(group._id);
        }
    }

    async middleHighGraduation() {
        const adult = await new GroupService().getGroupByName('성인');
        const _19Group = await new GroupService().getGroupByName('고3');

        const students: IStudent[] = await this.getStudentsByGroup(_19Group._id);
        if (students.length <= 0) throw new ApiError(ApiCodes.NOT_FOUND, `NOT_FOUND: group's student is null`);

        for (const student of students) {
            await this.updateStudent(
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
}
