import jwt from 'jsonwebtoken';
// import bcrypt from 'bcrypt';

import { env } from '../../env';

// import logger from '../../lib/logger';
import ApiCodes from '../../lib/api.codes';
// import ApiMessages from '../../lib/api.messages';
import ApiError from '../../lib/api.error';

// import TokenRepository from './token.repository';

/**
 * 추후에 refresh token을 구현할 때 타입을 적용시켜야 함.
 */
export default class TokenService {
    async encodeAccessToken(account_ID: string) {
        const payload = {
            account_ID,
            timeStamp: Date.now()
        };
        return jwt.sign(payload, env.jwt.secret, { expiresIn: env.jwt.expire.access });
    }

    // public encodeRefreshToken = async (companyIdentificationNumber) => {
    //     const payload = {
    //         companyIdentificationNumber,
    //         timeStamp: Date.now()
    //     };
    //     const token = jwt.sign(payload, env.jwt.secret, { expiresIn: env.jwt.expire.refresh });
    //     await new TokenRepository().create(token);
    //     return token;
    // };

    async decodeToken(token: string) {
        try {
            return jwt.verify(token, env.jwt.secret);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
			throw new ApiError(ApiCodes.UNAUTHORIZED, error.name);
        }
    }

    // public getRefreshToken = async (token) => {
    //     return await new TokenRepository().getRefreshToken(token);
    // };
}
