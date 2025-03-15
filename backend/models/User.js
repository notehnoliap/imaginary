const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, '请提供用户名'],
      unique: true,
      trim: true,
      maxlength: [50, '用户名不能超过50个字符']
    },
    email: {
      type: String,
      required: [true, '请提供电子邮件'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        '请提供有效的电子邮件'
      ]
    },
    password: {
      type: String,
      required: [true, '请提供密码'],
      minlength: [6, '密码至少需要6个字符'],
      select: false
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    profile: {
      avatar: {
        type: String,
        default: 'default-avatar.jpg'
      },
      bio: {
        type: String,
        maxlength: [500, '个人简介不能超过500个字符']
      }
    },
    preferences: {
      theme: {
        type: String,
        enum: ['light', 'dark', 'system'],
        default: 'system'
      },
      language: {
        type: String,
        enum: ['zh-CN', 'en-US'],
        default: 'zh-CN'
      },
      notifications: {
        email: {
          type: Boolean,
          default: true
        },
        app: {
          type: Boolean,
          default: true
        }
      }
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    lastLoginAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// 虚拟字段：用户的图片
UserSchema.virtual('images', {
  ref: 'Image',
  localField: '_id',
  foreignField: 'user',
  justOne: false
});

// 虚拟字段：用户的相册
UserSchema.virtual('albums', {
  ref: 'Album',
  localField: '_id',
  foreignField: 'user',
  justOne: false
});

// 加密密码
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// 签署 JWT
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// 匹配密码
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);