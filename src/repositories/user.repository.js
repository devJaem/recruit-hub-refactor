class UserRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  findById = async (userId) => {
    return await this.prisma.user.findUnique({
      where: { userId: userId },
    });
  };

  findRefreshTokenByUserId = async (userId) => {
    return await this.prisma.refreshToken.findFirst({
      where: { userId },
    });
  };

  updateOrCreateToken = async (userId, token) => {
    const existingToken = await this.prisma.refreshToken.findFirst({
      where: { userId },
    });
    if (existingToken) {
      return await this.prisma.refreshToken.update({
        where: { tokenId: existingToken.tokenId },
        data: { token },
      });
    } else {
      return await this.prisma.refreshToken.create({
        data: { userId, token },
      });
    }
  };

  deleteTokenByUserId = async (userId) => {
    const existingToken = await this.prisma.refreshToken.findFirst({
      where: { userId },
    });
    if (existingToken) {
      await this.prisma.refreshToken.delete({
        where: { tokenId: existingToken.tokenId },
      });
      return { tokenId: existingToken.tokenId };
    }
    return null;
  };

  findOne = async (email) => {
    return await this.prisma.user.findFirst({
      where: { email },
    });
  };

  createUser = async (email, hashPassword, name) => {
    return await this.prisma.user.create({
      data: {
        email,
        password: hashPassword,
        userInfo: {
          create: {
            name,
            role: "APPLICANT", // 기본 역할을 APPLICANT로 설정
          },
        },
      },
    });
  };

  updateToken = async (userId, token) => {
    return await this.prisma.refreshToken.upsert({
      where: { userId: userId },
      update: { token },
      create: { userId, token },
    });
  };
}

export default UserRepository;