import { Builder } from 'builder-pattern';

import { IAccount } from '../../@types/account';
import { Account } from '../../models/account.model';

import AccountRepository from './account.repository';

export default class AccountService {
    async getAccountByAccountId(id: string): Promise<IAccount> {
        const account: Account = await new AccountRepository().getAccountByAccountId(id);

        return Builder<IAccount>()
            ._id(account._id)
            .accountId(account.account_ID)
            .accountPw(account.account_PW)
            .build();
    }
}
