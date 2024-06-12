import express from 'express';
import UserController from '../controllers/user.controller.js';
import UserService from '../services/user.service.js';
import UserRepository from '../repositories/user.repository.js';
import AuthRepository from '../repositories/auth.repository.js';
import { authMiddleware } from '../middlewares/require-access-token.middleware.js';
import { refreshMiddleware } from '../middlewares/require-refresh-token.middleware.js';
import { prisma } from '../utils/prisma.util.js';

const userRouter = express.Router();
const userRepository = new UserRepository(prisma);
const authRepository = new AuthRepository(prisma);
const userService = new UserService(userRepository, authRepository);
const userController = new UserController(userService);

/* 사용자 정보 조회 API */
userRouter.get(
  '/profile',
  authMiddleware(userRepository),
  userController.getProfile
);

/* RefreshToken 재발급 API */
userRouter.post(
  '/token',
  refreshMiddleware(userRepository, authRepository),
  userController.refreshToken
);

/* 로그아웃 API */
userRouter.get(
  '/logout',
  authMiddleware(userRepository),
  userController.logout
);

export default userRouter;
