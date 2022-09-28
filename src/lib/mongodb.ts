import mongoose from 'mongoose';
import util from 'util';

import { env } from '../env';
import logger from './logger';

export function connect() {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
        try {
            await mongoose.connect(env.mongodb.url);
            // MongoDB 로깅을 위한 로직 추가
            // mongoose.set('debug', true);
            mongoose.set('debug', function(collectionName, methodName, ...methodArgs) {
                const msgMapper = (m) => {
                    return util.inspect(m, false, 10, false).replace(/\n/g, '').replace(/\s{2,}/g, ' ');
                };
                logger.mongo(`${collectionName}.${methodName}` + `(${methodArgs.map(msgMapper).join(', ')})`);
            });
            logger.log('Connection has been established successfully.');

            resolve(null);
        } catch (error) {
            logger.error('Unable to connect to the database:', error);
            reject(error);
        }
    });
}
