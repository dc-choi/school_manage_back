import { Request, Response } from 'express';
import httpStatus from 'http-status';

// import { env } from '../../env';

import logger from '../../lib/logger';
import ApiCodes from '../../lib/api.codes';
import ApiMessages from '../../lib/api.messages';
import { getErrorResponse, getSuccessResponse } from '../../lib/utils';

import TokenService from '../token/token.service';
// import AccountService from './account.service';

export default class AccountController {
    async getAccount(req: Request, res: Response) {
        logger.log('req.params:', JSON.stringify(req.params));
        logger.log('req.query:', JSON.stringify(req.query));
        logger.log('req.body:', JSON.stringify(req.body));

        const { token } = req.query;
        let response;

        try {
            const decodeToken = await new TokenService().decodeToken(token);
            const { account_ID } = decodeToken;
            logger.log('result:', JSON.stringify(account_ID));

            response = getSuccessResponse({
                result: account_ID
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
    }
}
