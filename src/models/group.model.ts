import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface GroupAttributes {
    _id: number;
    name: string;
    create_at: Date;
    update_at?: Date;
    delete_at?: Date;
    account_id: number;
}

export type GroupPk = "_id";
export type GroupId = Group[GroupPk];
export type GroupOptionalAttributes = "_id" | "update_at" | "delete_at";
export type GroupCreationAttributes = Optional<GroupAttributes, GroupOptionalAttributes>;

export class Group extends Model<GroupAttributes, GroupCreationAttributes> implements GroupAttributes {
    _id!: number;
    name!: string;
    create_at!: Date;
    update_at?: Date;
    delete_at?: Date;
    account_id!: number;

    static initModel(sequelize: Sequelize.Sequelize): typeof Group {
        return Group.init({
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
                comment: "그룹명"
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
            account_id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                comment: "계정의 PK"
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
            ]
        });
    }
}
