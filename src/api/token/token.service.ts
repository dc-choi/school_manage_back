import jwt from 'jsonwebtoken';
// import bcrypt from 'bcrypt';

// import TokenRepository from './token.repository';

import { env } from '@/env';

import ApiCode from '@/common/api.code';
// import ApiMessage from '@/common/api.messages';
import ApiError from '@/common/api.error';

// import logger from '@/lib/logger';

/**
 * 추후에 refresh token을 구현할 때 타입을 적용시켜야 함.
 */
export default class TokenService {
    /**
     * 토큰 암호화
     *
     * @param name
     * @returns
     */
    async encodeAccessToken(name: string) {
        const payload = {
            name,
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

    /**
     * 토큰 복호화
     *
     * @param token
     * @returns
     */
    async decodeToken(token: string) {
        try {
            return jwt.verify(token, env.jwt.secret);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
			throw new ApiError(ApiCode.UNAUTHORIZED, error.name);
        }
    }

    // public getRefreshToken = async (token) => {
    //     return await new TokenRepository().getRefreshToken(token);
    // };

    /**
     * 복호화된 토큰의 만료시간 체크
     *
     * @param decodeToken
     */
    async checkTime(decodeToken: { name: string; timeStamp: number; }) {
        const regex = /[^A-z]/g; // 문자열 A~z에 대한 정규식
        const now = Date.now();
        const expireDate = new Date(decodeToken.timeStamp).getTime();
        const str = env.jwt.expire.access.replace(regex, ""); // 정규식으로 현재 시스템의 토큰 만료기한이 시간단위인지 분단위인지 구하기
        let result: boolean;

        if (str === 'h') { // 시간단위 처리
            const parsed = env.jwt.expire.access.split('h');
            result = (now - expireDate) > (parseInt(parsed[0]) * 3600000);
        } else { // 분단위 처리
            const parsed = env.jwt.expire.access.split('m');
            result = (now - expireDate) > (parseInt(parsed[0]) * 60000);
        }

        if (result) {
            throw new ApiError(ApiCode.UNAUTHORIZED, 'TOKEN is EXPIRE');
        }
    }
}
