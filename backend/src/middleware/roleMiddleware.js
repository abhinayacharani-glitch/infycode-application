/**
 * checkRole - Generic RBAC middleware
 * Usage: checkRole(['admin'])  or  checkRole(['admin', 'trainer'])
 *
 * Must be used AFTER verifyToken so that req.user is populated.
 */
export const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role(s): ${allowedRoles.join(", ")}`,
      });
    }
    next();
  };
};