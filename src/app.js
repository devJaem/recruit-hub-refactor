import express from 'express';
import { ENV } from './constants/env.constant.js';
import { globalErrorHandler } from './middlewares/error-handling.middleware.js';
import { requestLogger } from './middlewares/log.middleware.js';
import router from './routers/index.js';

const app = express();
const PORT = ENV.PORT;

app.use(requestLogger);
app.use(express.json());
app.use('/api/v1',[router]);
app.use(globalErrorHandler);

app.get('/', async (req, res) => {
  res.status(200).json({ message: '서버 정상 동작중'});
});

app.listen(PORT, () => {
  console.log(PORT, '포트로 서버가 열렸어요!');
});