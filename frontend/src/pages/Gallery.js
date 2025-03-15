import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5002/api/images', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setImages(response.data.data);
        setLoading(false);
      } catch (err) {
        setError('获取图片失败，请稍后再试');
        setLoading(false);
        console.error('获取图片失败:', err);
      }
    };

    fetchImages();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="text-red-500 mb-4">{error}</div>
        <button 
          className="px-4 py-2 bg-primary text-white rounded-md"
          onClick={() => window.location.reload()}
        >
          重试
        </button>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="text-gray-500 mb-4">暂无图片</div>
        <button className="px-4 py-2 bg-primary text-white rounded-md">
          上传图片
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">图片库</h1>
        <button className="px-4 py-2 bg-primary text-white rounded-md">
          上传图片
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images.map((image) => (
          <Link 
            to={`/gallery/${image._id}`} 
            key={image._id}
            className="block bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <div className="relative pb-[100%]">
              <img 
                src={`http://localhost:5002/${image.path}`} 
                alt={image.title || '图片'} 
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-medium text-gray-900 truncate">
                {image.title || '未命名图片'}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {new Date(image.createdAt).toLocaleDateString()}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Gallery; 