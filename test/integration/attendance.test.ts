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

/**
 * 헤딩연도의 토요일, 일요일에 해당하는 날 불러오기
 *
 * @param year
 * @returns
 */
const setDay = async(year) => {
    const saturDay = [];
    const sunDay = [];

    cache.get('saturday').forEach((month, monthIndex) => {
        const index = monthIndex + 1;
        const lastDay = new Date(year, index, 0).getDate();
        for (let i = 1; i <= lastDay; i++) {
            const date = new Date(year, index - 1, i);
            if (date.getDay() === 6) {
                saturDay.push({ month: index, day: i });
            }
        }
    });
    cache.get('sunday').forEach((month, monthIndex) => {
        const index = monthIndex + 1;
        const lastDay = new Date(year, index, 0).getDate();
        for (let i = 1; i <= lastDay; i++) {
            const date = new Date(year, index - 1, i);
            if (date.getDay() === 0) {
                sunDay.push({ month: index, day: i });
            }
        }
    });

    return {
        saturDay,
        sunDay
    };
};

/**
 * 각 날짜에 해당하는 출석일자 생성
 *
 * @param saturDay
 * @param sunDay
 * @returns
 */
const setAttendance = async(saturDay, sunDay) => {
    const loopData = {
        _id: 0,
        month: 0,
        day: 0,
        data: '',
    }; // loop하기 위한 임시 데이터
    const emptyData = []; // 빈 출석에 대한 데이터
    const fullData = []; // 마크된 출석에 대한 데이터

    let attendanceDate;
    cache.get('account') === '초등부' ? attendanceDate = saturDay : attendanceDate = sunDay;
    cache.get('students').forEach(student => {
        attendanceDate.forEach((item) => {
            fullData.push({
                _id: student._id,
                month: item.month,
                day: item.day,
                data: '○',
            });

            emptyData.push({
                _id: student._id,
                month: item.month,
                day: item.day,
                data: '',
            });

            loopData._id = 0;
            loopData.month = 0;
            loopData.day = 0;
        });
    });

    return {
        emptyData,
        fullData
    };
};

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
            expect(res.body.code).to.equal(ApiCode.OK);
            expect(res.body.result.name).to.be.a('string');
            expect(res.body.result.accessToken).to.be.a('string');
            cache.put('id', res.body.result.name);
            cache.put('accessToken', res.body.result.accessToken);
        });
    });

    describe(`초기 출석부 데이터 확인`, () => {
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
            cache.put('groupId', res.body.result.groups[0]._id); // 테스트를 위해 계정의 첫번째 임의 그룹ID를 가져옴.
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

    describe(`그룹의 출석현황 확인`, () => {
        it (`정상 동작 시`, async () => {
            const groupId = cache.get('groupId');
            const accessToken = cache.get('accessToken');
            const res = await request(app)
            .get(`/api/group/${groupId}/attendance`)
            .auth(accessToken, { type: 'bearer' })
            .set('Accept', 'application/json')
            .send();

            expect(res.body).to.have.keys(responseSuccessKeys);
            expect(res.body.code).to.equal(ApiCode.OK);
            expect(res.body.result.year).to.be.a('number');
            expect(res.body.result.sunday).to.be.a('array');
            expect(res.body.result.saturday).to.be.a('array');
            expect(res.body.result.students).to.be.a('array');
            expect(res.body.result.attendances).to.be.a('array');
            expect(res.body.result.account).to.be.a('string');
            cache.put('sunday', res.body.result.sunday);
            cache.put('saturday', res.body.result.saturday);
            cache.put('students', res.body.result.students);
            cache.put('account', res.body.result.account);
        });

        it (`토큰이 없을 경우`, async () => {
            const groupId = cache.get('groupId');
            const res = await request(app)
            .get(`/api/group/${groupId}/attendance`)
            .set('Accept', 'application/json')
            .send();

            expect(res.body).to.have.keys(responseFailKeys);
            expect(res.body.code).to.equal(ApiCode.NOT_FOUND);
        });

        it (`잘못된 그룹번호일 경우`, async () => {
            const groupId = faker.random.word();
            const accessToken = cache.get('accessToken');
            const res = await request(app)
            .get(`/api/group/${groupId}/attendance`)
            .auth(accessToken, { type: 'bearer' })
            .set('Accept', 'application/json')
            .send();

            expect(res.body).to.have.keys(responseFailKeys);
            expect(res.body.code).to.equal(ApiCode.BAD_REQUEST);
        });
    });

    describe(`출석 입력`, () => {
        it (`정상 동작 시 (공백)`, async () => {
            const year = new Date().getFullYear();
            const { saturDay, sunDay } = await setDay(year);
            const { emptyData } = await setAttendance(saturDay, sunDay);
            const accessToken = cache.get('accessToken');

            const res = await request(app)
            .post(`/api/attendance`)
            .auth(accessToken, { type: 'bearer' })
            .set('Accept', 'application/json')
            .send({
                year,
                attendance: emptyData,
                isFull: false
            });

            expect(res.body).to.have.keys(responseSuccessKeys);
            expect(res.body.code).to.equal(ApiCode.OK);
            expect(res.body.result.account).to.be.a('string');
            expect(res.body.result.row).to.be.a('number');
            expect(res.body.result.isFull).to.be.a('boolean');
        });

        it (`연도를 제외한 경우 (공백)`, async () => {
            const year = new Date().getFullYear();
            const { saturDay, sunDay } = await setDay(year);
            const { emptyData } = await setAttendance(saturDay, sunDay);
            const accessToken = cache.get('accessToken');

            const res = await request(app)
            .post(`/api/attendance`)
            .auth(accessToken, { type: 'bearer' })
            .set('Accept', 'application/json')
            .send({
                attendance: emptyData,
                isFull: false
            });

            expect(res.body).to.have.keys(responseSuccessKeys);
            expect(res.body.code).to.equal(ApiCode.OK);
            expect(res.body.result.account).to.be.a('string');
            expect(res.body.result.row).to.be.a('number');
            expect(res.body.result.isFull).to.be.a('boolean');
        });

        it (`출석을 제외한 경우 (공백)`, async () => {
            // const year = new Date().getFullYear();
            // const { saturDay, sunDay } = await setDay(year);
            // const { emptyData } = await setAttendance(saturDay, sunDay);
            const accessToken = cache.get('accessToken');

            const res = await request(app)
            .post(`/api/attendance`)
            .auth(accessToken, { type: 'bearer' })
            .set('Accept', 'application/json')
            .send({
                isFull: false
            });

            expect(res.body).to.have.keys(responseFailKeys);
            expect(res.body.code).to.equal(ApiCode.BAD_REQUEST);
        });

        it (`공백/입력부분을 제외한 경우 (공백)`, async () => {
            const year = new Date().getFullYear();
            const { saturDay, sunDay } = await setDay(year);
            const { emptyData } = await setAttendance(saturDay, sunDay);
            const accessToken = cache.get('accessToken');

            const res = await request(app)
            .post(`/api/attendance`)
            .auth(accessToken, { type: 'bearer' })
            .set('Accept', 'application/json')
            .send({
                attendance: emptyData
            });

            expect(res.body).to.have.keys(responseFailKeys);
            expect(res.body.code).to.equal(ApiCode.BAD_REQUEST);
        });

        it (`정상 동작 시 (입력)`, async () => {
            const year = new Date().getFullYear();
            const { saturDay, sunDay } = await setDay(year);
            const { fullData } = await setAttendance(saturDay, sunDay);
            const accessToken = cache.get('accessToken');

            const res = await request(app)
            .post(`/api/attendance`)
            .auth(accessToken, { type: 'bearer' })
            .set('Accept', 'application/json')
            .send({
                year,
                attendance: fullData,
                isFull: true
            });

            expect(res.body).to.have.keys(responseSuccessKeys);
            expect(res.body.code).to.equal(ApiCode.OK);
            expect(res.body.result.account).to.be.a('string');
            expect(res.body.result.row).to.be.a('number');
            expect(res.body.result.isFull).to.be.a('boolean');
        });

        it (`연도를 제외한 경우 (입력)`, async () => {
            const year = new Date().getFullYear();
            const { saturDay, sunDay } = await setDay(year);
            const { fullData } = await setAttendance(saturDay, sunDay);
            const accessToken = cache.get('accessToken');

            const res = await request(app)
            .post(`/api/attendance`)
            .auth(accessToken, { type: 'bearer' })
            .set('Accept', 'application/json')
            .send({
                attendance: fullData,
                isFull: true
            });

            expect(res.body).to.have.keys(responseSuccessKeys);
            expect(res.body.code).to.equal(ApiCode.OK);
            expect(res.body.result.account).to.be.a('string');
            expect(res.body.result.row).to.be.a('number');
            expect(res.body.result.isFull).to.be.a('boolean');
        });

        it (`출석을 제외한 경우 (입력)`, async () => {
            // const year = new Date().getFullYear();
            // const { saturDay, sunDay } = await setDay(year);
            // const { fullData } = await setAttendance(saturDay, sunDay);
            const accessToken = cache.get('accessToken');

            const res = await request(app)
            .post(`/api/attendance`)
            .auth(accessToken, { type: 'bearer' })
            .set('Accept', 'application/json')
            .send({
                isFull: true
            });

            expect(res.body).to.have.keys(responseFailKeys);
            expect(res.body.code).to.equal(ApiCode.BAD_REQUEST);
        });

        it (`공백/입력부분을 제외한 경우 (입력)`, async () => {
            const year = new Date().getFullYear();
            const { saturDay, sunDay } = await setDay(year);
            const { fullData } = await setAttendance(saturDay, sunDay);
            const accessToken = cache.get('accessToken');

            const res = await request(app)
            .post(`/api/attendance`)
            .auth(accessToken, { type: 'bearer' })
            .set('Accept', 'application/json')
            .send({
                attendance: fullData
            });

            expect(res.body).to.have.keys(responseFailKeys);
            expect(res.body.code).to.equal(ApiCode.BAD_REQUEST);
        });
    });
});
