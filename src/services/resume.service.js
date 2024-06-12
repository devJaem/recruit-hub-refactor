import { MESSAGES } from '../constants/message.constant.js';
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from '../errors/http.error.js';

class ResumeService {
  constructor(resumeRepository) {
    this.resumeRepository = resumeRepository;
  }

  async createResume(userId, resumeData) {
    const newResume = await this.resumeRepository.createResume(
      userId,
      resumeData
    );
    await this.resumeRepository.createResumeLog(
      newResume.resumeId,
      userId,
      '',
      'apply',
      'Created resume'
    );
    return newResume;
  }

  async getAllResumes(userId, userInfo, sortBy, order, status) {
    const whereClause = userInfo.role === 'RECRUITER' ? {} : { userId };
    if (status) {
      whereClause.resumeStatus = status;
    }
    const resumes = await this.resumeRepository.getAllResumes(
      whereClause,
      sortBy,
      order
    );
    return resumes.map((resume) => ({
      resumeId: resume.resumeId,
      name: resume.user.userInfo.name,
      title: resume.title,
      content: resume.content,
      resumeStatus: resume.resumeStatus,
      createdAt: resume.createdAt,
      updatedAt: resume.updatedAt,
    }));
  }

  async getResumeDetail(userId, userInfo, resumeId) {
    const resume = await this.resumeRepository.getResumeDetail(resumeId);
    if (!resume) {
      throw new NotFoundError(MESSAGES.RESUMES.COMMON.NOT_FOUND);
    }
    if (userInfo.role === 'APPLICANT' && resume.userId !== userId) {
      throw new UnauthorizedError(MESSAGES.AUTH.COMMON.FORBIDDEN);
    }
    return {
      resumeId: resume.resumeId,
      name: resume.user.userInfo.name,
      title: resume.title,
      content: resume.content,
      resumeStatus: resume.resumeStatus,
      createdAt: resume.createdAt,
      updatedAt: resume.updatedAt,
    };
  }

  async updateResume(userId, resumeId, resumeData) {
    const existing = await this.resumeRepository.getResumeDetail(resumeId);
    if (!existing || existing.userId !== userId) {
      throw new NotFoundError(MESSAGES.RESUMES.COMMON.NOT_FOUND);
    }
    const updatedResume = await this.resumeRepository.updateResume(
      resumeId,
      resumeData
    );
    return {
      resumeId: updatedResume.resumeId,
      userId: updatedResume.userId,
      name: updatedResume.user.userInfo.name,
      title: updatedResume.title,
      content: updatedResume.content,
      resumeStatus: updatedResume.resumeStatus,
      createdAt: updatedResume.createdAt,
      updatedAt: updatedResume.updatedAt,
    };
  }

  async deleteResume(userId, resumeId) {
    const existing = await this.resumeRepository.getResumeDetail(resumeId);
    if (!existing) {
      throw new NotFoundError(MESSAGES.RESUMES.COMMON.NOT_FOUND);
    }
    if (existing.userId !== userId) {
      throw new BadRequestError(MESSAGES.AUTH.COMMON.FORBIDDEN);
    }
    if (existing.resumeStatus !== 'APPLY') {
      // 'APPLY'로 수정
      throw new BadRequestError(
        MESSAGES.RESUMES.DELETE.RECRUITER_RESULT_PUBLISHED_DELETE_DENIED
      );
    }
    const deletedResume = await this.resumeRepository.deleteResume(resumeId);
    return { resumeId: deletedResume.resumeId };
  }

  async updateResumeStatus(userId, resumeId, resumeStatus, reason) {
    const existing = await this.resumeRepository.getResumeDetail(resumeId);
    if (!existing) {
      throw new NotFoundError(MESSAGES.RESUMES.COMMON.NOT_FOUND);
    }
    const updatedResume = await this.resumeRepository.updateResume(resumeId, {
      resumeStatus,
    });
    const resumeLog = await this.resumeRepository.createResumeLog(
      resumeId,
      userId,
      existing.resumeStatus,
      resumeStatus,
      reason
    );
    return { updatedResume, resumeLog };
  }

  async getResumeLogs(resumeId) {
    const logs = await this.resumeRepository.getResumeLogs(resumeId);
    return logs.map((log) => ({
      resumeLogId: log.resumeHistoryId,
      recruiterName: log.recruiter.userInfo.name,
      resumeId: log.resumeId,
      oldStatus: log.oldStatus,
      newStatus: log.newStatus,
      reason: log.reason,
      changedAt: log.changedAt,
    }));
  }
}

export default ResumeService;
