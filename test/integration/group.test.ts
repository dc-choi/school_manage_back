import { describe, it, before } from 'mocha';
import chai from 'chai';
import chaiSubset from 'chai-subset';
import chaiLike from 'chai-like';
import chaiThings from 'chai-things';
import request from 'supertest';
import { faker } from '@faker-js/faker';
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
const groupDTOKeys = [ '_id', 'groupName', 'accountId' ];

describe(`/api/group API Test`, async () => {
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
            expect(res.body.result.id).to.be.a('string');
            expect(res.body.result.accessToken).to.be.a('string');
            cache.put('id', res.body.result.id);
            cache.put('accessToken', res.body.result.accessToken);
        });
    });

    describe(`계정에 소속된 그룹 조회`, () => {
        it (`정상 동작 시`, async () => {
            const accessToken = cache.get('accessToken');
            const res = await request(app)
            .get('/api/group')
            .auth(accessToken, { type: 'bearer' })
            .set('Accept', 'application/json')
            .send();

            expect(res.body).to.have.keys(responseSuccessKeys);
            expect(res.body.code).to.equal(ApiCode.OK);
            expect(res.body.result.groups).to.be.a('array');
            expect(res.body.result.account).to.be.a('string');
        });

        it (`토큰이 없을 경우`, async () => {
            const res = await request(app)
            .get('/api/group')
            .set('Accept', 'application/json')
            .send();

            expect(res.body).to.have.keys(responseFailKeys);
            expect(res.body.code).to.equal(ApiCode.NOT_FOUND);
        });
    });

    describe(`계정에 소속시킬 그룹 추가`, () => {
        it (`정상 동작 시`, async () => {
            const name = faker.name.firstName();
            const accessToken = cache.get('accessToken');
            const res = await request(app)
            .post('/api/group')
            .auth(accessToken, { type: 'bearer' })
            .set('Accept', 'application/json')
            .send({ name });

            expect(res.body).to.have.keys(responseSuccessKeys);
            expect(res.body.code).to.equal(ApiCode.OK);
            expect(res.body.result.group).to.be.a('object');
            expect(res.body.result.group).to.have.keys(groupDTOKeys);
            cache.put('groupId', res.body.result.group._id);
        });

        it (`토큰이 없을 경우`, async () => {
            const name = faker.name.firstName();
            const res = await request(app)
            .post('/api/group')
            .set('Accept', 'application/json')
            .send({ name });

            expect(res.body).to.have.keys(responseFailKeys);
            expect(res.body.code).to.equal(ApiCode.NOT_FOUND);
        });

        it (`매개변수가 없을 경우`, async () => {
            const accessToken = cache.get('accessToken');
            const res = await request(app)
            .post('/api/group')
            .auth(accessToken, { type: 'bearer' })
            .set('Accept', 'application/json')
            .send();

            expect(res.body).to.have.keys(responseFailKeys);
            expect(res.body.code).to.equal(ApiCode.INTERNAL_SERVER_ERROR);
        });
    });

    describe(`계정에 추가된 그룹 상세조회`, () => {
        it (`정상 동작 시`, async () => {
            const groupId = cache.get('groupId');
            const accessToken = cache.get('accessToken');
            const res = await request(app)
            .get(`/api/group/${groupId}`)
            .auth(accessToken, { type: 'bearer' })
            .set('Accept', 'application/json')
            .send();

            expect(res.body).to.have.keys(responseSuccessKeys);
            expect(res.body.code).to.equal(ApiCode.OK);
            expect(res.body.result.group).to.be.a('object');
            expect(res.body.result.group).to.have.keys(groupDTOKeys);
            cache.put('groupId', res.body.result.group._id);
        });

        it (`토큰이 없을 경우`, async () => {
            const groupId = cache.get('groupId');
            const res = await request(app)
            .get(`/api/group/${groupId}`)
            .set('Accept', 'application/json')
            .send();

            expect(res.body).to.have.keys(responseFailKeys);
            expect(res.body.code).to.equal(ApiCode.NOT_FOUND);
        });

        it (`잘못된 그룹번호일 경우`, async () => {
            const groupId = faker.random.word();
            const accessToken = cache.get('accessToken');
            const res = await request(app)
            .get(`/api/group/${groupId}`)
            .auth(accessToken, { type: 'bearer' })
            .set('Accept', 'application/json')
            .send();

            expect(res.body).to.have.keys(responseFailKeys);
            expect(res.body.code).to.equal(ApiCode.BAD_REQUEST);
        });
    });

    describe(`계정에 소속된 그룹 수정`, () => {
        it (`정상 동작 시`, async () => {
            const groupId = cache.get('groupId');
            const name = faker.name.firstName();
            const accessToken = cache.get('accessToken');
            const res = await request(app)
            .put(`/api/group/${groupId}`)
            .auth(accessToken, { type: 'bearer' })
            .set('Accept', 'application/json')
            .send({ name });

            expect(res.body).to.have.keys(responseSuccessKeys);
            expect(res.body.code).to.equal(ApiCode.OK);
            expect(res.body.result.row).to.be.a('number');
            expect(res.body.result.account).to.be.a('string');

            const res2 = await request(app)
            .get(`/api/group/${groupId}`)
            .auth(accessToken, { type: 'bearer' })
            .set('Accept', 'application/json')
            .send();

            expect(res2.body).to.have.keys(responseSuccessKeys);
            expect(res2.body.code).to.equal(ApiCode.OK);
            expect(res2.body.result.group).to.be.a('object');
            expect(res2.body.result.group).to.have.keys(groupDTOKeys);
            expect(res2.body.result.group.groupName).to.be.a('string');
            expect(res2.body.result.group.groupName).to.equal(name);
        });

        it (`토큰이 없을 경우`, async () => {
            const groupId = cache.get('groupId');
            const res = await request(app)
            .put(`/api/group/${groupId}`)
            .set('Accept', 'application/json')
            .send();

            expect(res.body).to.have.keys(responseFailKeys);
            expect(res.body.code).to.equal(ApiCode.NOT_FOUND);
        });

        it (`잘못된 그룹번호일 경우`, async () => {
            const groupId = faker.random.word();
            const accessToken = cache.get('accessToken');
            const res = await request(app)
            .put(`/api/group/${groupId}`)
            .auth(accessToken, { type: 'bearer' })
            .set('Accept', 'application/json')
            .send();

            expect(res.body).to.have.keys(responseFailKeys);
            expect(res.body.code).to.equal(ApiCode.BAD_REQUEST);
        });
    });

    describe(`계정에 소속된 그룹 삭제`, () => {
        it (`정상 동작 시`, async () => {
            const groupId = cache.get('groupId');
            const accessToken = cache.get('accessToken');
            const res = await request(app)
            .delete(`/api/group/${groupId}`)
            .auth(accessToken, { type: 'bearer' })
            .set('Accept', 'application/json')
            .send();

            expect(res.body).to.have.keys(responseSuccessKeys);
            expect(res.body.code).to.equal(ApiCode.OK);
            expect(res.body.result.row).to.be.a('number');
            expect(res.body.result.account).to.be.a('string');

            const res2 = await request(app)
            .get(`/api/group/${groupId}`)
            .auth(accessToken, { type: 'bearer' })
            .set('Accept', 'application/json')
            .send();

            // 그룹이 이미 삭제되어서 404 에러
            expect(res2.body).to.have.keys(responseFailKeys);
            expect(res2.body.code).to.equal(ApiCode.NOT_FOUND);
        });

        it (`토큰이 없을 경우`, async () => {
            const groupId = cache.get('groupId');
            const res = await request(app)
            .delete(`/api/group/${groupId}`)
            .set('Accept', 'application/json')
            .send();

            expect(res.body).to.have.keys(responseFailKeys);
            expect(res.body.code).to.equal(ApiCode.NOT_FOUND);
        });

        it (`잘못된 그룹번호일 경우`, async () => {
            const groupId = faker.random.word();
            const accessToken = cache.get('accessToken');
            const res = await request(app)
            .delete(`/api/group/${groupId}`)
            .auth(accessToken, { type: 'bearer' })
            .set('Accept', 'application/json')
            .send();

            expect(res.body).to.have.keys(responseFailKeys);
            expect(res.body.code).to.equal(ApiCode.BAD_REQUEST);
        });
    });
});
