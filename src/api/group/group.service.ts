import { Builder } from 'builder-pattern';

import GroupRepository from './group.repository';

import { IGroup } from '@/@types/group';

import ApiCodes from '@/common/api.codes';
import ApiError from '@/common/api.error';

import { Group } from '@/models/group.model';

export default class GroupService {
    async getGroupsByAccount(_id: number): Promise<IGroup[]> {
        const groups: Group[] = await new GroupRepository().getGroupsByAccount(_id);
        const groupsBuilder: IGroup[] = [];
        groups.forEach(item => {
            groupsBuilder.push(
                Builder<IGroup>()
                    ._id(item._id)
                    .groupName(item.group_name)
                    .build()
            );
        });

        return groupsBuilder;
    }

    async getGroup(groupId: number): Promise<IGroup> {
        const group: Group = await new GroupRepository().getGroup(groupId);
        if (!group) throw new ApiError(ApiCodes.NOT_FOUND, `NOT_FOUND: GROUP NOT_FOUND`);

        return Builder<IGroup>()
            ._id(group._id)
            .groupName(group.group_name)
            .accountId(group.account__id)
            .build();
    }

    async createGroup(name: string, accountId: number): Promise<IGroup> {
        const group: Group = await new GroupRepository().createGroup(name, accountId);

        return Builder<IGroup>()
            ._id(group._id)
            .groupName(group.group_name)
            .accountId(group.account__id)
            .build();
    }

    async updateGroup(groupId: number, name: string, accountId: number): Promise<number> {
        const [ affectedCount ] = await new GroupRepository().updateGroup(groupId, name, accountId);
        const row = affectedCount;
        return row;
    }

    async deleteGroup(groupId: number): Promise<number> {
        const [ affectedCount ] = await new GroupRepository().deleteGroup(groupId);
        const row = affectedCount;
        return row;
    }
}
