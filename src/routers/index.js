import express from 'express';
import authRouter from './auth.router.js';
import usersRouter from './user.router.js';
import resumeRouter from './resume.router.js';

const route = express.Router();

route.use('/auth', authRouter);
route.use('/users', usersRouter);
route.use('/resumes', resumeRouter);

export default route;
