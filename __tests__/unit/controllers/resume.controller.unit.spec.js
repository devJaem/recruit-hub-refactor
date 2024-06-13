import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import ResumeController from '../../../src/controllers/resume.controller.js';
import { HTTP_STATUS } from '../../../src/constants/http-status.constant.js';
import { MESSAGES } from '../../../src/constants/message.constant.js';
import { dummyResumes, dummyResumeLogs } from '../../dummies/resume.dummy.js'

const mockResumeService = {
  createResume: jest.fn(),
  getAllResumes: jest.fn(),
  getResumeDetail: jest.fn(),
  updateResume: jest.fn(),
  deleteResume: jest.fn(),
  updateResumeStatus: jest.fn(),
  getResumeLogs: jest.fn(),
};

let mockRequest;
let mockResponse;
let mockNext;

const resumeController = new ResumeController(mockResumeService);

describe('ResumeController 유닛 테스트', () => {
  beforeEach(() => {
    jest.resetAllMocks();

    mockRequest = {
      user: { userId: 1, userInfo: {} },
      body: {},
      params: {},
      query: {},
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockNext = jest.fn();
  });

  test('createResume 성공', async () => {
    const resumeData = { title: 'New Resume' };
    const result = { resumeId: 1, ...resumeData };
    mockRequest.body = resumeData;
    mockResumeService.createResume.mockResolvedValue(result);

    await resumeController.createResume(mockRequest, mockResponse, mockNext);

    expect(mockResumeService.createResume).toHaveBeenCalledWith(1, resumeData);
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_STATUS.CREATED);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: HTTP_STATUS.CREATED,
      message: MESSAGES.RESUMES.CREATE.SUCCEED,
      data: result,
    });
  });

  test('getAllResumes 성공', async () => {
    const resumes = [dummyResumes[0], dummyResumes[1]];
    mockResumeService.getAllResumes.mockResolvedValue(resumes);

    await resumeController.getAllResumes(mockRequest, mockResponse, mockNext);

    expect(mockResumeService.getAllResumes).toHaveBeenCalledWith(1, {}, 'createdAt', 'desc', undefined);
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: HTTP_STATUS.OK,
      message: MESSAGES.RESUMES.READ_LIST.SUCCEED,
      data: resumes,
    });
  });

  test('getResumeDetail 성공', async () => {
    const resume = dummyResumes[0];
    mockRequest.params.resumeId = 1;
    mockResumeService.getResumeDetail.mockResolvedValue(resume);

    await resumeController.getResumeDetail(mockRequest, mockResponse, mockNext);

    expect(mockResumeService.getResumeDetail).toHaveBeenCalledWith(1, {}, 1);
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: HTTP_STATUS.OK,
      message: MESSAGES.RESUMES.READ_DETAIL.SUCCEED,
      data: resume,
    });
  });

  test('updateResume 성공', async () => {
    const resumeData = { title: 'Updated Resume' };
    const updatedResume = { resumeId: 1, ...resumeData };
    mockRequest.params.resumeId = 1;
    mockRequest.body = resumeData;
    mockResumeService.updateResume.mockResolvedValue(updatedResume);

    await resumeController.updateResume(mockRequest, mockResponse, mockNext);

    expect(mockResumeService.updateResume).toHaveBeenCalledWith(1, 1, resumeData);
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: HTTP_STATUS.OK,
      message: MESSAGES.RESUMES.UPDATE.SUCCEED,
      data: updatedResume,
    });
  });

  test('deleteResume 성공', async () => {
    const result = { success: true };
    mockRequest.params.resumeId = 1;
    mockResumeService.deleteResume.mockResolvedValue(result);

    await resumeController.deleteResume(mockRequest, mockResponse, mockNext);

    expect(mockResumeService.deleteResume).toHaveBeenCalledWith(1, 1);
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: HTTP_STATUS.OK,
      message: MESSAGES.RESUMES.DELETE.SUCCEED,
      data: result,
    });
  });

  test('updateResumeStatus 성공', async () => {
    const resumeStatus = 'APPROVED';
    const reason = 'All good';
    const result = { success: true };
    mockRequest.params.resumeId = 1;
    mockRequest.body = { resumeStatus, reason };
    mockResumeService.updateResumeStatus.mockResolvedValue(result);

    await resumeController.updateResumeStatus(mockRequest, mockResponse, mockNext);

    expect(mockResumeService.updateResumeStatus).toHaveBeenCalledWith(1, 1, resumeStatus, reason);
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: HTTP_STATUS.OK,
      message: MESSAGES.RESUMES.UPDATE.STATUS.SUCCEED,
      data: result,
    });
  });

  test('getResumeLogs 성공', async () => {
    const logs = dummyResumeLogs;
    mockRequest.params.resumeId = 1;
    mockResumeService.getResumeLogs.mockResolvedValue(logs);

    await resumeController.getResumeLogs(mockRequest, mockResponse, mockNext);

    expect(mockResumeService.getResumeLogs).toHaveBeenCalledWith(1);
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: HTTP_STATUS.OK,
      message: MESSAGES.RESUMES.READ_LIST.LOG.SUCCEED,
      data: logs,
    });
  });
});

