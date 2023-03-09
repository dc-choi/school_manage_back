import AccountRepository from './account.repository';

import { IAccount } from '@/@types/account';

import ApiCode from '@/common/api.code';
import ApiError from '@/common/api.error';
import AccountDTO from '@/common/dto/account.dto';

import { Account } from '@/models/account.model';

export default class AccountService {
    async getByAccountName(name: string): Promise<IAccount> {
        const account: Account = await new AccountRepository().getByAccountName(name);
        if (!account) throw new ApiError(ApiCode.NOT_FOUND, `NOT_FOUND: ID NOT_FOUND`);

        return new AccountDTO(account).account;
    }
}
