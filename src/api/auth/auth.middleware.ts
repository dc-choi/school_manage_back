import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import context from 'express-http-context';

import { IAccount } from '@/@types/account';

import ApiCode from '@/common/api.code';
import ApiError from '@/common/api.error';
import { Result } from '@/common/result';

import logger from '@/lib/logger';

import AccountService from '@/api/account/account.service';
import TokenService from '@/api/token/token.service';

/**
 * authentication/authorization에 관련된 미들웨어
 *
 * authorization을 파이프라인으로 처리한 이유는 하나의 authentication() 에서 관리하기 보다 기능을 나누는게 효율적이라고 생각했음.
 * 사용자의 피드백을 듣게 되면 언젠가는 authentication/authorization에 관련된 부분도 수정을 해야하는데, 그 부분이 하나의 함수에서 여러 동작을 하게되는 경우 유지보수가 어렵다고 생각했음.
 *
 * 또한, 클린 코드를 추구하기에 각각의 동작끼리 묶어서 처리함.
 * Node.js의 next() 를 사용해서 파이프라인으로 처리하였음.
 */
export default class AuthMiddleware {
    /**
     * 토큰 파싱하는 부분
     */
    async parseAuthToken(req: Request, res: Response, next: NextFunction) {
        try {
			if (req.headers.authorization?.startsWith('Bearer')) {
				const token = req.headers.authorization.split(' ')[1];
				const decodeToken = await new TokenService().decodeToken(token);
                req.decodeToken = decodeToken;
                next();
			} else {
				throw new ApiError(ApiCode.NOT_FOUND, 'UNAUTHORIZED: TOKEN NOT_FOUND');
			}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (e: any) {
			logger.err(JSON.stringify({ code: e.code, message: e.message, stack: e.stack }));
            logger.error(e);
            const response = Result.fail<ApiError>(e).toJson();

            logger.res(httpStatus.OK, response, req);
            res.status(httpStatus.OK).json(response);
		}
    }

    /**
     * 파싱된 데이터로 검증
     */
    async verifyAccount(req: Request, res: Response, next: NextFunction) {
        try {
            // 토큰의 기한이 만료된 토큰인지 검사하는 로직
            await new TokenService().checkTime(req.decodeToken);
            // 시스템상 가입된 회원인지 확인
            const { name } = req.decodeToken;
            const account: IAccount = await new AccountService().getByAccountName(name);

            req.account = {
                id: account._id,
                name
            };

            context.set('account_name', name);
            next();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (e: any) {
			logger.err(JSON.stringify({ code: e.code, message: e.message, stack: e.stack }));
            logger.error(e);
            const response = Result.fail<ApiError>(e).toJson();

            logger.res(httpStatus.OK, response, req);
            res.status(httpStatus.OK).json(response);
		}
    }
}
