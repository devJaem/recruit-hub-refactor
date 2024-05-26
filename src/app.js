import express from 'express';
import cookieParser from 'cookie-parser';
import { ENV } from './constants/env.constant.js';
import { errorHandler} from './middlewares/error-handling.middleware.js';
import LogMiddleware from './middlewares/log.middleware.js';
import index from './routers/index.js';

const app = express();
const PORT = ENV.PORT;

app.use(LogMiddleware);
app.use(express.json());
app.use(cookieParser());
app.use(errorHandler);
app.use('/api/v1',[index]);

app.get('/', async (req, res) => {
  res.status(200).json({ message: '서버 정상 동작중'});
});

app.listen(PORT, () => {
  console.log(PORT, '포트로 서버가 열렸어요!');
});