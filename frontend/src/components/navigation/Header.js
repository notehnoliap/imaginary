import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import { useUI } from '../../context/UIContext';
import { useAuth } from '../../context/AuthContext';

// 图标
import {
  Bars3Icon,
  BellIcon,
  MagnifyingGlassIcon,
  CommandLineIcon,
  ArrowUpTrayIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  SunIcon,
  MoonIcon
} from '@heroicons/react/24/outline';

const Header = () => {
  const { toggleSidebar, toggleCommandBar, toggleUploadModal, theme, toggleTheme } = useUI();
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow">
      <button
        type="button"
        className="px-4 border-r border-border text-text-light focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary md:hidden"
        onClick={toggleSidebar}
      >
        <span className="sr-only">打开侧边栏</span>
        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
      </button>
      
      <div className="flex-1 px-4 flex justify-between">
        <div className="flex-1 flex items-center">
          {/* 搜索框 */}
          <div className="max-w-lg w-full lg:max-w-xs">
            <label htmlFor="search" className="sr-only">
              搜索
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon
                  className="h-5 w-5 text-text-light"
                  aria-hidden="true"
                />
              </div>
              <input
                id="search"
                name="search"
                className="block w-full pl-10 pr-3 py-2 border border-border rounded-md leading-5 bg-background placeholder-text-light focus:outline-none focus:placeholder-text-light focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="搜索图片..."
                type="search"
              />
            </div>
          </div>
          
          {/* 命令栏按钮 */}
          <button
            type="button"
            className="ml-4 px-3 py-1 flex items-center text-sm font-medium text-text-light bg-background rounded-md border border-border hover:bg-background-dark"
            onClick={toggleCommandBar}
          >
            <CommandLineIcon className="h-4 w-4 mr-1" />
            <span>命令</span>
            <span className="ml-2 text-xs bg-border px-1.5 py-0.5 rounded">⌘K</span>
          </button>
        </div>
        
        <div className="ml-4 flex items-center md:ml-6">
          {/* 上传按钮 */}
          <button
            type="button"
            className="p-1 rounded-full text-text-light hover:text-text focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            onClick={toggleUploadModal}
          >
            <span className="sr-only">上传图片</span>
            <ArrowUpTrayIcon className="h-6 w-6" aria-hidden="true" />
          </button>
          
          {/* 主题切换按钮 */}
          <button
            type="button"
            className="ml-3 p-1 rounded-full text-text-light hover:text-text focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            onClick={toggleTheme}
          >
            <span className="sr-only">切换主题</span>
            {theme === 'light' ? (
              <MoonIcon className="h-6 w-6" aria-hidden="true" />
            ) : (
              <SunIcon className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
          
          {/* 通知按钮 */}
          <button
            type="button"
            className="ml-3 p-1 rounded-full text-text-light hover:text-text focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <span className="sr-only">查看通知</span>
            <BellIcon className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* 个人资料下拉菜单 */}
          <Menu as="div" className="ml-3 relative">
            <div>
              <Menu.Button className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                <span className="sr-only">打开用户菜单</span>
                <img
                  className="h-8 w-8 rounded-full"
                  src={user?.profile?.avatar || '/default-avatar.jpg'}
                  alt=""
                />
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      to="/profile"
                      className={`${
                        active ? 'bg-background' : ''
                      } block px-4 py-2 text-sm text-text`}
                    >
                      <div className="flex items-center">
                        <UserCircleIcon className="mr-3 h-5 w-5 text-text-light" aria-hidden="true" />
                        个人资料
                      </div>
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      to="/settings"
                      className={`${
                        active ? 'bg-background' : ''
                      } block px-4 py-2 text-sm text-text`}
                    >
                      <div className="flex items-center">
                        <Cog6ToothIcon className="mr-3 h-5 w-5 text-text-light" aria-hidden="true" />
                        设置
                      </div>
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={logout}
                      className={`${
                        active ? 'bg-background' : ''
                      } block w-full text-left px-4 py-2 text-sm text-text`}
                    >
                      <div className="flex items-center">
                        <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5 text-text-light" aria-hidden="true" />
                        退出登录
                      </div>
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </header>
  );
};

export default Header; 