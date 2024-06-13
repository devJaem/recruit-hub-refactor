export const dummyUsers = [
  {
    userId: 1,
    email: 'spartan@spartacodingclub.kr',
    password: '$2b$10$ZU8QqLH0phwjorogYV67jOl6x5l/pm5Oc1QcNzOgz6ADzy7ntQ2FG',
    userInfo: {
      userInfoId: 1,
      name: '스파르탄',
      role: 'APPLICANT',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
  {
    userId: 2,
    email: 'applicant@spartacodingclub.kr',
    password: '$2b$10$ZU8QqLH0phwjorogYV67jOl6x5l/pm5Oc1QcNzOgz6ADzy7ntQ2FG',
    userInfo: {
      userInfoId: 2,
      name: '지원자',
      role: 'APPLICANT',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
  {
    userId: 3,
    email: 'recruiter@spartacodingclub.kr',
    password: '$2b$10$ZU8QqLH0phwjorogYV67jOl6x5l/pm5Oc1QcNzOgz6ADzy7ntQ2FG',
    userInfo: {
      userInfoId: 3,
      name: '채용 담당자',
      role: 'RECRUITER',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
];

export const dummyRefreshTokens = [
  {
    tokenId: 1,
    userId: 1,
    token: 'sample-token-1',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    tokenId: 2,
    userId: 2,
    token: 'sample-token-2',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    tokenId: 3,
    userId: 3,
    token: 'sample-token-3',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
