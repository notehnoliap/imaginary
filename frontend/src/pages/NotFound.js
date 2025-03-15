import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-9xl font-bold text-primary">404</h1>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            页面未找到
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            您访问的页面不存在或已被移除。
          </p>
        </div>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            返回首页
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound; 