import { join } from 'path';
import logger from '../logger';

export function getOsEnv(key: string): string {
    if (typeof process.env[key] === 'undefined') {
        logger.error(`Environment variable ${key} is not set.`)
        throw new Error(`Environment variable ${key} is not set.`);
    }

    return process.env[key] as string;
}

export function getOsEnvOptional(key: string): string | undefined {
    return process.env[key];
}

export function getOsEnvNumber(key: string): number {
    if (typeof process.env[key] === 'undefined') {
        throw new Error(`[${process.env.NODE_ENV}] Environment variable ${key} is not set.`);
    }

    const parsed = parseInt(process.env[key], 10);
    if (isNaN(parsed)) {
        // named pipe
        return Number.NaN;
    }

    return parsed;
}

export function getOsEnvNumberOptional(key: string): number | undefined {
    if (typeof process.env[key] === 'undefined') {
        return undefined;
    }

    const parsed = parseInt(process.env[key], 10);
    if (isNaN(parsed)) {
        // named pipe
        return undefined;
    }

    return parsed;
}

export function getPath(path: string): string {
    return (process.env.NODE_ENV === 'production')
        ? join(process.cwd(), path.replace('src/', 'dist/').slice(0, -3) + '.js')
        : join(process.cwd(), path);
}

export function getPaths(paths: string[]): string[] {
    return paths.map(p => getPath(p));
}

export function getOsPath(key: string): string {
    return getPath(getOsEnv(key));
}

export function getOsPaths(key: string): string[] {
    return getPaths(getOsEnvArray(key));
}

export function getOsEnvArray(key: string, delimiter: string = ','): string[] {
    return process.env[key] && process.env[key].split(delimiter) || [];
}

export function toNumber(value: string): number {
    return parseInt(value, 10);
}

export function toBool(value: string): boolean {
    return value === 'true';
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
