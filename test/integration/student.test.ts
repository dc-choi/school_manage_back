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
const studentDTOKeys = [ 'nowPage', 'rowPerPage', 'totalRow', 'totalPage', 'students', 'account' ];
const studentKeys = [ '_id', 'studentSocietyName', 'studentCatholicName', 'studentAge', 'studentContact', 'groupId' ]; // 'studentDescription', 'groupName'은 추후에 추가
const detailStudentKeys = [ '_id', 'studentSocietyName', 'studentCatholicName', 'studentAge', 'studentContact', 'studentDescription', 'groupId' ]; // 'groupName'은 추후에 추가

const studentJSON = {
    societyName: faker.name.fullName(),
    catholicName: faker.name.fullName(),
    age: Number(faker.random.numeric(2)),
    contact: 1000000000,
    groupId: 0,
};

describe(`/api/student API Test`, async () => {
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

    describe(`계정이 관리하는 학생들의 내역 조회`, () => {
        it (`정상 동작 시`, async () => {
            const accessToken = cache.get('accessToken');
            const res = await request(app)
            .get('/api/student')
            .auth(accessToken, { type: 'bearer' })
            .set('Accept', 'application/json')
            .send();

            expect(res.body).to.have.keys(responseSuccessKeys);
            expect(res.body.code).to.equal(ApiCode.OK);
            expect(res.body.result).to.have.keys(studentDTOKeys);
            expect(res.body.result.students).to.be.a('array');
            expect(res.body.result.account).to.be.a('string');
            expect(res.body.result.nowPage).to.be.a('number');
            expect(res.body.result.rowPerPage).to.be.a('number');
            expect(res.body.result.totalRow).to.be.a('number');
            expect(res.body.result.totalPage).to.be.a('number');
        });

        it (`토큰이 없을 경우`, async () => {
            const res = await request(app)
            .get('/api/student')
            .set('Accept', 'application/json')
            .send();

            expect(res.body).to.have.keys(responseFailKeys);
            expect(res.body.code).to.equal(ApiCode.NOT_FOUND);
        });
    });

    describe(`계정에 소속된 그룹에 학생 추가`, () => {
        it (`계정에 소속시킬 그룹 추가`, async () => {
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

        it (`정상 동작 시`, async () => {
            const groupId = cache.get('groupId');
            const accessToken = cache.get('accessToken');
            studentJSON.groupId = groupId
            const res = await request(app)
            .post('/api/student')
            .auth(accessToken, { type: 'bearer' })
            .set('Accept', 'application/json')
            .send(studentJSON);

            expect(res.body).to.have.keys(responseSuccessKeys);
            expect(res.body.code).to.equal(ApiCode.OK);
            expect(res.body.result.student).to.have.keys(studentKeys);
            expect(res.body.result.student._id).to.be.a('number');
            expect(res.body.result.student.studentSocietyName).to.be.a('string');
            expect(res.body.result.student.studentCatholicName).to.be.a('string');
            expect(res.body.result.student.studentAge).to.be.a('number');
            expect(res.body.result.student.studentContact).to.be.a('number');
            expect(res.body.result.student.groupId).to.be.a('number');
            cache.put('studentId', res.body.result.student._id);
        });

        it (`토큰이 없을 경우`, async () => {
            const res = await request(app)
            .post('/api/student')
            .set('Accept', 'application/json')
            .send(studentJSON);

            expect(res.body).to.have.keys(responseFailKeys);
            expect(res.body.code).to.equal(ApiCode.NOT_FOUND);
        });

        it (`매개변수가 없을 경우`, async () => {
            const accessToken = cache.get('accessToken');
            const res = await request(app)
            .post('/api/student')
            .auth(accessToken, { type: 'bearer' })
            .set('Accept', 'application/json')
            .send();

            expect(res.body).to.have.keys(responseFailKeys);
            expect(res.body.code).to.equal(ApiCode.INTERNAL_SERVER_ERROR);
        });
    });

    describe(`학생 상세 조회`, () => {
        it (`정상 동작 시`, async () => {
            const studentId = cache.get('studentId');
            const accessToken = cache.get('accessToken');
            const res = await request(app)
            .get(`/api/student/${studentId}`)
            .auth(accessToken, { type: 'bearer' })
            .set('Accept', 'application/json')
            .send(studentJSON);

            expect(res.body).to.have.keys(responseSuccessKeys);
            expect(res.body.code).to.equal(ApiCode.OK);
            expect(res.body.result.student).to.have.keys(detailStudentKeys);
            expect(res.body.result.student._id).to.be.a('number');
            expect(res.body.result.student.studentSocietyName).to.be.a('string');
            expect(res.body.result.student.studentCatholicName).to.be.a('string');
            expect(res.body.result.student.studentAge).to.be.a('number');
            expect(res.body.result.student.studentContact).to.be.a('number');
            expect(res.body.result.student.studentDescription).to.be.a('null'); // 추후에 값이 입력되기 시작하면 string으로 올 수 있음.
            expect(res.body.result.student.groupId).to.be.a('number');
        });

        it (`토큰이 없을 경우`, async () => {
            const studentId = cache.get('studentId');
            const res = await request(app)
            .get(`/api/student/${studentId}`)
            .set('Accept', 'application/json')
            .send(studentJSON);

            expect(res.body).to.have.keys(responseFailKeys);
            expect(res.body.code).to.equal(ApiCode.NOT_FOUND);
        });

        it (`잘못된 학생번호일 경우`, async () => {
            const studentId = faker.random.word();
            const accessToken = cache.get('accessToken');
            const res = await request(app)
            .get(`/api/student/${studentId}`)
            .auth(accessToken, { type: 'bearer' })
            .set('Accept', 'application/json')
            .send();

            expect(res.body).to.have.keys(responseFailKeys);
            expect(res.body.code).to.equal(ApiCode.BAD_REQUEST);
        });
    });

    describe(`학생 수정`, () => {
        it (`정상 동작 시`, async () => {
            const studentId = cache.get('studentId');
            const accessToken = cache.get('accessToken');
            const res = await request(app)
            .put(`/api/student/${studentId}`)
            .auth(accessToken, { type: 'bearer' })
            .set('Accept', 'application/json')
            .send(studentJSON);

            expect(res.body).to.have.keys(responseSuccessKeys);
            expect(res.body.code).to.equal(ApiCode.OK);
            expect(res.body.result.row).to.be.a('number');
            expect(res.body.result.account).to.be.a('string');

            const res2 = await request(app)
            .get(`/api/student/${studentId}`)
            .auth(accessToken, { type: 'bearer' })
            .set('Accept', 'application/json')
            .send();

            expect(res2.body).to.have.keys(responseSuccessKeys);
            expect(res2.body.code).to.equal(ApiCode.OK);
            expect(res2.body.result.student).to.have.keys(detailStudentKeys);
            expect(res2.body.result.student._id).to.be.a('number');
            expect(res2.body.result.student.studentSocietyName).to.be.a('string');
            expect(res2.body.result.student.studentCatholicName).to.be.a('string');
            expect(res2.body.result.student.studentAge).to.be.a('number');
            expect(res2.body.result.student.studentContact).to.be.a('number');
            expect(res2.body.result.student.studentDescription).to.be.a('null'); // 추후에 값이 입력되기 시작하면 string으로 올 수 있음.
            expect(res2.body.result.student.groupId).to.be.a('number');
        });

        it (`토큰이 없을 경우`, async () => {
            const studentId = cache.get('studentId');
            const res = await request(app)
            .put(`/api/student/${studentId}`)
            .set('Accept', 'application/json')
            .send(studentJSON);

            expect(res.body).to.have.keys(responseFailKeys);
            expect(res.body.code).to.equal(ApiCode.NOT_FOUND);
        });

        it (`잘못된 학생번호일 경우`, async () => {
            const studentId = faker.random.word();
            const accessToken = cache.get('accessToken');
            const res = await request(app)
            .put(`/api/student/${studentId}`)
            .auth(accessToken, { type: 'bearer' })
            .set('Accept', 'application/json')
            .send();

            expect(res.body).to.have.keys(responseFailKeys);
            expect(res.body.code).to.equal(ApiCode.BAD_REQUEST);
        });
    });

    describe(`학생 삭제`, () => {
        it (`정상 동작 시`, async () => {
            const studentId = cache.get('studentId');
            const accessToken = cache.get('accessToken');
            const res = await request(app)
            .delete(`/api/student/${studentId}`)
            .auth(accessToken, { type: 'bearer' })
            .set('Accept', 'application/json')
            .send();

            expect(res.body).to.have.keys(responseSuccessKeys);
            expect(res.body.code).to.equal(ApiCode.OK);
            expect(res.body.result.row).to.be.a('number');
            expect(res.body.result.account).to.be.a('string');

            const res2 = await request(app)
            .get(`/api/student/${studentId}`)
            .auth(accessToken, { type: 'bearer' })
            .set('Accept', 'application/json')
            .send();

            // 학생이 이미 삭제되어서 404 에러
            expect(res2.body).to.have.keys(responseFailKeys);
            expect(res2.body.code).to.equal(ApiCode.NOT_FOUND);
        });

        it (`토큰이 없을 경우`, async () => {
            const studentId = cache.get('studentId');
            const res = await request(app)
            .delete(`/api/student/${studentId}`)
            .set('Accept', 'application/json')
            .send();

            expect(res.body).to.have.keys(responseFailKeys);
            expect(res.body.code).to.equal(ApiCode.NOT_FOUND);
        });

        it (`잘못된 학생번호일 경우`, async () => {
            const studentId = faker.random.word();
            const accessToken = cache.get('accessToken');
            const res = await request(app)
            .delete(`/api/student/${studentId}`)
            .auth(accessToken, { type: 'bearer' })
            .set('Accept', 'application/json')
            .send();

            expect(res.body).to.have.keys(responseFailKeys);
            expect(res.body.code).to.equal(ApiCode.BAD_REQUEST);
        });
    });
});
