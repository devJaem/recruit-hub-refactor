import { MESSAGES } from '../constants/message.constant.js';
import { ForbiddenError } from '../errors/http.error.js';

const requireRoles = (allowedRoles) => {
  return (req, res, next) => {
    try {
      const user = req.user
      if (!allowedRoles.includes(user)) {
        throw new ForbiddenError(MESSAGES.AUTH.COMMON.FORBIDDEN);
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

export { requireRoles };
