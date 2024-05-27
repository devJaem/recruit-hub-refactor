import joi from 'joi';

/* 회원가입용 유효성 검증 */
const signupUserSchema = joi.object({
  email: joi.string().email().required().empty('')
  .messages({
    'string.email': '이메일 형식이 몰바르지 않습니다.',
    'any.required': '이메일을 입력해 주세요.'
  }),

  password: joi.string().min(6).required().empty('')
  .messages({
    'string.min' : '비밀번호는 6자리 이상이어야 합니다.',
    'any.required' : '비밀번호를 입력해 주세요.'
  }),

  checkPassword: joi.string().valid(joi.ref('password')).required().empty('')
  .messages({
    'any.only' : '입력한 두 비밀번호가 일치하지 않습니다.',
    'any.required' : '비밀번호 확인을 입력해 주세요.'
  }),

  name: joi.string().required().empty('')
  .messages({
    'any.required' : '이름을 입력해 주세요.'
  })
});

/* 로그인용 유효성 검증*/
const signinUserSchema = joi.object({
  email: joi.string().email().required().empty('')
  .messages({
    'string.email': '이메일 형식이 몰바르지 않습니다.',
    'any.required': '이메일을 입력해 주세요.'
  }),
  
  password: joi.string().min(6).required().empty('')
  .messages({
    'string.min' : '비밀번호는 6자리 이상이어야 합니다.',
    'any.required' : '비밀번호를 입력해 주세요.'
  })
});

export {
  signupUserSchema,
  signinUserSchema,
};