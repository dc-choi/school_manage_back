import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Group, GroupId } from './group';

export interface AccountAttributes {
    _id: number;
    account_ID: string;
    account_PW: string;
    create_at: Date;
    update_at?: Date;
    delete_at?: Date;
}

export type AccountPk = "_id";
export type AccountId = Account[AccountPk];
export type AccountOptionalAttributes = "_id" | "update_at" | "delete_at";
export type AccountCreationAttributes = Optional<AccountAttributes, AccountOptionalAttributes>;

export class Account extends Model<AccountAttributes, AccountCreationAttributes> implements AccountAttributes {
    _id!: number;
    account_ID!: string;
    account_PW!: string;
    create_at!: Date;
    update_at?: Date;
    delete_at?: Date;

    // Account hasMany Group via account__id
    groups!: Group[];
    getGroups!: Sequelize.HasManyGetAssociationsMixin<Group>;
    setGroups!: Sequelize.HasManySetAssociationsMixin<Group, GroupId>;
    addGroup!: Sequelize.HasManyAddAssociationMixin<Group, GroupId>;
    addGroups!: Sequelize.HasManyAddAssociationsMixin<Group, GroupId>;
    createGroup!: Sequelize.HasManyCreateAssociationMixin<Group>;
    removeGroup!: Sequelize.HasManyRemoveAssociationMixin<Group, GroupId>;
    removeGroups!: Sequelize.HasManyRemoveAssociationsMixin<Group, GroupId>;
    hasGroup!: Sequelize.HasManyHasAssociationMixin<Group, GroupId>;
    hasGroups!: Sequelize.HasManyHasAssociationsMixin<Group, GroupId>;
    countGroups!: Sequelize.HasManyCountAssociationsMixin;

    static initModel(sequelize: Sequelize.Sequelize): typeof Account {
        return Account.init({
            _id: {
                autoIncrement: true,
                type: DataTypes.BIGINT,
                allowNull: false,
                primaryKey: true
            },
            account_ID: {
                type: DataTypes.STRING(50),
                allowNull: false
            },
            account_PW: {
                type: DataTypes.STRING(200),
                allowNull: false
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
            tableName: 'account',
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
            ]
        });
    }
}
