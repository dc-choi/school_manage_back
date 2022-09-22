import { Sequelize } from 'sequelize';

import { env } from '../env';

import logger from '../lib/logger';



/**
 * sequelize-auto -o "./models" -d idp_local -h localhost -p 3306 -e mysql -u root -x -l ts --cm p --useDefine --indentation 4
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
};

export function initModels() {
    Rp.initModel(sequelize);
    Credentials.initModel(sequelize);
    Transport.initModel(sequelize);
    Sessions.initModel(sequelize);

    Rp.hasMany(Credentials, { foreignKey: 'rp_id' });
    Credentials.hasMany(Transport, { foreignKey: 'credentials_id' });
}

export function connect() {
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
    })
}
