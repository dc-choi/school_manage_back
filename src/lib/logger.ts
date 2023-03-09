/* eslint-disable @typescript-eslint/no-explicit-any */
import tracer from 'tracer';
import tid from 'cls-rtracer';
import context from 'express-http-context';
import appRoot from 'app-root-path';

const rootFolder = `${appRoot.path}/logs`;
const splitFormat = `yyyymmdd`;
const logFormat = '{{timestamp}} {{title}} {{file}}:{{line}} ({{method}}) {{tid}} [{{account}}] {{message}}';
const sqlFormat = '{{timestamp}} {{title}} {{tid}} [{{account}}] {{message}}';
const mongoFormat = '{{timestamp}} {{title}} {{tid}} [{{account}}] {{message}}';
const jsonFormat = '{ timestamp:{{timestamp}}, tid:{{tid}}, payload:{{message}} }';
const dateformat = 'yyyy-mm-dd"T"HH:MM:ss.lo';

exports.filter = {
    log: true,
    sql: true,
    net: true,
    debug: true,
    error: true,
    fatal: true,
    console: false,
}

/**
 * root: 파일위치
 * allLogsFileName: 로그 파일명
 * stackIndex: 로거를 사용하는곳을 알아내기 위해사용한다. 기본값 0을 사용하면 logger.ts가 찍힌다.
 * 1을 사용하면 한단계 위의 콜스택인 logger.ts를 사용하는 곳의 파일이 찍힌다.
 * format: 현재 로그 파일의 형식을 커스텀하게 지정한다.
 * preprocess: 로그 오브젝트를 불러와서 커스텀할 필터를 적용한다.
 */

const convTitle = (title: string) => {
    let result: string;

    switch (title) {
        case 'error':
            result = 'ERR';
            break;
        case 'warn':
            result = 'WRN';
            break;
        case 'info':
            result = 'INF';
            break;
        case 'debug':
            result = 'DBG';
            break;
        case 'fatal':
            result = 'FTL';
            break;
        case 'trace':
            result = 'TRC';
            break;
        case 'sql':
            result = 'SQL';
            break;
        case 'mongo':
            result = 'MONGO';
            break;
        default:
            result = 'LOG';
            break;
    }

    return result;
};

const preprocess = (data) => {
    data.title = convTitle(data.title)?.toUpperCase();
    data.tid = `${tid.id() ? tid.id() : '00000000-0000-0000-0000-000000000000'}`;

    const account = context.get('account_name');
    data.account = account ? account : '';

    const file = data.file?.length > 23 ? (data.file.substring(0, 20) + '...') : data.file;
    data.file = file?.padStart(23, ' ');
    data.line = data.line?.padEnd(3, ' ');

    const method = data.method?.length > 25 ? (data.method.substring(0, 22) + '...') : data.method;
    data.method = method?.padEnd(25, ' ');

    return data;
};

const logConfig = {
    root: rootFolder,
    allLogsFileName: 'log',
    format: logFormat,
    dateformat: dateformat,
    splitFormat: splitFormat,
    stackIndex: 1,
    preprocess: (data: any) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        data = preprocess(data);
    },
    transport: (data: any) => {
        if (exports.filter.console) console.log(data.output);
    }
};

const sqlConfig = {
    root: rootFolder,
    allLogsFileName: 'log',
    format: sqlFormat,
    dateformat: dateformat,
    splitFormat: splitFormat,
    stackIndex: 1,
    preprocess: (data: any) => {
        data.title = 'SQL';
        const account = context.get('account_name');
        data.account = account ? account : '';
        data.tid = `${tid.id() ? tid.id() : '00000000-0000-0000-0000-000000000000'}`;
    },
    transport: (data: any) => {
        if (exports.filter.console) console.log(data.output);
    }
};

const mongoConfig = {
    root: rootFolder,
    allLogsFileName: 'log',
    format: mongoFormat,
    dateformat: dateformat,
    splitFormat: splitFormat,
    stackIndex: 1,
    preprocess: (data: any) => {
        data.title = 'QUERY';
        const account = context.get('account_name');
        data.account = account ? account : '';
        data.tid = `${tid.id() ? tid.id() : '00000000-0000-0000-0000-000000000000'}`;
    },
    transport: (data: any) => {
        if (exports.filter.console) console.log(data.output);
    }
};

const jsonConfig = {
    root: rootFolder,
    allLogsFileName: 'log',
    format: jsonFormat,
    dateformat: dateformat,
    splitFormat: splitFormat,
    stackIndex: 1,
    preprocess: function(data: any) {
        const account = context.get('account_name');
        data.account = account ? account : '';
        data.tid = `${tid.id() ? tid.id() : '00000000-0000-0000-0000-000000000000'}`;
    },
    transport: function(data: any) {
        if (exports.filter.console) console.log(data.output);
    }
};

/**
 * root: 파일위치
 * allLogsFileName: 로그 파일명
 * stackIndex: 로거를 사용하는곳을 알아내기 위해사용한다. 기본값 0을 사용하면 logger.ts가 찍힌다.
 * 1을 사용하면 한단계 위의 콜스택인 logger.ts를 사용하는 곳의 파일이 찍힌다.
 * format: 현재 로그 파일의 형식을 커스텀하게 지정한다.
 * preprocess: 로그 오브젝트를 불러와서 커스텀할 필터를 적용한다.
 */
const error = tracer.dailyfile({
    ...logConfig,
    ...{
        allLogsFileName: 'err',
    }
});

const log = tracer.dailyfile({
    ...logConfig,
    ...{
        allLogsFileName: 'app',
    }
});

const sql = tracer.dailyfile({
    ...sqlConfig,
    ...{
        allLogsFileName: 'sql',
    }
});

const mongo = tracer.dailyfile({
    ...mongoConfig,
    ...{
        allLogsFileName: 'mongo',
    }
});

const net = tracer.dailyfile({
    ...jsonConfig,
    ...{
        allLogsFileName: 'net',
        format: jsonFormat,
    }
});

const logger = {
    init (options: any) {
        exports.filter = {...exports.filter, ...options};
        if (exports.filter.console) console.log(exports.filter);
    },
    sql (...args: any[]) {
        if (exports.filter.console) console.log(...args);
        return exports.filter.sql ? sql.log(...args) : null;
    },
    mongo (...args: any[]) {
        if (exports.filter.console) console.log(...args);
        return exports.filter.sql ? mongo.log(...args) : null;
    },
    log (...args: any[]) {
        if (exports.filter.console) console.log(...args);
        return exports.filter.log ? log.log(...args) : null;
    },
    err (...args: any[]) {
        if (exports.filter.console) console.log(...args);
        return exports.filter.log ? log.error(...args) : null;
    },
    error (...args: any[]) {
        if (exports.filter.console) console.log(...args);
        return exports.filter.error ? error.error(...args) : null;
    },
    req (req: any) {
        if (!exports.filter.net) return;

        const message = {
            type: 'REQ',
            method: req.method,
            url: req.url,
            params: req.params,
            query: req.query,
            body: JSON.stringify(req.body)
        };

        net.log(message);
        if (exports.filter.console) console.log(message);
    },
    res(code: number, res: any, req: any) {
        if (!exports.filter.net) return;

        const timestamp = req.locals?.log?.timestamp;
        const message = {
            type: 'RES',
            code: code,
            req: JSON.stringify({
                type: 'REQ',
                method: req.method,
                url: req.url,
                params: req.params,
                query: req.query,
                body: JSON.stringify(req.body)
            }),
            elapsed: timestamp ? new Date().getTime() - timestamp : undefined,
            response: JSON.stringify(res)
        };
        net.log(message);
        log.log(`[RES] [${req.method}] ${req.originalUrl}`, JSON.stringify(message));
        if (exports.filter.console) console.log(message);
    }
};


export default logger;
