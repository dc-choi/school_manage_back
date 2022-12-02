/* eslint-disable @typescript-eslint/no-explicit-any */
// import { env } from '../../env';

// import logger from '../../lib/logger';
// import ApiCodes from '../../lib/api.codes';
import ApiMessages from '../../lib/api.messages';
// import ApiError from '../../lib/errors';

import StudentRepository from './student.repository';

export default class StudentService {
    async getStudents(nowPage: number, searchOption: string, searchWord: string, groupsCode: Array<number>) {
        const rowPerPage = 10; // 페이지당 학생 출력 수
        const totalRow = await new StudentRepository().getTotalRow(searchOption, searchWord, groupsCode); // 학생 총 인원 수
        const totalPage = Math.ceil(totalRow / rowPerPage); // 학생 출력할 총 페이지
        const startRow = (nowPage - 1) * rowPerPage; // DB에서 가져올 데이터 위치
        const students = await new StudentRepository().getStudents(searchOption, searchWord, startRow, rowPerPage, groupsCode);

        return {
            message: ApiMessages.OK,
            students,
            nowPage,
            rowPerPage,
            totalRow,
            totalPage
        }
    }

    async getStudentsByGroup(groupId: number) {
        const students = await new StudentRepository().getStudentsByGroup(groupId);

        return {
            message: ApiMessages.OK,
            students
        };
    }

    async getStudent(studentId: number) {
        const student = await new StudentRepository().getStudent(studentId);

        return {
            message: ApiMessages.OK,
            student
        };
    }

    async createStudent(societyName: string, catholicName: string, age: number, contact: number, description: string, groupId: number) {
        await new StudentRepository().createStudent(societyName, catholicName, age, contact, description, groupId);

        return {
            message: ApiMessages.OK,
        };
    }

    async updateStudent(societyName: string, catholicName: string, age: number, contact: number, description: string, groupId: number, studentId: number) {
        await new StudentRepository().updateStudent(societyName, catholicName, age, contact, description, groupId, studentId);

        return {
            message: ApiMessages.OK,
        };
    }

    async deleteStudent(studentId: number) {
        await new StudentRepository().deleteStudent(studentId);

        return {
            message: ApiMessages.OK,
        };
    }
}
