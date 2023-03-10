import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { Builder } from 'builder-pattern';

import GroupService from './group.service';

import { IGroup } from '@/@types/group';
import { IResponse } from '@/@types/response';

import ApiCode from '@/common/api.code';
import ApiError from '@/common/api.error';
import { Result } from '@/common/result';

import logger from '@/lib/logger';

export default class GroupController {
    async list(req: Request, res: Response) {
        logger.log('req.params:', JSON.stringify(req.params));
        logger.log('req.query:', JSON.stringify(req.query));
        logger.log('req.body:', JSON.stringify(req.body));

        let response;

        try {
            const groups: IGroup[] = await new GroupService().setId(req.account.id).list();
            logger.log('result:', JSON.stringify(groups));

            // const result: ResponseDTO = {
            //     account: req.account.name,
            //     groups
            // };
            logger.log('result:', JSON.stringify(groups));

            response = Result.ok<IResponse>({
                account: req.account.name,
                groups
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

        const { groupId } = req.params;
        let response;

        try {
            // 요청으로 넘어오는것들은 전부 string으로 받아오기 때문에 number로 형변환함.
            const parseGroupId = Number(groupId);
            if (isNaN(parseGroupId) || parseGroupId === 0) {
                throw new ApiError(ApiCode.BAD_REQUEST, 'BAD_REQUEST: groupId is wrong');
            }

            const group: IGroup = await new GroupService().setId(parseGroupId).get();

            // const result: ResponseDTO = {
            //     account: req.account.name,
            //     group
            // };
            logger.log('result:', JSON.stringify(group));

            response = Result.ok<IResponse>({
                account: req.account.name,
                group
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

        const { name } = req.body;
        let response;

        try {
            const param: IGroup = Builder<IGroup>()
                .name(name)
                .accountId(req.account.id)
                .build();

            const group: IGroup = await new GroupService().add(param);

            // const result: ResponseDTO = {
            //     account: req.account.name,
            //     group
            // };
            logger.log('result:', JSON.stringify(group));

            response = Result.ok<IResponse>({
                account: req.account.name,
                group
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

        const { groupId } = req.params;
        const { name } = req.body;
        let response;

        try {
            // 요청으로 넘어오는것들은 전부 string으로 받아오기 때문에 number로 형변환함.
            const parseGroupId = Number(groupId);
            if (isNaN(parseGroupId) || parseGroupId === 0) {
                throw new ApiError(ApiCode.BAD_REQUEST, 'BAD_REQUEST: groupId is wrong');
            }

            const param = Builder<IGroup>()
                ._id(parseGroupId)
                .name(name)
                .accountId(req.account.id)
                .build();

            const row = await new GroupService().modify(param);

            // const result: ResponseDTO = {
            //     account: req.account.name,
            //     row
            // };
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

    async remove(req: Request, res: Response) {
        logger.log('req.params:', JSON.stringify(req.params));
        logger.log('req.query:', JSON.stringify(req.query));
        logger.log('req.body:', JSON.stringify(req.body));

        const { groupId } = req.params;
        let response;

        try {
            // 요청으로 넘어오는것들은 전부 string으로 받아오기 때문에 number로 형변환함.
            const parseGroupId = Number(groupId);
            if (isNaN(parseGroupId) || parseGroupId === 0) {
                throw new ApiError(ApiCode.BAD_REQUEST, 'BAD_REQUEST: groupId is wrong');
            }

            const row = await new GroupService().setId(parseGroupId).remove();

            // const result: ResponseDTO = {
            //     account: req.account.name,
            //     row
            // };
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
