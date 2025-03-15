import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUI } from '../../context/UIContext';

const CommandBar = () => {
  const navigate = useNavigate();
  const { closeCommandBar } = useUI();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const inputRef = useRef(null);

  // 使用useMemo包装预定义的命令
  const commands = useMemo(() => [
    { id: 'home', name: '首页', action: () => navigate('/') },
    { id: 'gallery', name: '图片库', action: () => navigate('/gallery') },
    { id: 'albums', name: '相册', action: () => navigate('/albums') },
    { id: 'profile', name: '个人资料', action: () => navigate('/profile') },
    { id: 'upload', name: '上传图片', action: () => { closeCommandBar(); /* 打开上传模态框 */ } },
    { id: 'logout', name: '退出登录', action: () => { /* 退出登录逻辑 */ } },
  ], [navigate, closeCommandBar]);

  // 过滤命令
  useEffect(() => {
    if (query.trim() === '') {
      setResults(commands);
    } else {
      const filtered = commands.filter(command => 
        command.name.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    }
  }, [query, commands]);

  // 自动聚焦输入框
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // 处理键盘事件
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      closeCommandBar();
    }
  };

  // 执行命令
  const executeCommand = (command) => {
    command.action();
    closeCommandBar();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={closeCommandBar}></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  命令
                </h3>
                <div className="mt-2">
                  <input
                    ref={inputRef}
                    type="text"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="输入命令..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                </div>
                <div className="mt-4 max-h-60 overflow-y-auto">
                  {results.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                      {results.map((command) => (
                        <li 
                          key={command.id}
                          className="py-2 px-2 hover:bg-gray-100 cursor-pointer rounded"
                          onClick={() => executeCommand(command)}
                        >
                          {command.name}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="py-4 text-center text-gray-500">
                      没有找到匹配的命令
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button 
              type="button" 
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={closeCommandBar}
            >
              关闭
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandBar; 