import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ENV } from '../constants/env.constant.js';
import { MESSAGES } from '../constants/message.constant.js';
import { UnauthorizedError, ConflictError } from '../errors/http.error.js';

class AuthService {
  constructor(userRepository, authRepository) {
    this.userRepository = userRepository;
    this.authRepository = authRepository;
  }

  signUp = async (createUser) => {
    const existingUser = await this.userRepository.findOne(createUser.email);
    if (existingUser) {
      throw new ConflictError(MESSAGES.AUTH.COMMON.EMAIL.DUPLICATED);
    }

    const hashPassword = await bcrypt.hash(createUser.password, parseInt(ENV.HASH_ROUND));
    const newUser = await this.userRepository.createUser(createUser.email, hashPassword, createUser.name);

    const { userId, email, createdAt, updatedAt, userInfo } = newUser;
    const { name, role } = userInfo;

    return {
      userId,
      email,
      name,
      role,
      createdAt,
      updatedAt,
    };
  };

  signIn = async (loginUser) => {
    const user = await this.userRepository.findOne(loginUser.email);
    if (!user) {
      throw new UnauthorizedError(MESSAGES.AUTH.COMMON.UNAUTHORIZED);
    }

    const match = await bcrypt.compare(loginUser.password, user.password);
    if (!match) {
      throw new UnauthorizedError(MESSAGES.AUTH.COMMON.UNAUTHORIZED);
    }

    const accessToken = jwt.sign(
      {
        userId: user.userId,
        role: user.userInfo.role,
      },
      ENV.ACCESS_KEY,
      {
        expiresIn: ENV.ACCESS_TIME,
      }
    );

    const refreshToken = jwt.sign(
      {
        userId: user.userId,
        role: user.userInfo.role,
      },
      ENV.REFRESH_KEY,
      {
        expiresIn: ENV.REFRESH_TIME,
      }
    );

    await this.authRepository.updateOrCreateToken(user.userId, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  };
}

export default AuthService;