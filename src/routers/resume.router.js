import express from 'express';
import { authMiddleware } from '../middlewares/require-access-token.middleware.js';
import { resumerCreatesSchema } from '../middlewares/validators/resumeCreate.validtation.middleware.js';
import { resumerUpdateSchema } from '../middlewares/validators/resumeUpdate.validation.middleware.js';
import { resumerLogSchema } from '../middlewares/validators/resumeLogCreate.validation.middleware copy.js';
import { requireRoles } from '../middlewares/require-roles.middleware.js';
import ResumeController from '../controllers/resume.controller.js';
import ResumeService from '../services/resume.service.js';
import ResumeRepository from '../repositories/resume.repository.js';
import UserRepository from '../repositories/user.repository.js';
import { prisma } from '../utils/prisma.util.js';

const resumeRouter = express.Router();
const userRepository = new UserRepository(prisma);
const resumeRepository = new ResumeRepository(prisma);
const resumeService = new ResumeService(resumeRepository);
const resumeController = new ResumeController(resumeService);

/* 이력서 생성 API */
resumeRouter.post(
  '/',
  authMiddleware(userRepository),
  resumerCreatesSchema,
  resumeController.createResume
);

/* 이력서 전체 조회 API */
resumeRouter.get(
  '/',
  authMiddleware(userRepository),
  resumeController.getAllResumes
);

/* 이력서 상세 조회 API */
resumeRouter.get(
  '/:resumeId',
  authMiddleware(userRepository),
  resumeController.getResumeDetail
);

/* 이력서 수정 API */
resumeRouter.patch(
  '/:resumeId',
  authMiddleware(userRepository),
  resumerUpdateSchema,
  resumeController.updateResume
);

/* 이력서 삭제 API */
resumeRouter.delete(
  '/:resumeId',
  authMiddleware(userRepository),
  resumeController.deleteResume
);

/* 이력서 지원 상태 변경 API */
resumeRouter.patch(
  '/:resumeId/status',
  authMiddleware(userRepository),
  requireRoles(['RECRUITER']),
  resumerLogSchema,
  resumeController.updateResumeStatus
);

/* 이력서 로그 목록 조회 API */
resumeRouter.get(
  '/:resumeId/logs',
  authMiddleware(userRepository),
  requireRoles(['RECRUITER']),
  resumeController.getResumeLogs
);

export default resumeRouter;
