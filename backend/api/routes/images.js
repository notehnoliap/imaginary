const express = require('express');
const multer = require('multer');
const { body, validationResult } = require('express-validator');
const Image = require('../../models/Image');
const { protect } = require('../../middleware/auth');
const imageService = require('../../services/imageService');
const vectorService = require('../../services/vectorService');

const router = express.Router();

// 配置文件上传
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/images');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = file.originalname.split('.').pop();
    cb(null, `${uniqueSuffix}.${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('只允许上传图片文件'), false);
    }
    cb(null, true);
  }
});

/**
 * @route   POST /api/images
 * @desc    上传新图片
 * @access  Private
 */
router.post(
  '/',
  [
    protect,
    upload.single('image'),
    body('description').optional(),
    body('tags').optional()
  ],
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: '请提供图片文件'
        });
      }

      // 处理标签
      let tags = [];
      if (req.body.tags) {
        tags = Array.isArray(req.body.tags)
          ? req.body.tags
          : req.body.tags.split(',').map(tag => tag.trim());
      }

      // 处理图片
      const imageData = {
        user: req.user.id,
        filename: req.file.filename,
        path: req.file.path,
        mimetype: req.file.mimetype,
        size: req.file.size,
        description: req.body.description || '',
        tags
      };

      // 分析图片内容
      const analysisResult = await imageService.analyzeImage(req.file.path);
      imageData.analysis = analysisResult;

      // 创建图片记录
      const image = await Image.create(imageData);

      // 创建向量嵌入
      await vectorService.createImageVector(
        image._id.toString(),
        image.description,
        image.tags,
        image.analysis
      );

      res.status(201).json({
        success: true,
        data: image
      });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * @route   GET /api/images
 * @desc    获取用户的所有图片
 * @access  Private
 */
router.get('/', protect, async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const startIndex = (page - 1) * limit;
    
    const query = { user: req.user.id };
    
    // 添加标签过滤
    if (req.query.tags) {
      const tags = req.query.tags.split(',').map(tag => tag.trim());
      query.tags = { $all: tags };
    }
    
    // 添加日期过滤
    if (req.query.startDate && req.query.endDate) {
      query.createdAt = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate)
      };
    } else if (req.query.startDate) {
      query.createdAt = { $gte: new Date(req.query.startDate) };
    } else if (req.query.endDate) {
      query.createdAt = { $lte: new Date(req.query.endDate) };
    }
    
    // 执行查询
    const total = await Image.countDocuments(query);
    const images = await Image.find(query)
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);
    
    res.status(200).json({
      success: true,
      count: images.length,
      total,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      },
      data: images
    });
  } catch (err) {
    next(err);
  }
});

/**
 * @route   GET /api/images/search
 * @desc    搜索图片
 * @access  Private
 */
router.get('/search', protect, async (req, res, next) => {
  try {
    if (!req.query.q) {
      return res.status(400).json({
        success: false,
        message: '请提供搜索查询'
      });
    }
    
    // 使用向量搜索
    const imageIds = await vectorService.searchImagesByText(req.query.q);
    
    // 只返回属于当前用户的图片
    const images = await Image.find({
      _id: { $in: imageIds },
      user: req.user.id
    });
    
    res.status(200).json({
      success: true,
      count: images.length,
      data: images
    });
  } catch (err) {
    next(err);
  }
});

/**
 * @route   GET /api/images/:id
 * @desc    获取单个图片
 * @access  Private
 */
router.get('/:id', protect, async (req, res, next) => {
  try {
    const image = await Image.findById(req.params.id);
    
    if (!image) {
      return res.status(404).json({
        success: false,
        message: '未找到图片'
      });
    }
    
    // 确保用户只能访问自己的图片
    if (image.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: '无权访问此图片'
      });
    }
    
    res.status(200).json({
      success: true,
      data: image
    });
  } catch (err) {
    next(err);
  }
});

/**
 * @route   PUT /api/images/:id
 * @desc    更新图片信息
 * @access  Private
 */
router.put('/:id', protect, async (req, res, next) => {
  try {
    let image = await Image.findById(req.params.id);
    
    if (!image) {
      return res.status(404).json({
        success: false,
        message: '未找到图片'
      });
    }
    
    // 确保用户只能更新自己的图片
    if (image.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: '无权更新此图片'
      });
    }
    
    const { description, tags } = req.body;
    const updateData = {};
    
    if (description !== undefined) updateData.description = description;
    if (tags !== undefined) {
      updateData.tags = Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim());
    }
    
    // 更新图片
    image = await Image.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    // 更新向量嵌入
    if (description !== undefined || tags !== undefined) {
      await vectorService.createImageVector(
        image._id.toString(),
        image.description,
        image.tags,
        image.analysis
      );
    }
    
    res.status(200).json({
      success: true,
      data: image
    });
  } catch (err) {
    next(err);
  }
});

/**
 * @route   DELETE /api/images/:id
 * @desc    删除图片
 * @access  Private
 */
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const image = await Image.findById(req.params.id);
    
    if (!image) {
      return res.status(404).json({
        success: false,
        message: '未找到图片'
      });
    }
    
    // 确保用户只能删除自己的图片
    if (image.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: '无权删除此图片'
      });
    }
    
    // 删除图片文件
    await imageService.deleteImageFile(image.path);
    
    // 删除向量嵌入
    await vectorService.deleteImageVector(image._id.toString());
    
    // 删除数据库记录
    await image.remove();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;