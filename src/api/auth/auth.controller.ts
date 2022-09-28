import httpStatus from 'http-status';

// import { env } from '../../env';

import logger from '../../lib/logger';
import ApiCodes from '../../lib/api.codes';
import ApiMessages from '../../lib/api.messages';
import { getErrorResponse, getSuccessResponse } from '../../lib/utils';

import AuthService from './auth.service';

export default class AuthController {
    /**
     * 로그인을 하는 API
     *
     * @param req
     * @param res
     */
    public login = async(req, res) => {
        logger.log('req.params:', JSON.stringify(req.params));
        logger.log('req.query:', JSON.stringify(req.query));
        logger.log('req.body:', JSON.stringify(req.body));

        const { id, password } = req.body;
        let response;

        try {
            const result = await new AuthService().authentication({ id, password });
            logger.log('result:', JSON.stringify(result));

            response = getSuccessResponse({
                result
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

    // 지금 당장 사용하는 함수 X
    // public logout = async(req, res) => {
    //     logger.log('req.params:', JSON.stringify(req.params));
    //     logger.log('req.query:', JSON.stringify(req.query));
    //     logger.log('req.body:', JSON.stringify(req.body));

    //     let response;
    //     try {
    //         response = getSuccessResponse({
    //             // 코드 추가 예정
    //         });
    //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //     } catch (e: any) {
    //         logger.err(JSON.stringify({ code: e.code, message: e.message, stack: e.stack }));
    //         logger.error(e);
    //         response = getErrorResponse({
    //             code: e.code || ApiCodes.INTERNAL_SERVER_ERROR,
    //             message: e.message || ApiMessages.INTERNAL_SERVER_ERROR
    //         });
    //     }

    //     logger.res(httpStatus.OK, response, req);
    //     res.status(httpStatus.OK).json(response);
    // };

    // public accessToken = async (req, res) => {
    //     logger.log('req.params:', JSON.stringify(req.params));
    //     logger.log('req.query:', JSON.stringify(req.query));
    //     logger.log('req.body:', JSON.stringify(req.body));

    //     // const { refreshToken } = req.body
    //     let response;

    //     try {
    //         const dbToken = await new AuthService().checkRefreshToken(refreshToken);
    //         const result = await new AuthService().getAccessToken(dbToken);

    //         response = getSuccessResponse({
    //             result
    //         });
    //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //     } catch (e: any) {
    //         logger.err(JSON.stringify({ code: e.code, message: e.message, stack: e.stack }));
    //         logger.error(e);
    //         response = getErrorResponse({
    //             code: e.code || ApiCodes.INTERNAL_SERVER_ERROR,
    //             message: e.message || ApiMessages.INTERNAL_SERVER_ERROR
    //         });
    //     }

    //     logger.res(httpStatus.OK, response, req);
    //     res.status(httpStatus.OK).json(response);
    // };
}
