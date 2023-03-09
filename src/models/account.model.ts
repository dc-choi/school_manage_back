import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface AccountAttributes {
    _id: number;
    name: string;
    password: string;
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
    name!: string;
    password!: string;
    create_at!: Date;
    update_at?: Date;
    delete_at?: Date;

    static initModel(sequelize: Sequelize.Sequelize): typeof Account {
        return Account.init({
            _id: {
                autoIncrement: true,
                type: DataTypes.BIGINT,
                allowNull: false,
                primaryKey: true,
                comment: "PK"
            },
            name: {
                type: DataTypes.STRING(50),
                allowNull: false,
                comment: "사용자가 입력하는 ID"
            },
            password: {
                type: DataTypes.STRING(200),
                allowNull: false,
                comment: "사용자가 입력하는 password"
            },
            create_at: {
                type: DataTypes.DATE,
                allowNull: false,
                comment: "생성일자",
                defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
            },
            update_at: {
                type: DataTypes.DATE,
                allowNull: true,
                comment: "수정일자"
            },
            delete_at: {
                type: DataTypes.DATE,
                allowNull: true,
                comment: "삭제일자"
            },
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
