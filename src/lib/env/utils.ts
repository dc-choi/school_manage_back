import { join } from 'path';
import logger from '../logger';

export function getOsEnv(key: string): string {
    if (typeof process.env[key] === 'undefined') {
        logger.error(`Environment variable ${key} is not set.`)
        throw new Error(`Environment variable ${key} is not set.`);
    }

    return process.env[key] as string;
}

export function normalizePort(port: string): number | string | boolean {
    const parsedPort = parseInt(port, 10);
    if (isNaN(parsedPort)) { // named pipe
        return port;
    }
    if (parsedPort >= 0) { // port number
        return parsedPort;
    }
    return false;
}
