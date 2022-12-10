# school-manage program
이 [프로젝트](https://jangwi-dev.duckdns.org)는 기존의 출석부 프로젝트를 보완하기 위해서 제작된 프로젝트입니다.
※실제 정보가 들어있는 사이트입니다. 기존 데이터의 수정/삭제는 금지해주세요.

[v1의 프로젝트 내역...](https://github.com/dc-choi/Attendance)
<details>
<summary> v1의 패치내역 </summary>

- v1.4.0 (22.09.06) : 기존 EC2의 Ubuntu 20.04.4 LTS에서 AWS Lightsail의 Amazon Linux 2 2.0.20220805.0로 변경
	1. 서버 유지비용이 너무 많이 들어서 비슷한 서비스를 찾던 중, Lightsail을 확인하고 Lightsail로 변경하였습니다.
	2. 더불어 AWS의 유지보수도 원활하게 받기 위해 OS 변경 작업도 진행하였습니다.

- v1.3.1 (22.07.30) : 출석부의 버그를 고쳤습니다.
	1. 매달 마지막 날이 정상적으로 찍히지않는 버그를 확인하고 수정했습니다.

- v1.3.0 (22.07.19) : Nginx를 이용하여 도메인, HTTPS를 적용하였습니다.
	1. 전화 번호를 저장할 때 양식에 맞춰서 자동으로 Form을 맞추도록 합니다.
	2. NPM으로 패키지를 관리하는 것이 아닌, Yarn으로 관리를 하도록 변경하였습니다.

- v1.2.1 (22.07.12) : Nginx를 이용하여 도메인, HTTPS를 적용하였습니다.
	1. 도메인 적용
	2. HTTPS 적용
	3. 리버스 프록시 적용

- v1.2.0 (22.06.18) : 디자인을 수정하였습니다.
	1. 프로젝트 디자인 수정.

- v1.1.1 (22.06.08) : 버그를 수정하였습니다.
	1. 학생수가 10명 이상일때, 출석 입력이 되지 않는 버그 수정

- v1.1.0 (22.03.03) : 기능 및 버그를 추가, 수정하였습니다.
	1. 학생 조회에서 검색시 페이징이 정상적으로 적용되지않던 버그 수정
	2. 그룹 CRUD 기능 추가
	3. DB 설계 변경으로 인한 사이드 이펙트 수정

</details>

## 만들게 된 계기
주일학교 시스템상 매년 아이들의 출석을 기록해야 했고, 그에 따라 기존 엑셀로 된 출석부로는 매년 올해의 토요일, 일요일에 해당되는 부분을 일일히 알아보고 적어야하는 점이 너무 불편했습니다.

또한 출석 관리가 재대로 되지 않는 문제가 있었습니다. 파일을 가지고 있는 한명이 나올 수 없는 경우에는 다른 사람이 출석 체크를 하게되면 재대로 출석관리가 되지 않았습니다.

아이들을 돌보는 것도 힘든 와중에 출석관리까지 매년 따로 신경을 써야하는 점이 너무 번거로웠습니다.

어떻게 해결할 수 있을까? 고민중, 내가 가지고 있는 웹 프로그래밍 지식이라면 중고등부의 시스템을 어느 정도 전산화할 수 있지 않을까? 생각을 하게 되었습니다.

그래서 현 주일학교 시스템 중 하나인 출석부 프로그램을 만들게 되었고, 현재는 주일학교 시스템의 전산화를 목표로 하고 있습니다.

결론적으로 기존의 중고등부의 문제점은 다음과 같습니다.

1. 매년 엑셀로 된 출석부를 다시 만들어야 해서, 아이들의 정보를 다시 입력하고, 새로운 아이들의 정보를 입력하는 데 많은 어려움이 있었습니다.
2. 매년 출석 상을 보상해야 하는데, 기존의 출석부로는 아이들의 출석 통계를 내는 게 어려웠습니다.
3. 엑셀로 된 출석부를 가지고 있지않으면, 출석체크가 불가능합니다.
4. 파일로 관리하기 때문에 각자 가지고있는 출석 현황이 전부 달랐던 문제가 있었습니다.

출석부 프로그램을 제작함으로써, 개선되는 점은 다음과 같습니다.

1. 매년 출석부를 다시 만들지 않아도, 한번만 아이들의 정보를 등록하면 졸업하기 전까지 정보를 계속 유지할 수 있습니다.
2. 출석부 프로그램을 누구나 언제든 출석사항을 기록하고 확인 할 수 있습니다.
3. 회의록을 통해 확인해야하는 출석현황과 다르게 직관적으로 확인이 가능합니다.
4. 출석 상에 대한 통계를 낼때, 간편하게 산출할 수 있습니다.

저의 작은 노력으로 주일학교 공동체가 좋은 방향으로 변화했으면 좋겠습니다. 감사합니다.

</details>

## 개발기간
22.02.19 ~ 현재 (첫 배포는 기획한지 2주만에 진행)

## 시스템 구성도
![시스템 구성도](https://github.com/dc-choi/school_manage_back/blob/main/img/v2.0.0%20work%20flow.png)

## 사용 기술
- FrontEnd
    - HTML5
    - CSS3
    - JavaScript
    - jQuery 3.6.0

- BackEnd
    - TypeScript 4.6.3
    - Node.js 16.17.0
    - Express 4.16.1
    - Sequelize 6.16.2
    - MYSQL 8.0.30

- DevOps
    - ~~Ubuntu 20.04.4 LTS~~
    - ~~AWS EC2~~
    - Amazon Linux 2 2.0.20220805.0
    - AWS Lightsail
    - Nginx
    - GitHub

## 프로젝트 구조
```
public // 정적 파일을 담아두는 폴더
 ├── css // 공통 css
 ├── img // 웹 페이지에 필요한 이미지 파일
 └── *.html // 정적 페이지
src
 ├── @types // TS 타입 지정
 ├── api // api's (기능별 분류)
 ├── common // api에서의 공통 사용 모듈
 ├── lib // 프로젝트 구성 모듈
 ├── models // Database entity's
 ├── app.router.ts // api에 독립적인 router
 ├── app.ts // App Root
 └── env.ts // env file
 test/integration
 └── *.test.ts // Api에 독립적인 테스트를 작성
```

## ERD
![ERD](https://github.com/dc-choi/school_manage_back/blob/main/img/v2.0.0%20ERD.JPG)

논리적 설계만 이렇게 하였고, 물리적 설계는 관계를 끊어놓았습니다. 사용자의 요구사항이 계속 바뀌므로 유연한 구조를 가져야겠다고 생각했습니다.

## 주요 기능

- 로그인: 각 계정별로 로그인하여 계정에 속한 그룹을 관리할 수 있습니다.
- 그룹 리스트: 주일학교 학생들이 속한 그룹을 보고, 추가하고, 수정하고, 삭제할 수 있습니다.
- 학생 명단: 주일학교 학생들의 명단을 보고, 추가하고, 수정하고, 삭제할 수 있습니다.
- 출석부: 주일학교 학생들의 출석을 보고, 추가하고, 수정하고, 삭제할 수 있습니다.
- 통계(추후 패치를 통해 추가 예정): 학생들의 출석 현황을 간단하게 확인 할 수 있습니다.

<!-- ## 출석부 프로그램 초기 화면 구성
[오븐을 이용한 프로토타입](https://ovenapp.io/view/uUt1nneSOrTuih71pV814CGUcr6lRVKP/I6IRP) -->

## 느낀점
<details>
<summary> 22년 1분기 느낀점 </summary>

22.03.02: AWS를 이용해서 처음 배포를 진행했었는데 22년 3월 1일 22시부터 배포를 시작해서 다음날 02시까지 총 4시간의 배포를 진행했었습니다. 1.0.0 버전은 정말 간단하게 시작을 했었지만, 그래도 배포라는것이 정말 쉽지않고 내가 생각한만큼 잘 되지않는다는것을 배웠습니다. 다음에 배포를 진행할 경우 좀 더 테스트를 하고 계획을 세우고 배포를 진행하고 싶습니다. [참고링크: [Node.js] EC2에 Express APP 배포하기](https://dc-choi.tistory.com/50)

22.03.03: 페이징 버그 및 그룹 추가, 삭제, 수정 기능을 추가했습니다. DB 스키마를 변경함으로써, PM2로 매니징 하던 웹 서버를 종료 후 EC2에 설치된 Mysql Server에 새 DB 스키마를 적용하고 웹 서버에는 바뀐 소스코드를 적용한 다음 다시 시작을 하였습니다. 수동으로 서비스를 중지하고 배포를 진행했던 점이 좀 아쉬웠습니다. 이 프로젝트에 CI/CD를 적용시키고 싶습니다.

</details>

<details>
<summary> 22년 2분기 느낀점 </summary>

22.06.08: 오랜만에 버그 수정을 하였습니다. 10명 이상의 그룹에서 출석 내역을 저장하게 되면 페이로드가 1000개가 넘어, 요청이 완료되지 않았습니다. 기존 요청에서 입력한 칸의 데이터를 입력하는 API와 입력하지 않은 칸의 데이터를 입력하는 API를 나눴습니다. HTTP에 대해서 더 공부를 해야할 거 같습니다.

22.06.18: 부트스트랩을 이용해서 프론트의 디자인을 수정했습니다. 좀 더 보기 이쁜 화면이 사용자들에게 친숙하게 와닿을 것이라고 생각했고, 사람들에게 물어본 결과 수정이 필요하다고 판단하여 수정을 진행했습니다. 다음에는 전문적으로 수정할 수 있는 사람과 협업을 해야할거같습니다.

</details>

<details>
<summary> 22년 3분기 느낀점 </summary>

22.07.12: Nginx를 사용해서 리버스 프록시를 적용하였고, HTTPS까지 적용하였습니다. 또한, 도메인을 적용하여 기존의 알아보기 힘든 IP주소대신 도메인으로 접속할 수 있게 되었습니다. 기존의 외우기 힘들었던 IP주소 대신 도메인 주소로 접속이 가능하게 되어서 사용자들이 좋아했었습니다. [참고링크: [Deploy] Nginx 설치 및 HTTPS 적용](https://dc-choi.tistory.com/68)

22.07.19: 좀 더 가벼운 패키지 매니저인 Yarn을 도입하였습니다. 차이점으로는 조금 더 서버를 시작하는게 더 빨라진거같습니다. 또한, 자동으로 전화번호 Form을 완성하도록 수정하였습니다.

22.07.30: 출석부 매달 마지막 날이 그 전달의 마지막날을 찍고있는 버그를 확인하고 수정했습니다. 테스트가 정말 중요한거같습니다. 여러번 확인한다는것은 언제나 옳은거 같습니다.

</details>

22.09.06: 기존 EC2에서 Lightsail로 변경하였습니다. 변경의 가장 큰 이유는 감당할 수 없는 요금 때문이였습니다. 또한 OS도 우분투에서 아마존 리눅스로 변경하였습니다. AWS에서는 아마존 리눅스를 사용하는 것이 유지보수에 도움이 된다는 조언을 들었기 때문입니다.

22.09.28: v2.0.0으로 변경하였습니다. 기존의 소스코드는 너무 유지보수가 어려워서 아예 버전을 올려서 유지보수를 진행하게 되었습니다. 클린 아키텍처와 클린 코드에 대해서 생각하게 되었고, 좋은 구조란 사용자의 요구사항에 따라 유연하게 변경될 수 있는 구조라고 생각했습니다. 계속해서 유지보수를 열심히 해야겠습니다.

22.09.29: 출석부가 재대로 입력이 되지 않는 버그가 발생했습니다. 또한 413 에러를 만났는데, 요청의 기본 설정을 변경해도 그대로 에러가 나는 것을 확인했습니다. 확인해본 결과 jQuery AJAX의 기본 content-type이 x-www-form-urlencoded로 전송하는 것을 확인하였습니다. Axios의 기본 content-type이 application/json인 것을 생각하면, 생각지도 못한 오류를 만났던 거 같습니다. REST API를 사용하는 경우에는 application/json로만 데이터를 주게 받게 되는데, 이 부분을 한번 더 상기할 수 있었고, HTTP에 대해서 다시 한번 공부를 해야겠다고 결심했습니다.

22.09.30: 출석부 버그를 고치면서 리펙터링을 진행했습니다. 기존의 저장함수 하나에서 모든 처리를 진행하던 부분을 함수를 쪼개서 입력하였습니다. 가독성이 더 좋도록 수정하였고, 기존의 alert도 두번이 나타나는 로직을 한번만 나타나도록 해야겠습니다. alert가 뜨는 동안 사용자가 기다려야해서 프론트에 스피닝 기능을 추가할 예정입니다.

22.11.28: 사용자들의 피드백을 들었고, 요구사항을 추가한 후, 천천히 수정해가려고 했습니다. 앞으로 요구사항이 더 많아질 것을 고려하여 기존에 물리적 스키마의 관계가 이어져있던 부분을 없앴습니다. 논리적으로는 남겨두고 있고, 물리적으로만 없애서 좀 더 유연한 구조를 가지도록 하였습니다. 로그인 화면도 불편하다고 하여, 최대한 간편하게 엔터키를 누르면 로그인이 되도록 수정하였고, 출석 입력시 알림창이 자꾸 뜨는 불편한 부분을 개선했습니다. 스피닝 기능을 추가해서 저장이 되고있는 상태로 보이게 하였고, 저장중일때는 다른 입력을 할 수 없도록 수정했습니다. 사용자를 좀 더 배려하는 프로그램을 만들도록 노력해야겠다는 생각이 들었습니다. 이를 위해서는 유연하게 변경될 수 있는 구조를 가져가는게 핵심이라고 생각이 들었습니다.

22.11.29 : 엔터키를 여러번 누르면 API 호출도 여러번 되는 현상을 발견했습니다. 사용자가 입력이 느리다고 엔터를 여러번 누르는 경우를 생각해서 이에 이벤트가 한번 발생하면 여러번 API 호출을 할 수 없도록 수정하였습니다. 좀 더 사용자 중심적으로 생각하려고 했습니다. 출석입력 테이블 안에서 탭을 누르면 다음 학생의 출석이 입력되도록 수정하였습니다. tabindex를 사용해서 키보드로 입력하기 더 간단하게 하였습니다. 이 역시 사용자 입장에서 생각해보았습니다.

22.12.01 : 인가를 해주는 부분을 파이프라인식으로 처리하여 유지보수성을 높였습니다. 사용자의 피드백을 들어서 요구사항을 처리하다보면 언젠가는 authentication/authorization에 관련된 부분도 수정을 해야하는데, 그 부분이 하나의 함수에서 여러 동작을 하게되는 경우 유지보수가 어렵다고 생각했습니다. 출석부에 반응형을 추가하고 table태그의 양식을 맞춰서 pc, 모바일에서 보기좋은 화면을 제작했습니다. 테이블의 이름 고정하는 부분에서 어려움을 겪었는데 회사 동료에게 물어봐서 해결했었고 너무 혼자서 고민하는 시간이 길어지면 좋지 않다는걸 알았습니다. 그래서 프론트엔드 개발자도 구해서 같이 해보고싶습니다. 프론트 문제를 해결해줄뿐더러 같이 프로그램 개발에 대해서도 상의하고 싶습니다.

22.12.02 : 출석부의 날짜가 가운데 정렬이 되지 않은 것을 확인하고 가운데 정렬이 되도록 수정했습니다. TypeScript답게 코드에 타입을 입혀야할 필요성을 느껴서 타입을 적용했고 리펙터링을 진행하여 학생 명단을 내려줄 때 효율적인 로직을 가지도록 수정했습니다. 타입을 적용하여 개발상 오류가 발생하면 바로 확인할 수 있도록 하였습니다. DTO를 더 적용하면 좀 더 좋은 코드가 될거라 생각합니다. 학생명단을 내려줄때는 기존에는 object안에 number가 들어가서 필요없는 로직을 추가해서 처리해주고 있었는데, 바로 number를 넘겨주도록 변경했습니다.

22.12.05 : 전체적으로 리팩터링을 진행하면서 많은 수정사항이 있었습니다. DTO를 사용해서 클라이언트와 서버의 결합도를 줄였습니다. DTO를 도입하여 클라이언트가 Entity에 의존하는 것이 아닌, DTO에 의존하도록 변경했습니다. 그것이 서버의 구조가 변경되어도 클라이언트에 덜 영향이 가는 구조라고 생각해서 적용하게 되었습니다. 물론 전부 다 DTO를 사용하는 것이 아닌, DTO가 필요하다고 판단되는 출석과 학생부분에만 DTO를 적용했습니다. 나머지 부분에는 interface를 사용해서 DTO처럼 사용합니다. 개인적인 생각으로 복잡하지않은 이상, interface를 사용하는게 이상적이라고 생각합니다. DTO를 선언시에는 Builder Patten을 사용해서 가독성이 좋게 코드를 짰습니다. 그리고 출석입력의 API가 RESTful 하지않아 그 부분을 다시 수정하였습니다. 이제 하나의 API로 서버에서 분기해서 처리합니다. 더욱 더 가독성이 좋고 효율적인 코드를 작성했습니다 그리고 TypeScript의 타입을 적용하기 위해서 any를 사용하던 부분을 거의 모든부분을 개선했습니다. 타입 안정성이 더 좋은 코드가 되었습니다. 출석 저장부분을 리팩터링 했습니다. 효율적이지 않은 로직을 수정해서 개선했습니다. 이번 패치에서 좋은 코드에 대해서 한번 더 공부하게 되었습니다. 개인적으로 이번 경험을 통해 조금 더 성장했다는 것을 느꼈습니다.

22.12.08 : 미루고 미루던 테스트 코드 작성을 했습니다. 확실히 테스트 코드를 작성하니, 수동으로 테스트를 하지않고 간단하게 테스트를 할 수 있어서 좋았습니다. 성능을 생각해서 많이 사용하고있는 jest가 아닌, mocha, chai 조합으로 테스트를 작성했습니다. jest가 더 편리하긴 하지만 테스트가 좀 더 오래걸린다는 단점이 있습니다. 테스트 성능이 느리면 개발 생산성이 저하된다는 걸 느꼈습니다. 그리고 테스트하기 안좋은 코드는 안좋은 코드라는 것을 깨달았습니다. POST /api/attendance부분의 테스트 코드를 작성하는데 큰 어려움이 있었습니다. 이런 코드를 지양해야할 거 같습니다... 그리고 Promise.all을 공부해서 브라우저에서 비동기로 요청을 보낼 수 있도록 수정했습니다. 좋은 개념을 배워서 성취감을 느꼈고, Promise.all을 Node.js에서는 어떻게 사용해야하는지 생각해야 할 거 같습니다. 마지막으로 README.md의 가독성이 너무 떨어지는것으로 판단되어서 Releases에만 패치내역을 추가하기로 했습니다.

## 향후 패치방향
[버전 관리 규칙에 대해서...](https://dc-choi.tistory.com/62)

### 기능 추가
1. 아직 통계 페이지가 완성되지않았습니다. 최대한 빠른 시일내에 완성할 예정입니다.
2. 아이들에 대한 상세정보를 적을 수 없습니다. 이에 따른 상세 정보 추가, 수정, 삭제하는 기능을 추가 할 예정입니다. (UI도 같이 변경이 필요합니다.)
3. 아이들이 한살 먹으면 자동으로 아이들의 나이를 한살 증가시켜주는 기능을 추가 할 예정입니다. 초등부의 경우, 자동으로 학년도 올라가도록 설정 할 것이고, 중고등부로 올라올때 초등부의 그룹에서 자동으로 해제되도록 할 것입니다. 중고등부에서 성인이 되는 경우는 성인 그룹에 따로 매핑시킬 예정입니다. (관리자의 추가가 필요합니다.)
4. 자동으로 조 편성을 해주는 기능을 추가해야 할 거 같습니다. 중고등부는 초등부와 다르게 나이에 상관없이 조별로 활동하기 때문입니다. (조 정책을 어떻게 가져가냐에 따라 달라집니다.)
5. 출석부 입력시 아이들이 몇살인지 확인할 수 없어서 아이들의 나이를 추가해야 합니다.
6. 출석부 입력시 테이블에 이번주 몇명 출석했는지에 대한 정보가 필요함.
7. 출석 입력을 select로 변경해야 합니다. 피드백을 주셨습니다. (select시 테이블이 깨지는 문제 해결하기)
8. 폰트가 이쁘지않다는 피드백을 받아서 폰트 변경이 필요합니다.
9. 축일을 저장하도록 수정해야 합니다. 축일을 저장할 수 있도록 해달라는 초등부의 요청을 받았습니다. (DB구조 변경이 필요합니다.)

### 구조 및 성능 개선
1. FrontEnd를 그냥 HTML, CSS, JS로만 관리하는 것이 아닌, Vue.js를 적용해야 할 거 같습니다.
2. jenkins를 도입해서 CI/CD를 해야할 거 같습니다. 현재는 test와 deploy를 전부 수동으로 하고 있습니다. 이 부분의 도입을 조금 더 생각해봐야 할 거 같습니다.
3. 출석을 입력하는 부분이 테스트하기 좋은 코드로 작성되지 않았습니다. 이에 전체적으로 효율적이지 않은 로직을 가지고 있습니다. 이 부분이 개선이 필요합니다. 개선 후 다시 테스트코드를 작성해야 합니다.
