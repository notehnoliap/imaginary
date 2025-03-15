const express = require('express');
const { body, validationResult } = require('express-validator');
const Album = require('../../models/Album');
const Image = require('../../models/Image');
const { protect } = require('../../middleware/auth');

const router = express.Router();

/**
 * @route   POST /api/albums
 * @desc    创建新相册
 * @access  Private
 */
router.post(
  '/',
  [
    protect,
    body('name', '请提供相册名称').not().isEmpty(),
    body('description').optional()
  ],
  async (req, res, next) => {
    try {
      // 验证请求
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const { name, description, imageIds } = req.body;

      // 创建相册
      const album = await Album.create({
        user: req.user.id,
        name,
        description: description || '',
        images: imageIds || []
      });

      res.status(201).json({
        success: true,
        data: album
      });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * @route   GET /api/albums
 * @desc    获取用户的所有相册
 * @access  Private
 */
router.get('/', protect, async (req, res, next) => {
  try {
    const albums = await Album.find({ user: req.user.id })
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: albums.length,
      data: albums
    });
  } catch (err) {
    next(err);
  }
});

/**
 * @route   GET /api/albums/:id
 * @desc    获取单个相册
 * @access  Private
 */
router.get('/:id', protect, async (req, res, next) => {
  try {
    const album = await Album.findById(req.params.id)
      .populate('images');
    
    if (!album) {
      return res.status(404).json({
        success: false,
        message: '未找到相册'
      });
    }
    
    // 确保用户只能访问自己的相册
    if (album.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: '无权访问此相册'
      });
    }
    
    res.status(200).json({
      success: true,
      data: album
    });
  } catch (err) {
    next(err);
  }
});

/**
 * @route   PUT /api/albums/:id
 * @desc    更新相册信息
 * @access  Private
 */
router.put(
  '/:id',
  [
    protect,
    body('name').optional(),
    body('description').optional()
  ],
  async (req, res, next) => {
    try {
      let album = await Album.findById(req.params.id);
      
      if (!album) {
        return res.status(404).json({
          success: false,
          message: '未找到相册'
        });
      }
      
      // 确保用户只能更新自己的相册
      if (album.user.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: '无权更新此相册'
        });
      }
      
      const { name, description } = req.body;
      const updateData = {};
      
      if (name) updateData.name = name;
      if (description !== undefined) updateData.description = description;
      
      // 更新相册
      album = await Album.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
      );
      
      res.status(200).json({
        success: true,
        data: album
      });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * @route   PUT /api/albums/:id/images
 * @desc    添加图片到相册
 * @access  Private
 */
router.put(
  '/:id/images',
  [
    protect,
    body('imageIds', '请提供图片ID数组').isArray()
  ],
  async (req, res, next) => {
    try {
      // 验证请求
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }
      
      let album = await Album.findById(req.params.id);
      
      if (!album) {
        return res.status(404).json({
          success: false,
          message: '未找到相册'
        });
      }
      
      // 确保用户只能更新自己的相册
      if (album.user.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: '无权更新此相册'
        });
      }
      
      const { imageIds } = req.body;
      
      // 验证所有图片都属于当前用户
      const images = await Image.find({
        _id: { $in: imageIds },
        user: req.user.id
      });
      
      if (images.length !== imageIds.length) {
        return res.status(400).json({
          success: false,
          message: '一个或多个图片ID无效或不属于当前用户'
        });
      }
      
      // 添加图片到相册
      const updatedImageIds = [...new Set([...album.images.map(id => id.toString()), ...imageIds])];
      
      album = await Album.findByIdAndUpdate(
        req.params.id,
        { images: updatedImageIds },
        { new: true, runValidators: true }
      );
      
      res.status(200).json({
        success: true,
        data: album
      });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * @route   DELETE /api/albums/:id/images
 * @desc    从相册中移除图片
 * @access  Private
 */
router.delete(
  '/:id/images',
  [
    protect,
    body('imageIds', '请提供图片ID数组').isArray()
  ],
  async (req, res, next) => {
    try {
      // 验证请求
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }
      
      let album = await Album.findById(req.params.id);
      
      if (!album) {
        return res.status(404).json({
          success: false,
          message: '未找到相册'
        });
      }
      
      // 确保用户只能更新自己的相册
      if (album.user.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: '无权更新此相册'
        });
      }
      
      const { imageIds } = req.body;
      
      // 从相册中移除图片
      const updatedImageIds = album.images
        .map(id => id.toString())
        .filter(id => !imageIds.includes(id));
      
      album = await Album.findByIdAndUpdate(
        req.params.id,
        { images: updatedImageIds },
        { new: true, runValidators: true }
      );
      
      res.status(200).json({
        success: true,
        data: album
      });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * @route   DELETE /api/albums/:id
 * @desc    删除相册
 * @access  Private
 */
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const album = await Album.findById(req.params.id);
    
    if (!album) {
      return res.status(404).json({
        success: false,
        message: '未找到相册'
      });
    }
    
    // 确保用户只能删除自己的相册
    if (album.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: '无权删除此相册'
      });
    }
    
    // 删除相册
    await album.remove();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router; 