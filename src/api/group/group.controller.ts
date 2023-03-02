import { Request, Response } from 'express';
import httpStatus from 'http-status';

import GroupService from './group.service';

import { IGroup } from '@/@types/group';

import ApiCodes from '@/common/api.codes';
import ApiError from '@/common/api.error';
import { Result } from '@/common/result';
import { ResponseDTO } from '@/common/dto/response.dto';

import logger from '@/lib/logger';

export default class GroupController {
    async getGroups(req: Request, res: Response) {
        logger.log('req.params:', JSON.stringify(req.params));
        logger.log('req.query:', JSON.stringify(req.query));
        logger.log('req.body:', JSON.stringify(req.body));

        let response;

        try {
            const groups: IGroup[] = await new GroupService().getGroupsByAccount(req.account.id);
            logger.log('result:', JSON.stringify(groups));

            const result: ResponseDTO = {
                account: req.account.name,
                groups
            }
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

            const group: IGroup = await new GroupService().getGroup(parseGroupId);

            const result: ResponseDTO = {
                account: req.account.name,
                group
            }
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

    async createGroup(req: Request, res: Response) {
        logger.log('req.params:', JSON.stringify(req.params));
        logger.log('req.query:', JSON.stringify(req.query));
        logger.log('req.body:', JSON.stringify(req.body));

        const { name } = req.body;
        let response;

        try {
            const group: IGroup = await new GroupService().createGroup(name, req.account.id);

            const result: ResponseDTO = {
                account: req.account.name,
                group
            }
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

            const row = await new GroupService().updateGroup(parseGroupId, name, req.account.id);

            const result: ResponseDTO = {
                account: req.account.name,
                row
            }
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

            const row = await new GroupService().deleteGroup(parseGroupId);

            const result: ResponseDTO = {
                account: req.account.name,
                row
            }
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
