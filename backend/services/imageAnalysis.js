const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const Image = require('../models/Image');
const Vector = require('../models/Vector');
const vectorService = require('./vectorService');

// 初始化 OpenAI 客户端
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * 分析图片内容
 * @param {string} imageId - 图片ID
 * @returns {Promise<Object>} - 分析结果
 */
exports.analyzeImage = async (imageId) => {
  try {
    // 获取图片信息
    const image = await Image.findById(imageId);
    if (!image) {
      throw new Error('图片不存在');
    }

    // 更新分析状态
    await Image.findByIdAndUpdate(imageId, {
      'analysis.status': 'processing'
    });

    // 读取图片文件
    const imagePath = path.join(__dirname, '..', image.storagePath);
    
    // 使用 OpenAI 分析图片
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            { 
              type: "text", 
              text: "请详细分析这张图片，并提供以下信息：\n1. 详细描述图片内容\n2. 识别图片中的主要对象\n3. 识别场景类型\n4. 识别人物（如果有）\n5. 评估图片质量（清晰度、曝光、构图）\n6. 提取主要颜色\n7. 识别情感或氛围\n8. 提供相关标签\n\n请以JSON格式返回结果，包含以下字段：description, objects, scenes, people, quality_score, colors, emotions, tags" 
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/${image.format};base64,${fs.readFileSync(imagePath).toString('base64')}`
              }
            }
          ]
        }
      ],
      max_tokens: 1000
    });

    // 解析分析结果
    const analysisText = response.choices[0].message.content;
    let analysisData;
    
    try {
      // 尝试从文本中提取 JSON
      const jsonMatch = analysisText.match(/```json\n([\s\S]*?)\n```/) || 
                        analysisText.match(/{[\s\S]*}/);
      
      if (jsonMatch) {
        analysisData = JSON.parse(jsonMatch[0].replace(/```json\n|```/g, ''));
      } else {
        throw new Error('无法解析 JSON');
      }
    } catch (err) {
      console.error('JSON 解析错误:', err);
      // 如果无法解析 JSON，则手动构建结果
      analysisData = {
        description: analysisText,
        objects: [],
        scenes: [],
        people: [],
        quality_score: 3,
        colors: [],
        emotions: [],
        tags: []
      };
    }

    // 生成并存储向量嵌入
    const vectorId = await vectorService.createImageVector(
      imageId,
      image.userId,
      analysisData.description,
      analysisData.tags.join(', ')
    );

    // 更新图片分析结果
    const updatedImage = await Image.findByIdAndUpdate(
      imageId,
      {
        analysis: {
          description: analysisData.description,
          tags: analysisData.tags || [],
          objects: analysisData.objects || [],
          scenes: analysisData.scenes || [],
          people: analysisData.people || [],
          qualityScore: analysisData.quality_score || 3,
          colors: analysisData.colors || [],
          emotions: analysisData.emotions || [],
          vectorId: vectorId,
          status: 'completed'
        }
      },
      { new: true }
    );

    return updatedImage.analysis;
  } catch (error) {
    console.error('图片分析错误:', error);
    
    // 更新分析状态为失败
    await Image.findByIdAndUpdate(imageId, {
      'analysis.status': 'failed'
    });
    
    throw error;
  }
};

/**
 * 生成图片缩略图
 * @param {string} sourcePath - 源图片路径
 * @param {string} targetPath - 目标缩略图路径
 * @param {number} width - 缩略图宽度
 * @returns {Promise<void>}
 */
exports.generateThumbnail = async (sourcePath, targetPath, width = 300) => {
  try {
    await sharp(sourcePath)
      .resize(width, null, { fit: 'inside' })
      .toFile(targetPath);
  } catch (error) {
    console.error('生成缩略图错误:', error);
    throw error;
  }
}; 