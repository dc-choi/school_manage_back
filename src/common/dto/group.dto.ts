import { Builder } from 'builder-pattern';

import { IGroup } from '@/@types/group';

import { prune } from '@/lib/utils';

import { Group } from '@/models/group.model';

export default class GroupDTO {
    public group: IGroup;

    constructor(param: Group) {
        const build = Builder<IGroup>()
            ._id(param._id)
            .name(param.name)
            .accountId(param.account_id)
            .build();

        this.group = prune(build);
    }
}
