const mongoose = require('mongoose');

const VectorSchema = new mongoose.Schema({
  imageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Image',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pineconeId: {
    type: String,
    required: true,
    unique: true
  },
  metadata: {
    modelVersion: {
      type: String,
      required: true
    },
    dimensions: {
      type: Number,
      required: true
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// 更新时间中间件
VectorSchema.pre('findOneAndUpdate', function() {
  this.set({ updatedAt: Date.now() });
});

// 索引
VectorSchema.index({ imageId: 1 }, { unique: true });
VectorSchema.index({ userId: 1 });
VectorSchema.index({ pineconeId: 1 }, { unique: true });

module.exports = mongoose.model('Vector', VectorSchema); 