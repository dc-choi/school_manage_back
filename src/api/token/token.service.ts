import jwt from 'jsonwebtoken';
// import bcrypt from 'bcrypt';

import { env } from '../../env';

// import logger from '../../lib/logger';
import ApiCodes from '../../lib/api.codes';
// import ApiMessages from '../../lib/api.messages';
import ApiError from '../../lib/errors';

// import TokenRepository from './token.repository';

export default class TokenService {
    public encodeAccessToken = async(account_ID) => {
        const payload = {
            account_ID,
            timeStamp: Date.now()
        };
        return jwt.sign(payload, env.jwt.secret, { expiresIn: env.jwt.expire.access });
    };

    // public encodeRefreshToken = async (companyIdentificationNumber) => {
    //     const payload = {
    //         companyIdentificationNumber,
    //         timeStamp: Date.now()
    //     };
    //     const token = jwt.sign(payload, env.jwt.secret, { expiresIn: env.jwt.expire.refresh });
    //     await new TokenRepository().create(token);
    //     return token;
    // };

    public decodeToken = async (token) => {
        try {
            return jwt.verify(token, env.jwt.secret);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
			throw new ApiError(ApiCodes.UNAUTHORIZED, error.name);
        }
    };

    // public getRefreshToken = async (token) => {
    //     return await new TokenRepository().getRefreshToken(token);
    // };
}
