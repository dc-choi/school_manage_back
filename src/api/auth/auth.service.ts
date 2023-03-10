import bcrypt from 'bcrypt';

import { IToken } from '@/@types/token';

import ApiCode from '@/common/api.code';
import ApiError from '@/common/api.error';
import TokenDTO from '@/common/dto/token.dto';

import TokenService from '@/api/token/token.service';
import AccountService from '@/api/account/account.service';

export default class AuthService {
    async authentication(id: string, password: string): Promise<IToken> {
        const account = await new AccountService().getByAccountName(id);
        // bcrypt.hashSync(password, 12)로 만들어낸 패스워드끼리 비교.
        const checkPw = bcrypt.compareSync(password, account.password);
        if (!checkPw) throw new ApiError(ApiCode.UNAUTHORIZED, `UNAUTHORIZED: PW is NOT_MATCHED`);

        const accessToken = await new TokenService().encodeAccessToken(account.name);
        // 추후에 완성하면 추가할 것
        // const refreshToken = await new TokenService().encodeRefreshToken(dbData.companyIdentificationNumber);

        return new TokenDTO(account.name, accessToken).token;
    }

    // public checkRefreshToken = async (refreshToken) => {
    //     const dbToken = await new TokenService().getRefreshToken(refreshToken);
    //     if (!dbToken) throw new ApiError(ApiCode.BAD_REQUEST, `BAD_REQUEST: refreshToken is Wrong`);
    //     return await new TokenService().decodeToken(dbToken.refreshToken);
    // };

    // public getAccessToken = async (token) => {
    //     const accessToken = await new TokenService().encodeAccessToken(token.companyIdentificationNumber);

    //     return {
    //         message: ApiMessage.OK,
    //         accessToken
    //     };
    // };
}
