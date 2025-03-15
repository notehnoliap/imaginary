import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './contexts/AuthContext';

// 页面组件
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

// 受保护的路由组件
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = React.useContext(AuthContext);
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// 公开路由组件
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = React.useContext(AuthContext);
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }
  
  return isAuthenticated ? <Navigate to="/" /> : children;
};

function App() {
  return (
    <Routes>
      {/* 公开路由 */}
      <Route path="/login" element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } />
      <Route path="/register" element={
        <PublicRoute>
          <Register />
        </PublicRoute>
      } />
      
      {/* 受保护路由 */}
      <Route path="/" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      
      {/* 404页面 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App; 