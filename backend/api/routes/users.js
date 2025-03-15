const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const { protect } = require('../../middleware/auth');
const ErrorResponse = require('../../utils/errorResponse');

const router = express.Router();

/**
 * @route   POST /api/users/register
 * @desc    注册新用户
 * @access  Public
 */
router.post(
  '/register',
  [
    body('username', '请提供用户名').not().isEmpty(),
    body('email', '请提供有效的电子邮件').isEmail(),
    body('password', '请提供至少6个字符的密码').isLength({ min: 6 })
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

      const { username, email, password } = req.body;

      // 检查用户是否已存在
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({
          success: false,
          message: '该电子邮件已被注册'
        });
      }

      user = await User.findOne({ username });
      if (user) {
        return res.status(400).json({
          success: false,
          message: '该用户名已被使用'
        });
      }

      // 创建用户
      user = await User.create({
        username,
        email,
        password
      });

      // 创建令牌
      const token = user.getSignedJwtToken();

      res.status(201).json({
        success: true,
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email
        }
      });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * @route   POST /api/users/login
 * @desc    用户登录
 * @access  Public
 */
router.post(
  '/login',
  [
    body('email', '请提供有效的电子邮件').isEmail(),
    body('password', '请提供密码').exists()
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

      const { email, password } = req.body;

      // 检查用户是否存在
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        return res.status(401).json({
          success: false,
          message: '无效的凭据'
        });
      }

      // 验证密码
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: '无效的凭据'
        });
      }

      // 更新最后登录时间
      user.lastLoginAt = Date.now();
      await user.save();

      // 创建令牌
      const token = user.getSignedJwtToken();

      res.status(200).json({
        success: true,
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email
        }
      });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * @route   GET /api/users/me
 * @desc    获取当前用户信息
 * @access  Private
 */
router.get('/me', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
});

/**
 * @route   PUT /api/users/me
 * @desc    更新用户信息
 * @access  Private
 */
router.put('/me', protect, async (req, res, next) => {
  try {
    const { profile, preferences } = req.body;
    
    // 构建更新对象
    const updateFields = {};
    if (profile) updateFields.profile = profile;
    if (preferences) updateFields.preferences = preferences;
    
    // 更新用户
    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateFields,
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
});

/**
 * @route   PUT /api/users/me/password
 * @desc    修改密码
 * @access  Private
 */
router.put(
  '/me/password',
  [
    protect,
    body('currentPassword', '请提供当前密码').not().isEmpty(),
    body('newPassword', '请提供至少6个字符的新密码').isLength({ min: 6 })
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
      
      const { currentPassword, newPassword } = req.body;
      
      // 获取用户
      const user = await User.findById(req.user.id).select('+password');
      
      // 验证当前密码
      const isMatch = await user.matchPassword(currentPassword);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: '当前密码不正确'
        });
      }
      
      // 更新密码
      user.password = newPassword;
      await user.save();
      
      res.status(200).json({
        success: true,
        message: '密码已更新'
      });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router; 