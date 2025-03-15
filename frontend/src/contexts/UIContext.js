import React, { createContext, useState } from 'react';

export const UIContext = createContext();

export const UIProvider = ({ children }) => {
  const [modals, setModals] = useState({
    upload: false,
    createAlbum: false,
    imageDetail: false,
    share: false,
    settings: false,
    command: false
  });
  
  const [currentImage, setCurrentImage] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  
  // 打开模态框
  const openModal = (modalName, data = null) => {
    if (modalName === 'imageDetail' && data) {
      setCurrentImage(data);
    }
    
    setModals(prev => ({
      ...prev,
      [modalName]: true
    }));
  };
  
  // 关闭模态框
  const closeModal = (modalName) => {
    setModals(prev => ({
      ...prev,
      [modalName]: false
    }));
    
    if (modalName === 'imageDetail') {
      setCurrentImage(null);
    }
  };
  
  // 切换侧边栏
  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };
  
  // 切换主题
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };
  
  return (
    <UIContext.Provider
      value={{
        modals,
        currentImage,
        sidebarOpen,
        theme,
        openModal,
        closeModal,
        toggleSidebar,
        toggleTheme
      }}
    >
      {children}
    </UIContext.Provider>
  );
};

export default UIProvider; 