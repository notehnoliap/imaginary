const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ErrorResponse = require('../utils/errorResponse');

// 确保上传目录存在
const uploadDir = path.join(__dirname, '..', process.env.UPLOAD_PATH || 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 配置存储
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    // 为每个用户创建单独的目录
    const userDir = path.join(uploadDir, req.user._id.toString());
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }
    cb(null, userDir);
  },
  filename: function(req, file, cb) {
    // 生成唯一文件名
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

// 文件过滤器
const fileFilter = (req, file, cb) => {
  // 允许的文件类型
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  
  // 检查文件扩展名
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  
  // 检查 MIME 类型
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (extname && mimetype) {
    return cb(null, true);
  } else {
    return cb(new ErrorResponse('只允许上传图片文件（JPEG, JPG, PNG, GIF, WEBP）', 400), false);
  }
};

// 配置 multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 默认 10MB
  },
  fileFilter: fileFilter
});

// 单文件上传中间件
exports.uploadSingleImage = upload.single('image');

// 多文件上传中间件
exports.uploadMultipleImages = upload.array('images', 20); // 最多 20 张图片

// 错误处理中间件
exports.handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Multer 错误
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: `文件大小超过限制（${(parseInt(process.env.MAX_FILE_SIZE) / (1024 * 1024)).toFixed(2)}MB）`
      });
    }
    return res.status(400).json({
      success: false,
      error: err.message
    });
  } else if (err) {
    // 其他错误
    return res.status(err.statusCode || 500).json({
      success: false,
      error: err.message || '文件上传失败'
    });
  }
  next();
}; 