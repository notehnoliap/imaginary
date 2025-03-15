import React from 'react';
import { Link } from 'react-router-dom';

const RecentImages = ({ images, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gray-200 rounded-lg h-32"></div>
            <div className="h-4 bg-gray-200 rounded mt-2 w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded mt-2 w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!images || images.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
        <p className="text-gray-500">暂无图片</p>
        <Link 
          to="/gallery" 
          className="mt-2 inline-block px-4 py-2 bg-primary text-white rounded-md"
        >
          上传图片
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {images.map((image) => (
        <Link 
          key={image.id} 
          to={`/gallery/${image.id}`}
          className="block bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
        >
          <div className="relative pb-[100%]">
            <img 
              src={image.url} 
              alt={image.description || '图片'} 
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          <div className="p-3">
            <p className="text-sm font-medium text-gray-900 truncate">
              {image.description || '未命名图片'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {image.createdAt}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default RecentImages; 