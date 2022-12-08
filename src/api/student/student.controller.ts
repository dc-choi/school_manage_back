import { Request, Response } from 'express';
import httpStatus from 'http-status';

import logger from '../../lib/logger';
import ApiCodes from '../../lib/api.codes';
import ApiError from '../../lib/errors';

import { IStudent } from '../../@types/student';
import { StudentsDTO } from '../../common/dto/student.dto';
import { Result } from '../../common/result';

import GroupService from '../group/group.service';
import StudentService from './student.service';

export default class StudentController {
    async getStudents(req: Request, res: Response) {
        logger.log('req.params:', JSON.stringify(req.params));
        logger.log('req.query:', JSON.stringify(req.query));
        logger.log('req.body:', JSON.stringify(req.body));

        const { searchOption, searchWord } = req.query;
        const { nowPage } = req.query;
        let response;

        try {
            // 요청으로 넘어오는것들은 전부 string으로 받아오기 때문에 number로 형변환함.
            let parseNowPage = Number(nowPage);
            if (isNaN(parseNowPage) || parseNowPage === 0) {
                parseNowPage = 1;
            }

            // 계정에 소속된 그룹의 PK를 가져온다.
            const groups = await new GroupService().getGroupsByAccount(req.account.id);
            const groupsCode = [];
            groups.forEach((item) => {
                groupsCode.push(item._id);
            });

            // req.query에서 넘어오는 값은 any가 아닌, string | QueryString.ParsedQs | string[] | QueryString.ParsedQs[]으로 설정되어서 string으로 형변환해서 보내줌
            const students: StudentsDTO = await new StudentService().getStudents(parseNowPage, String(searchOption), String(searchWord), groupsCode);

            const result = {
                ...students,
                account: req.account.name
            }
            logger.log('result:', JSON.stringify(result));

            response = Result.ok(result).toJson();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
            logger.err(JSON.stringify({ code: e.code, message: e.message, stack: e.stack }));
            logger.error(e);
            response = Result.fail<ApiError>(e).toJson();
        }

        logger.res(httpStatus.OK, response, req);
        res.status(httpStatus.OK).json(response);
    }

    async getStudent(req: Request, res: Response) {
        logger.log('req.params:', JSON.stringify(req.params));
        logger.log('req.query:', JSON.stringify(req.query));
        logger.log('req.body:', JSON.stringify(req.body));

        const { studentId } = req.params;
        let response;

        try {
            // 요청으로 넘어오는것들은 전부 string으로 받아오기 때문에 number로 형변환함.
            const parseStudentId = Number(studentId);
            if (isNaN(parseStudentId) || parseStudentId === 0) {
                throw new ApiError(ApiCodes.BAD_REQUEST, 'BAD_REQUEST: studentId is wrong');
            }

            const student: IStudent = await new StudentService().getStudent(parseStudentId);

            const result = {
                student,
                account: req.account.name
            }
            logger.log('result:', JSON.stringify(result));

            response = Result.ok(result).toJson();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
            logger.err(JSON.stringify({ code: e.code, message: e.message, stack: e.stack }));
            logger.error(e);
            response = Result.fail<ApiError>(e).toJson();
        }

        logger.res(httpStatus.OK, response, req);
        res.status(httpStatus.OK).json(response);
    }

    async createStudent(req: Request, res: Response) {
        logger.log('req.params:', JSON.stringify(req.params));
        logger.log('req.query:', JSON.stringify(req.query));
        logger.log('req.body:', JSON.stringify(req.body));

        const { societyName, catholicName, age, contact, description, groupId } = req.body;
        let response;

        try {
            const student: IStudent = await new StudentService().createStudent(societyName, catholicName, age, contact, description, groupId);

            const result = {
                student,
                account: req.account.name
            }
            logger.log('result:', JSON.stringify(result));

            response = Result.ok(result).toJson();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
            logger.err(JSON.stringify({ code: e.code, message: e.message, stack: e.stack }));
            logger.error(e);
            response = Result.fail<ApiError>(e).toJson();
        }

        logger.res(httpStatus.OK, response, req);
        res.status(httpStatus.OK).json(response);
    }

    async updateStudent(req: Request, res: Response) {
        logger.log('req.params:', JSON.stringify(req.params));
        logger.log('req.query:', JSON.stringify(req.query));
        logger.log('req.body:', JSON.stringify(req.body));

        const { studentId } = req.params;
        const { societyName, catholicName, age, contact, description, groupId } = req.body;
        let response;

        try {
            // 요청으로 넘어오는것들은 전부 string으로 받아오기 때문에 number로 형변환함.
            const parseStudentId = Number(studentId);
            if (isNaN(parseStudentId) || parseStudentId === 0) {
                throw new ApiError(ApiCodes.BAD_REQUEST, 'BAD_REQUEST: studentId is wrong');
            }

            const row = await new StudentService().updateStudent(societyName, catholicName, age, contact, description, groupId, parseStudentId);

            const result = {
                row,
                account: req.account.name
            }
            logger.log('result:', JSON.stringify(result));

            response = Result.ok(result).toJson();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
            logger.err(JSON.stringify({ code: e.code, message: e.message, stack: e.stack }));
            logger.error(e);
            response = Result.fail<ApiError>(e).toJson();
        }

        logger.res(httpStatus.OK, response, req);
        res.status(httpStatus.OK).json(response);
    }

    async deleteStudent(req: Request, res: Response) {
        logger.log('req.params:', JSON.stringify(req.params));
        logger.log('req.query:', JSON.stringify(req.query));
        logger.log('req.body:', JSON.stringify(req.body));

        const { studentId } = req.params;
        let response;

        try {
            // 요청으로 넘어오는것들은 전부 string으로 받아오기 때문에 number로 형변환함.
            const parseStudentId = Number(studentId);
            if (isNaN(parseStudentId) || parseStudentId === 0) {
                throw new ApiError(ApiCodes.BAD_REQUEST, 'BAD_REQUEST: studentId is wrong');
            }

            const row = await new StudentService().deleteStudent(parseStudentId);

            const result = {
                row,
                account: req.account.name
            }
            logger.log('result:', JSON.stringify(result));

            response = Result.ok(result).toJson();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
            logger.err(JSON.stringify({ code: e.code, message: e.message, stack: e.stack }));
            logger.error(e);
            response = Result.fail<ApiError>(e).toJson();
        }

        logger.res(httpStatus.OK, response, req);
        res.status(httpStatus.OK).json(response);
    }
}
