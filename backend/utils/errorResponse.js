/**
 * 自定义错误响应类
 * 扩展 Error 类，添加状态码
 */
class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

module.exports = ErrorResponse; 