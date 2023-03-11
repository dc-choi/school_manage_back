import { Request, Response } from 'express';
import httpStatus from 'http-status';

import AttendanceService from './attendance.service';

import { IResponse } from '@/@types/response';

import ApiError from '@/common/api.error';
import { Result } from '@/common/result';

import logger from '@/lib/logger';

export default class AttendanceController {
    /**
     * 출석 데이터를 입력하는 API
     *
     * @param req
     * @param res
     */
     async modify(req: Request, res: Response) {
        logger.log('req.params:', JSON.stringify(req.params));
        logger.log('req.query:', JSON.stringify(req.query));
        logger.log('req.body:', JSON.stringify(req.body));

        const { year, attendance, isFull } = req.body;
        let response;

        try {
            /**
             * 공백에 대한 출석과 입력에 대한 출석을 따로 나누는 로직도 합치는 것을 생각해봤으나,
             * 하나의 로직으로 묶어서 처리한다고 가정하고 성능 테스트를 해봤을 때에는 10번정도 요청을 보냈을 때, 1.2 ~ 2.3초정도의 성능을 보이는 것으로 확인함.
             * 결론적으로 프론트에서 Promise.all을 사용하면 더욱 더 성능이 증가할 것으로 예상됨. 그래서 지금 로직을 유지하는것으로 생각함.
             */
            let row: number;
            if (isFull) {
                row = await new AttendanceService().setYear(year).update(attendance);
            } else {
                row = await new AttendanceService().setYear(year).delete(attendance);
            }
            logger.log('result:', JSON.stringify(row));

            response = Result.ok<IResponse>({
                account: req.account.name,
                row,
                isFull,
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
