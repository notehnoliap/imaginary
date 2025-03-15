import React from 'react';
import { Outlet } from 'react-router-dom';
import { useUI } from '../../context/UIContext';

// 组件
import Sidebar from '../navigation/Sidebar';
import Header from '../navigation/Header';
import CommandBar from '../command/CommandBar';
import NotificationCenter from '../notifications/NotificationCenter';
import UploadModal from '../upload/UploadModal';

const MainLayout = () => {
  const { commandBarOpen, uploadModalOpen } = useUI();

  return (
    <div className="h-screen flex overflow-hidden bg-background">
      {/* 侧边栏 */}
      <Sidebar />

      {/* 主内容区域 */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <Header />

        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>

      {/* 命令栏 */}
      {commandBarOpen && <CommandBar />}

      {/* 通知中心 */}
      <NotificationCenter />

      {/* 上传模态框 */}
      {uploadModalOpen && <UploadModal />}
    </div>
  );
};

export default MainLayout; 