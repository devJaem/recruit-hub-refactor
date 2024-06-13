import { beforeEach, describe, jest, test, expect } from '@jest/globals';
import jwt from 'jsonwebtoken';
import UserService from '../../../src/services/user.service.js';
import { dummyUsers } from '../../dummies/users.dummy.js';
import { ACCESS_TOKEN_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_IN } from '../../../src/constants/auth.constant.js';

// Mock repositories
const mockUserRepository = {
  findById: jest.fn(),
};

const mockAuthRepository = {
  updateOrCreateToken: jest.fn(),
  deleteTokenByUserId: jest.fn(),
};

// Instantiate the service with the mocked repositories
const userService = new UserService(mockUserRepository, mockAuthRepository);

describe('UserService 유닛 테스트', () => {
  beforeEach(() => {
    jest.resetAllMocks(); // 매 테스트 전에 모든 모의를 초기화합니다.
  });

  test('getUserProfile 메서드 성공 케이스', async () => {
    // GIVEN
    const userId = dummyUsers[0].userId;
    const mockReturn = dummyUsers[0];
    mockUserRepository.findById.mockResolvedValue(mockReturn);

    // WHEN
    const result = await userService.getUserProfile(userId);

    // THEN
    expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
    expect(result).toEqual({
      userId,
      email: mockReturn.email,
      name: mockReturn.userInfo.name,
      role: mockReturn.userInfo.role,
      createdAt: mockReturn.createdAt,
      updatedAt: mockReturn.updatedAt,
    });
  });

  test('generateTokens 메서드 성공 케이스', async () => {
    // GIVEN
    const userId = dummyUsers[0].userId;
    const mockReturn = dummyUsers[0];
    mockUserRepository.findById.mockResolvedValue(mockReturn);
    jest.spyOn(jwt, 'sign').mockImplementation((payload, secret, options) => `mockedToken-${payload.userId}-${options.expiresIn}`);

    // WHEN
    const result = await userService.generateTokens(userId);

    // THEN
    expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
    expect(mockAuthRepository.updateOrCreateToken).toHaveBeenCalledWith(userId, expect.any(String));
    expect(result).toEqual({
      accessToken: `mockedToken-${userId}-${ACCESS_TOKEN_EXPIRES_IN}`,
      refreshToken: `mockedToken-${userId}-${REFRESH_TOKEN_EXPIRES_IN}`,
    });
  });

  test('deleteToken 메서드 성공 케이스', async () => {
    // GIVEN
    const userId = dummyUsers[0].userId;
    const mockReturn = { tokenId: 1 };
    mockAuthRepository.deleteTokenByUserId.mockResolvedValue(mockReturn);

    // WHEN
    const result = await userService.deleteToken(userId);

    // THEN
    expect(mockAuthRepository.deleteTokenByUserId).toHaveBeenCalledWith(userId);
    expect(result).toEqual(mockReturn);
  });
});
