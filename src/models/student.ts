import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Attendance, AttendanceId } from './attendance';
import type { Group, GroupId } from './group';

export interface StudentAttributes {
    s_code: string;
    s_society_name: string;
    s_catholic_name: string;
    s_age: number;
    s_contact: string;
    group_g_code: string;
}

export type StudentPk = "s_code";
export type StudentId = Student[StudentPk];
export type StudentCreationAttributes = StudentAttributes;

export class Student extends Model<StudentAttributes, StudentCreationAttributes> implements StudentAttributes {
    s_code!: string;
    s_society_name!: string;
    s_catholic_name!: string;
    s_age!: number;
    s_contact!: string;
    group_g_code!: string;

    // Student belongsTo Group via group_g_code
    group_g_code_group!: Group;
    getGroup_g_code_group!: Sequelize.BelongsToGetAssociationMixin<Group>;
    setGroup_g_code_group!: Sequelize.BelongsToSetAssociationMixin<Group, GroupId>;
    createGroup_g_code_group!: Sequelize.BelongsToCreateAssociationMixin<Group>;
    // Student hasMany Attendance via student_s_code
    attendances!: Attendance[];
    getAttendances!: Sequelize.HasManyGetAssociationsMixin<Attendance>;
    setAttendances!: Sequelize.HasManySetAssociationsMixin<Attendance, AttendanceId>;
    addAttendance!: Sequelize.HasManyAddAssociationMixin<Attendance, AttendanceId>;
    addAttendances!: Sequelize.HasManyAddAssociationsMixin<Attendance, AttendanceId>;
    createAttendance!: Sequelize.HasManyCreateAssociationMixin<Attendance>;
    removeAttendance!: Sequelize.HasManyRemoveAssociationMixin<Attendance, AttendanceId>;
    removeAttendances!: Sequelize.HasManyRemoveAssociationsMixin<Attendance, AttendanceId>;
    hasAttendance!: Sequelize.HasManyHasAssociationMixin<Attendance, AttendanceId>;
    hasAttendances!: Sequelize.HasManyHasAssociationsMixin<Attendance, AttendanceId>;
    countAttendances!: Sequelize.HasManyCountAssociationsMixin;

    static initModel(sequelize: Sequelize.Sequelize): typeof Student {
        return sequelize.define('Student', {
        s_code: {
            type: DataTypes.STRING(50),
            allowNull: false,
            primaryKey: true
        },
        s_society_name: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        s_catholic_name: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        s_age: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        s_contact: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        group_g_code: {
            type: DataTypes.STRING(50),
            allowNull: false,
            references: {
                model: 'group',
                key: 'g_code'
            }
        }
    }, {
        tableName: 'student',
        timestamps: false,
        indexes: [
            {
                name: "PRIMARY",
                unique: true,
                using: "BTREE",
                fields: [
                    { name: "s_code" },
                ]
            },
            {
                name: "fk_student_gruop1_idx",
                using: "BTREE",
                fields: [
                    { name: "group_g_code" },
                ]
            },
        ]
    }) as typeof Student;
    }
}
