import { Request, Response } from 'express';
import httpStatus from 'http-status';

import AuthService from './auth.service';

import { IToken } from '@/@types/token';
import { IResponse } from '@/@types/response';

import ApiError from '../../common/api.error';
import { Result } from '../../common/result';

import logger from '@/lib/logger';

export default class AuthController {
    /**
     * 로그인을 하는 API
     *
     * @param req
     * @param res
     */
     async login(req: Request, res: Response) {
        logger.log('req.params:', JSON.stringify(req.params));
        logger.log('req.query:', JSON.stringify(req.query));
        logger.log('req.body:', JSON.stringify(req.body));

        const { id, password } = req.body;
        let response;

        try {
            const token: IToken = await new AuthService().authentication(id, password);
            logger.log('result:', JSON.stringify(token));

            response = Result.ok<IResponse>(token).toJson();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
            logger.err(JSON.stringify({ code: e.code, message: e.message, stack: e.stack }));
            logger.error(e);
            response = Result.fail<ApiError>(e).toJson();
        }

        logger.res(httpStatus.OK, response, req);
        res.status(httpStatus.OK).json(response);
    }

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
    //             code: e.code || ApiCode.INTERNAL_SERVER_ERROR,
    //             message: e.message || ApiMessage.INTERNAL_SERVER_ERROR
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
    //             code: e.code || ApiCode.INTERNAL_SERVER_ERROR,
    //             message: e.message || ApiMessage.INTERNAL_SERVER_ERROR
    //         });
    //     }

    //     logger.res(httpStatus.OK, response, req);
    //     res.status(httpStatus.OK).json(response);
    // };
}
