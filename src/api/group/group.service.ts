import { Builder } from 'builder-pattern';

import GroupRepository from './group.repository';

import { IGroup } from '@/@types/group';

import ApiCodes from '@/common/api.codes';
import ApiError from '@/common/api.error';

import { Group } from '@/models/group.model';

export default class GroupService {
    async list(accountId: number): Promise<IGroup[]> {
        const groups: Group[] = await new GroupRepository().list(accountId);
        const groupsBuilder: IGroup[] = [];
        groups.forEach(item => {
            groupsBuilder.push(
                Builder<IGroup>()
                    ._id(item._id)
                    .groupName(item.group_name)
                    .accountId(item.account__id)
                    .build()
            );
        });

        return groupsBuilder;
    }

    async listByAccount(accountId: number): Promise<IGroup[]> {
        const groups: Group[] = await new GroupRepository().listByAccount(accountId);
        const groupsBuilder: IGroup[] = [];
        groups.forEach(item => {
            groupsBuilder.push(
                Builder<IGroup>()
                    ._id(item._id)
                    .groupName(item.group_name)
                    .accountId(item.account__id)
                    .build()
            );
        });

        return groupsBuilder;
    }

    async get(groupId: number): Promise<IGroup> {
        const group: Group = await new GroupRepository().get(groupId);
        if (!group) throw new ApiError(ApiCodes.NOT_FOUND, `NOT_FOUND: GROUP NOT_FOUND, group_id: ${groupId}`);

        return Builder<IGroup>()
            ._id(group._id)
            .groupName(group.group_name)
            .accountId(group.account__id)
            .build();
    }

    async getByName(groupName: string): Promise<IGroup> {
        const group: Group = await new GroupRepository().getByName(groupName);
        if (!group) throw new ApiError(ApiCodes.NOT_FOUND, `NOT_FOUND: GROUP NOT_FOUND, group_name: ${groupName}`);

        return Builder<IGroup>()
            ._id(group._id)
            .groupName(group.group_name)
            .accountId(group.account__id)
            .build();
    }

    async create(name: string, accountId: number): Promise<IGroup> {
        const group: Group = await new GroupRepository().create(name, accountId);

        return Builder<IGroup>()
            ._id(group._id)
            .groupName(group.group_name)
            .accountId(group.account__id)
            .build();
    }

    async update(groupId: number, name: string, accountId: number): Promise<number> {
        const [ affectedCount ] = await new GroupRepository().update(groupId, name, accountId);
        return affectedCount;
    }

    async delete(groupId: number): Promise<number> {
        const [ affectedCount ] = await new GroupRepository().delete(groupId);
        return affectedCount;
    }
}
