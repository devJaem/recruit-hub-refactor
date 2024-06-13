import { beforeEach, describe, jest, test, expect } from '@jest/globals';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import AuthService from '../../../src/services/auth.service.js';
import { dummyUsers } from '../../dummies/users.dummy.js';
import { UnauthorizedError, ConflictError } from '../../../src/errors/http.error.js';
import { MESSAGES } from '../../../src/constants/message.constant.js';
import { ACCESS_TOKEN_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_IN } from '../../../src/constants/auth.constant.js';

const mockAuthRepository = {
  findRefreshTokenByUserId: jest.fn(),
  updateOrCreateToken: jest.fn(),
  deleteTokenByUserId: jest.fn(),
  updateToken: jest.fn(),
};

const mockUserRepository = {
  findById: jest.fn(),
  findOne: jest.fn(),
  createUser: jest.fn(),
};

const authService = new AuthService(mockAuthRepository, mockUserRepository);

describe('AuthService 유닛 테스트', () => {
  beforeEach(() => {
    jest.resetAllMocks(); // 매 테스트 전에 모든 모의를 초기화합니다.
  });

  test('회원가입 성공 케이스', async () => {
    // GIVEN
    const createUser = {
      email: 'newuser@example.com',
      password: 'password123',
      name: 'New User',
    };
    const mockCreatedUser = {
      ...dummyUsers[0],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockUserRepository.findOne.mockResolvedValue(null);
    mockUserRepository.createUser.mockResolvedValue(mockCreatedUser);
    bcrypt.hash = jest.fn().mockResolvedValue('hashedPassword');

    // WHEN
    const result = await authService.signUp(createUser);

    // THEN
    expect(mockUserRepository.findOne).toHaveBeenCalledWith(createUser.email);
    expect(mockUserRepository.createUser).toHaveBeenCalledWith(
      createUser.email,
      'hashedPassword',
      createUser.name
    );
    expect(result).toMatchObject({
      userId: mockCreatedUser.userId,
      email: mockCreatedUser.email,
      name: mockCreatedUser.userInfo.name,
      role: mockCreatedUser.userInfo.role,
    });
  });

  test('회원가입 중복 에러 케이스', async () => {
    // GIVEN
    const createUser = {
      email: 'existinguser@example.com',
      password: 'password123',
      name: 'Existing User',
    };
    mockUserRepository.findOne.mockResolvedValue(dummyUsers[0]);

    // WHEN & THEN
    await expect(authService.signUp(createUser)).rejects.toThrow(ConflictError);
    await expect(authService.signUp(createUser)).rejects.toThrow(MESSAGES.AUTH.COMMON.EMAIL.DUPLICATED);
  });

  test('로그인 성공 케이스', async () => {
    // GIVEN
    const loginUser = {
      email: dummyUsers[0].email,
      password: 'password123',
    };
    mockUserRepository.findOne.mockResolvedValue(dummyUsers[0]);
    bcrypt.compare = jest.fn().mockResolvedValue(true);
    jwt.sign = jest.fn().mockImplementation((payload, secret, options) => `mockedToken-${payload.userId}-${options.expiresIn}`);

    // WHEN
    const result = await authService.signIn(loginUser);

    // THEN
    expect(mockUserRepository.findOne).toHaveBeenCalledWith(loginUser.email);
    expect(bcrypt.compare).toHaveBeenCalledWith(loginUser.password, dummyUsers[0].password);
    expect(mockAuthRepository.updateOrCreateToken).toHaveBeenCalledWith(dummyUsers[0].userId, expect.any(String));
    expect(result).toEqual({
      accessToken: `mockedToken-${dummyUsers[0].userId}-${ACCESS_TOKEN_EXPIRES_IN}`,
      refreshToken: `mockedToken-${dummyUsers[0].userId}-${REFRESH_TOKEN_EXPIRES_IN}`,
    });
  });

  test('로그인 실패 케이스 - 사용자 없음', async () => {
    // GIVEN
    const loginUser = {
      email: 'nonexistentuser@example.com',
      password: 'password123',
    };
    mockUserRepository.findOne.mockResolvedValue(null);

    // WHEN & THEN
    await expect(authService.signIn(loginUser)).rejects.toThrow(UnauthorizedError);
    await expect(authService.signIn(loginUser)).rejects.toThrow(MESSAGES.AUTH.COMMON.UNAUTHORIZED);
  });

  test('로그인 실패 케이스 - 비밀번호 불일치', async () => {
    // GIVEN
    const loginUser = {
      email: dummyUsers[0].email,
      password: 'wrongpassword',
    };
    mockUserRepository.findOne.mockResolvedValue(dummyUsers[0]);
    bcrypt.compare = jest.fn().mockResolvedValue(false);

    // WHEN & THEN
    await expect(authService.signIn(loginUser)).rejects.toThrow(UnauthorizedError);
    await expect(authService.signIn(loginUser)).rejects.toThrow(MESSAGES.AUTH.COMMON.UNAUTHORIZED);
  });
});
