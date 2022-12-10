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
            /**
             * TODO: 출석입력 부분의 큰 변화가 필요함.
             * 일단 attendance는 { str, data } 이렇게 되어있음.
             * str이라는 매개변수는 절대 클린하지않음. (다른 사람이 봤을때 한눈에 알아 볼 수 없음.)
             * 현재 str안에는 student, month, day에 대한 정보가 들어감.
             * 이를 프론트에서 먼저 student, month, day로 나누고, 백엔드에서 그에 맞춰서 로직을 새로 짜는것을 생각해야함.
             *
             * 공백에 대한 출석과 입력에 대한 출석을 따로 나누는 로직도 합치는 것을 생각해봤으나,
             * 하나의 로직으로 묶어서 처리한다고 가정하고 성능 테스트를 해봤을 때에는 10번정도 요청을 보냈을 때, 1.2 ~ 2.3초정도의 성능을 보이는 것으로 확인함.
             * 결론적으로 프론트에서 Promise.all을 사용하면 더욱 더 성능이 증가할 것으로 예상됨. 그래서 지금 로직을 유지하는것으로 생각함.
             */
            let row: number;
            if (isFull) {
                row = await new AttendanceService().createFullAttendance(year, attendance);
            } else {
                row = await new AttendanceService().createBlankAttendance(year, attendance);
            }

            const result = {
                row,
                isFull,
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
