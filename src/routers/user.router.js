import express from 'express';
import UserController from '../controllers/user.controller.js';
import UserService from '../services/user.service.js';
import UserRepository from '../repositories/user.repository.js';
import { prisma } from '../utils/prisma.util.js';
import { authMiddleware } from '../middlewares/require-access-token.middleware.js';

const userRouter = express.Router();
const userRepository = new UserRepository(prisma);
const userService = new UserService(userRepository);
const userController = new UserController(userService);

/* 사용자 정보 조회 API */
userRouter.get('/profile', authMiddleware, userController.getProfile);

/* 로그아웃 API */
userRouter.get('/logout', authMiddleware, userController.logout);

export default userRouter;
