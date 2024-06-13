import { beforeEach, describe, jest, test, expect } from '@jest/globals';
import ResumeService from '../../../src/services/resume.service.js';
import { dummyUsers} from '../../dummies/users.dummy.js';
import { dummyResumes, dummyResumeLogs } from '../../dummies/resume.dummy.js'
import { MESSAGES } from '../../../src/constants/message.constant.js';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../../../src/errors/http.error.js';

const mockResumeRepository = {
  createResume: jest.fn(),
  createResumeLog: jest.fn(),
  getAllResumes: jest.fn(),
  getResumeDetail: jest.fn(),
  updateResume: jest.fn(),
  deleteResume: jest.fn(),
  getResumeLogs: jest.fn(),
};

const resumeService = new ResumeService(mockResumeRepository);

describe('이력서 서비스 유닛 테스트', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('createResume 메서드 성공 케이스', async () => {
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
    mockResumeRepository.createResume.mockResolvedValue(mockReturn);
    mockResumeRepository.createResumeLog.mockResolvedValue({});

    const result = await resumeService.createResume(userId, resumeData);

    expect(mockResumeRepository.createResume).toHaveBeenCalledWith(userId, resumeData);
    expect(mockResumeRepository.createResumeLog).toHaveBeenCalledWith(mockReturn.resumeId, userId, '', 'apply', 'Created resume');
    expect(result).toEqual(mockReturn);
  });

  test('getAllResumes 메서드 성공 케이스', async () => {
    const userId = dummyUsers[2].userId;
    const userInfo = dummyUsers[2].userInfo;
    const sortBy = 'createdAt';
    const order = 'desc';
    const status = null;
    const mockReturn = dummyResumes;
    mockResumeRepository.getAllResumes.mockResolvedValue(mockReturn);

    const result = await resumeService.getAllResumes(userId, userInfo, sortBy, order, status);

    expect(mockResumeRepository.getAllResumes).toHaveBeenCalledWith({}, sortBy, order);
    expect(result).toEqual(mockReturn.map(resume => ({
      resumeId: resume.resumeId,
      name: resume.user.userInfo.name,
      title: resume.title,
      content: resume.content,
      resumeStatus: resume.resumeStatus,
      createdAt: resume.createdAt,
      updatedAt: resume.updatedAt,
    })));
  });

  test('getResumeDetail 메서드 성공 케이스', async () => {
    const userId = dummyUsers[0].userId;
    const userInfo = dummyUsers[0].userInfo;
    const resumeId = dummyResumes[0].resumeId;
    const mockReturn = dummyResumes[0];
    mockResumeRepository.getResumeDetail.mockResolvedValue(mockReturn);

    const result = await resumeService.getResumeDetail(userId, userInfo, resumeId);

    expect(mockResumeRepository.getResumeDetail).toHaveBeenCalledWith(resumeId);
    expect(result).toEqual({
      resumeId: mockReturn.resumeId,
      name: mockReturn.user.userInfo.name,
      title: mockReturn.title,
      content: mockReturn.content,
      resumeStatus: mockReturn.resumeStatus,
      createdAt: mockReturn.createdAt,
      updatedAt: mockReturn.updatedAt,
    });
  });

  test('getResumeDetail 메서드 실패 케이스 - Not Found Error', async () => {
    const userId = dummyUsers[0].userId;
    const userInfo = dummyUsers[0].userInfo;
    const resumeId = 999;
    mockResumeRepository.getResumeDetail.mockResolvedValue(null);

    await expect(resumeService.getResumeDetail(userId, userInfo, resumeId)).rejects.toThrow(NotFoundError);
    await expect(resumeService.getResumeDetail(userId, userInfo, resumeId)).rejects.toThrow(MESSAGES.RESUMES.COMMON.NOT_FOUND);
  });

  test('updateResume 메서드 성공 케이스', async () => {
    const userId = dummyUsers[0].userId;
    const resumeId = dummyResumes[0].resumeId;
    const resumeData = {
      title: 'Updated Title',
      content: 'Updated Content',
    };
    const mockReturn = {
      ...dummyResumes[0],
      ...resumeData,
    };
    mockResumeRepository.getResumeDetail.mockResolvedValue(dummyResumes[0]);
    mockResumeRepository.updateResume.mockResolvedValue(mockReturn);

    const result = await resumeService.updateResume(userId, resumeId, resumeData);

    expect(mockResumeRepository.getResumeDetail).toHaveBeenCalledWith(resumeId);
    expect(mockResumeRepository.updateResume).toHaveBeenCalledWith(resumeId, resumeData);
    expect(result).toEqual({
      resumeId: mockReturn.resumeId,
      userId: mockReturn.userId,
      name: mockReturn.user.userInfo.name,
      title: mockReturn.title,
      content: mockReturn.content,
      resumeStatus: mockReturn.resumeStatus,
      createdAt: mockReturn.createdAt,
      updatedAt: mockReturn.updatedAt,
    });
  });

  test('deleteResume 메서드 성공 케이스', async () => {
    const userId = dummyUsers[0].userId;
    const resumeId = dummyResumes[0].resumeId;
    mockResumeRepository.getResumeDetail.mockResolvedValue(dummyResumes[0]);
    mockResumeRepository.deleteResume.mockResolvedValue(dummyResumes[0]);

    const result = await resumeService.deleteResume(userId, resumeId);

    expect(mockResumeRepository.getResumeDetail).toHaveBeenCalledWith(resumeId);
    expect(mockResumeRepository.deleteResume).toHaveBeenCalledWith(resumeId);
    expect(result).toEqual({ resumeId: dummyResumes[0].resumeId });
  });

  test('getResumeLogs 메서드 성공 케이스', async () => {
    const resumeId = dummyResumes[0].resumeId;
    const mockReturn = dummyResumeLogs;
    mockResumeRepository.getResumeLogs.mockResolvedValue(mockReturn);

    const result = await resumeService.getResumeLogs(resumeId);

    expect(mockResumeRepository.getResumeLogs).toHaveBeenCalledWith(resumeId);
    expect(result).toEqual(mockReturn.map(log => ({
      resumeLogId: log.resumeHistoryId,
      recruiterName: log.recruiter.userInfo.name,
      resumeId: log.resumeId,
      oldStatus: log.oldStatus,
      newStatus: log.newStatus,
      reason: log.reason,
      changedAt: log.changedAt,
    })));
  });
});
