/* eslint-disable no-extra-boolean-cast */
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { Builder } from 'builder-pattern';

import StudentService from './student.service';

import { IStudent } from '@/@types/student';

import ApiCodes from '@/common/api.codes';
import ApiError from '@/common/api.error';
import { Result } from '@/common/result';
import { StudentsDTO } from '@/common/dto/student.dto';
import { ResponseDTO } from '@/common/dto/response.dto';

import logger from '@/lib/logger';

export default class StudentController {
    async list(req: Request, res: Response) {
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

            const where = await new StudentService().setId(req.account.id).setWhere(String(searchOption), String(searchWord))
            const students: StudentsDTO = await new StudentService().setPage(parseNowPage).findAll(where);

            const result: ResponseDTO = {
                account: req.account.name,
                ...students
            };
            logger.log('result:', JSON.stringify(result));

            response = Result.ok<ResponseDTO>(result).toJson();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
            logger.err(JSON.stringify({ code: e.code, message: e.message, stack: e.stack }));
            logger.error(e);
            response = Result.fail<ApiError>(e).toJson();
        }

        logger.res(httpStatus.OK, response, req);
        res.status(httpStatus.OK).json(response);
    }

    async get(req: Request, res: Response) {
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

            const student: IStudent = await new StudentService().setId(parseStudentId).get();

            const result: ResponseDTO = {
                account: req.account.name,
                student
            };
            logger.log('result:', JSON.stringify(result));

            response = Result.ok<ResponseDTO>(result).toJson();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
            logger.err(JSON.stringify({ code: e.code, message: e.message, stack: e.stack }));
            logger.error(e);
            response = Result.fail<ApiError>(e).toJson();
        }

        logger.res(httpStatus.OK, response, req);
        res.status(httpStatus.OK).json(response);
    }

    async add(req: Request, res: Response) {
        logger.log('req.params:', JSON.stringify(req.params));
        logger.log('req.query:', JSON.stringify(req.query));
        logger.log('req.body:', JSON.stringify(req.body));

        const { societyName, catholicName, age, contact, description, groupId, baptizedAt } = req.body;
        let response;

        try {
            const param = Builder<IStudent>()
                .groupId(groupId)
                .studentSocietyName(societyName)
                .studentCatholicName(catholicName)
                .studentAge(age)
                .studentContact(contact)
                .studentDescription(description)
                .baptizedAt(baptizedAt)
                .build();

            const student: IStudent = await new StudentService().add(param);

            const result: ResponseDTO = {
                account: req.account.name,
                student
            };
            logger.log('result:', JSON.stringify(result));

            response = Result.ok<ResponseDTO>(result).toJson();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
            logger.err(JSON.stringify({ code: e.code, message: e.message, stack: e.stack }));
            logger.error(e);
            response = Result.fail<ApiError>(e).toJson();
        }

        logger.res(httpStatus.OK, response, req);
        res.status(httpStatus.OK).json(response);
    }

    async modify(req: Request, res: Response) {
        logger.log('req.params:', JSON.stringify(req.params));
        logger.log('req.query:', JSON.stringify(req.query));
        logger.log('req.body:', JSON.stringify(req.body));

        const { studentId } = req.params;
        const { societyName, catholicName, age, contact, description, groupId, baptizedAt } = req.body;
        let response;

        try {
            // 요청으로 넘어오는것들은 전부 string으로 받아오기 때문에 number로 형변환함.
            const parseStudentId = Number(studentId);
            if (isNaN(parseStudentId) || parseStudentId === 0) {
                throw new ApiError(ApiCodes.BAD_REQUEST, 'BAD_REQUEST: studentId is wrong');
            }

            const param = Builder<IStudent>()
                ._id(parseStudentId)
                .groupId(groupId)
                .studentSocietyName(societyName)
                .studentCatholicName(catholicName)
                .studentAge(age)
                .studentContact(contact)
                .studentDescription(description)
                .baptizedAt(baptizedAt)
                .build();

            const row = await new StudentService().modify(param);

            const result: ResponseDTO = {
                account: req.account.name,
                row
            };
            logger.log('result:', JSON.stringify(result));

            response = Result.ok<ResponseDTO>(result).toJson();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
            logger.err(JSON.stringify({ code: e.code, message: e.message, stack: e.stack }));
            logger.error(e);
            response = Result.fail<ApiError>(e).toJson();
        }

        logger.res(httpStatus.OK, response, req);
        res.status(httpStatus.OK).json(response);
    }

    async remove(req: Request, res: Response) {
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

            const row = await new StudentService().setId(parseStudentId).remove();

            const result: ResponseDTO = {
                account: req.account.name,
                row
            };
            logger.log('result:', JSON.stringify(result));

            response = Result.ok<ResponseDTO>(result).toJson();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
            logger.err(JSON.stringify({ code: e.code, message: e.message, stack: e.stack }));
            logger.error(e);
            response = Result.fail<ApiError>(e).toJson();
        }

        logger.res(httpStatus.OK, response, req);
        res.status(httpStatus.OK).json(response);
    }

    async graduate(req: Request, res: Response) {
        logger.log('req.params:', JSON.stringify(req.params));
        logger.log('req.query:', JSON.stringify(req.query));
        logger.log('req.body:', JSON.stringify(req.body));

        let response;

        try {
            const row = await new StudentService().setId(req.account.id).graduate(req.account.name);

            const result: ResponseDTO = {
                account: req.account.name,
                row
            };
            logger.log('result:', JSON.stringify(result));

            response = Result.ok<ResponseDTO>(result).toJson();
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
