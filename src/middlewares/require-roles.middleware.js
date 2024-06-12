import { MESSAGES } from '../constants/message.constant.js';
import { ForbiddenError } from '../errors/http.error.js';

const requireRoles = (allowedRoles) => {
  return (req, res, next) => {
    try {
      const userRole = req.user.role;
      if (!allowedRoles.includes(userRole)) {
        throw new ForbiddenError(MESSAGES.AUTH.COMMON.FORBIDDEN);
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

export { requireRoles };
