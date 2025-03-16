# Imaginary - 图片管理应用

一个现代化的图片管理系统，使用React和Node.js构建。

## 功能特点

- 图片上传和管理
- 相册创建和组织
- 用户认证和授权
- 响应式设计，适配各种设备
- 简洁直观的用户界面

## 技术栈

### 前端
- React
- React Router
- Tailwind CSS
- Heroicons

### 后端
- Node.js
- Express
- MongoDB
- JWT认证

## 安装和运行

### 前提条件
- Node.js (v14+)
- MongoDB

### 安装步骤

1. 克隆仓库
   ```bash
   git clone https://github.com/notehnoliap/imaginary.git
   cd imaginary
   ```

2. 安装依赖
   ```bash
   # 安装项目根目录依赖
   npm install
   
   # 安装后端依赖
   cd backend
   npm install
   npm install socket.io
   
   # 安装前端依赖
   cd ../frontend
   npm install
   ```

3. 配置环境变量
   在backend目录下创建.env文件，添加以下内容：
   ```
   MONGO_URI=mongodb://localhost:27017/imaginary
   JWT_SECRET=your_jwt_secret
   PORT=5002
   ```

4. 启动MongoDB服务
   ```bash
   # 如果MongoDB尚未启动，请先启动MongoDB服务
   # macOS用户
   brew services start mongodb-community
   
   # Linux用户
   sudo systemctl start mongod
   
   # Windows用户
   # 从服务菜单启动MongoDB服务
   ```

5. 运行应用
   ```bash
   # 启动后端服务（在backend目录下）
   cd backend
   npm run dev
   
   # 在新的终端窗口启动前端服务（在frontend目录下）
   cd frontend
   npm start
   ```
   
   后端服务将在 http://localhost:5002 上运行
   前端服务将在 http://localhost:3000 上运行（如果端口被占用，会自动使用其他端口）

6. 常见问题处理
   - 如果遇到"port already in use"（端口已被占用）错误：
     ```bash
     # 查找并杀死占用端口的进程
     # 对于macOS/Linux
     lsof -i :5002  # 或其他被占用的端口
     kill -9 <PID>  # 替换<PID>为上一步找到的进程ID
     
     # 对于Windows
     netstat -ano | findstr :5002  # 或其他被占用的端口
     taskkill /PID <PID> /F  # 替换<PID>为上一步找到的进程ID
     ```
   
   - 如果遇到MongoDB连接问题：
     1. 确保MongoDB服务正在运行
     2. 检查连接字符串是否正确
     3. 检查MongoDB版本是否与项目兼容

## 项目结构

```
imaginary/
├── frontend/            # 前端React应用
│   ├── public/          # 静态资源
│   └── src/             # 源代码
│       ├── components/  # React组件
│       ├── pages/       # 页面组件
│       ├── services/    # API服务
│       └── App.js       # 主应用组件
├── backend/             # 后端Node.js/Express应用
│   ├── controllers/     # 请求处理控制器
│   ├── middleware/      # 中间件
│   ├── models/          # 数据模型
│   ├── routes/          # API路由
│   └── server.js        # 服务器入口文件
└── README.md            # 项目说明文档
```

## 贡献

欢迎贡献代码、报告问题或提出改进建议。

## 许可证

MIT