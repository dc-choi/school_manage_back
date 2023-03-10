/* eslint-disable no-extra-boolean-cast */
import { Request, Response } from 'express';
import httpStatus from 'http-status';

import StatisticsService from './statistics.service';

import { IResponse } from '@/@types/response';

import ApiError from '@/common/api.error';
import { Result } from '@/common/result';

import logger from '@/lib/logger';

export default class StatisticsController {
    async excellentStudent(req: Request, res: Response) {
        logger.log('req.params:', JSON.stringify(req.params));
        logger.log('req.query:', JSON.stringify(req.query));
        logger.log('req.body:', JSON.stringify(req.body));

        const { year } = req.query;
        let parseYear = String(year);
        let response;

        try {
            if (!!!parseYear || parseYear === 'undefined') {
                parseYear = new Date().getFullYear().toString();
            }

            const excellentStudents = await new StatisticsService().excellentStudents(req.account.id, parseYear);
            logger.log('result:', JSON.stringify(excellentStudents));

            // const result: ResponseDTO = {
            //     account: req.account.name,
            //     excellentStudents
            // };
            logger.log('result:', JSON.stringify(excellentStudents));

            response = Result.ok<IResponse>({
                account: req.account.name,
                excellentStudents
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
