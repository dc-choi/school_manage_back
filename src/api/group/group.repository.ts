import { Sequelize, Op } from 'sequelize';

import logger from '@/lib/logger'
import { mysql } from '@/lib/mysql';

import { Group } from '@/models/group.model';

export default class GroupRepository {
    async list(accountId: number): Promise<Group[]> {
        return await Group.findAll({
            attributes: [
                '_id',
				'group_name',
                'account__id',
			],
            where: {
                account__id: accountId,
				delete_at: {
                    [Op.eq]: null,
                },
			}
        });
    }

    async listByAccount(accountId: number): Promise<Group[]> {
        return await Group.findAll({
            attributes: [
                '_id',
				'group_name',
                'account__id',
			],
            where: {
                account__id: accountId,
				delete_at: {
                    [Op.eq]: null,
                },
			},
            order: [ ['group_name', 'DESC'] ]
        });
    }

    async get(groupId: number): Promise<Group> {
        return await Group.findOne({
            where: {
                _id: groupId,
                delete_at: {
                    [Op.eq]: null,
                },
            }
        })
    }

    async getByName(groupName: string): Promise<Group> {
        return await Group.findOne({
            where: {
                group_name: groupName,
                delete_at: {
                    [Op.eq]: null,
                },
            }
        });
    }

    async create(name: string, accountId: number): Promise<Group> {
        const transaction = await mysql.transaction();
        let group;

        try {
            group = await Group.create({
                group_name: name,
                account__id: accountId
            }, { transaction });

            await transaction.commit();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
            logger.error(e);
            await transaction.rollback();
            group = null;
        }

        return group;
    }

    async update(groupId: number, name: string, accountId: number): Promise<[affectedCount: number]> {
        const transaction = await mysql.transaction();
        let group;

        try {
            group = await Group.update(
                {
                    group_name: name,
                    account__id: accountId
                },
                {
                    where: {
                        _id: groupId
                    },
                    transaction
                }
            );

            await transaction.commit();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
            logger.error(e);
            await transaction.rollback();
            group = 0;
        }

        return group;
    }

    async delete(groupId: number): Promise<[affectedCount: number]> {
        const transaction = await mysql.transaction();
        let group;

        try {
            group = await Group.update(
                {
                    delete_at: Sequelize.literal('CURRENT_TIMESTAMP')
                },
                {
                    where: {
                        _id: groupId
                    },
                    transaction
                }
            );

            await transaction.commit();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
            logger.error(e);
            await transaction.rollback();
            group = 0;
        }

        return group;
    }
}
