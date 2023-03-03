// import { mysql } from '../../lib/mysql';

import { Account } from '@/models/account.model';

export default class AccountRepository {
    async getByAccountId(id: string): Promise<Account> {
        return await Account.findOne({
            where: {
                account_ID: id
            },
        });
    }

    // public create = async (refreshToken) => {
    //     await Token.create({
    //         refreshToken
    //     });
    // };
}
