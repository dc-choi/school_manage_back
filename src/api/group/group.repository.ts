/* eslint-disable @typescript-eslint/no-explicit-any */
import { Op } from 'sequelize';

import { IGroup } from '@/@types/group';

import BaseRepository from '@/common/base/base.repository';

import { Group } from '@/models/group.model';

export default class GroupRepository extends BaseRepository<Group> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    findAndCountAll(where: any): Promise<{ rows: any; count: number; }> {
        throw new Error('Method not implemented.');
    }

    async findAll(): Promise<Group[]> {
        return await Group.findAll({
            attributes: [
                '_id',
				'name',
                'account_id',
			],
            where: {
                account_id: this._id,
				delete_at: {
                    [Op.eq]: null,
                },
			}
        });
    }

    async findAllByAccount(): Promise<Group[]> {
        return await Group.findAll({
            attributes: [
                '_id',
				'name',
                'account_id',
			],
            where: {
                account_id: this._id,
				delete_at: {
                    [Op.eq]: null,
                },
			},
            order: [ ['name', 'DESC'] ]
        });
    }

    async findOne(): Promise<Group> {
        return await Group.findOne({
            where: {
                _id: this._id,
                delete_at: {
                    [Op.eq]: null,
                },
            }
        })
    }

    async findOneByName(name: string): Promise<Group> {
        return await Group.findOne({
            where: {
                name,
                delete_at: {
                    [Op.eq]: null,
                },
            }
        });
    }

    async create(param: IGroup): Promise<Group> {
        return await Group.create({
            name: param.name,
            account_id: param.accountId
        }, { transaction: this.transaction });
    }

    async update(param: IGroup): Promise<Group> {
        const group: Group = await this.setId(param._id).findOne();
        group.name = param.name;
        group.account_id = param.accountId;
        await group.save({
            transaction: this.transaction,
            fields: ['name', 'account_id']
        });

        return group;
    }

    async delete(): Promise<Group> {
        const group: Group = await this.findOne();
        group.delete_at = new Date();
        await group.save({
            transaction: this.transaction,
            fields: [ 'delete_at' ]
        });

        return group;
    }
}
