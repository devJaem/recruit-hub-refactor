import { prisma } from '../utils/prisma.util.js';
import { ENV } from '../constants/env.constant.js';
import { validateToken } from '../utils/jwt.util.js';
import { AUTH_MESSAGES } from '../constants/auth.constant.js';
import { catchError } from './error-handling.middleware.js';
import { validateToken } from './require-access-token.middleware.js';
import { USER_MESSAGES } from '../constants/user.constant.js';

/* RefreshToken 검증, 재발급 미들웨어 */
const refreshMiddleware = catchError(async (req, res, next) => {
  const refreshToken = req.headers.authorization;
  if(!refreshToken){
    return res.status(400).json({
      status:400,
      message: AUTH_MESSAGES.INVALID_AUTH
    });
  }

  const token = refreshToken.split(' ')[1];
  if(!token){
    return res.status(401).json({
      status:401,
      message: AUTH_MESSAGES.UNSUPPORTED_AUTH
    });
  }

  const payload = await validateToken(token, ENV.REFRESH_KEY);
  if(payload === 'expired'){
    return res.status(401).json({
      status:401,
      message: AUTH_MESSAGES.TOKEN_EXPIRED
    });
  }else if(payload === 'JsonWebTokenError'){
    return res.status(401).json({
      status:401,
      message: AUTH_MESSAGES.INVALID_AUTH
    });
  }

  const tokenData = await prisma.refreshToken.findFirst({
    where:{
      userId:payload.userId,
      token: token
    },
  }); 
  if(!tokenData){
    return res.status(400).json({
      status:400,
      message: AUTH_MESSAGES.TOKEN_END
    });
  }

  const user = await prisma.user.findUnique({
    where: {
      userId: payload.userId
    },
  });
  if(!user){
    return res.status(404).json({
      status:404,
      message: USER_MESSAGES.USER_NOT_FOUND
    });
  }

  req.user= user;
  next();
});

export { refreshMiddleware };