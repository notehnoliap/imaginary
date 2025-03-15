const mongoose = require('mongoose');

const CommandSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    text: {
      type: String,
      required: [true, '请提供命令文本'],
      trim: true
    },
    intent: {
      type: String,
      enum: ['search', 'create_album', 'edit', 'filter', 'sort', 'unknown'],
      default: 'unknown'
    },
    parameters: {
      type: Object,
      default: {}
    },
    result: {
      status: {
        type: String,
        enum: ['success', 'failed', 'pending'],
        default: 'pending'
      },
      message: {
        type: String,
        default: ''
      },
      data: {
        type: Object,
        default: {}
      }
    },
    processingTime: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// 创建索引
CommandSchema.index({ user: 1, createdAt: -1 });
CommandSchema.index({ intent: 1 });
CommandSchema.index({ text: 'text' });

module.exports = mongoose.model('Command', CommandSchema); 