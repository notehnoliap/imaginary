const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');

// 加载环境变量
dotenv.config();

// 导入路由
const userRoutes = require('./api/routes/users');
const imageRoutes = require('./api/routes/images');
const albumRoutes = require('./api/routes/albums');
const commandRoutes = require('./api/routes/commands');

// 初始化 Express 应用
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 根路由 - 添加一个简单的状态检查端点
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Imaginary API 正在运行',
    version: '1.0.0'
  });
});

// 静态文件服务
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API 路由
app.use('/api/users', userRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/albums', albumRoutes);
app.use('/api/commands', commandRoutes);

// 生产环境下提供前端静态文件
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
  });
}

// WebSocket 连接处理
io.on('connection', (socket) => {
  console.log('New client connected');
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// 全局错误处理
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 连接数据库并启动服务器
const PORT = process.env.PORT || 5000;

// 启动服务器
server.listen(PORT, '0.0.0.0', () => {
  console.log(`服务器运行在端口 ${PORT}`);
  
  // 确保上传目录存在
  const uploadDirs = ['uploads', 'uploads/images'];
  uploadDirs.forEach(dir => {
    const dirPath = path.join(__dirname, dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`创建目录: ${dirPath}`);
    }
  });
  
  // 尝试连接数据库
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('MongoDB 连接成功');
  })
  .catch(err => {
    console.error('MongoDB 连接失败:', err.message);
    console.log('服务器将继续运行，但数据库功能将不可用');
  });
});

// 处理未捕获的异常
process.on('uncaughtException', err => {
  console.error('未捕获的异常:', err);
  process.exit(1);
});

// 处理未处理的Promise拒绝
process.on('unhandledRejection', (err, promise) => {
  console.error('未处理的Promise拒绝:', err);
  // 优雅地关闭服务器
  server.close(() => process.exit(1));
});

module.exports = server; 