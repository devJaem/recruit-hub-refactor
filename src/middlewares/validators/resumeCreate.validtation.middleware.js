import Joi from 'joi';
import { MESSAGES } from '../../constants/message.constant.js';
/** 이력서 생성 joi **/
export const resumerCreatesSchema = async (req, res, next) => {
  try {
    const resumerSchema = Joi.object({
      title: Joi.string().required().empty('').messages({
        'any.required': MESSAGES.RESUMES.COMMON.TITLE.REQUIRED,
      }),

      content: Joi.string().min(150).required().empty('').messages({
        'string.min': MESSAGES.RESUMES.COMMON.CONTENT.MIN_LENGTH,
        'any.required': MESSAGES.RESUMES.COMMON.CONTENT.REQUIRED,
      }),
    });
    await resumerSchema.validateAsync(req.body);
    next();
  } catch (error) {
    next(error);
  }
};
