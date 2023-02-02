import { Sequelize, Op } from 'sequelize';

import logger from '@/lib/logger'
import { mysql } from '@/lib/mysql';

import { Group } from '@/models/group.model';

export default class GroupRepository {
    async getGroupsByAccount(_id: number): Promise<Group[]> {
        return await Group.findAll({
            attributes: [
                '_id',
				'group_name',
			],
            where: {
                account__id: _id,
				delete_at: {
                    [Op.eq]: null,
                },
			},
        });
    }

    async getGroup(groupId: number): Promise<Group> {
        return await Group.findOne({
            where: {
                _id: groupId,
                delete_at: {
                    [Op.eq]: null,
                },
            }
        })
    }

    async createGroup(name: string, accountId: number): Promise<Group> {
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

    async updateGroup(groupId: number, name: string, accountId: number): Promise<[affectedCount: number]> {
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

    async deleteGroup(groupId: number): Promise<[affectedCount: number]> {
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
