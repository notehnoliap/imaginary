import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    profile: {
      bio: ''
    },
    preferences: {
      theme: 'system',
      language: 'zh-CN'
    }
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        profile: {
          bio: user.profile?.bio || ''
        },
        preferences: {
          theme: user.preferences?.theme || 'system',
          language: user.preferences?.language || 'zh-CN'
        }
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setFormData({
        ...formData,
        [section]: {
          ...formData[section],
          [field]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        'http://localhost:5002/api/users/me',
        {
          profile: formData.profile,
          preferences: formData.preferences
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      updateUser(response.data.data);
      setSuccess('个人资料已更新');
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || '更新个人资料失败');
      setLoading(false);
      console.error('更新个人资料失败:', err);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('新密码和确认密码不匹配');
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        'http://localhost:5002/api/users/me/password',
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setSuccess('密码已更新');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || '更新密码失败');
      setLoading(false);
      console.error('更新密码失败:', err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">个人资料</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          {success}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-6">基本信息</h2>
            
            <form onSubmit={handleProfileSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">用户名</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  disabled
                  className="w-full px-4 py-2 border rounded-md bg-gray-100"
                />
                <p className="text-sm text-gray-500 mt-1">用户名不可更改</p>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">电子邮件</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="w-full px-4 py-2 border rounded-md bg-gray-100"
                />
                <p className="text-sm text-gray-500 mt-1">电子邮件不可更改</p>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">个人简介</label>
                <textarea
                  name="profile.bio"
                  value={formData.profile.bio}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md"
                  rows="4"
                ></textarea>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">主题</label>
                <select
                  name="preferences.theme"
                  value={formData.preferences.theme}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md"
                >
                  <option value="light">浅色</option>
                  <option value="dark">深色</option>
                  <option value="system">跟随系统</option>
                </select>
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 mb-2">语言</label>
                <select
                  name="preferences.language"
                  value={formData.preferences.language}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md"
                >
                  <option value="zh-CN">中文</option>
                  <option value="en-US">English</option>
                </select>
              </div>
              
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded-md"
                disabled={loading}
              >
                {loading ? '保存中...' : '保存更改'}
              </button>
            </form>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">修改密码</h2>
            
            <form onSubmit={handlePasswordSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">当前密码</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-2 border rounded-md"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">新密码</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-2 border rounded-md"
                  required
                  minLength="6"
                />
                <p className="text-sm text-gray-500 mt-1">密码至少需要6个字符</p>
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 mb-2">确认新密码</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-2 border rounded-md"
                  required
                  minLength="6"
                />
              </div>
              
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded-md"
                disabled={loading}
              >
                {loading ? '更新中...' : '更新密码'}
              </button>
            </form>
          </div>
        </div>
        
        <div>
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-6">账户信息</h2>
            
            <div className="mb-4">
              <div className="text-gray-500 mb-1">账户创建时间</div>
              <div>{new Date(user.createdAt).toLocaleString()}</div>
            </div>
            
            <div className="mb-4">
              <div className="text-gray-500 mb-1">最后登录时间</div>
              <div>{new Date(user.lastLoginAt).toLocaleString()}</div>
            </div>
            
            <div className="mb-4">
              <div className="text-gray-500 mb-1">账户类型</div>
              <div>{user.role === 'admin' ? '管理员' : '普通用户'}</div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">账户操作</h2>
            
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 bg-red-500 text-white rounded-md mb-4"
            >
              退出登录
            </button>
            
            <button
              className="w-full px-4 py-2 border border-red-500 text-red-500 rounded-md"
              onClick={() => {
                if (window.confirm('确定要删除账户吗？此操作不可撤销。')) {
                  // 删除账户逻辑
                }
              }}
            >
              删除账户
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 