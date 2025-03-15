import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUI } from '../../context/UIContext';
import { useAuth } from '../../context/AuthContext';

// 图标
import {
  HomeIcon,
  PhotoIcon,
  FolderIcon,
  UserIcon,
  Cog6ToothIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const navigation = [
  { name: '仪表盘', href: '/', icon: HomeIcon },
  { name: '图片库', href: '/gallery', icon: PhotoIcon },
  { name: '相册', href: '/albums', icon: FolderIcon },
  { name: '个人资料', href: '/profile', icon: UserIcon },
  { name: '设置', href: '/settings', icon: Cog6ToothIcon },
];

const Sidebar = () => {
  const location = useLocation();
  const { sidebarOpen, toggleSidebar } = useUI();
  const { user } = useAuth();

  return (
    <>
      {/* 移动端侧边栏 */}
      <div
        className={`${
          sidebarOpen ? 'fixed' : 'hidden'
        } md:hidden inset-0 flex z-40`}
      >
        {/* 背景遮罩 */}
        <div
          className="fixed inset-0 bg-text bg-opacity-75 transition-opacity"
          onClick={toggleSidebar}
        ></div>

        {/* 侧边栏内容 */}
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={toggleSidebar}
            >
              <span className="sr-only">关闭侧边栏</span>
              <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
            </button>
          </div>

          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <img
                className="h-8 w-auto"
                src="/logo.svg"
                alt="Imaginary"
              />
              <span className="ml-2 text-xl font-bold text-primary">Imaginary</span>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    location.pathname === item.href
                      ? 'bg-primary-light bg-opacity-10 text-primary'
                      : 'text-text hover:bg-background hover:text-primary'
                  } group flex items-center px-2 py-2 text-base font-medium rounded-md`}
                >
                  <item.icon
                    className={`${
                      location.pathname === item.href
                        ? 'text-primary'
                        : 'text-text-light group-hover:text-primary'
                    } mr-4 flex-shrink-0 h-6 w-6`}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* 用户信息 */}
          {user && (
            <div className="flex-shrink-0 flex border-t border-border p-4">
              <Link to="/profile" className="flex-shrink-0 group block">
                <div className="flex items-center">
                  <div>
                    <img
                      className="inline-block h-10 w-10 rounded-full"
                      src={user.profile?.avatar || '/default-avatar.jpg'}
                      alt={user.username}
                    />
                  </div>
                  <div className="ml-3">
                    <p className="text-base font-medium text-text">
                      {user.username}
                    </p>
                    <p className="text-sm font-medium text-text-light">
                      查看个人资料
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* 桌面端侧边栏 */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 border-r border-border bg-white">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <img
                  className="h-8 w-auto"
                  src="/logo.svg"
                  alt="Imaginary"
                />
                <span className="ml-2 text-xl font-bold text-primary">Imaginary</span>
              </div>
              <nav className="mt-5 flex-1 px-2 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`${
                      location.pathname === item.href
                        ? 'bg-primary-light bg-opacity-10 text-primary'
                        : 'text-text hover:bg-background hover:text-primary'
                    } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                  >
                    <item.icon
                      className={`${
                        location.pathname === item.href
                          ? 'text-primary'
                          : 'text-text-light group-hover:text-primary'
                      } mr-3 flex-shrink-0 h-6 w-6`}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>

            {/* 用户信息 */}
            {user && (
              <div className="flex-shrink-0 flex border-t border-border p-4">
                <Link to="/profile" className="flex-shrink-0 w-full group block">
                  <div className="flex items-center">
                    <div>
                      <img
                        className="inline-block h-9 w-9 rounded-full"
                        src={user.profile?.avatar || '/default-avatar.jpg'}
                        alt={user.username}
                      />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-text">
                        {user.username}
                      </p>
                      <p className="text-xs font-medium text-text-light">
                        查看个人资料
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar; 