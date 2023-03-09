/**
 * https://huns.me/2022-05-22-43-TypeScript%EC%97%90%EC%84%9C%20%EC%A0%84%EC%97%AD%20%EA%B0%9C%EC%B2%B4%20%ED%83%80%EC%9E%85%EC%9D%80%20%EC%96%B4%EB%96%BB%EA%B2%8C%20%EC%A0%95%EC%9D%98%ED%95%98%EB%82%98%EC%9A%94
 *
 * 위 링크에서 방법을 참고함.
 *
 * Node.js는 import/export가 없으면 일반 스크립트로 인식하고 그렇지 않으면 모듈로 사용한다고 함.
 * Request의 전역 개체 타입을 임의로 추가해줘서 모듈로서 사용해야하기 때문에 export를 추가해서 모듈로서 사용하게 만듬.
 */

export {};

declare global {
    namespace Express {
        interface Request {
            decodeToken: {
                name: string
                timeStamp: number
            },
            account: {
                id: number,
                name: string
            }
        }
    }
}
