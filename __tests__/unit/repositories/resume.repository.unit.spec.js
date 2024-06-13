import { beforeEach, describe, jest, test, expect } from '@jest/globals';
import ResumeRepository from '../../../src/repositories/resume.repository.js';
import { dummyUsers } from '../../dummies/users.dummy.js';
import { dummyResumes, dummyResumeLogs } from '../../dummies/resume.dummy.js';

// Prisma 클라이언트 모킹
const mockPrisma = {
  resume: {
    create: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  resumeLog: {
    create: jest.fn(),
    findMany: jest.fn(),
  },
};

const resumeRepository = new ResumeRepository(mockPrisma);

describe('ResumeRepository Unit Test', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('createResume', async () => {
    // GIVEN
    const userId = dummyUsers[0].userId;
    const resumeData = {
      title: 'Sample Title',
      content: 'Sample Content',
    };
    const mockReturn = {
      ...dummyResumes[0],
      userId,
      ...resumeData,
    };
    mockPrisma.resume.create.mockResolvedValue(mockReturn);

    // WHEN
    const result = await resumeRepository.createResume(userId, resumeData);

    // THEN
    expect(mockPrisma.resume.create).toHaveBeenCalledWith({
      data: {
        userId,
        title: resumeData.title,
        content: resumeData.content,
        resumeStatus: 'APPLY',
      },
    });
    expect(result).toEqual(mockReturn);
  });

  test('createResumeLog', async () => {
    // GIVEN
    const resumeId = dummyResumes[0].resumeId;
    const recruiterId = dummyUsers[2].userId;
    const oldStatus = 'APPLY';
    const newStatus = 'PASS';
    const reason = 'Good performance';
    const mockReturn = {
      ...dummyResumeLogs[0],
      resumeId,
      recruiterId,
      oldStatus,
      newStatus,
      reason,
    };
    mockPrisma.resumeLog.create.mockResolvedValue(mockReturn);

    // WHEN
    const result = await resumeRepository.createResumeLog(resumeId, recruiterId, oldStatus, newStatus, reason);

    // THEN
    expect(mockPrisma.resumeLog.create).toHaveBeenCalledWith({
      data: {
        resumeId: parseInt(resumeId),
        recruiterId,
        oldStatus,
        newStatus,
        reason,
      },
    });
    expect(result).toEqual(mockReturn);
  });

  test('getAllResumes', async () => {
    // GIVEN
    const whereClause = {};
    const sortBy = 'createdAt';
    const order = 'desc';
    const mockReturn = dummyResumes;
    mockPrisma.resume.findMany.mockResolvedValue(mockReturn);

    // WHEN
    const result = await resumeRepository.getAllResumes(whereClause, sortBy, order);

    // THEN
    expect(mockPrisma.resume.findMany).toHaveBeenCalledWith({
      where: whereClause,
      orderBy: {
        [sortBy]: order,
      },
      select: {
        resumeId: true,
        userId: true,
        user: { select: { userInfo: { select: { name: true } } } },
        title: true,
        content: true,
        resumeStatus: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    expect(result).toEqual(mockReturn);
  });

  test('getResumeDetail', async () => {
    // GIVEN
    const resumeId = dummyResumes[0].resumeId;
    const mockReturn = dummyResumes[0];
    mockPrisma.resume.findFirst.mockResolvedValue(mockReturn);

    // WHEN
    const result = await resumeRepository.getResumeDetail(resumeId);

    // THEN
    expect(mockPrisma.resume.findFirst).toHaveBeenCalledWith({
      where: { resumeId: parseInt(resumeId) },
      include: {
        user: {
          select: {
            userInfo: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
    expect(result).toEqual(mockReturn);
  });

  test('updateResume', async () => {
    // GIVEN
    const resumeId = dummyResumes[0].resumeId;
    const resumeData = {
      title: 'Updated Title',
      content: 'Updated Content',
    };
    const mockReturn = {
      ...dummyResumes[0],
      ...resumeData,
    };
    mockPrisma.resume.update.mockResolvedValue(mockReturn);

    // WHEN
    const result = await resumeRepository.updateResume(resumeId, resumeData);

    // THEN
    expect(mockPrisma.resume.update).toHaveBeenCalledWith({
      where: {
        resumeId: parseInt(resumeId),
      },
      data: resumeData,
      include: {
        user: {
          select: {
            userInfo: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
    expect(result).toEqual(mockReturn);
  });

  test('deleteResume', async () => {
    // GIVEN
    const resumeId = dummyResumes[0].resumeId;
    const mockReturn = dummyResumes[0];
    mockPrisma.resume.delete.mockResolvedValue(mockReturn);

    // WHEN
    const result = await resumeRepository.deleteResume(resumeId);

    // THEN
    expect(mockPrisma.resume.delete).toHaveBeenCalledWith({
      where: {
        resumeId: parseInt(resumeId),
      },
    });
    expect(result).toEqual(mockReturn);
  });

  test('getResumeLogs', async () => {
    // GIVEN
    const resumeId = dummyResumes[0].resumeId;
    const mockReturn = dummyResumeLogs;
    mockPrisma.resumeLog.findMany.mockResolvedValue(mockReturn);

    // WHEN
    const result = await resumeRepository.getResumeLogs(resumeId);

    // THEN
    expect(mockPrisma.resumeLog.findMany).toHaveBeenCalledWith({
      where: { resumeId: parseInt(resumeId) },
      orderBy: { changedAt: 'desc' },
      select: {
        resumeHistoryId: true,
        resumeId: true,
        oldStatus: true,
        newStatus: true,
        reason: true,
        changedAt: true,
        recruiter: {
          select: {
            userInfo: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
    expect(result).toEqual(mockReturn);
  });
});
