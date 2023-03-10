import GroupRepository from './group.repository';

import { IGroup } from '@/@types/group';

import ApiCode from '@/common/api.code';
import ApiError from '@/common/api.error';
import GroupDTO from '@/common/dto/group.dto';
import BaseService from '@/common/base/base.service';

import { Group } from '@/models/group.model';

export default class GroupService extends BaseService<IGroup> {
    async list(): Promise<IGroup[]> {
        const groups: Group[] = await new GroupRepository().setId(this._id).findAll();
        const groupDTOs: IGroup[] = [];
        groups.forEach(item => groupDTOs.push(new GroupDTO(item).group));

        return groupDTOs;
    }

    async listByAccount(): Promise<IGroup[]> {
        const groups: Group[] = await new GroupRepository().setId(this._id).findAllByAccount();
        const groupDTOs: IGroup[] = [];
        groups.forEach(item => groupDTOs.push(new GroupDTO(item).group));

        return groupDTOs;
    }

    async get(): Promise<IGroup> {
        const group: Group = await new GroupRepository().setId(this._id).findOne();
        if (!group) throw new ApiError(ApiCode.NOT_FOUND, `NOT_FOUND: GROUP NOT_FOUND, group_id: ${this._id}`);

        return new GroupDTO(group).group;
    }

    async getByName(name: string): Promise<IGroup> {
        const group: Group = await new GroupRepository().findOneByName(name);
        if (!group) throw new ApiError(ApiCode.NOT_FOUND, `NOT_FOUND: GROUP NOT_FOUND, name: ${name}`);

        return new GroupDTO(group).group;
    }

    async add(param: IGroup): Promise<IGroup> {
        const transaction = await new GroupRepository().setTransaction();
        const group: Group = await transaction.create(param);

        return new GroupDTO(group).group;
    }

    async modify(param: IGroup): Promise<IGroup> {
        const transaction = await new GroupRepository().setTransaction();
        const group: Group = await transaction.update(param);

        return new GroupDTO(group).group;
    }

    async remove(): Promise<IGroup> {
        const transaction = await new GroupRepository().setId(this._id).setTransaction();
        const group: Group = await transaction.delete();

        return new GroupDTO(group).group;
    }
}
