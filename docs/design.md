# Imaginary 项目设计文档

## 1. UI设计

### 1.1 整体设计风格

Imaginary 采用现代简约的设计风格，以确保用户界面直观、易用且美观。设计遵循以下原则：

- **简洁明了**：界面元素简洁，减少视觉干扰
- **层次分明**：通过色彩、阴影和间距创建清晰的视觉层次
- **响应式**：适应不同屏幕尺寸和设备
- **一致性**：保持设计元素和交互模式的一致性
- **可访问性**：符合WCAG 2.1 AA级标准

### 1.2 色彩方案

主色调采用蓝色系，辅以中性色调：

- **主色**：#3B82F6（蓝色）
- **次要色**：#10B981（绿色）
- **强调色**：#F59E0B（橙色）
- **背景色**：#F9FAFB（浅灰）
- **文本色**：#1F2937（深灰）
- **边框色**：#E5E7EB（灰色）

### 1.3 主要页面设计

#### 1.3.1 登录/注册页面

![登录页面示意图]

- 简洁的登录表单
- 社交媒体登录选项
- 注册入口
- 品牌标识和简介

#### 1.3.2 主页/仪表盘

![主页示意图]

- 顶部导航栏（用户信息、通知、设置）
- 侧边栏（主要功能导航）
- 图片库概览（最近上传、智能相册推荐）
- 快速操作区（上传、创建相册、搜索）
- 使用统计（存储使用情况、活动记录）

#### 1.3.3 图片库页面

![图片库示意图]

- 多视图模式（网格视图、列表视图）
- 筛选和排序选项
- 批量操作工具栏
- 图片预览卡片（缩略图、基本信息）
- 分页或无限滚动

#### 1.3.4 图片详情页面

![图片详情示意图]

- 大图预览区
- 图片元数据显示
- 编辑工具栏
- 系统生成的标签和描述
- 相关图片推荐

#### 1.3.5 自然语言命令界面

![命令界面示意图]

- 命令输入框（支持自动完成）
- 命令历史记录
- 结果展示区域
- 建议和提示

#### 1.3.6 相册页面

![相册页面示意图]

- 相册封面和标题
- 相册描述和元数据
- 图片网格视图
- 幻灯片播放选项
- 分享和导出选项

### 1.4 组件设计

#### 1.4.1 导航组件
- 顶部导航栏
- 侧边导航菜单
- 面包屑导航

#### 1.4.2 图片相关组件
- 图片卡片组件
- 图片预览组件
- 图片编辑组件
- 上传组件（支持拖放）

#### 1.4.3 交互组件
- 自然语言命令输入组件
- 搜索组件
- 筛选和排序组件
- 通知组件

#### 1.4.4 反馈组件
- 加载指示器
- 进度条
- 提示和警告对话框
- 成功/错误消息

## 2. 数据模型设计

### 2.1 用户模型

```json
{
  "id": "用户唯一标识符",
  "username": "用户名",
  "email": "电子邮件",
  "password_hash": "密码哈希",
  "profile": {
    "display_name": "显示名称",
    "avatar_url": "头像URL",
    "bio": "个人简介"
  },
  "preferences": {
    "theme": "界面主题",
    "language": "界面语言",
    "notifications_enabled": "通知开关"
  },
  "storage_usage": {
    "total_bytes": "总存储使用量",
    "quota_bytes": "存储配额"
  },
  "created_at": "创建时间",
  "updated_at": "更新时间",
  "last_login_at": "最后登录时间"
}
```

### 2.2 图片模型

```json
{
  "id": "图片唯一标识符",
  "user_id": "所属用户ID",
  "filename": "原始文件名",
  "storage_path": "存储路径",
  "thumbnail_path": "缩略图路径",
  "format": "文件格式",
  "size_bytes": "文件大小",
  "dimensions": {
    "width": "宽度",
    "height": "高度"
  },
  "metadata": {
    "exif": "EXIF数据",
    "location": {
      "latitude": "纬度",
      "longitude": "经度",
      "place_name": "地点名称"
    },
    "taken_at": "拍摄时间"
  },
  "analysis": {
    "description": "生成的描述",
    "tags": ["标签1", "标签2", "..."],
    "objects": ["对象1", "对象2", "..."],
    "scenes": ["场景1", "场景2", "..."],
    "people": ["人物1", "人物2", "..."],
    "quality_score": "质量评分",
    "colors": ["主色1", "主色2", "..."],
    "emotions": ["情感1", "情感2", "..."],
    "vector_id": "特征向量ID"
  },
  "user_data": {
    "title": "用户设置的标题",
    "description": "用户添加的描述",
    "tags": ["用户标签1", "用户标签2", "..."],
    "favorite": "是否收藏",
    "rating": "用户评分"
  },
  "permissions": {
    "visibility": "可见性设置",
    "shared_with": ["用户ID1", "用户ID2", "..."]
  },
  "created_at": "上传时间",
  "updated_at": "更新时间"
}
```

### 2.3 相册模型

```json
{
  "id": "相册唯一标识符",
  "user_id": "所属用户ID",
  "title": "相册标题",
  "description": "相册描述",
  "cover_image_id": "封面图片ID",
  "type": "相册类型（用户创建/系统生成）",
  "theme": "相册主题",
  "images": [
    {
      "image_id": "图片ID",
      "order": "排序顺序"
    }
  ],
  "metadata": {
    "date_range": {
      "start": "开始日期",
      "end": "结束日期"
    },
    "location": "主要地点",
    "tags": ["标签1", "标签2", "..."],
    "auto_generated": "是否自动生成"
  },
  "permissions": {
    "visibility": "可见性设置",
    "shared_with": ["用户ID1", "用户ID2", "..."]
  },
  "created_at": "创建时间",
  "updated_at": "更新时间"
}
```

### 2.4 向量存储模型

```json
{
  "id": "向量唯一标识符",
  "image_id": "关联图片ID",
  "user_id": "所属用户ID",
  "vector": [0.1, 0.2, ...],  // 图片特征向量
  "text_vector": [0.3, 0.4, ...],  // 文本描述向量
  "metadata": {
    "model_version": "生成模型版本",
    "dimensions": "向量维度"
  },
  "created_at": "创建时间",
  "updated_at": "更新时间"
}
```

## 3. API设计

### 3.1 RESTful API

#### 3.1.1 用户API

| 端点 | 方法 | 描述 |
|------|------|------|
| `/api/users/register` | POST | 注册新用户 |
| `/api/users/login` | POST | 用户登录 |
| `/api/users/logout` | POST | 用户登出 |
| `/api/users/me` | GET | 获取当前用户信息 |
| `/api/users/me` | PUT | 更新用户信息 |
| `/api/users/me/password` | PUT | 修改密码 |
| `/api/users/me/preferences` | GET | 获取用户偏好设置 |
| `/api/users/me/preferences` | PUT | 更新用户偏好设置 |

#### 3.1.2 图片API

| 端点 | 方法 | 描述 |
|------|------|------|
| `/api/images` | GET | 获取用户图片列表 |
| `/api/images` | POST | 上传新图片 |
| `/api/images/{id}` | GET | 获取单张图片详情 |
| `/api/images/{id}` | PUT | 更新图片信息 |
| `/api/images/{id}` | DELETE | 删除图片 |
| `/api/images/{id}/analysis` | GET | 获取图片分析结果 |
| `/api/images/batch` | POST | 批量操作图片 |
| `/api/images/search` | POST | 搜索图片 |

#### 3.1.3 相册API

| 端点 | 方法 | 描述 |
|------|------|------|
| `/api/albums` | GET | 获取用户相册列表 |
| `/api/albums` | POST | 创建新相册 |
| `/api/albums/{id}` | GET | 获取相册详情 |
| `/api/albums/{id}` | PUT | 更新相册信息 |
| `/api/albums/{id}` | DELETE | 删除相册 |
| `/api/albums/{id}/images` | GET | 获取相册中的图片 |
| `/api/albums/{id}/images` | POST | 添加图片到相册 |
| `/api/albums/{id}/images/{image_id}` | DELETE | 从相册中移除图片 |
| `/api/albums/auto` | POST | 自动创建智能相册 |

#### 3.1.4 自然语言命令API

| 端点 | 方法 | 描述 |
|------|------|------|
| `/api/commands` | POST | 处理自然语言命令 |
| `/api/commands/history` | GET | 获取命令历史 |
| `/api/commands/suggestions` | GET | 获取命令建议 |

### 3.2 WebSocket API

| 事件 | 描述 |
|------|------|
| `upload_progress` | 图片上传进度更新 |
| `analysis_progress` | 图片分析进度更新 |
| `command_result` | 命令处理结果 |
| `notification` | 系统通知 |

### 3.3 API请求/响应示例

#### 用户注册请求
```json
POST /api/users/register
{
  "username": "example_user",
  "email": "user@example.com",
  "password": "secure_password"
}
```

#### 用户注册响应
```json
{
  "status": "success",
  "data": {
    "user_id": "user123",
    "username": "example_user",
    "email": "user@example.com",
    "token": "jwt_token_here"
  }
}
```

#### 图片上传请求
```
POST /api/images
Content-Type: multipart/form-data

file: [binary_data]
metadata: {
  "title": "Beach Sunset",
  "description": "Beautiful sunset at the beach"
}
```

#### 图片上传响应
```json
{
  "status": "success",
  "data": {
    "image_id": "img123",
    "filename": "beach_sunset.jpg",
    "upload_time": "2023-06-15T14:30:00Z",
    "analysis_status": "pending"
  }
}
```

#### 自然语言命令请求
```json
POST /api/commands
{
  "command": "找出去年夏天在海边拍摄的所有照片并创建一个名为'夏日回忆'的相册"
}
```

#### 自然语言命令响应
```json
{
  "status": "success",
  "data": {
    "command_id": "cmd123",
    "parsed_intent": "create_album",
    "parameters": {
      "time_period": "去年夏天",
      "location": "海边",
      "album_name": "夏日回忆"
    },
    "matched_images": ["img123", "img456", "img789"],
    "result": {
      "album_id": "alb123",
      "album_name": "夏日回忆",
      "image_count": 3
    }
  }
}
```

## 4. 交互设计

### 4.1 用户注册和登录流程

1. 用户访问登录页面
2. 选择注册新账户
3. 填写用户名、电子邮件和密码
4. 提交注册表单
5. 系统验证信息并创建账户
6. 用户收到确认邮件
7. 用户确认邮件后可以登录
8. 登录后进入主页/仪表盘

### 4.2 图片上传流程

1. 用户点击"上传"按钮或拖放图片到上传区域
2. 系统显示上传预览和进度
3. 用户可以添加标题、描述和标签
4. 用户确认上传
5. 系统上传图片并显示处理进度
6. 上传完成后，系统进行图像分析
7. 分析完成后，图片显示在图片库中

### 4.3 自然语言命令流程

1. 用户点击命令输入框
2. 用户输入自然语言命令
3. 系统实时提供命令建议和自动完成
4. 用户提交命令
5. 系统解析命令并显示理解的意图
6. 系统执行命令并显示进度
7. 命令完成后，系统显示结果和相关操作选项

### 4.4 智能相册创建流程

1. 用户请求创建智能相册（通过UI或命令）
2. 系统提示用户选择相册主题或条件
3. 用户提供相册名称和条件
4. 系统分析用户图片库并选择匹配图片
5. 系统创建相册并显示预览
6. 用户可以调整相册内容和顺序
7. 用户确认后，系统保存相册

## 5. 响应式设计

### 5.1 断点设计

- **移动设备**：< 640px
- **平板设备**：640px - 1024px
- **桌面设备**：> 1024px

### 5.2 移动设备适配

- 单列布局
- 简化导航（汉堡菜单）
- 优化触摸交互
- 减少非必要元素

### 5.3 平板设备适配

- 双列或网格布局
- 侧边导航可折叠
- 优化触摸和鼠标交互

### 5.4 桌面设备适配

- 多列布局
- 固定侧边导航
- 高级功能完全展示
- 键盘快捷键支持 