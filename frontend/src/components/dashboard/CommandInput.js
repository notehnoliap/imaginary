import React, { useState } from 'react';

const CommandInput = ({ onExecute }) => {
  const [command, setCommand] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (command.trim()) {
      onExecute(command);
      setCommand('');
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <form onSubmit={handleSubmit} className="flex items-center">
        <div className="flex-shrink-0 mr-3 text-gray-400">
          &gt;
        </div>
        <input
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          placeholder="输入命令 (例如: 'help', 'upload', 'search')"
          className="flex-1 bg-transparent border-none focus:outline-none text-gray-700 placeholder-gray-400"
        />
        <button
          type="submit"
          className="ml-2 px-3 py-1 bg-primary text-white rounded-md text-sm"
        >
          执行
        </button>
      </form>
      <div className="mt-2 text-xs text-gray-500">
        提示: 输入 'help' 查看可用命令列表
      </div>
    </div>
  );
};

export default CommandInput; 