// import { mysql } from '../../lib/mysql';

import { Account } from '../../models/account.model';

export default class AccountRepository {
    public getAccount = async(id) => {
        return await Account.findOne({
            where: {
                account_ID: id
            },
        });
    };

    // public create = async (refreshToken) => {
    //     await Token.create({
    //         refreshToken
    //     });
    // };
}
