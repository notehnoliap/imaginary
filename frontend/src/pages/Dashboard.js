import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { UIContext } from '../contexts/UIContext';
import StatsCard from '../components/dashboard/StatsCard';
import RecentImages from '../components/dashboard/RecentImages';
import RecentAlbums from '../components/dashboard/RecentAlbums';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import QuickActions from '../components/dashboard/QuickActions';
import CommandInput from '../components/dashboard/CommandInput';
import { PhotoIcon, FolderIcon, ClockIcon, StarIcon } from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const { openModal } = useContext(UIContext);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalImages: 0,
    totalAlbums: 0,
    recentUploads: 0,
    favorites: 0
  });
  const [recentImages, setRecentImages] = useState([]);
  const [recentAlbums, setRecentAlbums] = useState([]);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    // 模拟数据加载
    const fetchData = async () => {
      try {
        setLoading(true);
        // 在实际应用中，这里应该是从API获取数据
        // 模拟API调用延迟
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 模拟数据
        setStats({
          totalImages: 128,
          totalAlbums: 12,
          recentUploads: 8,
          favorites: 24
        });
        
        setRecentImages([
          { id: 1, url: 'https://source.unsplash.com/random/300x300?nature', description: '自然风景', createdAt: '2天前' },
          { id: 2, url: 'https://source.unsplash.com/random/300x300?city', description: '城市景观', createdAt: '3天前' },
          { id: 3, url: 'https://source.unsplash.com/random/300x300?people', description: '人物肖像', createdAt: '5天前' },
          { id: 4, url: 'https://source.unsplash.com/random/300x300?food', description: '美食佳肴', createdAt: '1周前' }
        ]);
        
        setRecentAlbums([
          { id: 1, name: '旅行', imageCount: 24, coverImage: 'https://source.unsplash.com/random/300x200?travel' },
          { id: 2, name: '家庭', imageCount: 36, coverImage: 'https://source.unsplash.com/random/300x200?family' },
          { id: 3, name: '工作', imageCount: 12, coverImage: 'https://source.unsplash.com/random/300x200?work' }
        ]);
        
        setActivities([
          { type: 'upload', count: 5, time: '今天 14:30' },
          { type: 'album', name: '假期', time: '昨天 09:15' },
          { type: 'share', count: 3, time: '3天前 18:45' },
          { type: 'edit', count: 2, time: '上周 20:30' }
        ]);
        
        setLoading(false);
      } catch (error) {
        console.error('获取数据失败:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCommandExecute = (command) => {
    // 简单的命令处理逻辑
    const cmd = command.toLowerCase().trim();
    
    if (cmd === 'upload' || cmd === '上传') {
      openModal('upload');
    } else if (cmd.startsWith('search') || cmd.startsWith('搜索')) {
      // 处理搜索命令
      console.log('搜索命令:', cmd);
    } else if (cmd === 'help' || cmd === '帮助') {
      // 显示帮助信息
      console.log('显示帮助信息');
    } else {
      // 未知命令
      console.log('未知命令:', cmd);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">欢迎回来，{user?.name || '用户'}</h1>
        <p className="text-gray-600">这是您的个人仪表板，您可以在这里管理您的图片和相册。</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard 
          title="总图片数" 
          value={stats.totalImages} 
          icon={<PhotoIcon className="h-6 w-6" />} 
          loading={loading} 
        />
        <StatsCard 
          title="相册数" 
          value={stats.totalAlbums} 
          icon={<FolderIcon className="h-6 w-6" />} 
          loading={loading} 
        />
        <StatsCard 
          title="最近上传" 
          value={stats.recentUploads} 
          icon={<ClockIcon className="h-6 w-6" />} 
          loading={loading} 
        />
        <StatsCard 
          title="收藏数" 
          value={stats.favorites} 
          icon={<StarIcon className="h-6 w-6" />} 
          loading={loading} 
        />
      </div>

      {/* 快速操作 */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">快速操作</h2>
        <QuickActions />
      </div>

      {/* 命令输入 */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">命令行</h2>
        <CommandInput onExecute={handleCommandExecute} />
      </div>

      {/* 最近图片 */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">最近图片</h2>
        <RecentImages images={recentImages} loading={loading} />
      </div>

      {/* 最近相册 */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">最近相册</h2>
        <RecentAlbums albums={recentAlbums} loading={loading} />
      </div>

      {/* 活动记录 */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">活动记录</h2>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <ActivityFeed activities={activities} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;