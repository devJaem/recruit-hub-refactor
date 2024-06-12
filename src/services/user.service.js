import jwt from 'jsonwebtoken';
import { ENV } from '../constants/env.constant.js';
import { MESSAGES } from '../constants/message.constant.js';
import { NotFoundError, UnauthorizedError, BadRequestError } from '../errors/http.error.js';

class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  getUserProfile = async (userId) => {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError(MESSAGES.AUTH.COMMON.JWT.NO_USER);
    }
    const { email, userInfo, createdAt, updatedAt } = user;
    return {
      userId,
      email,
      name: userInfo.name,
      role: userInfo.role,
      createdAt,
      updatedAt,
    };
  };

  generateTokens = async (userId) => {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedError(MESSAGES.AUTH.COMMON.UNAUTHORIZED);
    }

    const accessToken = jwt.sign(
      { userId: user.userId, role: user.userInfo.role },
      ENV.ACCESS_KEY,
      { expiresIn: ENV.ACCESS_TIME }
    );

    const refreshToken = jwt.sign(
      { userId: user.userId, role: user.userInfo.role },
      ENV.REFRESH_KEY,
      { expiresIn: ENV.REFRESH_TIME }
    );

    await this.userRepository.updateOrCreateToken(user.userId, refreshToken);

    return { accessToken, refreshToken };
  };

  deleteToken = async (userId) => {
    const result = await this.userRepository.deleteTokenByUserId(userId);
    if (!result) {
      throw new BadRequestError(MESSAGES.AUTH.COMMON.JWT.NO_USER);
    }
    return result;
  };
}

export default UserService;
