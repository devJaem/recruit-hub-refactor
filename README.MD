# 내배캠 NodeJS_5기 정재민
### 채용 사이트 백엔드 만들기
---
### Setting
1. 코드 복사하기
```bash
git clone https://github.com/devJaem/marketplace.git .
```

2. Node 의존성 다운로드
```bash
yarn install
```

3. .env 파일 생성하기 (https://github.com/devJaem/recruit-hub/blob/main/.env.example) 참고

4. 서버 실행하기
```bash
# nodemon 으로 실행하기
yarn run dev
```
#### 폴더구조
---
```
.
├── node_modules
├── prisma
│   └── schema.prisma
├── src
│   ├── constants
│   │   ├── auth.constant.js
│   │   ├── env.constant.js
│   │   ├── resume.constant.js
│   │   └── user.constant.js
│   ├── middlewares
│   │   ├── error-handler.middleware.js
│   │   ├── log.middleware.js
│   │   ├── require-access-token.middleware.js
│   │   ├── require-refresh-token.middleware.js
│   │   ├── require-roles.middleware.js
│   │   └── validation.middleware.js
│   ├── routers
│   │   ├── auth.router.js
│   │   ├── index.js
│   │   ├── resumes.router.js
│   │   └── users.router.js
│   ├── utils
│   │   ├── jwt.util.js
│   │   └── prisma.util.js
│   └── app.js
├── .env 
├── .env.example 
├── .gitignore
├── .prettierrc
├── package.json
├── README.md
└── yarn.lock // npm을 사용하면 package-lock.json
```
- `app.js`
    - **전체 어플리케이션의 시작점**입니다.
    - **미들웨어(Middleware)**와 **라우터(Router)**를 등록하며, 서버를 시작하는 역할을 담당합니다.
- `middlewares`
    - 미들웨어를 정의하기 위해 사용합니다.
    - 에러 핸들러, 로그, 토큰검증, 재발급을 처리하는 
      미들웨어를 이 폴더에서 관리합니다.
    - 입력값에 대한 유효성 검증 미들웨어를 관리합니다.
- `routes`
    - Express.js의 **라우터(Router)**를 관리하기 위해 사용합니다.
    - 각 **API 경로를 정의**하며, 해당 경로에서 실행될 **함수를 관리**하는 역할을 담당합니다.
- `utils`
    - Prisma 와 관련된 로그를 처리합니다.
    - jwt 를 분해해서 payload를 리턴합니다.
#### API 명세
---
https://devjeam.notion.site/Node-js-API-6024911b8cfb477cb106b290770cf9d4?pvs=4

#### ERD
---
https://drawsql.app/teams/recruit-hub/diagrams/recruit-hub