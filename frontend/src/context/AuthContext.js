import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import axios from 'axios';

// 设置API基础URL
axios.defaults.baseURL = 'http://localhost:5002';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 配置axios默认请求头
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // 检查用户是否已登录
  const checkAuth = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get('/api/users/me');
      setUser(res.data.data);
      setLoading(false);
    } catch (err) {
      console.error('认证检查失败:', err);
      // 不要在认证检查失败时立即登出用户
      // 可能是临时网络问题或服务器问题
      setError('认证检查失败，请重新登录');
      setLoading(false);
    }
  }, [token]);

  // 用户注册
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.post('/api/users/register', userData);
      
      const { token: newToken, user: newUser } = res.data;
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(newUser);
      setLoading(false);
      
      return { success: true };
    } catch (err) {
      setLoading(false);
      const message = err.response?.data?.message || '注册失败，请稍后重试';
      setError(message);
      return { success: false, message };
    }
  };

  // 用户登录
  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.post('/api/users/login', credentials);
      
      const { token: newToken, user: newUser } = res.data;
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(newUser);
      setLoading(false);
      
      return { success: true };
    } catch (err) {
      setLoading(false);
      const message = err.response?.data?.message || '登录失败，请检查您的凭据';
      setError(message);
      return { success: false, message };
    }
  };

  // 用户登出
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  // 更新用户信息
  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      const res = await axios.put('/api/users/me', profileData);
      setUser(res.data.data);
      setLoading(false);
      return { success: true };
    } catch (err) {
      setLoading(false);
      const message = err.response?.data?.message || '更新个人资料失败';
      setError(message);
      return { success: false, message };
    }
  };

  // 修改密码
  const changePassword = async (passwordData) => {
    try {
      setLoading(true);
      await axios.put('/api/users/me/password', passwordData);
      setLoading(false);
      return { success: true };
    } catch (err) {
      setLoading(false);
      const message = err.response?.data?.message || '修改密码失败';
      setError(message);
      return { success: false, message };
    }
  };

  const value = {
    user,
    token,
    loading,
    error,
    isAuthenticated: !!user,
    register,
    login,
    logout,
    checkAuth,
    updateProfile,
    changePassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext; 