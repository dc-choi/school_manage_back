import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { IResponse } from '@/@types/response';

import ApiError from '@/common/api.error';
import { Result } from '@/common/result';

import logger from '@/lib/logger';

export default class AccountController {
    async get(req: Request, res: Response) {
        logger.log('req.params:', JSON.stringify(req.params));
        logger.log('req.query:', JSON.stringify(req.query));
        logger.log('req.body:', JSON.stringify(req.body));

        let response;

        try {
            // 파싱된 토큰에 데이터가 있으면 처리가 가능함.
            logger.log('result:', JSON.stringify(req.account.name));
            response = Result.ok<IResponse>({ name: req.account.name }).toJson();
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
