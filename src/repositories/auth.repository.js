class AuthRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

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

  updateToken = async (userId, token) => {
    return await this.prisma.refreshToken.upsert({
      where: { userId: userId },
      update: { token },
      create: { userId, token },
    });
  };
}

export default AuthRepository;
