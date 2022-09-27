import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface GroupAttributes {
    _id: number;
    group_name: string;
    account__id: number;
    create_at: Date;
    update_at?: Date;
    delete_at?: Date;
}

export type GroupPk = "_id";
export type GroupId = Group[GroupPk];
export type GroupOptionalAttributes = "_id" | "update_at" | "delete_at";
export type GroupCreationAttributes = Optional<GroupAttributes, GroupOptionalAttributes>;

export class Group extends Model<GroupAttributes, GroupCreationAttributes> implements GroupAttributes {
    _id!: number;
    group_name!: string;
    account__id!: number;
    create_at!: Date;
    update_at?: Date;
    delete_at?: Date;

    static initModel(sequelize: Sequelize.Sequelize): typeof Group {
        return Group.init({
            _id: {
                autoIncrement: true,
                type: DataTypes.BIGINT,
                allowNull: false,
                primaryKey: true
            },
            group_name: {
                type: DataTypes.STRING(50),
                allowNull: false
            },
            account__id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                references: {
                    model: 'account',
                    key: '_id'
                }
            },
            create_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
            },
            update_at: {
                type: DataTypes.DATE,
                allowNull: true
            },
            delete_at: {
                type: DataTypes.DATE,
                allowNull: true
            }
        }, {
            sequelize,
            tableName: 'group',
            timestamps: false,
            indexes: [
                {
                    name: "PRIMARY",
                    unique: true,
                    using: "BTREE",
                    fields: [
                        { name: "_id" },
                    ]
                },
                {
                    name: "fk_group_account_idx",
                    using: "BTREE",
                    fields: [
                        { name: "account__id" },
                    ]
                },
            ]
        });
    }
}
