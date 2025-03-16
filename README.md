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

### 安装步骤（按操作系统）

#### 通用步骤（所有操作系统）

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

#### Windows 系统

1. 安装 Node.js
   - 访问 [Node.js官网](https://nodejs.org/)
   - 下载并安装最新的LTS版本
   - 安装过程中勾选"Automatically install the necessary tools"选项

2. 安装 MongoDB
   - 访问 [MongoDB下载页面](https://www.mongodb.com/try/download/community)
   - 下载并安装MongoDB Community Server
   - 安装时选择"Complete"安装类型
   - 勾选"Install MongoDB as a Service"选项
   - 安装完成后，MongoDB服务应该会自动启动

3. 启动 MongoDB 服务
   - MongoDB应该已作为Windows服务自动启动
   - 如需手动启动，打开"服务"应用程序（services.msc）
   - 找到"MongoDB Server"服务并启动

4. 运行应用
   ```bash
   # 启动后端服务（在backend目录下）
   cd backend
   npm run dev
   
   # 在新的命令提示符窗口启动前端服务（在frontend目录下）
   cd frontend
   npm start
   ```

5. 常见问题处理
   - 如果遇到"port already in use"（端口已被占用）错误：
     ```bash
     # 查找并杀死占用端口的进程
     netstat -ano | findstr :5002  # 或其他被占用的端口
     taskkill /PID <PID> /F  # 替换<PID>为上一步找到的进程ID
     ```
   
   - 如果遇到MongoDB连接问题：
     1. 确保MongoDB服务正在运行（检查服务应用程序）
     2. 检查MongoDB数据目录权限
     3. 检查Windows防火墙是否阻止了MongoDB连接

#### macOS 系统

1. 安装 Node.js
   - 使用Homebrew安装：`brew install node`
   - 或访问 [Node.js官网](https://nodejs.org/) 下载macOS安装包

2. 安装 MongoDB
   - 使用Homebrew安装：`brew tap mongodb/brew && brew install mongodb-community`
   - 或访问 [MongoDB下载页面](https://www.mongodb.com/try/download/community) 下载macOS安装包

3. 启动 MongoDB 服务
   ```bash
   # 使用Homebrew启动MongoDB服务
   brew services start mongodb-community
   ```

4. 运行应用
   ```bash
   # 启动后端服务（在backend目录下）
   cd backend
   npm run dev
   
   # 在新的终端窗口启动前端服务（在frontend目录下）
   cd frontend
   npm start
   ```

5. 常见问题处理
   - 如果遇到"port already in use"（端口已被占用）错误：
     ```bash
     # 查找并杀死占用端口的进程
     lsof -i :5002  # 或其他被占用的端口
     kill -9 <PID>  # 替换<PID>为上一步找到的进程ID
     ```
   
   - 如果遇到MongoDB连接问题：
     1. 确保MongoDB服务正在运行：`brew services list`
     2. 重启MongoDB服务：`brew services restart mongodb-community`
     3. 检查MongoDB日志：`cat /usr/local/var/log/mongodb/mongo.log`

#### Ubuntu/Linux 系统

1. 安装 Node.js
   ```bash
   # 使用apt安装（推荐使用NodeSource仓库获取最新版本）
   curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

2. 安装 MongoDB
   ```bash
   # 导入MongoDB公钥
   wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
   
   # 添加MongoDB源
   echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
   
   # 更新包数据库
   sudo apt-get update
   
   # 安装MongoDB
   sudo apt-get install -y mongodb-org
   ```

3. 启动 MongoDB 服务
   ```bash
   # 启动MongoDB服务
   sudo systemctl start mongod
   
   # 设置开机自启
   sudo systemctl enable mongod
   
   # 检查服务状态
   sudo systemctl status mongod
   ```

4. 运行应用
   ```bash
   # 启动后端服务（在backend目录下）
   cd backend
   npm run dev
   
   # 在新的终端窗口启动前端服务（在frontend目录下）
   cd frontend
   npm start
   ```

5. 常见问题处理
   - 如果遇到"port already in use"（端口已被占用）错误：
     ```bash
     # 查找并杀死占用端口的进程
     sudo lsof -i :5002  # 或其他被占用的端口
     sudo kill -9 <PID>  # 替换<PID>为上一步找到的进程ID
     ```
   
   - 如果遇到MongoDB连接问题：
     1. 检查MongoDB服务状态：`sudo systemctl status mongod`
     2. 检查MongoDB日志：`sudo cat /var/log/mongodb/mongod.log`
     3. 确保防火墙未阻止MongoDB连接：`sudo ufw status`

后端服务将在 http://localhost:5002 上运行
前端服务将在 http://localhost:3000 上运行（如果端口被占用，会自动使用其他端口）

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