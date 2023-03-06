import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface StudentAttributes {
    _id: number;
    student_society_name: string;
    student_catholic_name?: string;
    student_age?: number;
    student_contact?: number;
    student_description?: string;
    baptized_at?: string;
    create_at: Date;
    update_at?: Date;
    delete_at?: Date;
    group__id: number;
}

export type StudentPk = "_id";
export type StudentId = Student[StudentPk];
export type StudentOptionalAttributes = "_id" | "student_catholic_name" | "student_age" | "student_contact" | "student_description" | "baptized_at" | "update_at" | "delete_at";
export type StudentCreationAttributes = Optional<StudentAttributes, StudentOptionalAttributes>;

export class Student extends Model<StudentAttributes, StudentCreationAttributes> implements StudentAttributes {
    _id!: number;
    student_society_name!: string;
    student_catholic_name?: string;
    student_age?: number;
    student_contact?: number;
    student_description?: string;
    baptized_at?: string;
    create_at!: Date;
    update_at?: Date;
    delete_at?: Date;
    group__id!: number;

    static initModel(sequelize: Sequelize.Sequelize): typeof Student {
        return Student.init({
            _id: {
                autoIncrement: true,
                type: DataTypes.BIGINT,
                allowNull: false,
                primaryKey: true
            },
            student_society_name: {
                type: DataTypes.STRING(50),
                allowNull: false
            },
            student_catholic_name: {
                type: DataTypes.STRING(50),
                allowNull: true
            },
            student_age: {
                type: DataTypes.BIGINT,
                allowNull: true
            },
            student_contact: {
                type: DataTypes.BIGINT,
                allowNull: true
            },
            student_description: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            create_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
            },
            baptized_at: {
                type: DataTypes.STRING(10),
                allowNull: true
            },
            update_at: {
                type: DataTypes.DATE,
                allowNull: true
            },
            delete_at: {
                type: DataTypes.DATE,
                allowNull: true
            },
            group__id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                references: {
                    model: 'group',
                    key: '_id'
                }
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
                {
                    name: "fk_student_group1_idx",
                    using: "BTREE",
                    fields: [
                        { name: "group__id" },
                    ]
                },
            ]
        });
    }
}
