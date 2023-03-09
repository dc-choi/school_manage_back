/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Sequelize, Op } from 'sequelize';

import { IGroup } from '@/@types/group';

import BaseRepository from '@/common/base/base.repository';

import logger from '@/lib/logger'

import { Group } from '@/models/group.model';

export default class GroupRepository extends BaseRepository<Group> {
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
        let group: Group;

        try {
            group = await Group.create({
                name: param.name,
                account_id: param.accountId
            }, { transaction: this.transaction });

            await this.transaction.commit();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
            logger.error(e);
            await this.transaction.rollback();
            group = null;
        }

        return group;
    }

    async update(param: IGroup): Promise<number> {
        let group: number;

        try {
            [ group ] = await Group.update(
                {
                    name: param.name,
                    account_id: param.accountId
                },
                {
                    where: {
                        _id: param._id
                    },
                    transaction: this.transaction
                }
            );

            await this.transaction.commit();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
            logger.error(e);
            await this.transaction.rollback();
            group = 0;
        }

        return group;
    }

    async delete(): Promise<number> {
        let group: number;

        try {
            [ group ] = await Group.update(
                {
                    delete_at: Sequelize.literal('CURRENT_TIMESTAMP')
                },
                {
                    where: {
                        _id: this._id
                    },
                    transaction: this.transaction
                }
            );

            await this.transaction.commit();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
            logger.error(e);
            await this.transaction.rollback();
            group = 0;
        }

        return group;
    }
}
