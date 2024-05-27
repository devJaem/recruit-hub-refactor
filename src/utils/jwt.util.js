import jwt from 'jsonwebtoken';

/* JWT payload 분해함수 */
const validateToken = async (token, key) => {
  try {
    const payload = jwt.verify(token, key);
    return payload;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return 'expired';
    } else {
      return 'TokenExpiredError';
    }
  }
};

export { validateToken };
