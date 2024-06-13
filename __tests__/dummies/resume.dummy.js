import { dummyUsers } from './users.dummy.js';

export const dummyResumes = [
  {
    resumeId: 1,
    userId: 1,
    title: '튼튼한 개발자 스파르탄',
    content: '저는 튼튼함을 제 자랑거리로 선보일 수 있습니다. 어떤 도전이든 두려워하지 않고, 견고한 코드와 해결책을 제시할 자신이 있습니다...',
    resumeStatus: 'APPLY',
    createdAt: new Date(),
    updatedAt: new Date(),
    user: dummyUsers[0],
  },
  {
    resumeId: 2,
    userId: 1,
    title: '튼튼하고 영리한 개발자 스파르탄',
    content: '저는 튼튼함과 영리함을 제 자랑거리로 선보일 수 있습니다...',
    resumeStatus: 'PASS',
    createdAt: new Date(new Date().getTime() + 1000),
    updatedAt: new Date(new Date().getTime() + 1000),
    user: dummyUsers[0],
  },
  {
    resumeId: 3,
    userId: 2,
    title: '창의적인 기획자 지원자',
    content: '저는 창의성을 제 자랑거리로 선보일 수 있습니다...',
    resumeStatus: 'APPLY',
    createdAt: new Date(new Date().getTime() + 2000),
    updatedAt: new Date(new Date().getTime() + 2000),
    user: dummyUsers[1],
  },
  {
    resumeId: 4,
    userId: 2,
    title: '창의적이고 우직한 기획자 지원자',
    content: '저는 창의성과 우직함을 제 자랑거리로 선보일 수 있습니다...',
    resumeStatus: 'INTERVIEW1',
    createdAt: new Date(new Date().getTime() + 3000),
    updatedAt: new Date(new Date().getTime() + 3000),
    user: dummyUsers[1],
  },
];

export const dummyResumeLogs = [
  {
    resumeHistoryId: 1,
    resumeId: 1,
    recruiterId: 3,
    oldStatus: 'APPLY',
    newStatus: 'PASS',
    reason: 'Good performance',
    changedAt: new Date(),
    recruiter: {
      userInfo: {
        name: '채용 담당자',
      },
    },
  },
];