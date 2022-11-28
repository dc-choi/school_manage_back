import { describe, it, before } from 'mocha';
import chai from 'chai';
import chaiSubset from 'chai-subset';
import chaiLike from 'chai-like';
import chaiThings from 'chai-things';
import request from 'supertest';
import { faker } from '@faker-js/faker';
// import cache from 'memory-cache';

import { app } from '../../src/app';
import { env } from '../../src/env';

import logger from '../../src/lib/logger';
import ApiCodes from '../../src/lib/api.codes';

chai.use(chaiSubset);
chai.use(chaiLike);
chai.use(chaiThings);

const expect = chai.expect;

const responseSuccessKeys = ['code', 'message', 'result'];
const responseFailKeys = ['code', 'message'];

describe(`/api/auth/login API Test`, async () => {
    before(async () => {
        try {
            logger.init({
                console: false,
                debug: true,
                log: true,
                error: true,
                info: true,
                fatal: true,
                sql: true,
                net: true,
            });
            logger.log(`[ ${env.mode.value} ] =========================================`);
        } catch (e) {
            console.log(e);
        }
    });

    describe(`로그인 시도`, () => {
        it (`정상 동작 시`, async () => {
            const res = await request(app).post('/api/auth/login').set('Accept', 'application/json').send({
                id: '중고등부',
                password: '5678'
            });

            expect(res.body.code).to.equal(ApiCodes.OK);
            expect(res.body).to.have.keys(responseSuccessKeys);
        });

        it (`존재하지 않는 ID의 경우`, async () => {
            const res = await request(app).post('/api/auth/login').set('Accept', 'application/json').send({
                id: faker.name.fullName(),
                password: '1234'
            });

            expect(res.body.code).to.equal(ApiCodes.NOT_FOUND);
            expect(res.body).to.have.keys(responseFailKeys);
        });

        it (`password가 잘못된 경우`, async () => {
            const res = await request(app).post('/api/auth/login').set('Accept', 'application/json').send({
                id: '중고등부',
                password: faker.random.alphaNumeric(10)
            });

            expect(res.body.code).to.equal(ApiCodes.UNAUTHORIZED);
            expect(res.body).to.have.keys(responseFailKeys);
        });
    });
});
