class UserRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  findById = async (userId) => {
    return await this.prisma.user.findUnique({
      where: { userId: userId },
      include:{
        userInfo: true,
      },
    });
  };

  findOne = async (email) => {
    return await this.prisma.user.findFirst({
      where: { email },
      include: {
        userInfo: true,
      },
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
            role: "APPLICANT",
          },
        },
      },
      include: {
        userInfo: true,
      },
    });
  };
}

export default UserRepository;
