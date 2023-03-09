import { Request, Response } from 'express';
import httpStatus from 'http-status';

import ApiError from '@/common/api.error';
import { Result } from '@/common/result';
import ResponseDTO from '@/common/dto/response.dto';

import logger from '@/lib/logger';

export default class AccountController {
    async get(req: Request, res: Response) {
        logger.log('req.params:', JSON.stringify(req.params));
        logger.log('req.query:', JSON.stringify(req.query));
        logger.log('req.body:', JSON.stringify(req.body));

        let response;

        try {
            // 파싱된 토큰에 데이터가 있으면 처리가 가능함.
            const { name } = req.account;
            logger.log('result:', JSON.stringify(name));

            response = Result.ok<ResponseDTO>(name).toJson();
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
