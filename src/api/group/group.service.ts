import { Builder } from 'builder-pattern';

import GroupRepository from './group.repository';

import { IGroup } from '@/@types/group';

import ApiCodes from '@/common/api.codes';
import ApiError from '@/common/api.error';
import BaseService from '@/common/base/base.service';

import { Group } from '@/models/group.model';

export default class GroupService extends BaseService<IGroup> {
    async list(): Promise<IGroup[]> {
        const groups: Group[] = await new GroupRepository().setId(this._id).findAll();
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

    async listByAccount(): Promise<IGroup[]> {
        const groups: Group[] = await new GroupRepository().setId(this._id).findAllByAccount();
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

    async get(): Promise<IGroup> {
        const group: Group = await new GroupRepository().setId(this._id).findOne();
        if (!group) throw new ApiError(ApiCodes.NOT_FOUND, `NOT_FOUND: GROUP NOT_FOUND, group_id: ${this._id}`);

        return Builder<IGroup>()
            ._id(group._id)
            .groupName(group.group_name)
            .accountId(group.account__id)
            .build();
    }

    async getByName(groupName: string): Promise<IGroup> {
        const group: Group = await new GroupRepository().findOneByName(groupName);
        if (!group) throw new ApiError(ApiCodes.NOT_FOUND, `NOT_FOUND: GROUP NOT_FOUND, group_name: ${groupName}`);

        return Builder<IGroup>()
            ._id(group._id)
            .groupName(group.group_name)
            .accountId(group.account__id)
            .build();
    }

    async add(param: IGroup): Promise<IGroup> {
        const transaction = await new GroupRepository().setTransaction();
        const group: Group = await transaction.create(param);

        return Builder<IGroup>()
            ._id(group._id)
            .groupName(group.group_name)
            .accountId(group.account__id)
            .build();
    }

    async modify(param: IGroup): Promise<number> {
        const transaction = await new GroupRepository().setTransaction();
        return await transaction.update(param);
    }

    async remove(): Promise<number> {
        const transaction = await new GroupRepository().setId(this._id).setTransaction();
        return await transaction.delete();
    }
}
