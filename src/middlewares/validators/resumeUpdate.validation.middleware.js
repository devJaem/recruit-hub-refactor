import Joi from 'joi';
import { MESSAGES } from '../../constants/message.constant.js';
/** 이력서 업데이트 joi **/
export const resumerUpdateSchema = async(req, res, next)=>{
  try{
    const resumerSchema = Joi.object({
      title: Joi.string()
      .required()    
      .empty('')
      .messages({
        'any.required': MESSAGES.RESUMES.COMMON.TITLE.REQUIRED
      }),
    
      content: Joi.string()
      .min(150)
      .required()
      .empty('')
      .messages({
        'string.min': MESSAGES.RESUMES.COMMON.CONTENT.MIN_LENGTH,
        'any.required': MESSAGES.RESUMES.COMMON.CONTENT.REQUIRED
      })
    }).messages({
      'object.or': MESSAGES.RESUMES.UPDATE.NO_BODY_DATA
    });
    await resumerSchema.validateAsync(req.body);
    next();
  }catch (error){
    next(error)
  }
}