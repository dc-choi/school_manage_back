import httpStatus from 'http-status';

// import { env } from '../../env';

import logger from '../../lib/logger';
import ApiCodes from '../../lib/api.codes';
import ApiMessages from '../../lib/api.messages';
import { getErrorResponse, getSuccessResponse } from '../../lib/utils';

import GroupService from '../group/group.service';
import StudentService from './student.service';

export default class StudentController {
    public getStudents = async(req, res) => {
        logger.log('req.params:', JSON.stringify(req.params));
        logger.log('req.query:', JSON.stringify(req.query));
        logger.log('req.body:', JSON.stringify(req.body));

        const { searchOption, searchWord } = req.query;
        let { nowPage } = req.query;
        let response;

        try {
            nowPage = Number(nowPage);
            if (isNaN(nowPage) || nowPage === 0) {
                nowPage = 1;
            }

            // 계정에 소속된 그룹의 PK를 가져온다.
            const { groups } = await new GroupService().getGroups(req.account.id);
            const groupsCode = [];
            groups.forEach((item) => {
                groupsCode.push(item._id);
            });

            const result = await new StudentService().getStudents({ nowPage, searchOption, searchWord, groupsCode });
            logger.log('result:', JSON.stringify(result));

            response = getSuccessResponse({
                result,
                account: req.account.name
            });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
            logger.err(JSON.stringify({ code: e.code, message: e.message, stack: e.stack }));
            logger.error(e);
            response = getErrorResponse({
                code: e.code || ApiCodes.INTERNAL_SERVER_ERROR,
                message: e.message || ApiMessages.INTERNAL_SERVER_ERROR
            });
        }

        logger.res(httpStatus.OK, response, req);
        res.status(httpStatus.OK).json(response);
    };

    public getStudent = async(req, res) => {
        logger.log('req.params:', JSON.stringify(req.params));
        logger.log('req.query:', JSON.stringify(req.query));
        logger.log('req.body:', JSON.stringify(req.body));

        const { studentId } = req.params;
        let response;

        try {
            const result = await new StudentService().getStudent(studentId);
            logger.log('result:', JSON.stringify(result));

            response = getSuccessResponse({
                result,
                account: req.account.name
            });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
            logger.err(JSON.stringify({ code: e.code, message: e.message, stack: e.stack }));
            logger.error(e);
            response = getErrorResponse({
                code: e.code || ApiCodes.INTERNAL_SERVER_ERROR,
                message: e.message || ApiMessages.INTERNAL_SERVER_ERROR
            });
        }

        logger.res(httpStatus.OK, response, req);
        res.status(httpStatus.OK).json(response);
    };

    public createStudent = async(req, res) => {
        logger.log('req.params:', JSON.stringify(req.params));
        logger.log('req.query:', JSON.stringify(req.query));
        logger.log('req.body:', JSON.stringify(req.body));

        const { societyName, catholicName, age, contact, description, group } = req.body;
        let response;

        try {
            const result = await new StudentService().createStudent({ societyName, catholicName, age, contact, description, group });
            logger.log('result:', JSON.stringify(result));

            response = getSuccessResponse({
                result,
                account: req.account.name
            });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
            logger.err(JSON.stringify({ code: e.code, message: e.message, stack: e.stack }));
            logger.error(e);
            response = getErrorResponse({
                code: e.code || ApiCodes.INTERNAL_SERVER_ERROR,
                message: e.message || ApiMessages.INTERNAL_SERVER_ERROR
            });
        }

        logger.res(httpStatus.OK, response, req);
        res.status(httpStatus.OK).json(response);
    };

    public updateStudent = async(req, res) => {
        logger.log('req.params:', JSON.stringify(req.params));
        logger.log('req.query:', JSON.stringify(req.query));
        logger.log('req.body:', JSON.stringify(req.body));

        const { studentId } = req.params;
        const { societyName, catholicName, age, contact, description, group } = req.body;
        let response;

        try {
            const result = await new StudentService().updateStudent({ societyName, catholicName, age, contact, description, group, studentId });
            logger.log('result:', JSON.stringify(result));

            response = getSuccessResponse({
                result,
                account: req.account.name
            });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
            logger.err(JSON.stringify({ code: e.code, message: e.message, stack: e.stack }));
            logger.error(e);
            response = getErrorResponse({
                code: e.code || ApiCodes.INTERNAL_SERVER_ERROR,
                message: e.message || ApiMessages.INTERNAL_SERVER_ERROR
            });
        }

        logger.res(httpStatus.OK, response, req);
        res.status(httpStatus.OK).json(response);
    };

    public deleteStudent = async(req, res) => {
        logger.log('req.params:', JSON.stringify(req.params));
        logger.log('req.query:', JSON.stringify(req.query));
        logger.log('req.body:', JSON.stringify(req.body));

        const { studentId } = req.params;
        let response;

        try {
            const result = await new StudentService().deleteStudent(studentId);
            logger.log('result:', JSON.stringify(result));

            response = getSuccessResponse({
                result,
                account: req.account.name
            });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
            logger.err(JSON.stringify({ code: e.code, message: e.message, stack: e.stack }));
            logger.error(e);
            response = getErrorResponse({
                code: e.code || ApiCodes.INTERNAL_SERVER_ERROR,
                message: e.message || ApiMessages.INTERNAL_SERVER_ERROR
            });
        }

        logger.res(httpStatus.OK, response, req);
        res.status(httpStatus.OK).json(response);
    };
}
