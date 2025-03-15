const mongoose = require('mongoose');

const AlbumSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: [true, '请提供相册名称'],
      trim: true,
      maxlength: [100, '相册名称不能超过100个字符']
    },
    description: {
      type: String,
      default: '',
      maxlength: [500, '相册描述不能超过500个字符']
    },
    coverImage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Image',
      default: null
    },
    images: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Image'
      }
    ],
    isPublic: {
      type: Boolean,
      default: false
    },
    views: {
      type: Number,
      default: 0
    },
    favorites: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// 创建索引
AlbumSchema.index({ user: 1, createdAt: -1 });
AlbumSchema.index({ name: 'text', description: 'text' });

// 中间件：自动设置封面图片
AlbumSchema.pre('save', function (next) {
  if (this.images.length > 0 && !this.coverImage) {
    this.coverImage = this.images[0];
  }
  next();
});

// 虚拟字段：图片数量
AlbumSchema.virtual('imageCount').get(function () {
  return this.images.length;
});

module.exports = mongoose.model('Album', AlbumSchema); 