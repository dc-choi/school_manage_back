/* eslint-disable @typescript-eslint/no-explicit-any */
import GroupRepository from './group.repository';

import { IGroup } from '@/@types/group';

import ApiCode from '@/common/api.code';
import ApiError from '@/common/api.error';
import GroupDTO from '@/common/dto/group.dto';
import BaseService from '@/common/base/base.service';

import logger from '@/lib/logger';

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

        try {
            const group = await transaction.create(param);
            await transaction.commit();
            return new GroupDTO(group).group;
        } catch(e: any) {
            logger.err(e);
            logger.error(e);
            await transaction.rollback();
            throw new ApiError(ApiCode.INTERNAL_SERVER_ERROR, `${e}`);
        }
    }

    async modify(param: IGroup): Promise<IGroup> {
        const transaction = await new GroupRepository().setTransaction();

        try {
            const group = await transaction.update(param);
            await transaction.commit();
            return new GroupDTO(group).group;
        } catch(e: any) {
            logger.err(e);
            logger.error(e);
            await transaction.rollback();
            throw new ApiError(ApiCode.INTERNAL_SERVER_ERROR, `${e}`);
        }
    }

    async remove(): Promise<IGroup> {
        const transaction = await new GroupRepository().setId(this._id).setTransaction();

        try {
            const group = await transaction.delete();
            await transaction.commit();
            return new GroupDTO(group).group;
        } catch(e: any) {
            logger.err(e);
            logger.error(e);
            await transaction.rollback();
            throw new ApiError(ApiCode.INTERNAL_SERVER_ERROR, `${e}`);
        }
    }
}
