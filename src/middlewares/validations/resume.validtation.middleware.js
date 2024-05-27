import joi from 'joi';

/* 이력서 작성용 유효성 검증 */
const resumeCreateSchema = joi.object({
  title: joi.string().required().empty('')
  .messages({
    'any.required': '이력서 제목을 입력해주세요.',
  }),

  content: joi.string().min(150).required().empty('')
  .messages({
    'string.min': '자기소개는 150자 이상 작성해야 합니다.',
    'any.required': '자기소개를 입력해 주세요.',
  }),
});

/* 이력서 수정용 유효성 검증 */
const resumeUpdateSchema = joi.object({
  title: joi.string().empty('').messages({
    'string.empty': '이력서 제목을 입력해주세요.'
  }),
  content: joi.string().min(150).empty('').messages({
    'string.min': '자기소개는 150자 이상 작성해야 합니다.',
    'string.empty': '자기소개를 입력해 주세요.'
  })
}).or('title', 'content').messages({
  'object.missing': '수정할 정보를 입력해 주세요.'
});

/* 이력서 History 생성 유효성 검증 */
const resumerLogSchema = joi.object({
  resumeStatus: joi.string().required().empty('').messages({
    'any.required': '변경하고자 하는 지원 상태를 입력해 주세요.',
    'string.empty': '변경하고자 하는 지원 상태를 입력해 주세요.'
  }),
  
  reason: joi.string().required().empty('').messages({
    'any.required': '지원 상태 변경 사유를 입력해 주세요.',
    'string.empty': '지원 상태 변경 사유를 입력해 주세요.'
  })
}).or('resumeStatus', 'reason');

/* 유효성 검증 미들웨어 생성 함수 */
const createValidationMiddleware = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.validateAsync(req.body);
      next();
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
};

const validateResumeCreate = createValidationMiddleware(resumeCreateSchema);
const validateResumeUpdate = createValidationMiddleware(resumeUpdateSchema);
const validateResumeLog = createValidationMiddleware(resumerLogSchema);

export {
  validateResumeCreate,
  validateResumeUpdate,
  validateResumeLog,
};