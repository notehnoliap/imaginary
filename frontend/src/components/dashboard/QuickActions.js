import React from 'react';
import { Link } from 'react-router-dom';

const QuickActions = () => {
  const actions = [
    {
      id: 'upload',
      title: '上传图片',
      description: '上传新的图片到您的库',
      icon: '📤',
      path: '/upload',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      id: 'create-album',
      title: '创建相册',
      description: '整理您的图片到新相册',
      icon: '📁',
      path: '/albums/create',
      color: 'bg-green-100 text-green-600'
    },
    {
      id: 'share',
      title: '分享图片',
      description: '与朋友分享您的图片',
      icon: '🔗',
      path: '/gallery',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      id: 'settings',
      title: '设置',
      description: '管理您的账户设置',
      icon: '⚙️',
      path: '/settings',
      color: 'bg-gray-100 text-gray-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {actions.map((action) => (
        <Link
          key={action.id}
          to={action.path}
          className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
        >
          <div className={`w-10 h-10 rounded-full ${action.color} flex items-center justify-center text-xl`}>
            {action.icon}
          </div>
          <div className="ml-4">
            <h3 className="text-sm font-medium text-gray-900">{action.title}</h3>
            <p className="text-xs text-gray-500 mt-1">{action.description}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default QuickActions;
