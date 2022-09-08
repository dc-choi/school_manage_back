/* eslint-disable @typescript-eslint/no-explicit-any */
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as pkg from '../package.json';
import {
    getOsEnv,
    normalizePort,
} from './lib/env';

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
    app: {
        name: getOsEnv('APP_NAME'),
        version: (pkg as any).version,
        description: (pkg as any).description,
        port: normalizePort(process.env.APP_PORT),
    },
    jwt: {
		secret: getOsEnv('JWT_SECRET'),
        access: getOsEnv('JWT_ACCESS_EXPIRE'),
        refresh: getOsEnv('JWT_REFRESH_EXPIRE')
	},
};
