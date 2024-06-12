import express from 'express';
import { userCreateSchema } from '../middlewares/validators/sign-up.validation.middleware.js';
import { userLoginSchema } from '../middlewares/validators/sign-in.validation.middleware.js';
import AuthController from '../controllers/auth.controller.js';
import AuthService from '../services/auth.service.js';
import UserRepository from '../repositories/user.repository.js';
import AuthRepository from '../repositories/auth.repository.js';
import { prisma } from '../utils/prisma.util.js';

const authRouter = express.Router();
const userRepository = new UserRepository(prisma);
const authRepository = new AuthRepository(prisma);
const authService = new AuthService(authRepository, userRepository);
const authController = new AuthController(authService);

/* 회원가입 API */
authRouter.post('/sign-up', userCreateSchema, authController.signUp);

/* 로그인 API */
authRouter.post('/sign-in', userLoginSchema, authController.signIn);

export default authRouter;
