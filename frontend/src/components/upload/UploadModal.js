import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useUI } from '../../context/UIContext';

const UploadModal = () => {
  const { closeUploadModal } = useUI();
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  // 处理文件选择
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    // 验证文件类型
    const validFiles = selectedFiles.filter(file => 
      file.type.startsWith('image/')
    );
    
    if (validFiles.length !== selectedFiles.length) {
      setError('只能上传图片文件');
    } else {
      setError(null);
    }
    
    // 添加预览URL
    const filesWithPreview = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
      type: file.type,
      uploading: false,
      error: null
    }));
    
    setFiles(prev => [...prev, ...filesWithPreview]);
  };

  // 移除文件
  const removeFile = (index) => {
    setFiles(prev => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  // 处理上传
  const handleUpload = async () => {
    if (files.length === 0) return;
    
    setUploading(true);
    setUploadProgress(0);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      
      // 创建一个FormData对象
      const formData = new FormData();
      files.forEach(fileObj => {
        formData.append('images', fileObj.file);
      });
      
      // 上传文件
      await axios.post('http://localhost:5002/api/images/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        }
      });
      
      // 上传成功
      setFiles([]);
      setUploading(false);
      closeUploadModal();
      
      // 这里可以添加成功通知
      
    } catch (err) {
      setError('上传失败，请稍后再试');
      setUploading(false);
      console.error('上传失败:', err);
    }
  };

  // 打开文件选择器
  const openFileSelector = () => {
    fileInputRef.current?.click();
  };

  // 格式化文件大小
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={!uploading ? closeUploadModal : undefined}></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  上传图片
                </h3>
                
                <div className="mt-4">
                  {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                      {error}
                    </div>
                  )}
                  
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary"
                    onClick={openFileSelector}
                  >
                    <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="mt-1 text-sm text-gray-600">
                      点击或拖拽图片到此处上传
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      支持JPG, PNG, GIF等格式，单个文件最大10MB
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                      disabled={uploading}
                    />
                  </div>
                  
                  {files.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-900">已选择 {files.length} 个文件</h4>
                      <ul className="mt-2 divide-y divide-gray-200 max-h-60 overflow-y-auto">
                        {files.map((file, index) => (
                          <li key={index} className="py-2 flex items-center">
                            <img 
                              src={file.preview} 
                              alt={file.name} 
                              className="h-10 w-10 object-cover rounded"
                            />
                            <div className="ml-3 flex-1">
                              <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                              <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                            </div>
                            <button
                              type="button"
                              className="ml-2 bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                              onClick={() => removeFile(index)}
                              disabled={uploading}
                            >
                              <span className="sr-only">移除</span>
                              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {uploading && (
                    <div className="mt-4">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-primary">{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-primary h-2.5 rounded-full" 
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:ml-3 sm:w-auto sm:text-sm"
              onClick={handleUpload}
              disabled={files.length === 0 || uploading}
            >
              {uploading ? '上传中...' : '上传'}
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={closeUploadModal}
              disabled={uploading}
            >
              取消
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadModal; 