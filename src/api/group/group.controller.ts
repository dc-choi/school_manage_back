import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { Builder } from 'builder-pattern';

import GroupService from './group.service';

import { IGroup } from '@/@types/group';
import { IResponse } from '@/@types/response';

import ApiCode from '@/common/api.code';
import ApiError from '@/common/api.error';
import AttendanceBuilder from '@/common/builder/attendance.builder';
import { Result } from '@/common/result';

import logger from '@/lib/logger';

import AttendanceService from '@/api/attendance/attendance.service';

export default class GroupController {
    async list(req: Request, res: Response) {
        logger.log('req.params:', JSON.stringify(req.params));
        logger.log('req.query:', JSON.stringify(req.query));
        logger.log('req.body:', JSON.stringify(req.body));

        let response;

        try {
            const groups: IGroup[] = await new GroupService().setId(req.account.id).list();
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

            const group = await new GroupService().modify(param);
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

            const group = await new GroupService().setId(parseGroupId).remove();
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

    /**
     * 출석 데이터를 가져오는 API
     *
     * @param req
     * @param res
     */
    async attendanceForGroup(req: Request, res: Response) {
        logger.log('req.params:', JSON.stringify(req.params));
        logger.log('req.query:', JSON.stringify(req.query));
        logger.log('req.body:', JSON.stringify(req.body));

        const { groupId } = req.params;
        const { year } = req.query;
        let response;

        try {
            // 요청으로 넘어오는것들은 전부 string으로 받아오기 때문에 number로 형변환함.
            const parseGroupId = Number(groupId);
            if (isNaN(parseGroupId) || parseGroupId === 0) {
                throw new ApiError(ApiCode.BAD_REQUEST, 'BAD_REQUEST: groupId is wrong');
            }

            let parseYear = Number(year);
            if (isNaN(parseYear) || parseYear === 0) {
                // year의 경우는 올해의 값으로 처리하도록 함.
                parseYear = new Date().getFullYear();
            }

            const attendances: AttendanceBuilder = await new AttendanceService().setId(parseGroupId).setYear(parseYear).findAllByGroup();
            logger.log('result:', JSON.stringify(attendances));

            response = Result.ok<IResponse>({
                account: req.account.name,
                ...attendances
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
