import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../utils/prisma.util.js';
import {signupUserSchema, signinUserSchema} from '../middlewares/validation.middleware.js';
import {catchError} from '../middlewares/error-handling.middleware.js';
import {ENV_VALUE} from '../constants/env.constant.js';
import {AUTH_MESSAGES} from '../constants/auth.constant.js';

const authRouter = express.Router();

/* 회원가입 API */
authRouter.post('/sign-up', catchError(async (req, res) => {
  const createUser = req.body;
  const {error} = signupUserSchema.validate(createUser);

  if(error){
    return res.status(400).json({
      status: 400,
      message: error.message
    });
  }

  const user = await prisma.user.findFirst({
    where: {email: createUser.email}
  });
  if(user){
    return res.status(409).json({
      status: 409,
      message: AUTH_MESSAGES.DUPLICATE_EMAIL
    });
  }

  const hashPassword = await bcrypt.hash(createUser.password, parseInt(ENV_VALUE.HASH_ROUND));
  const newUser = await prisma.user.create({
    data: {
      email: createUser.email,
      password: hashPassword,
      userInfo:{
        create:{
          name: createUser.name,
          role: 'APPLICANT'
        }
      }
    },
    include:{
      userInfo: true
    }
  });

  const { userId, email, createdAt, updatedAt, userInfo } = newUser;
  const { name, role } = userInfo;

  res.status(201).json({
    status: 201,
    message: AUTH_MESSAGES.SIGN_UP_SUCESS,
    data: {
      id: userId,
      email: email,
      name: name,
      role: role,
      createdAt: createdAt,
      updatedAt: updatedAt
    }
  });

}));

/* 로그인 API */
authRouter.post('/sign-in', catchError(async (req, res) => {
  const loginUser = req.body;
  const { error } = signinUserSchema.validate(loginUser);

  if (error) {
    return res.status(400).json({
      status: 400,
      message: error.message
    });
  }
  const user = await prisma.user.findFirst({
    where: { email: loginUser.email },
    include: { userInfo: true }
  });
  if (!user) {
    return res.status(401).json({
      status: 401,
      message: AUTH_MESSAGES.INVALID_AUTH
    });
  }

  const match = await bcrypt.compare(loginUser.password, user.password);
  if (!match) {
    return res.status(401).json({
      status: 401,
      message: AUTH_MESSAGES.INVALID_AUTH
    });
  }

  const accessToken = jwt.sign(
    {
      id: user.userId,
      role: user.userInfo.role 
    },
    process.env.ACCESS_SECRET_KEY,
    {
      expiresIn: process.env.ACCESS_EXPIRATION_TIME
    }
  );

  const refreshToken = jwt.sign(
    {
      id: user.userId,
      role: user.userInfo.role 
    },
    process.env.REFRESH_SECRET_KEY,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRATION_TIME
    }
  );

  await prisma.refreshToken.create({
    data: {
      userId: user.userId,
      token: refreshToken
    }
  });

  res.cookie('authorization', `Bearer ${accessToken}`);

  return res.status(200).json({
    status: 200,
    message: AUTH_MESSAGES.SIGN_IN_SUCESS,
    accessToken,
    refreshToken
  });
}));

export default authRouter;