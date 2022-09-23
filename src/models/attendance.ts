import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Student, StudentId } from './student';

export interface AttendanceAttributes {
    a_code: string;
    a_date: string;
    a_content: string;
    student_s_code: string;
}

export type AttendancePk = "a_code";
export type AttendanceId = Attendance[AttendancePk];
export type AttendanceCreationAttributes = AttendanceAttributes;

export class Attendance extends Model<AttendanceAttributes, AttendanceCreationAttributes> implements AttendanceAttributes {
    a_code!: string;
    a_date!: string;
    a_content!: string;
    student_s_code!: string;

    // Attendance belongsTo Student via student_s_code
    student_s_code_student!: Student;
    getStudent_s_code_student!: Sequelize.BelongsToGetAssociationMixin<Student>;
    setStudent_s_code_student!: Sequelize.BelongsToSetAssociationMixin<Student, StudentId>;
    createStudent_s_code_student!: Sequelize.BelongsToCreateAssociationMixin<Student>;

    static initModel(sequelize: Sequelize.Sequelize): typeof Attendance {
        return sequelize.define('Attendance', {
        a_code: {
            type: DataTypes.STRING(50),
            allowNull: false,
            primaryKey: true
        },
        a_date: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        a_content: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        student_s_code: {
            type: DataTypes.STRING(50),
            allowNull: false,
            references: {
                model: 'student',
                key: 's_code'
            }
        }
    }, {
        tableName: 'attendance',
        timestamps: false,
        indexes: [
            {
                name: "PRIMARY",
                unique: true,
                using: "BTREE",
                fields: [
                    { name: "a_code" },
                ]
            },
            {
                name: "fk_attendance_student_idx",
                using: "BTREE",
                fields: [
                    { name: "student_s_code" },
                ]
            },
        ]
    }) as typeof Attendance;
    }
}
