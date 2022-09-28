import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface AttendanceAttributes {
    _id: number;
    attendance_date?: string;
    attendance_content?: string;
    create_at: Date;
    update_at?: Date;
    delete_at?: Date;
    student__id: number;
}

export type AttendancePk = "_id";
export type AttendanceId = Attendance[AttendancePk];
export type AttendanceOptionalAttributes = "_id" | "attendance_date" | "attendance_content" | "update_at" | "delete_at";
export type AttendanceCreationAttributes = Optional<AttendanceAttributes, AttendanceOptionalAttributes>;

export class Attendance extends Model<AttendanceAttributes, AttendanceCreationAttributes> implements AttendanceAttributes {
    _id!: number;
    attendance_date?: string;
    attendance_content?: string;
    create_at!: Date;
    update_at?: Date;
    delete_at?: Date;
    student__id!: number;

    static initModel(sequelize: Sequelize.Sequelize): typeof Attendance {
        return Attendance.init({
            _id: {
                autoIncrement: true,
                type: DataTypes.BIGINT,
                allowNull: false,
                primaryKey: true
            },
            attendance_date: {
                type: DataTypes.STRING(50),
                allowNull: true
            },
            attendance_content: {
                type: DataTypes.STRING(50),
                allowNull: true
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
            },
            student__id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                references: {
                    model: 'student',
                    key: '_id'
                }
            }
        }, {
            sequelize,
            tableName: 'attendance',
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
                    name: "fk_attendance_student1_idx",
                    using: "BTREE",
                    fields: [
                        { name: "student__id" },
                    ]
                },
            ]
        });
    }
}
