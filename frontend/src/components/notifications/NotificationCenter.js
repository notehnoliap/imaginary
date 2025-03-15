import React, { useState, useEffect } from 'react';
import { useUI } from '../../context/UIContext';

const NotificationCenter = () => {
  const { notificationOpen, closeNotification } = useUI();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  // 模拟获取通知
  useEffect(() => {
    if (notificationOpen) {
      setLoading(true);
      // 模拟API调用
      setTimeout(() => {
        setNotifications([
          {
            id: 1,
            title: '系统通知',
            message: '欢迎使用Imaginary智能图像分析平台',
            date: new Date(),
            read: false,
            type: 'info'
          },
          {
            id: 2,
            title: '上传成功',
            message: '您的图片已成功上传并处理',
            date: new Date(Date.now() - 3600000),
            read: true,
            type: 'success'
          }
        ]);
        setLoading(false);
      }, 500);
    }
  }, [notificationOpen]);

  // 标记通知为已读
  const markAsRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  // 删除通知
  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  // 标记所有为已读
  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };

  if (!notificationOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={closeNotification}></div>
        
        <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
          <div className="relative w-screen max-w-md">
            <div className="h-full flex flex-col bg-white shadow-xl overflow-y-auto">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <h2 className="text-lg font-medium text-gray-900" id="slide-over-title">
                    通知中心
                  </h2>
                  <div className="ml-3 h-7 flex items-center">
                    <button
                      type="button"
                      className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                      onClick={closeNotification}
                    >
                      <span className="sr-only">关闭面板</span>
                      <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="border-b border-gray-200 px-6 py-2 flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {notifications.filter(n => !n.read).length} 条未读通知
                </span>
                <button
                  className="text-sm text-primary hover:text-primary-dark"
                  onClick={markAllAsRead}
                  disabled={!notifications.some(n => !n.read)}
                >
                  全部标为已读
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                {loading ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                    <svg className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <p>暂无通知</p>
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {notifications.map((notification) => (
                      <li 
                        key={notification.id} 
                        className={`p-4 hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}
                      >
                        <div className="flex justify-between">
                          <div className="flex-1">
                            <h3 className="text-sm font-medium text-gray-900">
                              {notification.title}
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                              {notification.message}
                            </p>
                            <p className="mt-1 text-xs text-gray-400">
                              {new Date(notification.date).toLocaleString()}
                            </p>
                          </div>
                          <div className="ml-4 flex-shrink-0 flex">
                            {!notification.read && (
                              <button
                                type="button"
                                className="mr-2 bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                                onClick={() => markAsRead(notification.id)}
                              >
                                <span className="sr-only">标为已读</span>
                                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                              </button>
                            )}
                            <button
                              type="button"
                              className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                              onClick={() => deleteNotification(notification.id)}
                            >
                              <span className="sr-only">删除</span>
                              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter; 