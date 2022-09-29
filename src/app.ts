import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
// import cors from 'cors';
import appRoot from 'app-root-path';
import tracer from 'cls-rtracer';
import context from 'express-http-context';

import { env } from './env';

import * as Api from './app.router';

import logger from './lib/logger';
// import * as mongodb from './lib/mongodb';
import * as mysql from './lib/mysql';

export const app = express();

app.use(express.static(path.join(appRoot.path, 'public')));
app.use(cookieParser());
app.use(express.urlencoded({ limit: '100mb', extended: true }));
app.use(express.json({ limit: '100mb' }));
app.use(express.raw());

/** APP과 Server 통신간 CORS를 사용하지 않음.
 function getOrigins() {
     const origins = [env.app.web.url];
     if (env.app.dev.web.url) {
        origins.push(env.app.dev.web.url);
    }
    return origins;
}

// https://1004lucifer.blogspot.com/2019/04/axios-response-headers-content.html
app.use(cors( {
    origin: getOrigins(),
    exposedHeaders: ['Content-Disposition'],
    credentials: true
}));
*/

app.use(tracer.expressMiddleware());
app.use(context.middleware);
app.use((req, res, next) => {
    const { method, url, body, params, query, cookies } = req;

    logger.log(`[${method}] ${url} body:${JSON.stringify(body)} params:${JSON.stringify(params)} query: ${JSON.stringify(query)} cookie:${JSON.stringify(cookies)}`);
    logger.req(req);
    next();
});

app.use(Api.path, Api.router);
app.listen(env.app.port, async function appMain() {
    logger.init({
        log: true,
        sql: true,
        net: true,
        debug: !env.mode.prod,
        error: true,
        fatal: true,
        console: false,
    });

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { build, version } = require('../package.json');
    logger.log(`[ v${version}, ${env.mode.value} ] =========================================`);

    // await mongodb.connect();
    await mysql.connect();

    logger.log(`----------------------------------------------`);
    logger.log(`🚀 App listening on the port ${env.app.port}`);
    logger.log(`==============================================`);
    console.log(`[ v${build || version}, ${env.mode.value} ] =================================== READY !!!`);
});
