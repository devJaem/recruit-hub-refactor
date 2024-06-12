import { validateToken } from './require-access-token.middleware.js';
import { ENV } from '../constants/env.constant.js';
import { MESSAGES } from '../constants/message.constant.js';
import {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
} from '../errors/http.error.js';

/** RefreshToken 토큰 검증 및 재발급 미들웨어 **/
const refreshMiddleware =
  (userRepository, authRepository) => async (req, res, next) => {
    try {
      const authorizationHeader = req.headers.authorization;
      if (!authorizationHeader) {
        throw new BadRequestError(MESSAGES.AUTH.COMMON.JWT.NO_TOKEN);
      }

      const token = authorizationHeader.split(' ')[1];
      if (!token) {
        throw new UnauthorizedError(
          MESSAGES.AUTH.COMMON.JWT.NOT_SUPPORTED_TYPE
        );
      }

      const payload = await validateToken(token, ENV.REFRESH_KEY);
      if (payload === 'expired') {
        throw new UnauthorizedError(MESSAGES.AUTH.COMMON.JWT.EXPIRED);
      } else if (payload === 'JsonWebTokenError') {
        throw new UnauthorizedError(MESSAGES.AUTH.COMMON.JWT.INVALID);
      }

      const tokenData = await authRepository.findRefreshTokenByUserId(
        payload.userId
      );
      if (!tokenData) {
        throw new BadRequestError(MESSAGES.AUTH.COMMON.JWT.DISCARDED_TOKEN);
      }

      const user = await userRepository.findById(payload.userId);
      if (!user) {
        throw new NotFoundError(MESSAGES.AUTH.COMMON.JWT.NO_USER);
      }

      req.user = user;
      next();
    } catch (error) {
      next(error);
    }
  };

export { refreshMiddleware };
