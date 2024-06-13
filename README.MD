# 내배캠 NodeJS_5기 정재민
### 채용 사이트 백엔드 리팩토링하기
### 기존 개인과제 (https://github.com/devJaem/recruit-hub)
### 레이어드아키텍처 적용하여 리팩토링, 테스트코드 작성하기 
---
### Setting
1. 코드 복사하기
```bash
git clone https://github.com/devJaem/marketplace.git .
```
2. 필요 패키지 설치
```bash
yarn
```
3. DB테이블 생성
```bash
yarn prisma db push
```
4. .env.example 파일의 이름을 .env로 변경하고 아래 내용을 채움
```bash
# MY SQL URL (아이디, 비밀번호 포함)
DATABASE_URL="mysql://계정이름:비밀번호@주소:포트/DB명"
# 포트번호 (정수)
PORT=서버포트
# Access Token key
ACCESS_SECRET_KEY="key value"
# Refresh Token key
REFRESH_SECRET_KEY="key value"

```
5. 서버 실행하기 
```bash
# 배포용
yarn start 
# 개발용
yarn dev
```

#### 폴더구조
---
```
├── __tests__
│   ├── dummies
│   │   ├── resumes.dummy.js
│   │   └── users.dummy.js
│   └── unit
│       ├── controllers
│       │   ├── auth.controller.unit.spec.js
│       │   ├── resumes.controller.unit.spec.js
│       │   └── users.controller.unit.spec.js
│       ├── repositories
│       │   ├── auth.repository.unit.spec.js
│       │   ├── resumes.repository.unit.spec.js
│       │   └── users.repository.unit.spec.js
│       └── services
│           ├── auth.service.unit.spec.js
│           ├── resumes.service.unit.spec.js
│           └── user.service.unit.spec.js
├── node_modules
├── prisma
│   └── schema.prisma
├── src
│   ├── constants
│   │   ├── auth.constant.js
│   │   ├── env.constant.js
│   │   ├── http-status.constant.js
│   │   ├── message.constant.js
│   │   ├── resume.constant.js
│   │   └── user.constant.js
│   ├── controllers
│   │   ├── auth.controller.js
│   │   ├── resumes.controller.js
│   │   └── users.controller.js
│   ├── errors
│   │   └── http.error.js
│   ├── middlewares
│   │   ├── error-handling.middleware.js
│   │   ├── log.middleware.js
│   │   ├── require-access-token.middleware.js
│   │   ├── require-refresh-token.middleware.js
│   │   ├── require-roles.middleware.js
│   │   └── validations
│   │       ├── resumeCreate.validtation.middleware.js
│   │       ├── resumeLogCreate.validtation.middleware.js
│   │       ├── resumeUpdate.validtation.middleware.js
│   │       ├── sign-in.validtation.middleware.js
│   │       └── sign-up.validtation.middleware.js
│   ├── repositories
│   │   ├── auth.repository.js
│   │   ├── resumes.repository.js
│   │   └── users.repository.js
│   ├── routers
│   │   ├── auth.router.js
│   │   ├── index.js
│   │   ├── resume.router.js
│   │   └── user.router.js
│   ├── services
│   │   ├── auth.service.js
│   │   ├── resumes.service.js
│   │   └── user.service.js
│   ├── utils
│   │   └── prisma.util.js
│   └── app.js
├── .env 
├── .env.example 
├── .gitignore
├── .prettierrc
├── jest.config.js
├── package.json
├── README.md
└── yarn.lock
```
- `__tests__`
    - 테스트 파일을 포함하는 디렉토리입니다.
    - dummies: 테스트에 사용할 더미 데이터를 포함합니다.
        - resumes.dummy.js: 이력서 더미 데이터.
        - users.dummy.js: 사용자 더미 데이터.
    - unit: 단위 테스트 파일을 포함합니다.
        - controllers: 컨트롤러 유닛 테스트 파일.
            - auth.controller.unit.spec.js: 인증 컨트롤러 테스트.
            - resumes.controller.unit.spec.js: 이력서 컨트롤러 테스트.
            - users.controller.unit.spec.js: 사용자 컨트롤러 테스트.
        - repositories: 리포지토리 유닛 테스트 파일.
            - auth.repository.unit.spec.js: 인증 리포지토리 테스트.
            - resumes.repository.unit.spec.js: 이력서 리포지토리 테스트.
            - users.repository.unit.spec.js: 사용자 리포지토리 테스트.
        - services: 서비스 유닛 테스트 파일.
            - auth.service.unit.spec.js: 인증 서비스 테스트.
            - resumes.service.unit.spec.js: 이력서 서비스 테스트.
            - user.service.unit.spec.js: 사용자 서비스 테스트.
- `prisma`
    - Prisma ORM 관련 파일을 포함합니다.
    - schema.prisma: Prisma 스키마 정의 파일.
- `src`
    - 애플리케이션의 소스 코드를 포함합니다.
    - `app.js`
        - **전체 어플리케이션의 시작점**입니다.
        - **미들웨어(Middleware)**와 **라우터(Router)**를 등록하며, 서버를 시작하는 역할을 담당합니다.
    - `constants`
        - 애플리케이션에서 사용하는 상수를 정의합니다.
        - auth.constant.js: 인증 관련 상수.
        - env.constant.js: 환경 변수 관련 상수.
        - http-status.constant.js: HTTP 상태 코드 상수.
        - message.constant.js: 메시지 상수.
        - resume.constant.js: 이력서 관련 상수.
        - user.constant.js: 사용자 관련 상수.
    - `controllers`
        - 컨트롤러를 정의합니다. 요청을 처리하고 응답을 반환합니다.
        - auth.controller.js: 인증 관련 컨트롤러.
        - resumes.controller.js: 이력서 관련 컨트롤러.
        - users.controller.js: 사용자 관련 컨트롤러.
    - `errors`
        - 에러를 정의합니다.
        - http.error.js: HTTP 에러 정의.    
    - `middlewares`
        - 미들웨어를 정의합니다.
        - error-handling.middleware.js: 에러 핸들링 미들웨어.
        - log.middleware.js: 로깅 미들웨어.
        - require-access-token.middleware.js: 액세스 토큰 검증 미들웨어.
        - require-refresh-token.middleware.js: 리프레시 토큰 검증 미들웨어.
        - require-roles.middleware.js: 역할 검증 미들웨어.
        - validations: 유효성 검증 미들웨어.
            - resumeCreate.validation.middleware.js: 이력서 생성 유효성 검증.
            - resumeLogCreate.validation.middleware.js: 이력서 로그 생성 유효성 검증.
            - resumeUpdate.validation.middleware.js: 이력서 업데이트 유효성 검증.
            - sign-in.validation.middleware.js: 로그인 유효성 검증.
            - sign-up.validation.middleware.js: 회원가입 유효성 검증.
    - `repositories`
        - 리포지토리를 정의합니다. 데이터베이스와 상호작용합니다.
        - auth.repository.js: 인증 리포지토리.
        - resumes.repository.js: 이력서 리포지토리.
        - users.repository.js: 사용자 리포지토리. 
    - `routes`
        - 라우터를 정의합니다. 경로와 해당 경로에서 실행될 컨트롤러 메서드를 설정합니다.
        - auth.router.js: 인증 라우터.
        - index.js: 기본 라우터.
        - resume.router.js: 이력서 라우터.
        - user.router.js: 사용자 라우터.
    - `services`
        - 서비스를 정의합니다. 비즈니스 로직을 처리합니다.
        - auth.service.js: 인증 서비스.
        - resumes.service.js: 이력서 서비스.
        - user.service.js: 사용자 서비스.
    - `utils`
        - 유틸리티 함수를 정의합니다.
        - prisma.util.js: Prisma 관련 유틸리티 함수.
#### API 명세
---
https://devjeam.notion.site/Node-js-API-6024911b8cfb477cb106b290770cf9d4

#### ERD
---
https://drawsql.app/teams/recruit-hub/diagrams/recruit-hub
