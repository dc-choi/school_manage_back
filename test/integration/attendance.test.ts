import { describe, it, before } from 'mocha';
import chai from 'chai';
import chaiSubset from 'chai-subset';
import chaiLike from 'chai-like';
import chaiThings from 'chai-things';
import request from 'supertest';
import { faker } from '@faker-js/faker';
import cache from 'memory-cache';

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

describe(`/api/attendance API Test`, async () => {
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
            expect(res.body.code).to.equal(ApiCodes.OK);
            expect(res.body.result.id).to.be.a('string');
            expect(res.body.result.accessToken).to.be.a('string');
            cache.put('id', res.body.result.id);
            cache.put('accessToken', res.body.result.accessToken);
        });
    });

    describe(`초기 출석부 데이터 확인`, () => {
        it (`정상 동작 시`, async () => {
            const accessToken = cache.get('accessToken');
            const res = await request(app)
            .get('/api/attendance')
            .auth(accessToken, { type: 'bearer' })
            .set('Accept', 'application/json')
            .send();

            expect(res.body).to.have.keys(responseSuccessKeys);
            expect(res.body.code).to.equal(ApiCodes.OK);
            expect(res.body.result.year).to.be.a('number');
            expect(res.body.result.groups).to.be.a('array');
            expect(res.body.result.account).to.be.a('string');
            cache.put('groupId', res.body.result.groups[0]._id); // 테스트를 위해 계정의 첫번째 임의 그룹ID를 가져옴.
        });

        it (`토큰이 없을 경우`, async () => {
            const res = await request(app)
            .get('/api/attendance')
            .set('Accept', 'application/json')
            .send();

            expect(res.body).to.have.keys(responseFailKeys);
            expect(res.body.code).to.equal(ApiCodes.NOT_FOUND);
        });
    });

    describe(`그룹의 출석현황 확인`, () => {
        it (`정상 동작 시`, async () => {
            const groupId = cache.get('groupId');
            const accessToken = cache.get('accessToken');
            const res = await request(app)
            .get(`/api/attendance/${groupId}`)
            .auth(accessToken, { type: 'bearer' })
            .set('Accept', 'application/json')
            .send();

            expect(res.body).to.have.keys(responseSuccessKeys);
            expect(res.body.code).to.equal(ApiCodes.OK);
            expect(res.body.result.year).to.be.a('number');
            expect(res.body.result.sunday).to.be.a('array');
            expect(res.body.result.saturday).to.be.a('array');
            expect(res.body.result.students).to.be.a('array');
            expect(res.body.result.attendances).to.be.a('array');
            expect(res.body.result.account).to.be.a('string');
        });

        it (`토큰이 없을 경우`, async () => {
            const groupId = cache.get('groupId');
            const res = await request(app)
            .get(`/api/attendance/${groupId}`)
            .set('Accept', 'application/json')
            .send();

            expect(res.body).to.have.keys(responseFailKeys);
            expect(res.body.code).to.equal(ApiCodes.NOT_FOUND);
        });

        it (`잘못된 그룹번호일 경우`, async () => {
            const groupId = faker.random.word();
            const accessToken = cache.get('accessToken');
            const res = await request(app)
            .get(`/api/attendance/${groupId}`)
            .auth(accessToken, { type: 'bearer' })
            .set('Accept', 'application/json')
            .send();

            expect(res.body).to.have.keys(responseFailKeys);
            expect(res.body.code).to.equal(ApiCodes.BAD_REQUEST);
        });
    });

    /**
     * 이 부분의 테스트 코드를 작성하는데 어려움이 있음...
     * 기본적으로 짜여있는 로직이 테스트 코드를 작성하는데 어려움이 있음.
     * 이 부분은 좀 더 효율적인 로직으로 작성해야 함...
     * 즉, 대대적인 개편이 필요해보임.
     */
    describe(`출석 입력...`, () => {
        it (`공백란에 대한 출석 입력`, async () => {
            // 추후에 추가 예정
        });

        it (`입력란에 대한 출석 입력`, async () => {
            // 추후에 추가 예정
        });
    });
});
