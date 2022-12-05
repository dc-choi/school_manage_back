import { Request, Response } from 'express';
import httpStatus from 'http-status';

import logger from '../../lib/logger';
import ApiCodes from '../../lib/api.codes';
import ApiError from '../../lib/errors';

import { AttendancesDTO } from '../../common/dto/attendance.dto';
import { Result } from '../../common/result';

import AttendanceService from './attendance.service';

export default class AttendanceController {
    /**
     * 초기 출석부 화면
     *
     * @param req
     * @param res
     */
     async setAttendance(req: Request, res: Response) {
        logger.log('req.params:', JSON.stringify(req.params));
        logger.log('req.query:', JSON.stringify(req.query));
        logger.log('req.body:', JSON.stringify(req.body));

        let response;

        try {
            const setting: AttendancesDTO = await new AttendanceService().setAttendance(req.account.id);

            const result = {
                ...setting,
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

    /**
     * 출석 데이터를 가져오는 API
     *
     * @param req
     * @param res
     */
    async getAttendanceByGroup(req: Request, res: Response) {
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
                throw new ApiError(ApiCodes.BAD_REQUEST, 'BAD_REQUEST: groupId is wrong');
            }

            let parseYear = Number(year);
            if (isNaN(parseYear) || parseYear === 0) {
                // year의 경우는 올해의 값으로 처리하도록 함.
                parseYear = new Date().getFullYear();
            }

            const attendances: AttendancesDTO = await new AttendanceService().getAttendanceByGroup(parseGroupId, parseYear);

            const result = {
                ...attendances,
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

    /**
     * 출석 데이터를 입력하는 API
     *
     * @param req
     * @param res
     */
     async createAttendance(req: Request, res: Response) {
        logger.log('req.params:', JSON.stringify(req.params));
        logger.log('req.query:', JSON.stringify(req.query));
        logger.log('req.body:', JSON.stringify(req.body));

        const { year, attendance, isFull } = req.body;
        let response;

        try {
            let row: number;
            if (isFull) {
                row = await new AttendanceService().createFullAttendance(year, attendance);
            } else {
                row = await new AttendanceService().createBlankAttendance(year, attendance);
            }

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
