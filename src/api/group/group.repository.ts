import { Sequelize, Op } from 'sequelize';

import logger from '../../lib/logger'
import { mysql } from '../../lib/mysql';

import { Group } from '../../models/group.model';

export default class GroupRepository {
    public getGroups = async(_id) => {
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
    };

    public getGroup = async(groupId) => {
        return await Group.findOne({
            where: {
                _id: groupId,
                delete_at: {
                    [Op.eq]: null,
                },
            }
        })
    };

    public createGroup = async({ name, accountId }) => {
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
    };

    public updateGroup = async({ groupId, name, accountId }) => {
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
    };

    public deleteGroup = async(groupId) => {
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
    };
}
