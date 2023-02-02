import { Sequelize } from 'sequelize';

import { env } from '@/env';

import logger from '@/lib/logger';

import { Account } from '@/models/account.model';
import { Group } from '@/models/group.model'
import { Student } from '@/models/student.model'
import { Attendance } from '@/models/attendance.model'

/**
 * sequelize-auto -o "./src/models" -d school -h localhost -p 3306 -e mysql -u root -x -l ts --cm p --indentation 4
 * -o: output
 * -d: database
 * -h: host
 * -p: port
 * -e: dialect (postgres, mysql)
 * -u: user
 * -x: password
 * -l: lang (es5, es6, esm, ts)
 * --cm p: camelCase (ModelName: PascalCase)
 * --useDefine: es6, esm, ts에서는 init대신에 define을 사용하도록 함. (오류가 발생해서 제외함.)
 * --indentation 4: 들여쓰기 4
 */
const sequelize = new Sequelize(env.mysql.schema, env.mysql.username, env.mysql.password, {
    host: env.mysql.host,
    dialect: 'mysql',
    port: parseInt(env.mysql.port, 10),
    define: {
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
        freezeTableName: true
    },
    timezone: '+09:00',
    logQueryParameters: env.mode.dev,
    logging: (query) => {
        if (query?.includes('SELECT 1+1 AS result')) return;
        logger.sql(query);
    }
});

export {
    sequelize as mysql
}

export function initModels() {
    const account = Account.initModel(sequelize);
    const group = Group.initModel(sequelize);
    const student = Student.initModel(sequelize);
    const attendance = Attendance.initModel(sequelize);

    group.belongsTo(account, { as: "account", foreignKey: "account__id"});
    account.hasMany(group, { as: "groups", foreignKey: "account__id"});
    student.belongsTo(group, { as: "group", foreignKey: "group__id"});
    group.hasMany(student, { as: "students", foreignKey: "group__id"});
    attendance.belongsTo(student, { as: "student", foreignKey: "student__id"});
    student.hasMany(attendance, { as: "attendances", foreignKey: "student__id"});
}

export function connect() {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
        initModels();

        try {
            await sequelize.authenticate();
            console.log('Connection has been established successfully.');
            resolve(null);
        } catch (error) {
            console.error('Unable to connect to the database:', error);
            reject(error);
        }
    });
}
