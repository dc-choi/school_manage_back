import { describe, it, before } from 'mocha';
import chai from 'chai';
import chaiSubset from 'chai-subset';
import chaiLike from 'chai-like';
import chaiThings from 'chai-things';
import request from 'supertest';
import { faker } from '@faker-js/faker';
// import cache from 'memory-cache';

import { app } from '@/app';
import { env } from '@/env';

import logger from '@/lib/logger';
import ApiCode from '@/common/api.code';

chai.use(chaiSubset);
chai.use(chaiLike);
chai.use(chaiThings);

const expect = chai.expect;

const responseSuccessKeys = ['code', 'message', 'result'];
const responseFailKeys = ['code', 'message'];

describe(`/api/auth API Test`, async () => {
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

    describe(`login`, () => {
        it (`정상 동작 시`, async () => {
            const res = await request(app)
            .post('/api/auth/login')
            .set('Accept', 'application/json')
            .send({
                id: '중고등부',
                password: '5678'
            });

            expect(res.body).to.have.keys(responseSuccessKeys);
            expect(res.body.code).to.equal(ApiCode.OK);
        });

        it (`존재하지 않는 ID의 경우`, async () => {
            const res = await request(app)
            .post('/api/auth/login')
            .set('Accept', 'application/json')
            .send({
                id: faker.name.fullName(),
                password: faker.random.alphaNumeric(10)
            });

            expect(res.body).to.have.keys(responseFailKeys);
            expect(res.body.code).to.equal(ApiCode.NOT_FOUND);
        });

        it (`password가 잘못된 경우`, async () => {
            const res = await request(app)
            .post('/api/auth/login')
            .set('Accept', 'application/json')
            .send({
                id: '중고등부',
                password: faker.random.alphaNumeric(10)
            });

            expect(res.body).to.have.keys(responseFailKeys);
            expect(res.body.code).to.equal(ApiCode.UNAUTHORIZED);
        });
    });
});
