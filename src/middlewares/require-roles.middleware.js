import { MESSAGES } from '../constants/message.constant.js';
const requireRoles = (allowedRoles) => {
  return (req, res, next) => {
    const userRoles = req.user.role;
    const allowed = allowedRoles.some((role) => userRoles.includes(role));
    if (!allowed) {
      return res.status(403).json({ message: MESSAGES.AUTH.COMMON.FORBIDDEN });
    }
    next();
  };
};

export { requireRoles };