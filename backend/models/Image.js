const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    filename: {
      type: String,
      required: true
    },
    path: {
      type: String,
      required: true
    },
    mimetype: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      required: true
    },
    description: {
      type: String,
      default: ''
    },
    tags: {
      type: [String],
      default: []
    },
    analysis: {
      type: Object,
      default: {
        description: '',
        tags: []
      }
    },
    metadata: {
      width: Number,
      height: Number,
      format: String,
      exif: Object
    },
    vectorId: {
      type: String,
      default: null
    },
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
ImageSchema.index({ user: 1, createdAt: -1 });
ImageSchema.index({ tags: 1 });
ImageSchema.index({ description: 'text', tags: 'text' });

// 虚拟字段：图片URL
ImageSchema.virtual('url').get(function () {
  return `/uploads/images/${this.filename}`;
});

// 虚拟字段：缩略图URL
ImageSchema.virtual('thumbnailUrl').get(function () {
  const ext = this.filename.split('.').pop();
  const name = this.filename.replace(`.${ext}`, '');
  return `/uploads/images/thumbnails/${name}_thumb.${ext}`;
});

module.exports = mongoose.model('Image', ImageSchema);