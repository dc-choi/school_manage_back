// import { env } from '../../env';

// import logger from '../../lib/logger';
// import ApiCodes from '../../lib/api.codes';
import ApiMessages from '../../lib/api.messages';
// import ApiError from '../../lib/errors';

import StudentRepository from './student.repository';

export default class GroupService {
    public getStudents = async({ nowPage, searchOption, searchWord, groupsCode }) => {
        const rowPerPage = 10; // 페이지당 학생 출력 수
        const totalRow = await new StudentRepository().getTotalRow({ searchOption, searchWord, groupsCode }); // 학생 총 인원 수
        const totalPage = Math.ceil(totalRow.dataValues.count / rowPerPage); // 학생 출력할 총 페이지
        const startRow = (nowPage - 1) * rowPerPage; // DB에서 가져올 데이터 위치
        const students = await new StudentRepository().getStudents({ searchOption, searchWord, startRow, rowPerPage, groupsCode });

        return {
            message: ApiMessages.OK,
            students,
            nowPage,
            rowPerPage,
            totalRow: totalRow.dataValues.count,
            totalPage
        }
    }

    public getStudentsByGroup = async(groupId) => {
        const students = await new StudentRepository().getStudentsByGroup(groupId);

        return {
            message: ApiMessages.OK,
            students
        };
    };

    public getStudent = async(studentId) => {
        const student = await new StudentRepository().getStudent(studentId);

        return {
            message: ApiMessages.OK,
            student
        };
    };

    public createStudent = async({ societyName, catholicName, age, contact, description, group }) => {
        await new StudentRepository().createStudent({ societyName, catholicName, age, contact, description, group });

        return {
            message: ApiMessages.OK,
        };
    };

    public updateStudent = async({ societyName, catholicName, age, contact, description, group, studentId }) => {
        await new StudentRepository().updateStudent({ societyName, catholicName, age, contact, description, group, studentId });

        return {
            message: ApiMessages.OK,
        };
    };

    public deleteStudent = async(studentId) => {
        await new StudentRepository().deleteStudent(studentId);

        return {
            message: ApiMessages.OK,
        };
    };
}
