import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import AuthController from '../../../src/controllers/auth.controller.js'; 
import { HTTP_STATUS } from '../../../src/constants/http-status.constant.js';
import { MESSAGES } from '../../../src/constants/message.constant.js';
import { ConflictError, UnauthorizedError } from '../../../src/errors/http.error.js';
import { dummyUsers } from '../../dummies/users.dummy.js'; 

const mockAuthService = {
  signUp: jest.fn(),
  signIn: jest.fn(),
};

let mockRequest;
let mockResponse;
let mockNext;

const authController = new AuthController(mockAuthService);

describe('AuthController 유닛 테스트', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    
    mockRequest = {
      body: {},
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockNext = jest.fn();
  });

  test('회원가입 성공', async () => {
    const createUser = {
      email: 'newuser@example.com',
      password: 'password123',
      name: 'New User',
    };
    const mockUser = {
      userId: 4,
      email: 'newuser@example.com',
      name: 'New User',
      role: 'APPLICANT',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockRequest.body = createUser;
    mockAuthService.signUp.mockResolvedValue(mockUser);

    await authController.signUp(mockRequest, mockResponse, mockNext);

    expect(mockAuthService.signUp).toHaveBeenCalledWith(createUser);
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_STATUS.CREATED);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: HTTP_STATUS.CREATED,
      message: MESSAGES.AUTH.SIGN_UP.SUCCEED,
      data: mockUser,
    });
  });

  test('회원가입 중복 에러', async () => {
    const createUser = {
      email: dummyUsers[0].email,
      password: 'password123',
      name: 'Existing User',
    };
    mockRequest.body = createUser;
    mockAuthService.signUp.mockRejectedValue(new ConflictError(MESSAGES.AUTH.COMMON.EMAIL.DUPLICATED));

    await authController.signUp(mockRequest, mockResponse, mockNext);

    expect(mockAuthService.signUp).toHaveBeenCalledWith(createUser);
    expect(mockNext).toHaveBeenCalledWith(new ConflictError(MESSAGES.AUTH.COMMON.EMAIL.DUPLICATED));
  });

  test('로그인 성공', async () => {
    const loginUser = {
      email: dummyUsers[0].email,
      password: 'password123',
    };
    const tokens = {
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    };
    mockRequest.body = loginUser;
    mockAuthService.signIn.mockResolvedValue(tokens);

    await authController.signIn(mockRequest, mockResponse, mockNext);

    expect(mockAuthService.signIn).toHaveBeenCalledWith(loginUser);
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: HTTP_STATUS.OK,
      message: MESSAGES.AUTH.SIGN_IN.SUCCEED,
      data: tokens,
    });
  });

  test('로그인 실패 - 사용자 없음', async () => {
    const loginUser = {
      email: 'nonexistentuser@example.com',
      password: 'password123',
    };
    mockRequest.body = loginUser;
    mockAuthService.signIn.mockRejectedValue(new UnauthorizedError(MESSAGES.AUTH.COMMON.UNAUTHORIZED));

    await authController.signIn(mockRequest, mockResponse, mockNext);

    expect(mockAuthService.signIn).toHaveBeenCalledWith(loginUser);
    expect(mockNext).toHaveBeenCalledWith(new UnauthorizedError(MESSAGES.AUTH.COMMON.UNAUTHORIZED));
  });
});
