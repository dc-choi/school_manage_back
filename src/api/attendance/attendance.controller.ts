import httpStatus from 'http-status';

// import { env } from '../../env';

import logger from '../../lib/logger';
import ApiCodes from '../../lib/api.codes';
import ApiMessages from '../../lib/api.messages';
import { getErrorResponse, getSuccessResponse } from '../../lib/utils';

import AttendanceService from './attendance.service';

export default class AttendanceController {
    /**
     * 초기 출석부 화면
     *
     * @param req
     * @param res
     */
    public initAttendance = async(req, res) => {
        logger.log('req.params:', JSON.stringify(req.params));
        logger.log('req.query:', JSON.stringify(req.query));
        logger.log('req.body:', JSON.stringify(req.body));

        let response;

        try {
            const result = await new AttendanceService().initAttendance(req.account.id);
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

    /**
     * 출석 데이터를 가져오는 API
     *
     * @param req
     * @param res
     */
    public getAttendanceByGroup = async(req, res) => {
        logger.log('req.params:', JSON.stringify(req.params));
        logger.log('req.query:', JSON.stringify(req.query));
        logger.log('req.body:', JSON.stringify(req.body));

        const { groupId } = req.params;
        let { year } = req.query;
        let response;

        try {
            year = Number(year);
            if (isNaN(year) || year === 0) {
                year = new Date().getFullYear();
            }

            const result = await new AttendanceService().getAttendanceByGroup({ groupId, year });
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

    /**
     * 공백 출석 데이터를 입력하는 API
     *
     * @param req
     * @param res
     */
    public createBlankAttendance = async(req, res) => {
        logger.log('req.params:', JSON.stringify(req.params));
        logger.log('req.query:', JSON.stringify(req.query));
        logger.log('req.body:', JSON.stringify(req.body));

        const { year, attendance } = req.body;
        let response;

        try {
            const result = await new AttendanceService().createBlankAttendance({ year, attendance });
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

    /**
     * 출석 데이터를 입력하는 API
     *
     * @param req
     * @param res
     */
     public createFullAttendance = async(req, res) => {
        logger.log('req.params:', JSON.stringify(req.params));
        logger.log('req.query:', JSON.stringify(req.query));
        logger.log('req.body:', JSON.stringify(req.body));

        const { year, attendance } = req.body;
        let response;

        try {
            const result = await new AttendanceService().createFullAttendance({ year, attendance });
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
