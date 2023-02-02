/* eslint-disable @typescript-eslint/no-explicit-any */
import * as dotenv from 'dotenv';
import * as path from 'path';

// 이 부분만 상대경로
import * as pkg from '../package.json';

import {
    getOsEnv,
    normalizePort,
} from '@/lib/env';

/**
 * Load .env file or for tests the .env.test file.
 */
const postfix = process.env.NODE_ENV?.toLowerCase().includes('prod') ? '' :
    (process.env.NODE_ENV?.toLowerCase().includes('dev') ? '.dev' : ('.' + process.env.NODE_ENV));
dotenv.config({ path: path.join(process.cwd(), `.env${postfix}`) });

/**
 * Environment variables
 */
export const env = {
    mode: {
        prod: process.env.NODE_ENV?.toLowerCase().includes('prod'),
        dev: process.env.NODE_ENV?.toLowerCase().includes('dev'),
        test: process.env.NODE_ENV?.toLowerCase().includes('test'),
        value: process.env.NODE_ENV?.toLowerCase()
    },
    mongodb: {
        url: getOsEnv('MONGODB_URL')
    },
    mysql: {
        host: getOsEnv('MYSQL_HOST'),
        port: getOsEnv('MYSQL_PORT'),
        username: getOsEnv('MYSQL_USERNAME'),
        password: getOsEnv('MYSQL_PASSWORD'),
        schema: getOsEnv('MYSQL_SCHEMA'),
    },
    app: {
        name: getOsEnv('APP_NAME'),
        version: (pkg as any).version,
        description: (pkg as any).description,
        port: normalizePort(process.env.APP_PORT),
    },
    jwt: {
		secret: getOsEnv('JWT_SECRET'),
        expire: {
            access: getOsEnv('JWT_EXPIRE_ACCESS'),
            refresh: getOsEnv('JWT_EXPIRE_REFRESH')
        },
	},
};
