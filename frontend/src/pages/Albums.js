import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Albums = () => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5002/api/albums', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setAlbums(response.data.data);
        setLoading(false);
      } catch (err) {
        setError('获取相册失败，请稍后再试');
        setLoading(false);
        console.error('获取相册失败:', err);
      }
    };

    fetchAlbums();
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

  if (albums.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="text-gray-500 mb-4">暂无相册</div>
        <button className="px-4 py-2 bg-primary text-white rounded-md">
          创建相册
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">我的相册</h1>
        <button className="px-4 py-2 bg-primary text-white rounded-md">
          创建相册
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {albums.map((album) => (
          <Link 
            to={`/albums/${album._id}`} 
            key={album._id}
            className="block bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <div className="relative pb-[75%]">
              {album.coverImage ? (
                <img 
                  src={`http://localhost:5002/${album.coverImage}`} 
                  alt={album.name} 
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400 text-xl">无封面</span>
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-medium text-gray-900 truncate">
                {album.name}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {album.imageCount || 0} 张图片
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {new Date(album.createdAt).toLocaleDateString()}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Albums; 