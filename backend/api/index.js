const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const path = require('path');
const { errorHandler } = require('../middleware/error');

// 导入路由
const userRoutes = require('./routes/users');
const imageRoutes = require('./routes/images');
const albumRoutes = require('./routes/albums');
const commandRoutes = require('./routes/commands');

const app = express();

// 中间件
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(xss());
app.use(hpp());
app.use(morgan('dev'));

// 速率限制
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10分钟
  max: 100 // 每个IP限制100个请求
});
app.use('/api/', limiter);

// 静态文件
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// 挂载路由
app.use('/api/users', userRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/albums', albumRoutes);
app.use('/api/commands', commandRoutes);

// 错误处理中间件
app.use(errorHandler);

module.exports = app; 