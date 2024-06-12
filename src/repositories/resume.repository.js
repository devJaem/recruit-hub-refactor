class ResumeRepository {
  constructor(prisma){
    this.prisma = prisma;
  }

  async createResume(userId, resumeData) {
    return await this.prisma.resume.create({
      data: {
        userId: userId,
        title: resumeData.title,
        content: resumeData.content,
        resumeStatus: 'apply',
      },
    });
  }

  async createResumeLog(resumeId, recruiterId, oldStatus, newStatus, reason) {
    return await this.prisma.resumeLog.create({
      data: {
        resumeId: resumeId,
        recruiterId: recruiterId,
        oldStatus: oldStatus,
        newStatus: newStatus,
        reason: reason,
      },
    });
  }

  async getAllResumes(whereClause, sortBy, order) {
    return await this.prisma.resume.findMany({
      where: whereClause,
      orderBy: {
        [sortBy]: order,
      },
      select: {
        resumeId: true,
        userId: true,
        user: { select: { userInfo: { select: { name: true } } } },
        title: true,
        content: true,
        resumeStatus: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async getResumeDetail(resumeId) {
    return await this.prisma.resume.findFirst({
      where: { resumeId: parseInt(resumeId) },
      include: {
        user: {
          select: {
            userInfo: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
  }

  async updateResume(resumeId, resumeData) {
    return await this.prisma.resume.update({
      where: {
        resumeId: parseInt(resumeId),
      },
      data: resumeData,
      include: {
        user: {
          select: {
            userInfo: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
  }

  async deleteResume(resumeId) {
    return await this.prisma.resume.delete({
      where: {
        resumeId: parseInt(resumeId),
      },
    });
  }

  async getResumeLogs(resumeId) {
    return await this.prisma.resumeLog.findMany({
      where: { resumeId: parseInt(resumeId) },
      orderBy: { changedAt: 'desc' },
      select: {
        resumeHistoryId: true,
        resumeId: true,
        oldStatus: true,
        newStatus: true,
        reason: true,
        changedAt: true,
        recruiter: {
          select: {
            userInfo: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
  }
}

export default ResumeRepository;
