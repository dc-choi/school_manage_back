import { describe, it, before } from 'mocha';
import chai from 'chai';
import chaiSubset from 'chai-subset';
import chaiLike from 'chai-like';
import chaiThings from 'chai-things';
import request from 'supertest';
// import { faker } from '@faker-js/faker';
import cache from 'memory-cache';

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

describe(`/api/account API Test`, async () => {
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
        it (`로그인`, async () => {
            const res = await request(app)
            .post('/api/auth/login')
            .set('Accept', 'application/json')
            .send({
                id: '중고등부',
                password: '5678'
            });

            expect(res.body).to.have.keys(responseSuccessKeys);
            expect(res.body.code).to.equal(ApiCode.OK);
            expect(res.body.result.name).to.be.a('string');
            expect(res.body.result.accessToken).to.be.a('string');
            cache.put('id', res.body.result.name);
            cache.put('accessToken', res.body.result.accessToken);
        });
    });

    describe(`토큰으로 ID 확인.`, () => {
        it (`정상 동작 시`, async () => {
            const accessToken = cache.get('accessToken');
            const res = await request(app)
            .get('/api/account')
            .auth(accessToken, { type: 'bearer' })
            .set('Accept', 'application/json')
            .send();

            expect(res.body).to.have.keys(responseSuccessKeys);
            expect(res.body.code).to.equal(ApiCode.OK);
            expect(res.body.result).to.be.a('object');
            expect(res.body.result.name).to.be.a('string');
        });

        it (`토큰이 없을 경우`, async () => {
            const res = await request(app)
            .get('/api/account')
            .set('Accept', 'application/json')
            .send();

            expect(res.body).to.have.keys(responseFailKeys);
            expect(res.body.code).to.equal(ApiCode.NOT_FOUND);
        });
    });
});
