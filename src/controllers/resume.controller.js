import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';

class ResumeController {
  constructor(resumeService) {
    this.resumeService = resumeService;
  }

  createResume = async (req, res, next) => {
    try {
      const { userId } = req.user;
      const resumeData = req.body;
      const result = await this.resumeService.createResume(userId, resumeData);
      return res.status(HTTP_STATUS.CREATED).json({
        status: HTTP_STATUS.CREATED,
        message: MESSAGES.RESUMES.CREATE.SUCCEED,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  getAllResumes = async (req, res, next) => {
    try {
      const { userId, userInfo } = req.user;
      let { sortBy = 'createdAt', order = 'desc', status } = req.query;
      const resumes = await this.resumeService.getAllResumes(userId, userInfo, sortBy, order, status);
      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.RESUMES.READ_LIST.SUCCEED,
        data: resumes,
      });
    } catch (error) {
      next(error);
    }
  };

  getResumeDetail = async (req, res, next) => {
    try {
      const { userId, userInfo } = req.user;
      const { resumeId } = req.params;
      const resume = await this.resumeService.getResumeDetail(userId, userInfo, resumeId);
      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.RESUMES.READ_DETAIL.SUCCEED,
        data: resume,
      });
    } catch (error) {
      next(error);
    }
  };

  updateResume = async (req, res, next) => {
    try {
      const resumeData = req.body;
      const { userId } = req.user;
      const { resumeId } = req.params;
      const updatedResume = await this.resumeService.updateResume(userId, resumeId, resumeData);
      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.RESUMES.UPDATE.SUCCEED,
        data: updatedResume,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteResume = async (req, res, next) => {
    try {
      const { userId } = req.user;
      const { resumeId } = req.params;
      const result = await this.resumeService.deleteResume(userId, resumeId);
      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.RESUMES.DELETE.SUCCEED,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  updateResumeStatus = async (req, res, next) => {
    try {
      const { userId } = req.user;
      const { resumeId } = req.params;
      const { resumeStatus, reason } = req.body;
      const result = await this.resumeService.updateResumeStatus(userId, resumeId, resumeStatus, reason);
      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.RESUMES.UPDATE.STATUS.SUCCEED,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  getResumeLogs = async (req, res, next) => {
    try {
      const { resumeId } = req.params;
      const logs = await this.resumeService.getResumeLogs(resumeId);
      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.RESUMES.READ_LIST.LOG.SUCCEED,
        data: logs,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default ResumeController;
