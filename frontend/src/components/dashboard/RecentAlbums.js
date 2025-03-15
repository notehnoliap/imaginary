import React from 'react';
import { Link } from 'react-router-dom';

const RecentAlbums = ({ albums, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gray-200 rounded-lg h-40"></div>
            <div className="h-4 bg-gray-200 rounded mt-2 w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded mt-2 w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!albums || albums.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
        <p className="text-gray-500">暂无相册</p>
        <Link 
          to="/albums/create" 
          className="mt-2 inline-block px-4 py-2 bg-primary text-white rounded-md"
        >
          创建相册
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {albums.map((album) => (
        <Link 
          key={album.id} 
          to={`/albums/${album.id}`}
          className="block bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
        >
          <div className="relative pb-[75%]">
            <img 
              src={album.coverImage || '/placeholder-album.jpg'} 
              alt={album.name} 
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          <div className="p-3">
            <p className="text-sm font-medium text-gray-900 truncate">
              {album.name}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {album.imageCount || 0} 张图片
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default RecentAlbums; 