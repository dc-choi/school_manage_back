import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface AttendanceAttributes {
    _id: number;
    date?: string;
    content?: string;
    create_at: Date;
    update_at?: Date;
    delete_at?: Date;
    student_id: number;
}

export type AttendancePk = "_id";
export type AttendanceId = Attendance[AttendancePk];
export type AttendanceOptionalAttributes = "_id" | "date" | "content" | "update_at" | "delete_at";
export type AttendanceCreationAttributes = Optional<AttendanceAttributes, AttendanceOptionalAttributes>;

export class Attendance extends Model<AttendanceAttributes, AttendanceCreationAttributes> implements AttendanceAttributes {
    _id!: number;
    date?: string;
    content?: string;
    create_at!: Date;
    update_at?: Date;
    delete_at?: Date;
    student_id!: number;

    static initModel(sequelize: Sequelize.Sequelize): typeof Attendance {
        return Attendance.init({
            _id: {
                autoIncrement: true,
                type: DataTypes.BIGINT,
                allowNull: false,
                primaryKey: true,
                comment: "PK"
            },
            date: {
                type: DataTypes.STRING(50),
                allowNull: true,
                comment: "출석일"
            },
            content: {
                type: DataTypes.STRING(50),
                allowNull: true,
                comment: "출석내용"
            },
            create_at: {
                type: DataTypes.DATE,
                allowNull: false,
                comment: "생성일자"
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
            student_id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                comment: "학생의 PK"
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
            ]
        });
    }
}
