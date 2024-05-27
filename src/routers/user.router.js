import express from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma.util.js';
import { catchError } from '../middlewares/error-handling.middleware.js';
import { accessMiddleware } from '../middlewares/require-access-token.middleware.js';
import { refreshMiddleware } from '../middlewares/require-refresh-token.middleware.js';
import { ENV } from '../constants/env.constant.js';
import { USER_MESSAGES } from '../constants/user.constant.js';

const userRouter = express.Router();

/* 사용자 정보 조회 API */
userRouter.get(
  '/profile',
  accessMiddleware,
  catchError(async (req, res) => {
    const user = req.user;
    res.status(200).json({
      status: 200,
      message: USER_MESSAGES.PROFILE_SUCESS,
      data: {
        userId: user.userId,
        email: user.email,
        name: user.userInfo.name,
        role: user.userInfo.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  })
);

/* RefreshToken 재발급 API*/
userRouter.post(
  '/token',
  refreshMiddleware,
  catchError(async (req, res) => {
    const { userId, userInfo } = req.user;

    const accessToken = jwt.sign(
      {
        userId: userId,
        role: userInfo.role,
      },
      ENV.ACCESS_KEY,
      { expiresIn: ENV.ACCESS_TIME }
    );

    const refreshToken = jwt.sign(
      {
        userId: userId,
        role: userInfo.role,
      },
      ENV.REFRESH_KEY,
      { expiresIn: ENV.REFRESH_TIME }
    );

    await prisma.refreshToken.updateMany({
      where: {
        userId: userId,
      },
      data: {
        token: refreshToken,
      },
    });

    return res.status(200).json({
      status: 200,
      message: USER_MESSAGES.RENEW_TOKEN,
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  })
);

/* 로그아웃 API*/
userRouter.get(
  '/logout',
  accessMiddleware,
  catchError(async (req, res) => {
    const { userId } = req.user;

    await prisma.refreshToken.deleteMany({
      where: {
        userId: userId,
      },
    });

    return res.status(200).json({
      status: 200,
      message: USER_MESSAGES.LOGOUT_SUCESS,
      data: { 
        userId:userId, 
      }
    });
  })
);

export default userRouter;
