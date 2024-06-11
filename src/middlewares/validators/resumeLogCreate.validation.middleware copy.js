import Joi from 'joi';
import { MESSAGES } from '../../constants/message.constant.js';
import { RESUME_STATUS } from '../../constants/resume.constant.js';

/** 이력서 로그 생성 joi**/
export const resumerLogSchema = async (req, res, next) => {
  try {
    const schema = Joi.object({
      resumeStatus: Joi.string()
        .required()
        .valid(...Object.values(RESUME_STATUS))
        .messages({
          'any.required': MESSAGES.RESUMES.UPDATE.STATUS.NO_STATUS,
          'any.only': MESSAGES.RESUMES.UPDATE.STATUS.INVALID_STATUS,
        }),
      reason: Joi.string().required().messages({
        'any.required': MESSAGES.RESUMES.UPDATE.STATUS.NO_REASON,
      }),
    });

    await schema.validateAsync(req.body);
    next();
  } catch (error) {
    next(error);
  }
};