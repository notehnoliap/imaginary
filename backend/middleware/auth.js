const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

// 保护路由
exports.protect = async (req, res, next) => {
  let token;

  // 从请求头或Cookie中获取令牌
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // 从请求头中获取令牌
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    // 从Cookie中获取令牌
    token = req.cookies.token;
  }

  // 检查令牌是否存在
  if (!token) {
    return next(new ErrorResponse('未授权访问', 401));
  }

  try {
    // 验证令牌
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 获取用户
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return next(new ErrorResponse('未找到用户', 404));
    }

    next();
  } catch (err) {
    return next(new ErrorResponse('未授权访问', 401));
  }
};

// 授权角色
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ErrorResponse(`用户角色 ${req.user.role} 无权访问此路由`, 403));
    }
    next();
  };
}; 