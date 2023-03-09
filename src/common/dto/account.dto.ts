import { Builder } from 'builder-pattern';

import { IAccount } from '@/@types/account';

import { prune } from '@/lib/utils';

import { Account } from '@/models/account.model';

export default class AccountDTO {
    public account: IAccount;

    constructor(param: Account) {
        const build = Builder<IAccount>()
            ._id(param._id)
            .name(param.name)
            .password(param.password)
            .build();

        this.account = prune(build);
    }
}
