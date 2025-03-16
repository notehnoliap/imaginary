const dotenv = require('dotenv');

// 加载环境变量
dotenv.config();

module.exports = {
  mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/imaginary',
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret_key',
  jwtExpire: process.env.JWT_EXPIRE || '30d',
  jwtCookieExpire: process.env.JWT_COOKIE_EXPIRE || 30,
  uploadPath: process.env.UPLOAD_PATH || 'uploads',
  maxFileSize: process.env.MAX_FILE_SIZE || 10485760, // 10MB
  clientURL: process.env.CLIENT_URL || 'http://localhost:3000'
}; 