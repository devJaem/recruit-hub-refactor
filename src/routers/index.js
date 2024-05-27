import express from 'express';
import authRouter from './auth.router.js';
import userRouter from './user.router.js';
// import resumeRouter from './resume.router.js';

const route = express.Router();

route.use('/auth', authRouter);
route.use('/user', userRouter);
// route.use('/resume', resumeRouter)

export default route;