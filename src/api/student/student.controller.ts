/* eslint-disable no-extra-boolean-cast */
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { Builder } from 'builder-pattern';

import StudentService from './student.service';

import { IStudent } from '@/@types/student';
import { IResponse } from '@/@types/response';

import ApiCode from '@/common/api.code';
import ApiError from '@/common/api.error';
import { Result } from '@/common/result';
import StudentBuilder from '@/common/builder/student.builder';

import logger from '@/lib/logger';

export default class StudentController {
    async list(req: Request, res: Response) {
        logger.log('req.params:', JSON.stringify(req.params));
        logger.log('req.query:', JSON.stringify(req.query));
        logger.log('req.body:', JSON.stringify(req.body));

        const { searchOption, searchWord } = req.query;
        const { page } = req.query;
        let response;

        try {
            // 요청으로 넘어오는것들은 전부 string으로 받아오기 때문에 number로 형변환함.
            let parsePage = Number(page);
            if (isNaN(parsePage) || parsePage === 0) {
                parsePage = 1;
            }

            const where = await new StudentService().setId(req.account.id).setWhere(String(searchOption), String(searchWord))
            const StudentDTO: StudentBuilder = await new StudentService().setPage(parsePage).findAll(where);
            logger.log('result:', JSON.stringify(StudentDTO));

            response = Result.ok<IResponse>({
                account: req.account.name,
                ...StudentDTO
            }).toJson();
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
                throw new ApiError(ApiCode.BAD_REQUEST, 'BAD_REQUEST: studentId is wrong');
            }

            const student: IStudent = await new StudentService().setId(parseStudentId).get();
            logger.log('result:', JSON.stringify(student));

            response = Result.ok<IResponse>({
                account: req.account.name,
                student
            }).toJson();
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
                .societyName(societyName)
                .catholicName(catholicName)
                .age(age)
                .contact(contact)
                .description(description)
                .baptizedAt(baptizedAt)
                .build();

            const student: IStudent = await new StudentService().add(param);
            logger.log('result:', JSON.stringify(student));

            response = Result.ok<IResponse>({
                account: req.account.name,
                student
            }).toJson();
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
                throw new ApiError(ApiCode.BAD_REQUEST, 'BAD_REQUEST: studentId is wrong');
            }

            const param = Builder<IStudent>()
                ._id(parseStudentId)
                .groupId(groupId)
                .societyName(societyName)
                .catholicName(catholicName)
                .age(age)
                .contact(contact)
                .description(description)
                .baptizedAt(baptizedAt)
                .build();

            const student = await new StudentService().modify(param);
            logger.log('result:', JSON.stringify(student));

            response = Result.ok<IResponse>({
                account: req.account.name,
                student
            }).toJson();
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
                throw new ApiError(ApiCode.BAD_REQUEST, 'BAD_REQUEST: studentId is wrong');
            }

            const student = await new StudentService().setId(parseStudentId).remove();
            logger.log('result:', JSON.stringify(student));

            response = Result.ok<IResponse>({
                account: req.account.name,
                student
            }).toJson();
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
            logger.log('result:', JSON.stringify(row));

            response = Result.ok<IResponse>({
                account: req.account.name,
                row
            }).toJson();
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
