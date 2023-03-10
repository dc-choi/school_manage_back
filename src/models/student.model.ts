import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface StudentAttributes {
    _id: number;
    society_name: string;
    catholic_name?: string;
    age?: number;
    contact?: number;
    description?: string;
    baptized_at?: string;
    create_at: Date;
    update_at?: Date;
    delete_at?: Date;
    group_id: number;
}

export type StudentPk = "_id";
export type StudentId = Student[StudentPk];
export type StudentOptionalAttributes = "_id" | "catholic_name" | "age" | "contact" | "description" | "update_at" | "delete_at" | "baptized_at";
export type StudentCreationAttributes = Optional<StudentAttributes, StudentOptionalAttributes>;

export class Student extends Model<StudentAttributes, StudentCreationAttributes> implements StudentAttributes {
    _id!: number;
    society_name!: string;
    catholic_name?: string;
    age?: number;
    contact?: number;
    description?: string;
    baptized_at?: string;
    create_at!: Date;
    update_at?: Date;
    delete_at?: Date;
    group_id!: number;

    static initModel(sequelize: Sequelize.Sequelize): typeof Student {
        return Student.init({
            _id: {
                autoIncrement: true,
                type: DataTypes.BIGINT,
                allowNull: false,
                primaryKey: true,
                comment: "PK"
            },
            society_name: {
                type: DataTypes.STRING(50),
                allowNull: false,
                comment: "이름"
            },
            catholic_name: {
                type: DataTypes.STRING(50),
                allowNull: true,
                comment: "세례명"
            },
            age: {
                type: DataTypes.BIGINT,
                allowNull: true,
                comment: "나이"
            },
            contact: {
                type: DataTypes.BIGINT,
                allowNull: true,
                comment: "연락처"
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true,
                comment: "상세 설명"
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
            group_id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                comment: "그룹의 PK"
            },
            baptized_at: {
                type: DataTypes.STRING(10),
                allowNull: true,
                comment: "축일"
            }
        }, {
            sequelize,
            tableName: 'student',
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
