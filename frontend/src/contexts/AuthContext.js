import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // 检查本地存储中是否有用户信息
    const checkAuth = () => {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      if (storedUser && token) {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  // 登录函数
  const login = (userData, token) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    setUser(userData);
    setIsAuthenticated(true);
  };

  // 登出函数
  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  // 更新用户信息
  const updateUser = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        isAuthenticated, 
        login, 
        logout, 
        updateUser 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider; 