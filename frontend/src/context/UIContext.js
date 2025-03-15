import React, { createContext, useState, useContext } from 'react';

const UIContext = createContext();

export const useUI = () => useContext(UIContext);

export const UIProvider = ({ children }) => {
  // 侧边栏状态
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // 主题设置
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  
  // 通知状态
  const [notifications, setNotifications] = useState([]);
  
  // 命令输入状态
  const [commandBarOpen, setCommandBarOpen] = useState(false);
  
  // 上传模态框状态
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  
  // 切换侧边栏
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  // 切换主题
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    setTheme(newTheme);
    
    // 应用主题到文档
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
  
  // 添加通知
  const addNotification = (notification) => {
    const id = Date.now();
    const newNotification = {
      id,
      ...notification,
      timestamp: new Date()
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // 自动移除通知
    if (notification.autoClose !== false) {
      setTimeout(() => {
        removeNotification(id);
      }, notification.duration || 5000);
    }
    
    return id;
  };
  
  // 移除通知
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };
  
  // 清空所有通知
  const clearNotifications = () => {
    setNotifications([]);
  };
  
  // 切换命令栏
  const toggleCommandBar = () => {
    setCommandBarOpen(!commandBarOpen);
  };
  
  // 切换上传模态框
  const toggleUploadModal = () => {
    setUploadModalOpen(!uploadModalOpen);
  };
  
  // 初始化主题
  React.useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);
  
  const value = {
    sidebarOpen,
    theme,
    notifications,
    commandBarOpen,
    uploadModalOpen,
    toggleSidebar,
    toggleTheme,
    addNotification,
    removeNotification,
    clearNotifications,
    toggleCommandBar,
    toggleUploadModal
  };
  
  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};

export default UIContext; 