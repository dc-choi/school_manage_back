import bcrypt from 'bcrypt';
import { Builder } from 'builder-pattern';

// import { env } from '../../env';

import { IToken } from '../../types/token';

// import logger from '../../lib/logger';

import ApiCodes from '../../common/api.codes';
import ApiError from '../../common/api.error';

import TokenService from '../token/token.service';
import AccountService from '../account/account.service';

export default class AuthService {
    async authentication(id: string, password: string): Promise<IToken> {
        const account = await new AccountService().getAccountByAccountId(id);
        // bcrypt.hashSync(password, 12)로 만들어낸 패스워드끼리 비교.
        const checkPw = bcrypt.compareSync(password, account.accountPw);
        if (!checkPw) throw new ApiError(ApiCodes.UNAUTHORIZED, `UNAUTHORIZED: PW is NOT_MATCHED`);

        const accessToken = await new TokenService().encodeAccessToken(account.accountId);
        // 추후에 완성하면 추가할 것
        // const refreshToken = await new TokenService().encodeRefreshToken(dbData.companyIdentificationNumber);

        return Builder<IToken>()
            .id(account.accountId)
            .accessToken(accessToken)
            .build();
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
