import { beforeEach, describe, jest, test, expect } from '@jest/globals';
import UserRepository from '../../../src/repositories/user.repository.js';
import { dummyUsers } from '../../dummies/users.dummy.js';

const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
  },
};

const userRepository = new UserRepository(mockPrisma);

describe('UserRepository 유닛 테스트', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('findById 메서드 테스트', async () => {
    // GIVEN
    const userId = dummyUsers[0].userId;
    const mockReturn = dummyUsers[0];
    mockPrisma.user.findUnique.mockResolvedValue(mockReturn);

    // WHEN
    const result = await userRepository.findById(userId);

    // THEN
    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
      where: { userId },
      include: {
        userInfo: true,
      },
    });
    expect(result).toEqual(mockReturn);
  });

  test('findOne 메서드 테스트', async () => {
    // GIVEN
    const email = dummyUsers[0].email;
    const mockReturn = dummyUsers[0];
    mockPrisma.user.findFirst.mockResolvedValue(mockReturn);

    // WHEN
    const result = await userRepository.findOne(email);

    // THEN
    expect(mockPrisma.user.findFirst).toHaveBeenCalledWith({
      where: { email },
      include: {
        userInfo: true,
      },
    });
    expect(result).toEqual(mockReturn);
  });

  test('createUser 메서드 테스트', async () => {
    // GIVEN
    const email = 'newuser@example.com';
    const hashPassword = 'hashedPassword';
    const name = 'New User';
    const mockReturn = {
      ...dummyUsers[0],
      email,
      password: hashPassword,
      userInfo: {
        ...dummyUsers[0].userInfo,
        name,
      },
    };
    mockPrisma.user.create.mockResolvedValue(mockReturn);

    // WHEN
    const result = await userRepository.createUser(email, hashPassword, name);

    // THEN
    expect(mockPrisma.user.create).toHaveBeenCalledWith({
      data: {
        email,
        password: hashPassword,
        userInfo: {
          create: {
            name,
            role: 'APPLICANT',
          },
        },
      },
      include: {
        userInfo: true,
      },
    });
    expect(result).toEqual(mockReturn);
  });
});
