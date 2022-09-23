import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Student, StudentId } from './student';

export interface GroupAttributes {
    g_code: string;
    g_name?: string;
}

export type GroupPk = "g_code";
export type GroupId = Group[GroupPk];
export type GroupOptionalAttributes = "g_name";
export type GroupCreationAttributes = Optional<GroupAttributes, GroupOptionalAttributes>;

export class Group extends Model<GroupAttributes, GroupCreationAttributes> implements GroupAttributes {
    g_code!: string;
    g_name?: string;

    // Group hasMany Student via group_g_code
    students!: Student[];
    getStudents!: Sequelize.HasManyGetAssociationsMixin<Student>;
    setStudents!: Sequelize.HasManySetAssociationsMixin<Student, StudentId>;
    addStudent!: Sequelize.HasManyAddAssociationMixin<Student, StudentId>;
    addStudents!: Sequelize.HasManyAddAssociationsMixin<Student, StudentId>;
    createStudent!: Sequelize.HasManyCreateAssociationMixin<Student>;
    removeStudent!: Sequelize.HasManyRemoveAssociationMixin<Student, StudentId>;
    removeStudents!: Sequelize.HasManyRemoveAssociationsMixin<Student, StudentId>;
    hasStudent!: Sequelize.HasManyHasAssociationMixin<Student, StudentId>;
    hasStudents!: Sequelize.HasManyHasAssociationsMixin<Student, StudentId>;
    countStudents!: Sequelize.HasManyCountAssociationsMixin;

    static initModel(sequelize: Sequelize.Sequelize): typeof Group {
        return sequelize.define('Group', {
        g_code: {
            type: DataTypes.STRING(50),
            allowNull: false,
            primaryKey: true
        },
        g_name: {
            type: DataTypes.STRING(50),
            allowNull: true
        }
    }, {
        tableName: 'group',
        timestamps: false,
        indexes: [
            {
                name: "PRIMARY",
                unique: true,
                using: "BTREE",
                fields: [
                    { name: "g_code" },
                ]
            },
        ]
    }) as typeof Group;
    }
}
