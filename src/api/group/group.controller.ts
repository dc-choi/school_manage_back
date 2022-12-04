import { Request, Response } from 'express';
import httpStatus from 'http-status';

// import { env } from '../../env';

import logger from '../../lib/logger';
import ApiCodes from '../../lib/api.codes';
import ApiMessages from '../../lib/api.messages';
import ApiError from '../../lib/errors';
import { getErrorResponse, getSuccessResponse } from '../../lib/utils';

import GroupService from './group.service';

export default class GroupController {
    async getGroups(req: Request, res: Response) {
        logger.log('req.params:', JSON.stringify(req.params));
        logger.log('req.query:', JSON.stringify(req.query));
        logger.log('req.body:', JSON.stringify(req.body));

        let response;

        try {
            const { groups } = await new GroupService().getGroups(req.account.id);
            logger.log('result:', JSON.stringify(groups));

            response = getSuccessResponse({
                result: groups,
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
    }

    async getGroup(req: Request, res: Response) {
        logger.log('req.params:', JSON.stringify(req.params));
        logger.log('req.query:', JSON.stringify(req.query));
        logger.log('req.body:', JSON.stringify(req.body));

        const { groupId } = req.params;
        let response;

        try {
            // 요청으로 넘어오는것들은 전부 string으로 받아오기 때문에 number로 형변환함.
            const parseGroupId = Number(groupId);
            if (isNaN(parseGroupId) || parseGroupId === 0) {
                throw new ApiError(ApiCodes.BAD_REQUEST, 'BAD_REQUEST: groupId is wrong');
            }

            const { group } = await new GroupService().getGroup(parseGroupId);
            logger.log('result:', JSON.stringify(group));

            response = getSuccessResponse({
                result: group,
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
    }

    async createGroup(req: Request, res: Response) {
        logger.log('req.params:', JSON.stringify(req.params));
        logger.log('req.query:', JSON.stringify(req.query));
        logger.log('req.body:', JSON.stringify(req.body));

        const { name } = req.body;
        let response;

        try {
            const result = await new GroupService().createGroup(name, req.account.id);
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
    }

    async updateGroup(req: Request, res: Response) {
        logger.log('req.params:', JSON.stringify(req.params));
        logger.log('req.query:', JSON.stringify(req.query));
        logger.log('req.body:', JSON.stringify(req.body));

        const { groupId } = req.params;
        const { name } = req.body;
        let response;

        try {
            // 요청으로 넘어오는것들은 전부 string으로 받아오기 때문에 number로 형변환함.
            const parseGroupId = Number(groupId);
            if (isNaN(parseGroupId) || parseGroupId === 0) {
                throw new ApiError(ApiCodes.BAD_REQUEST, 'BAD_REQUEST: groupId is wrong');
            }

            const result = await new GroupService().updateGroup(parseGroupId, name, req.account.id);
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
    }

    async deleteGroup(req: Request, res: Response) {
        logger.log('req.params:', JSON.stringify(req.params));
        logger.log('req.query:', JSON.stringify(req.query));
        logger.log('req.body:', JSON.stringify(req.body));

        const { groupId } = req.params;
        let response;

        try {
            // 요청으로 넘어오는것들은 전부 string으로 받아오기 때문에 number로 형변환함.
            const parseGroupId = Number(groupId);
            if (isNaN(parseGroupId) || parseGroupId === 0) {
                throw new ApiError(ApiCodes.BAD_REQUEST, 'BAD_REQUEST: groupId is wrong');
            }

            const result = await new GroupService().deleteGroup(parseGroupId);
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
    }
}
