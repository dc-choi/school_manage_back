/* eslint-disable no-extra-boolean-cast */
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { Op } from 'sequelize';
import { Builder } from 'builder-pattern';

import StudentService from './student.service';

import { IStudent } from '@/@types/student';

import ApiCodes from '@/common/api.codes';
import ApiError from '@/common/api.error';
import { Result } from '@/common/result';
import { StudentsDTO } from '@/common/dto/student.dto';
import { ResponseDTO } from '@/common/dto/response.dto';

import logger from '@/lib/logger';

import GroupService from '@/api/group/group.service';

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

            // 계정에 소속된 그룹의 PK를 가져온다.
            const groups = await new GroupService().list(req.account.id);
            const where = {
                student_society_name: null,
                student_catholic_name: null,
                group__id: {
                    [Op.in]: groups.map(item => { return item._id })
                },
                delete_at: {
                    [Op.eq]: null,
                },
            };

            // searchWord가 비어있으면 삭제
            switch (searchOption) {
                case 'societyName':
                    !!!searchWord ? delete where.student_society_name : where.student_society_name = searchWord;
                    delete where.student_catholic_name
                    break;
                case 'catholicName':
                    !!!searchWord ? delete where.student_catholic_name : where.student_catholic_name = searchWord;
                    delete where.student_society_name
                    break;
                default:
                    delete where.student_society_name
                    delete where.student_catholic_name
                    break;
            }
            logger.log('where:', where);

            const students: StudentsDTO = await new StudentService().list(parseNowPage, where);

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

            const student: IStudent = await new StudentService().get(parseStudentId);

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

    async create(req: Request, res: Response) {
        logger.log('req.params:', JSON.stringify(req.params));
        logger.log('req.query:', JSON.stringify(req.query));
        logger.log('req.body:', JSON.stringify(req.body));

        const { societyName, catholicName, age, contact, description, groupId } = req.body;
        let response;

        try {
            const param = Builder<IStudent>()
                .groupId(groupId)
                .studentSocietyName(societyName)
                .studentCatholicName(catholicName)
                .studentAge(age)
                .studentContact(contact)
                .studentDescription(description)
                .build();

            const student: IStudent = await new StudentService().create(param);

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

    async update(req: Request, res: Response) {
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

            const param = Builder<IStudent>()
                ._id(parseStudentId)
                .groupId(groupId)
                .studentSocietyName(societyName)
                .studentCatholicName(catholicName)
                .studentAge(age)
                .studentContact(contact)
                .studentDescription(description)
                .build();

            const row = await new StudentService().update(param);

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

    async delete(req: Request, res: Response) {
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

            const row = await new StudentService().delete(parseStudentId);

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
            const row = await new StudentService().graduate(req.account.id, req.account.name);

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
