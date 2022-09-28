// import { env } from '../../env';

// import logger from '../../lib/logger';
// import ApiCodes from '../../lib/api.codes';
// import ApiMessages from '../../lib/api.messages';
// import ApiError from '../../lib/errors';

import AccountRepository from './account.repository';

export default class AccountService {
    public getAccount = async(id) => {
        return await new AccountRepository().getAccount(id);
    };
}
