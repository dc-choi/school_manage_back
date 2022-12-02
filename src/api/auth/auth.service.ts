import bcrypt from 'bcrypt';

// import { env } from '../../env';

// import logger from '../../lib/logger';
import ApiCodes from '../../lib/api.codes';
import ApiMessages from '../../lib/api.messages';
import ApiError from '../../lib/errors';

import TokenService from '../token/token.service';
import AccountService from '../account/account.service';

export default class AuthService {
    async authentication(id: string, password: string) {
        const dbData = await new AccountService().getAccountByAccountId(id);
        if (!dbData) throw new ApiError(ApiCodes.NOT_FOUND, `NOT_FOUND: ID NOT_FOUND`);

        // bcrypt.hashSync(password, 12)로 만들어낸 패스워드끼리 비교.
        const checkPw = bcrypt.compareSync(password, dbData.account_PW);
        if (!checkPw) throw new ApiError(ApiCodes.UNAUTHORIZED, `UNAUTHORIZED: PW is NOT_MATCHED`);

        const accessToken = await new TokenService().encodeAccessToken(dbData.account_ID);
        // 추후에 frontEnd까지 제작을 완성하면 추가할 것
        // const refreshToken = await new TokenService().encodeRefreshToken(dbData.companyIdentificationNumber);

        return {
            message: ApiMessages.OK,
            accessToken,
            // refreshToken
        };
    }

    // public checkRefreshToken = async (refreshToken) => {
    //     const dbToken = await new TokenService().getRefreshToken(refreshToken);
    //     if (!dbToken) throw new ApiError(ApiCodes.BAD_REQUEST, `BAD_REQUEST: refreshToken is Wrong`);
    //     return await new TokenService().decodeToken(dbToken.refreshToken);
    // };

    // public getAccessToken = async (token) => {
    //     const accessToken = await new TokenService().encodeAccessToken(token.companyIdentificationNumber);

    //     return {
    //         message: ApiMessages.OK,
    //         accessToken
    //     };
    // };
}
