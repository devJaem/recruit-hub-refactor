import express from 'express';
import { prisma } from '../utils/prisma.util.js';
import { accessMiddleware } from '../middlewares/require-access-token.middleware.js';
import { catchError } from '../middlewares/error-handling.middleware.js';
import {
  validateResumeCreate,
  validateResumeUpdate,
  validateResumeLog,
} from '../middlewares/validations/resume.validtation.middleware.js';
import { RESUME_MESSAGES } from '../constants/resume.constant.js';
import { requireRoles } from '../middlewares/require-roles.middleware.js';

const resumeRouter = express.Router();

/* 이력서 생성 API */
resumeRouter.post(
  '/',
  accessMiddleware,
  validateResumeCreate,
  catchError(async (req, res) => {
    const { userId } = req.user;
    const resumeData = req.body;

    const result = await prisma.$transaction(async (tr) => {
      const newResume = await tr.resume.create({
        data: {
          userId: userId,
          title: resumeData.title,
          content: resumeData.content,
          resumeStatus: 'apply',
        },
      });

      await tr.resumeLog.create({
        data: {
          resumeId: newResume.resumeId,
          recruiterId: userId,
          oldStatus: '',
          newStatus: 'apply',
          reason: 'Created resume',
        },
      });

      return newResume;
    });

    return res.status(200).json({
      status: 200,
      message: RESUME_MESSAGES.RESUME_CREATE_SUCCESS,
      data: { result },
    });
  })
);

/* 이력서 전체 조회 API */
resumeRouter.get(
  '/',
  accessMiddleware,
  catchError(async (req, res) => {
    const { userId, userInfo } = req.user;
    let { sortBy = 'createdAt', order = 'desc', status } = req.query;

    order = order === 'asc' ? 'asc' : 'desc';

    const whereClause = userInfo.role === 'RECRUITER' ? {} : { userId: userId };
    if (status) {
      whereClause.resumeStatus = status;
    }

    const resumes = await prisma.resume.findMany({
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

    return res.status(200).json({
      status: 200,
      message: RESUME_MESSAGES.RESUME_READ_SUCCESS,
      data: resumes.map((resume) => ({
        resumeId: resume.resumeId,
        name: resume.user.userInfo.name,
        title: resume.title,
        content: resume.content,
        resumeStatus: resume.resumeStatus,
        createdAt: resume.createdAt,
        updatedAt: resume.updatedAt,
      })),
    });
  })
);

/* 이력서 상세 조회 */
resumeRouter.get(
  '/:resumeId',
  accessMiddleware,
  catchError(async (req, res) => {
    const { userId, userInfo } = req.user;
    const { resumeId } = req.params;

    const resume = await prisma.resume.findFirst({
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

    if (!resume) {
      return res.status(404).json({
        status: 404,
        message: RESUME_MESSAGES.RESUME_NOT_FOUND,
      });
    }
    if (userInfo.role === 'APPLICANT' && resume.userId !== userId) {
      return res.status(403).json({
        status: 403,
        message: RESUME_MESSAGES.ACCESS_DENIED,
      });
    }

    return res.status(200).json({
      status: 200,
      message: RESUME_MESSAGES.RESUME_READ_SUCCESS,
      data: {
        resumeId: resume.resumeId,
        name: resume.user.userInfo.name,
        title: resume.title,
        content: resume.content,
        resumeStatus: resume.resumeStatus,
        createdAt: resume.createdAt,
        updatedAt: resume.updatedAt,
      },
    });
  })
);

/* 이력서 수정 API*/
resumeRouter.patch(
  '/:resumeId',
  accessMiddleware,
  validateResumeUpdate,
  catchError(async (req, res) => {
    const resumeData = req.body;
    const { userId } = req.user;
    const { resumeId } = req.params;

    const existing = await prisma.resume.findFirst({
      where: {
        resumeId: parseInt(resumeId),
        userId: userId,
      },
    });
    if (!existing) {
      return res.status(404).json({
        status: 404,
        message: RESUME_MESSAGES.RESUME_NOT_FOUND,
      });
    }

    const updateResume = await prisma.resume.update({
      where: {
        resumeId: parseInt(resumeId),
      },
      data: {
        ...(resumeData.title && { title: resumeData.title }),
        ...(resumeData.content && { content: resumeData.content }),
      },
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

    return res.status(200).json({
      status: 200,
      message: RESUME_MESSAGES.RESUME_UPDATE_SUCCESS,
      data: {
        resumeId: updateResume.resumeId,
        userId: updateResume.userId,
        name: updateResume.user.userInfo.name,
        title: updateResume.title,
        content: updateResume.content,
        resumeStatus: updateResume.resumeStatus,
        createdAt: updateResume.createdAt,
        updatedAt: updateResume.updatedAt,
      },
    });
  })
);

/* 이력서 삭제 API*/
resumeRouter.delete(
  '/:resumeId',
  accessMiddleware,
  catchError(async (req, res) => {
    const { userId } = req.user;
    const { resumeId } = req.params;

    const existing = await prisma.resume.findFirst({
      where: {
        resumeId: parseInt(resumeId),
        userId: userId,
      },
    });
    if (!existing) {
      return res.status(404).json({
        status: 400,
        message: RESUME_MESSAGES.RESUME_NOT_FOUND,
      });
    }

    if (existing.resumeStatus !== 'apply') {
      return res.status(400).json({
        status: 400,
        message: RESUME_MESSAGES.RECRUITER_RESULT_PUBLISHED_DELETE_DENIED,
      });
    }

    const deleteResume = await prisma.resume.delete({
      where: {
        resumeId: parseInt(resumeId),
      },
    });

    return res.status(200).json({
      status: 200,
      message: RESUME_MESSAGES.RESUME_DELETE_SUCCESS,
      data: {
        resumeId: deleteResume.resumeId,
      },
    });
  })
);

/* 이력서 지원 상태 변경 API */
resumeRouter.patch(
  '/:resumeId/status',
  accessMiddleware,
  requireRoles(['RECRUITER']),
  validateResumeLog,
  catchError(async (req, res) => {
    const { userId } = req.user;
    const { resumeId } = req.params;
    const { resumeStatus, reason } = req.body;

    // 이력서 조회
    const existing = await prisma.resume.findUnique({
      where: { resumeId: parseInt(resumeId) },
    });

    if (!existing) {
      return res.status(404).json({
        status: 404,
        message: RESUME_MESSAGES.RESUME_NOT_FOUND,
      });
    }

    // Transaction으로 이력서 상태 업데이트 및 로그 생성
    const result = await prisma.$transaction(async (tr) => {
      const updatedResume = await tr.resume.update({
        where: { resumeId: parseInt(resumeId) },
        data: { resumeStatus },
      });

      const resumeLog = await tr.resumeLog.create({
        data: {
          resumeId: parseInt(resumeId),
          recruiterId: userId,
          oldStatus: existing.resumeStatus,
          newStatus: resumeStatus,
          reason,
          changedAt: new Date(),
        },
      });

      return { updatedResume, resumeLog };
    });

    const { updatedResume, resumeLog } = result;

    return res.status(200).json({
      status: 200,
      message: RESUME_MESSAGES.RESUME_STATUS_UPDATE_SUCCESS,
      data: {
        resumeLogId: resumeLog.resumeHistoryId,
        recruiterId: userId,
        resumeId: resumeLog.resumeId,
        oldStatus: resumeLog.oldStatus,
        newStatus: resumeLog.newStatus,
        reason: resumeLog.reason,
        changedAt: resumeLog.changedAt,
      },
    });
  })
);

/* 이력서 로그 목록 조회 API */
resumeRouter.get(
  '/:resumeId/logs',
  accessMiddleware,
  requireRoles(['RECRUITER']),
  catchError(async (req, res) => {
    const { resumeId } = req.params;

    // 이력서 로그 조회
    const logs = await prisma.resumeLog.findMany({
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

    return res.status(200).json({
      status: 200,
      message: RESUME_MESSAGES.LOGS_FETCH_SUCCESS,
      data: logs.map((log) => ({
        resumeLogId: log.resumeHistoryId,
        recruiterName: log.recruiter.userInfo.name,
        resumeId: log.resumeId,
        oldStatus: log.oldStatus,
        newStatus: log.newStatus,
        reason: log.reason,
        changedAt: log.changedAt,
      })),
    });
  })
);

export default resumeRouter;
