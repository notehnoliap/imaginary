import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const AlbumDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [album, setAlbum] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlbumDetails = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const albumResponse = await axios.get(`http://localhost:5002/api/albums/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setAlbum(albumResponse.data.data);
        
        // 获取相册中的图片
        const imagesResponse = await axios.get(`http://localhost:5002/api/albums/${id}/images`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setImages(imagesResponse.data.data);
        setLoading(false);
      } catch (err) {
        setError('获取相册详情失败，请稍后再试');
        setLoading(false);
        console.error('获取相册详情失败:', err);
      }
    };

    fetchAlbumDetails();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('确定要删除这个相册吗？此操作不可撤销。')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5002/api/albums/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        navigate('/albums');
      } catch (err) {
        setError('删除相册失败，请稍后再试');
        console.error('删除相册失败:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !album) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="text-red-500 mb-4">{error || '相册不存在'}</div>
        <button 
          className="px-4 py-2 bg-primary text-white rounded-md"
          onClick={() => navigate('/albums')}
        >
          返回相册列表
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">{album.name}</h1>
            {album.description && (
              <p className="text-gray-700 mt-2">{album.description}</p>
            )}
          </div>
          
          <div className="flex gap-4 mt-4 md:mt-0">
            <button 
              className="px-4 py-2 bg-primary text-white rounded-md"
              onClick={() => navigate(`/albums/${id}/edit`)}
            >
              编辑相册
            </button>
            <button 
              className="px-4 py-2 bg-red-500 text-white rounded-md"
              onClick={handleDelete}
            >
              删除相册
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-500">创建时间</span>
            <div>{new Date(album.createdAt).toLocaleString()}</div>
          </div>
          <div>
            <span className="text-gray-500">图片数量</span>
            <div>{images.length}</div>
          </div>
          {album.lastUpdated && (
            <div>
              <span className="text-gray-500">最后更新</span>
              <div>{new Date(album.lastUpdated).toLocaleString()}</div>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">相册图片</h2>
        <button 
          className="px-4 py-2 bg-primary text-white rounded-md"
          onClick={() => navigate(`/albums/${id}/add-images`)}
        >
          添加图片
        </button>
      </div>
      
      {images.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500 mb-4">这个相册还没有图片</p>
          <button 
            className="px-4 py-2 bg-primary text-white rounded-md"
            onClick={() => navigate(`/albums/${id}/add-images`)}
          >
            添加图片
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((image) => (
            <Link 
              to={`/gallery/${image._id}`} 
              key={image._id}
              className="block bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative pb-[100%]">
                <img 
                  src={`http://localhost:5002/${image.path}`} 
                  alt={image.title || '图片'} 
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-900 truncate">
                  {image.title || '未命名图片'}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(image.createdAt).toLocaleDateString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default AlbumDetail; 