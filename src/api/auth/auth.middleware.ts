import httpStatus from 'http-status';
import context from 'express-http-context';

// import { env } from '../../env';

import logger from '../../lib/logger';
import ApiCodes from '../../lib/api.codes';
import ApiMessages from '../../lib/api.messages';
import ApiError from '../../lib/errors';
import { getErrorResponse } from '../../lib/utils';

import TokenService from '../token/token.service';
import CompantService from '../company/company.service';

export default class AuthMiddleware {
    public verifyAccessToken = async (req, res, next) => {
		try {
			if (req.headers.authorization?.startsWith('Bearer')) {
				const token = req.headers.authorization.split(' ')[1];
				const decodeToken = await new TokenService().decodeToken(token);
                const { companyIdentificationNumber } = decodeToken;
				const result = await new CompantService().getCompany(companyIdentificationNumber);
                if (!result) throw new ApiError(ApiCodes.FORBIDDEN, 'FORBIDDEN: TOKEN is FORBIDDEN');
                context.set('companyIdentificationNumber', companyIdentificationNumber);
                next();
			} else {
				throw new ApiError(ApiCodes.NOT_FOUND, 'UNAUTHORIZED: TOKEN NOT_FOUND');
			}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (e: any) {
			logger.err(JSON.stringify({ code: e.code, message: e.message, stack: e.stack }));
            logger.error(e);
            const response = getErrorResponse({
                code: e.code || ApiCodes.INTERNAL_SERVER_ERROR,
                message: e.message || ApiMessages.INTERNAL_SERVER_ERROR
            });

            logger.res(httpStatus.OK, response, req);
            res.status(httpStatus.OK).json(response);
		}
	};
}
