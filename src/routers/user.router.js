import express from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma.util.js';
import { catchError } from '../middlewares/error-handling.middleware.js';
import { accessMiddleware } from '../middlewares/require-access-token.middleware.js';
import { refreshMiddleware } from '../middlewares/require-refresh-token.middleware.js';
import { ENV } from '../constants/env.constant.js';

const userRouter = express.Router();

/* 사용자 정보 조회 */
userRouter.get('/profile', accessMiddleware, catchError(async (req, res) => {
  const user = req.user;
  res.status(200).json({
    userId: user.userId,
    email: user.email,
    name: user.userInfo.name,
    role: user.userInfo.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  });
}));

export default userRouter;