import React from 'react';

const ActivityItem = ({ activity }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'upload':
        return '📤';
      case 'album':
        return '📁';
      case 'share':
        return '🔗';
      case 'edit':
        return '✏️';
      case 'delete':
        return '🗑️';
      default:
        return '📝';
    }
  };

  const getActivityMessage = (activity) => {
    switch (activity.type) {
      case 'upload':
        return `上传了 ${activity.count || 1} 张图片`;
      case 'album':
        return `创建了相册 "${activity.name}"`;
      case 'share':
        return `分享了 ${activity.count || 1} 张图片`;
      case 'edit':
        return `编辑了 ${activity.count || 1} 张图片`;
      case 'delete':
        return `删除了 ${activity.count || 1} 张图片`;
      default:
        return activity.message || '执行了操作';
    }
  };

  return (
    <div className="flex items-start py-3 border-b border-gray-100 last:border-0">
      <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-lg">
        {getActivityIcon(activity.type)}
      </div>
      <div className="ml-3 flex-1 min-w-0">
        <p className="text-sm text-gray-900">
          {getActivityMessage(activity)}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {activity.time}
        </p>
      </div>
    </div>
  );
};

const ActivityFeed = ({ activities, loading }) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="flex items-start animate-pulse">
            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
            <div className="ml-3 flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded mt-2 w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-gray-500">暂无活动记录</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {activities.map((activity, index) => (
        <ActivityItem key={index} activity={activity} />
      ))}
    </div>
  );
};

export default ActivityFeed;
