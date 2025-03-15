const fs = require('fs').promises;
const path = require('path');
const OpenAI = require('openai');
const Image = require('../models/Image');

// 初始化 OpenAI 客户端
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * 分析图片内容
 * @param {string} imagePath - 图片路径
 * @returns {Promise<Object>} - 分析结果
 */
exports.analyzeImage = async (imagePath) => {
  try {
    // 读取图片文件
    const imageBuffer = await fs.readFile(imagePath);
    const base64Image = imageBuffer.toString('base64');
    
    // 调用 OpenAI 分析图片
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "请详细分析这张图片的内容，包括：主要对象、场景、颜色、风格、情绪等。同时，请提供5-10个适合这张图片的标签。以JSON格式返回，包含description和tags字段。" },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        }
      ],
      max_tokens: 1000
    });
    
    // 解析响应
    const content = response.choices[0].message.content;
    let result;
    
    try {
      // 尝试解析JSON
      result = JSON.parse(content);
    } catch (error) {
      // 如果不是有效的JSON，则手动提取信息
      const descriptionMatch = content.match(/description["\s:]+([^"]+)/i);
      const tagsMatch = content.match(/tags["\s:]+\[(.*?)\]/i);
      
      result = {
        description: descriptionMatch ? descriptionMatch[1].trim() : '无法解析描述',
        tags: tagsMatch ? tagsMatch[1].split(',').map(tag => tag.trim().replace(/"/g, '')) : []
      };
    }
    
    return result;
  } catch (error) {
    console.error('图片分析失败:', error);
    return {
      description: '图片分析失败',
      tags: []
    };
  }
};

/**
 * 删除图片文件
 * @param {string} filePath - 文件路径
 * @returns {Promise<boolean>} - 是否成功
 */
exports.deleteImageFile = async (filePath) => {
  try {
    await fs.unlink(filePath);
    return true;
  } catch (error) {
    console.error('删除图片文件失败:', error);
    return false;
  }
};

/**
 * 获取用户的图片统计信息
 * @param {string} userId - 用户ID
 * @returns {Promise<Object>} - 统计信息
 */
exports.getUserImageStats = async (userId) => {
  try {
    // 获取总图片数
    const totalCount = await Image.countDocuments({ user: userId });
    
    // 获取标签统计
    const tagStats = await Image.aggregate([
      { $match: { user: userId } },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    // 获取每月上传统计
    const monthlyStats = await Image.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]);
    
    return {
      totalCount,
      tagStats: tagStats.map(item => ({
        tag: item._id,
        count: item.count
      })),
      monthlyStats: monthlyStats.map(item => ({
        year: item._id.year,
        month: item._id.month,
        count: item.count
      }))
    };
  } catch (error) {
    console.error('获取用户图片统计失败:', error);
    throw error;
  }
};