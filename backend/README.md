# Imaginary 后端

Imaginary 是一个智能图片管理系统，利用 AI 技术帮助用户组织、搜索和管理图片库。

## 功能特点

- 基于 AI 的图片分析和标签生成
- 自然语言命令处理
- 向量搜索图片
- 用户认证和授权
- 图片上传和管理
- 相册创建和管理

## 技术栈

- **Node.js** - JavaScript 运行时环境
- **Express** - Web 框架
- **MongoDB** - 数据库
- **Mongoose** - MongoDB 对象模型工具
- **OpenAI API** - 用于图片分析和自然语言处理
- **Pinecone** - 向量数据库，用于相似性搜索
- **JWT** - 用户认证
- **Multer** - 文件上传处理

## 安装和设置

### 前提条件

- Node.js (>= 18.0.0)
- MongoDB
- OpenAI API 密钥
- Pinecone API 密钥

### 安装步骤

1. 克隆仓库

```bash
git clone <repository-url>
cd imaginary/backend
```

2. 安装依赖

```bash
npm install
```

3. 配置环境变量

复制 `.env.example` 文件并重命名为 `.env`，然后填写必要的环境变量：

```bash
cp .env.example .env
```

4. 启动服务器

```bash
# 开发模式
npm run dev

# 生产模式
npm start
```

## API 文档

### 认证 API

- `POST /api/users/register` - 注册新用户
- `POST /api/users/login` - 用户登录
- `GET /api/users/me` - 获取当前用户信息
- `PUT /api/users/me` - 更新用户信息
- `PUT /api/users/me/password` - 修改密码

### 图片 API

- `POST /api/images` - 上传新图片
- `GET /api/images` - 获取用户的所有图片
- `GET /api/images/search` - 搜索图片
- `GET /api/images/:id` - 获取单个图片
- `PUT /api/images/:id` - 更新图片信息
- `DELETE /api/images/:id` - 删除图片

### 相册 API

- `POST /api/albums` - 创建新相册
- `GET /api/albums` - 获取用户的所有相册
- `GET /api/albums/:id` - 获取单个相册
- `PUT /api/albums/:id` - 更新相册信息
- `PUT /api/albums/:id/images` - 添加图片到相册
- `DELETE /api/albums/:id/images` - 从相册中移除图片
- `DELETE /api/albums/:id` - 删除相册

### 命令 API

- `POST /api/commands` - 处理自然语言命令
- `GET /api/commands` - 获取用户的命令历史
- `GET /api/commands/:id` - 获取单个命令详情
- `DELETE /api/commands/:id` - 删除命令

## 项目结构

```
backend/
├── api/                  # API 路由和控制器
│   ├── routes/           # 路由定义
│   └── index.js          # API 入口
├── middleware/           # 中间件
├── models/               # 数据模型
├── services/             # 业务逻辑服务
├── utils/                # 工具函数
├── uploads/              # 上传文件存储
├── .env.example          # 环境变量示例
├── package.json          # 项目依赖
├── server.js             # 服务器入口
└── README.md             # 项目文档
```

## 许可证

MIT