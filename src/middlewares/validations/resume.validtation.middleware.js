import joi from 'joi';

/* 이력서 작성용 유효성 검증 */
const resumeCreateSchema = joi.object({
  title: Joi.string().required().empty('')
  .messages({
    'any.required': '이력서 제목을 입력해주세요.',
  }),

  content: Joi.string().min(150).required().empty('')
  .messages({
    'string.min': '자기소개는 150자 이상 작성해야 합니다.',
    'any.required': '자기소개를 입력해 주세요.',
  }),
});

/* 이력서 수정용 유효성 검증 */
const resumeUpdateSchema = joi.object({
  title: Joi.string().required().empty('')
    .messages({
      'any.required': '이력서 제목을 입력해주세요.'
    }),

  content: Joi.string()
    .min(150).required().empty('')
    .messages({
      'string.min': '자기소개는 150자 이상 작성해야 합니다.',
      'any.required': '자기소개를 입력해 주세요.'
    })
}).messages({
  'object.or': '수정할 정보를 입력해 주세요.'
});

export {
  resumeCreateSchema,
  resumeUpdateSchema,
};