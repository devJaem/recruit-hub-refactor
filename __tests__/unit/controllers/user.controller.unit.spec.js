import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import UserController from '../../../src/controllers/user.controller.js';
import { HTTP_STATUS } from '../../../src/constants/http-status.constant.js';
import { MESSAGES } from '../../../src/constants/message.constant.js';
import { dummyUsers, dummyRefreshTokens } from '../../dummies/users.dummy.js'; 

const mockUserService = {
  getUserProfile: jest.fn(),
  generateTokens: jest.fn(),
  deleteToken: jest.fn(),
};

let mockRequest;
let mockResponse;
let mockNext;

const userController = new UserController(mockUserService);

describe('UserController 유닛 테스트', () => {
  beforeEach(() => {
    jest.resetAllMocks();

    mockRequest = {
      user: { userId: 1 },
      body: {},
      params: {},
      query: {},
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockNext = jest.fn();
  });

  test('getProfile 성공', async () => {
    const user = dummyUsers[0];
    mockUserService.getUserProfile.mockResolvedValue(user);

    await userController.getProfile(mockRequest, mockResponse, mockNext);

    expect(mockUserService.getUserProfile).toHaveBeenCalledWith(1);
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: HTTP_STATUS.OK,
      message: MESSAGES.USERS.READ_ME.SUCCEED,
      data: user,
    });
  });

  test('refreshToken 성공', async () => {
    const tokens = {
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token',
    };
    mockUserService.generateTokens.mockResolvedValue(tokens);

    await userController.refreshToken(mockRequest, mockResponse, mockNext);

    expect(mockUserService.generateTokens).toHaveBeenCalledWith(1);
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: HTTP_STATUS.OK,
      message: MESSAGES.AUTH.TOKEN.SUCCEED,
      data: tokens,
    });
  });

  test('logout 성공', async () => {
    const result = { success: true };
    mockUserService.deleteToken.mockResolvedValue(result);

    await userController.logout(mockRequest, mockResponse, mockNext);

    expect(mockUserService.deleteToken).toHaveBeenCalledWith(1);
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: HTTP_STATUS.OK,
      message: MESSAGES.AUTH.SIGN_OUT.SUCCEED,
      data: result,
    });
  });
});