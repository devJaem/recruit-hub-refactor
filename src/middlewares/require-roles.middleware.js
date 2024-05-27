import { RESUME_MESSAGES } from '../constants/resume.constant.js';

const requireRoles = (roles) => {
  return (req, res, next) => {
    const userRoles = req.user.userInfo.role;
    const allowed = roles.includes(userRoles);

    if (!allowed) {
      return res.status(403).json({
        status: 403,
        message: RESUME_MESSAGES.ACCESS_DENIED,
      });
    }
    next();
  };
};

export { requireRoles };
