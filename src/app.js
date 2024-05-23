import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv'
import LogMiddleware from './middlewares/log.middleware.js';
import ErrorHandlingMiddleware from './middlewares/error-handling.middleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(LogMiddleware);
app.use(express.json());
app.use(cookieParser());
app.use(ErrorHandlingMiddleware);

app.listen(PORT, () => {
  console.log(PORT, '포트로 서버가 열렸어요!');
});

