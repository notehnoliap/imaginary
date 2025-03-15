const ErrorResponse = require('../utils/errorResponse');

/**
 * 错误处理中间件
 */
exports.errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // 记录错误
  console.error(err);

  // Mongoose 错误处理
  
  // 无效的 ObjectId
  if (err.name === 'CastError') {
    const message = '找不到资源';
    error = new ErrorResponse(message, 404);
  }

  // 重复键错误
  if (err.code === 11000) {
    const message = '输入的值已存在';
    error = new ErrorResponse(message, 400);
  }

  // 验证错误
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = new ErrorResponse(message, 400);
  }

  // JWT 错误
  if (err.name === 'JsonWebTokenError') {
    const message = '无效的令牌';
    error = new ErrorResponse(message, 401);
  }

  // JWT 过期
  if (err.name === 'TokenExpiredError') {
    const message = '令牌已过期';
    error = new ErrorResponse(message, 401);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || '服务器错误'
  });
}; 