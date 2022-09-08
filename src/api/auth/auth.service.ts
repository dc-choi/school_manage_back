import bcrypt from 'bcrypt';

// import { env } from '../../env';

// import logger from '../../lib/logger';
import ApiCodes from '../../lib/api.codes';
import ApiMessages from '../../lib/api.messages';
import ApiError from '../../lib/errors';

import CompanyService from '../company/company.service'
import TokenService from '../token/token.service';

export default class AuthService {
    public authentication = async ({ id, password }) => {
        const dbData = await new CompanyService().getCompany(id);
        if (!dbData) throw new ApiError(ApiCodes.NOT_FOUND, `NOT_FOUND: ID NOT_FOUND`);

        const checkPw = bcrypt.compareSync(password, dbData.password);
        if (!checkPw) throw new ApiError(ApiCodes.UNAUTHORIZED, `UNAUTHORIZED: PW is NOT_MATCHED`);

        const accessToken = await new TokenService().encodeAccessToken(dbData.companyIdentificationNumber);
        const refreshToken = await new TokenService().encodeRefreshToken(dbData.companyIdentificationNumber);

        return {
            message: ApiMessages.OK,
            accessToken,
            refreshToken
        };
    };

    public checkRefreshToken = async (refreshToken) => {
        const dbToken = await new TokenService().getRefreshToken(refreshToken);
        if (!dbToken) throw new ApiError(ApiCodes.BAD_REQUEST, `BAD_REQUEST: refreshToken is Wrong`);
        return await new TokenService().decodeToken(dbToken.refreshToken);
    };

    public getAccessToken = async (token) => {
        const accessToken = await new TokenService().encodeAccessToken(token.companyIdentificationNumber);

        return {
            message: ApiMessages.OK,
            accessToken
        };
    };
}
