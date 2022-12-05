import { Builder } from 'builder-pattern';

import { IGroup } from '../../@types/group';
import { Group } from '../../models/group.model';

import GroupRepository from './group.repository';

export default class GroupService {
    async getGroupsByAccountId(_id: number): Promise<IGroup[]> {
        const groups: Group[] = await new GroupRepository().getGroupsByAccountId(_id);
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

        return Builder<IGroup>()
            ._id(group._id)
            .groupName(group.group_name)
            .accountId(group.account__id)
            .build();
    }

    async createGroup(name: string, accountId: number): Promise<IGroup> {
        const group = await new GroupRepository().createGroup(name, accountId);

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
