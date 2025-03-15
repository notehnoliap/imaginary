const express = require('express');
const { body, validationResult } = require('express-validator');
const Command = require('../../models/Command');
const { protect } = require('../../middleware/auth');
const commandProcessor = require('../../services/commandProcessor');

const router = express.Router();

/**
 * @route   POST /api/commands
 * @desc    处理自然语言命令
 * @access  Private
 */
router.post(
  '/',
  [
    protect,
    body('text', '请提供命令文本').not().isEmpty()
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

      const { text } = req.body;

      // 处理命令
      const result = await commandProcessor.processCommand(req.user.id, text);

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * @route   GET /api/commands
 * @desc    获取用户的命令历史
 * @access  Private
 */
router.get('/', protect, async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const startIndex = (page - 1) * limit;
    
    // 执行查询
    const total = await Command.countDocuments({ user: req.user.id });
    const commands = await Command.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);
    
    res.status(200).json({
      success: true,
      count: commands.length,
      total,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      },
      data: commands
    });
  } catch (err) {
    next(err);
  }
});

/**
 * @route   GET /api/commands/:id
 * @desc    获取单个命令详情
 * @access  Private
 */
router.get('/:id', protect, async (req, res, next) => {
  try {
    const command = await Command.findById(req.params.id);
    
    if (!command) {
      return res.status(404).json({
        success: false,
        message: '未找到命令'
      });
    }
    
    // 确保用户只能访问自己的命令
    if (command.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: '无权访问此命令'
      });
    }
    
    res.status(200).json({
      success: true,
      data: command
    });
  } catch (err) {
    next(err);
  }
});

/**
 * @route   DELETE /api/commands/:id
 * @desc    删除命令
 * @access  Private
 */
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const command = await Command.findById(req.params.id);
    
    if (!command) {
      return res.status(404).json({
        success: false,
        message: '未找到命令'
      });
    }
    
    // 确保用户只能删除自己的命令
    if (command.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: '无权删除此命令'
      });
    }
    
    // 删除命令
    await command.remove();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router; 