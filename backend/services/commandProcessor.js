const OpenAI = require('openai');
const Command = require('../models/Command');
const Image = require('../models/Image');
const Album = require('../models/Album');
const vectorService = require('./vectorService');

// 初始化 OpenAI 客户端
let openai;
try {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'dummy-key-for-testing'
  });
} catch (error) {
  console.warn('OpenAI 客户端初始化失败:', error.message);
  // 创建一个模拟的OpenAI客户端用于测试
  openai = {
    chat: {
      completions: {
        create: async () => ({
          choices: [{ 
            message: { 
              content: JSON.stringify({
                intent: 'search',
                parameters: { query: '测试查询' }
              })
            }
          }]
        })
      }
    }
  };
}

/**
 * 处理自然语言命令
 * @param {string} userId - 用户ID
 * @param {string} commandText - 命令文本
 * @returns {Promise<Object>} - 处理结果
 */
exports.processCommand = async (userId, commandText) => {
  const startTime = Date.now();
  
  try {
    // 创建命令记录
    const command = await Command.create({
      userId,
      command: commandText
    });
    
    // 解析命令意图
    const parsedCommand = await parseCommandIntent(commandText);
    
    // 更新命令记录
    command.parsedIntent = parsedCommand.intent;
    command.parameters = parsedCommand.parameters;
    await command.save();
    
    // 根据意图执行相应操作
    let result;
    switch (parsedCommand.intent) {
      case 'search':
        result = await handleSearchIntent(userId, parsedCommand.parameters);
        break;
      case 'create_album':
        result = await handleCreateAlbumIntent(userId, parsedCommand.parameters);
        break;
      case 'edit':
        result = await handleEditIntent(userId, parsedCommand.parameters);
        break;
      case 'filter':
        result = await handleFilterIntent(userId, parsedCommand.parameters);
        break;
      case 'sort':
        result = await handleSortIntent(userId, parsedCommand.parameters);
        break;
      default:
        result = {
          status: 'failed',
          message: '无法理解命令意图',
          data: {}
        };
    }
    
    // 计算执行时间
    const executionTime = Date.now() - startTime;
    
    // 更新命令结果
    await Command.findByIdAndUpdate(command._id, {
      result,
      executionTime,
      matchedImages: result.data.matchedImages || [],
      createdAlbumId: result.data.albumId || null
    });
    
    return {
      commandId: command._id,
      ...result
    };
  } catch (error) {
    console.error('命令处理错误:', error);
    
    // 计算执行时间
    const executionTime = Date.now() - startTime;
    
    // 创建失败结果
    const result = {
      status: 'failed',
      message: error.message || '命令处理失败',
      data: {}
    };
    
    return {
      executionTime,
      ...result
    };
  }
};

/**
 * 解析命令意图
 * @param {string} commandText - 命令文本
 * @returns {Promise<Object>} - 解析结果
 */
async function parseCommandIntent(commandText) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `你是一个图片管理助手，负责解析用户的自然语言命令。
请分析用户命令，并将其分类为以下意图之一：
1. search - 搜索图片
2. create_album - 创建相册
3. edit - 编辑图片
4. filter - 筛选图片
5. sort - 排序图片
6. unknown - 无法识别的命令

同时，提取命令中的关键参数，如：
- 搜索条件（时间、地点、人物、对象、场景等）
- 相册名称
- 编辑操作
- 筛选条件
- 排序条件

请以JSON格式返回结果，包含intent和parameters字段。`
        },
        {
          role: 'user',
          content: commandText
        }
      ],
      temperature: 0.3,
      max_tokens: 500
    });
    
    const resultText = response.choices[0].message.content;
    
    // 解析JSON结果
    try {
      // 尝试直接解析
      return JSON.parse(resultText);
    } catch (e) {
      // 尝试从文本中提取JSON
      const jsonMatch = resultText.match(/{[\s\S]*}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('无法解析命令意图');
      }
    }
  } catch (error) {
    console.error('解析命令意图错误:', error);
    return {
      intent: 'unknown',
      parameters: {}
    };
  }
}

/**
 * 处理搜索意图
 * @param {string} userId - 用户ID
 * @param {Object} parameters - 搜索参数
 * @returns {Promise<Object>} - 搜索结果
 */
async function handleSearchIntent(userId, parameters) {
  try {
    // 构建搜索查询
    const searchQuery = parameters.query || '';
    
    // 使用向量搜索
    const searchResults = await vectorService.searchImagesByText(userId, searchQuery);
    
    // 获取匹配图片的详细信息
    const imageIds = searchResults.map(result => result.imageId);
    const images = await Image.find({
      _id: { $in: imageIds },
      userId
    }).select('-analysis.vectorId');
    
    // 按相似度排序
    const sortedImages = imageIds.map(id => {
      return images.find(img => img._id.toString() === id);
    }).filter(Boolean);
    
    return {
      status: 'success',
      message: `找到 ${sortedImages.length} 张匹配的图片`,
      data: {
        matchedImages: sortedImages.map(img => img._id),
        images: sortedImages
      }
    };
  } catch (error) {
    console.error('搜索处理错误:', error);
    return {
      status: 'failed',
      message: error.message || '搜索失败',
      data: {}
    };
  }
}

/**
 * 处理创建相册意图
 * @param {string} userId - 用户ID
 * @param {Object} parameters - 创建参数
 * @returns {Promise<Object>} - 创建结果
 */
async function handleCreateAlbumIntent(userId, parameters) {
  try {
    // 获取相册名称
    const albumName = parameters.albumName || '未命名相册';
    
    // 获取匹配的图片
    let matchedImages = [];
    if (parameters.query) {
      const searchResults = await vectorService.searchImagesByText(userId, parameters.query);
      matchedImages = searchResults.map(result => result.imageId);
    }
    
    // 创建相册
    const album = await Album.create({
      userId,
      title: albumName,
      description: parameters.description || '',
      type: 'system',
      images: matchedImages.map((imageId, index) => ({
        imageId,
        order: index
      })),
      metadata: {
        autoGenerated: true,
        tags: parameters.tags || []
      }
    });
    
    // 如果有图片，设置第一张为封面
    if (matchedImages.length > 0) {
      album.coverImageId = matchedImages[0];
      await album.save();
    }
    
    return {
      status: 'success',
      message: `成功创建相册 "${albumName}" 并添加了 ${matchedImages.length} 张图片`,
      data: {
        albumId: album._id,
        albumName,
        matchedImages,
        imageCount: matchedImages.length
      }
    };
  } catch (error) {
    console.error('创建相册错误:', error);
    return {
      status: 'failed',
      message: error.message || '创建相册失败',
      data: {}
    };
  }
}

/**
 * 处理编辑意图
 * @param {string} userId - 用户ID
 * @param {Object} parameters - 编辑参数
 * @returns {Promise<Object>} - 编辑结果
 */
async function handleEditIntent(userId, parameters) {
  // 简化实现，实际应用中需要更复杂的逻辑
  return {
    status: 'failed',
    message: '编辑功能尚未实现',
    data: {}
  };
}

/**
 * 处理筛选意图
 * @param {string} userId - 用户ID
 * @param {Object} parameters - 筛选参数
 * @returns {Promise<Object>} - 筛选结果
 */
async function handleFilterIntent(userId, parameters) {
  // 简化实现，实际应用中需要更复杂的逻辑
  return {
    status: 'failed',
    message: '筛选功能尚未实现',
    data: {}
  };
}

/**
 * 处理排序意图
 * @param {string} userId - 用户ID
 * @param {Object} parameters - 排序参数
 * @returns {Promise<Object>} - 排序结果
 */
async function handleSortIntent(userId, parameters) {
  // 简化实现，实际应用中需要更复杂的逻辑
  return {
    status: 'failed',
    message: '排序功能尚未实现',
    data: {}
  };
} 