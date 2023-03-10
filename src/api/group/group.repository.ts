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

    async update(param: IGroup): Promise<Group> {
        let group: Group;

        try {
            group = await this.setId(param._id).findOne();
            group.name = param.name;
            group.account_id = param.accountId;
            await group.save({
                transaction: this.transaction,
                fields: ['name', 'account_id']
            });
            // 변경된 후의 객체를 반환해야 함. 그래서 이 부분은 주석 처리하였음.
            // await Group.update(
            //     {
            //         name: param.name,
            //         account_id: param.accountId
            //     },
            //     {
            //         where: {
            //             _id: param._id
            //         },
            //         transaction: this.transaction
            //     }
            // );
            await this.transaction.commit();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
            logger.error(e);
            await this.transaction.rollback();
            group = null;
        }

        return group;
    }

    async delete(): Promise<Group> {
        let group: Group;

        try {
            group = await this.findOne();
            group.delete_at = new Date();
            await group.save({
                transaction: this.transaction,
                fields: [ 'delete_at' ]
            });
            // 변경된 후의 객체를 반환해야 함. 그래서 이 부분은 주석 처리하였음.
            // await Group.update(
            //     {
            //         delete_at: Sequelize.literal('CURRENT_TIMESTAMP')
            //     },
            //     {
            //         where: {
            //             _id: this._id
            //         },
            //         transaction: this.transaction
            //     }
            // );
            await this.transaction.commit();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
            logger.error(e);
            await this.transaction.rollback();
            group = null;
        }

        return group;
    }
}
