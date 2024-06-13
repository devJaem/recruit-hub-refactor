import { beforeEach, describe, jest, test, expect } from '@jest/globals';
import AuthRepository from '../../../src/repositories/auth.repository.js';
import { dummyUsers, dummyRefreshTokens } from '../../dummies/users.dummy.js';

const mockPrisma = {
  refreshToken: {
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    upsert: jest.fn(),
  },
};

const authRepository = new AuthRepository(mockPrisma);

describe('AuthRepository 유닛 테스트', () => {
  beforeEach(() => {
    jest.resetAllMocks(); 
  });

  test('사용자 ID로 리프레시 토큰 찾기', async () => {
    // GIVEN
    const userId = dummyUsers[0].userId;
    const mockReturn = dummyRefreshTokens[0];
    mockPrisma.refreshToken.findFirst.mockResolvedValue(mockReturn);

    // WHEN
    const result = await authRepository.findRefreshTokenByUserId(userId);

    // THEN
    expect(mockPrisma.refreshToken.findFirst).toHaveBeenCalledWith({
      where: { userId },
    });
    expect(result).toEqual(mockReturn);
  });

  test('토큰 업데이트 또는 생성', async () => {
    // GIVEN
    const userId = dummyUsers[0].userId;
    const token = 'new-token';
    const mockExistingToken = dummyRefreshTokens[0];
    mockPrisma.refreshToken.findFirst.mockResolvedValue(mockExistingToken);
    mockPrisma.refreshToken.update.mockResolvedValue({
      ...mockExistingToken,
      token,
    });

    // WHEN
    const result = await authRepository.updateOrCreateToken(userId, token);

    // THEN
    expect(mockPrisma.refreshToken.findFirst).toHaveBeenCalledWith({
      where: { userId },
    });
    expect(mockPrisma.refreshToken.update).toHaveBeenCalledWith({
      where: { tokenId: mockExistingToken.tokenId },
      data: { token },
    });
    expect(result).toEqual({ ...mockExistingToken, token });
  });

  test('사용자 ID로 토큰 삭제', async () => {
    // GIVEN
    const userId = dummyUsers[2].userId;
    const mockExistingToken = dummyRefreshTokens[2];
    mockPrisma.refreshToken.findFirst.mockResolvedValue(mockExistingToken);
    mockPrisma.refreshToken.delete.mockResolvedValue(mockExistingToken);

    // WHEN
    const result = await authRepository.deleteTokenByUserId(userId);

    // THEN
    expect(mockPrisma.refreshToken.findFirst).toHaveBeenCalledWith({
      where: { userId },
    });
    expect(mockPrisma.refreshToken.delete).toHaveBeenCalledWith({
      where: { tokenId: mockExistingToken.tokenId },
    });
    expect(result).toEqual({ tokenId: mockExistingToken.tokenId });
  });

  test('토큰 업데이트', async () => {
    // GIVEN
    const userId = dummyUsers[0].userId;
    const token = 'new-token';
    const mockReturn = {
      ...dummyRefreshTokens[0],
      token,
    };
    mockPrisma.refreshToken.upsert.mockResolvedValue(mockReturn);

    // WHEN
    const result = await authRepository.updateToken(userId, token);

    // THEN
    expect(mockPrisma.refreshToken.upsert).toHaveBeenCalledWith({
      where: { userId },
      update: { token },
      create: { userId, token },
    });
    expect(result).toEqual(mockReturn);
  });
});
