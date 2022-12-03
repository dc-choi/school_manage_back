import { Sequelize, Op } from 'sequelize';

import logger from '../../lib/logger'
import { mysql } from '../../lib/mysql';

import { Group } from '../../models/group.model';

export default class GroupRepository {
    async getGroups(_id: number): Promise<Group[]> {
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

    async createGroup(name: string, accountId: number): Promise<void> {
        const transaction = await mysql.transaction();

        try {
            await Group.create({
                group_name: name,
                account__id: accountId
            }, { transaction });

            await transaction.commit();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
            logger.error(e);
            await transaction.rollback();
        }
    }

    async updateGroup(groupId: number, name: string, accountId: number): Promise<void> {
        const transaction = await mysql.transaction();

        try {
            await Group.update(
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
        }
    }

    async deleteGroup(groupId: number): Promise<void> {
        const transaction = await mysql.transaction();

        try {
            await Group.update(
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
        }
    }
}
