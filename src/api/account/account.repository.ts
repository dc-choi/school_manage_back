// import { mysql } from '../../lib/mysql';

import { Account } from '@/models/account.model';

export default class AccountRepository {
    async getByAccountName(name: string): Promise<Account> {
        return await Account.findOne({
            where: {
                name
            },
        });
    }

    // public create = async (refreshToken) => {
    //     await Token.create({
    //         refreshToken
    //     });
    // };
}
