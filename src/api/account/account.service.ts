import { Builder } from 'builder-pattern';

import { IAccount } from '../../types/account';

import ApiCodes from '../../common/api.codes';
import ApiError from '../../common/api.error';

import { Account } from '../../models/account.model';

import AccountRepository from './account.repository';

export default class AccountService {
    async getAccountByAccountId(id: string): Promise<IAccount> {
        const account: Account = await new AccountRepository().getAccountByAccountId(id);
        if (!account) throw new ApiError(ApiCodes.NOT_FOUND, `NOT_FOUND: ID NOT_FOUND`);

        return Builder<IAccount>()
            ._id(account._id)
            .accountId(account.account_ID)
            .accountPw(account.account_PW)
            .build();
    }
}
