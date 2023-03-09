import { Builder } from 'builder-pattern';

import { IToken } from '@/@types/token';

import { prune } from '@/lib/utils';

export default class TokenDTO {
    public account: IToken;

    constructor(name: string, accessToken: string, refreshToken?: string) {
        const build = Builder<IToken>()
            .name(name)
            .accessToken(accessToken)
            .refreshToken(refreshToken)
            .build();

        this.account = prune(build);
    }
}
