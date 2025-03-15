import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ImageDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImageDetails = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5002/api/images/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setImage(response.data.data);
        setLoading(false);
      } catch (err) {
        setError('获取图片详情失败，请稍后再试');
        setLoading(false);
        console.error('获取图片详情失败:', err);
      }
    };

    fetchImageDetails();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('确定要删除这张图片吗？此操作不可撤销。')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5002/api/images/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        navigate('/gallery');
      } catch (err) {
        setError('删除图片失败，请稍后再试');
        console.error('删除图片失败:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !image) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="text-red-500 mb-4">{error || '图片不存在'}</div>
        <button 
          className="px-4 py-2 bg-primary text-white rounded-md"
          onClick={() => navigate('/gallery')}
        >
          返回图片库
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-2/3">
          <div className="bg-white rounded-lg overflow-hidden shadow-md">
            <img 
              src={`http://localhost:5002/${image.path}`} 
              alt={image.title || '图片'} 
              className="w-full h-auto"
            />
          </div>
        </div>
        
        <div className="md:w-1/3">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold mb-4">{image.title || '未命名图片'}</h1>
            
            {image.description && (
              <div className="mb-6">
                <h2 className="text-lg font-medium mb-2">描述</h2>
                <p className="text-gray-700">{image.description}</p>
              </div>
            )}
            
            <div className="mb-6">
              <h2 className="text-lg font-medium mb-2">元数据</h2>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-gray-500">上传时间</div>
                <div>{new Date(image.createdAt).toLocaleString()}</div>
                
                {image.size && (
                  <>
                    <div className="text-gray-500">文件大小</div>
                    <div>{Math.round(image.size / 1024)} KB</div>
                  </>
                )}
                
                {image.dimensions && (
                  <>
                    <div className="text-gray-500">尺寸</div>
                    <div>{image.dimensions.width} x {image.dimensions.height}</div>
                  </>
                )}
              </div>
            </div>
            
            {image.tags && image.tags.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-medium mb-2">标签</h2>
                <div className="flex flex-wrap gap-2">
                  {image.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex gap-4">
              <button 
                className="px-4 py-2 bg-primary text-white rounded-md flex-1"
                onClick={() => navigate(`/gallery/${id}/edit`)}
              >
                编辑
              </button>
              <button 
                className="px-4 py-2 bg-red-500 text-white rounded-md flex-1"
                onClick={handleDelete}
              >
                删除
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageDetail; 