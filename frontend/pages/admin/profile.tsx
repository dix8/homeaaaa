import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/router';
import Api from '../../utils/api';
import { Profile } from '../../types';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import FileUpload from '../../components/common/FileUpload';
import AdminLayout from '../../components/layouts/AdminLayout';
import Image from 'next/image';

type AvatarSource = 'upload' | 'url' | 'qq' | 'gravatar';

const ProfileEditPage: React.FC = () => {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [avatarSource, setAvatarSource] = useState<AvatarSource | null>(null);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [qqNumber, setQQNumber] = useState('');
  const [gravatarEmail, setGravatarEmail] = useState('');
  const [gravatarServer, setGravatarServer] = useState('https://www.gravatar.com/avatar/');
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);
  const [mainAvatar, setMainAvatar] = useState<string | null>(null);
  const [customGravatarServer, setCustomGravatarServer] = useState('');
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const gravatarEmailRef = useRef<HTMLInputElement>(null);
  const customServerRef = useRef<HTMLInputElement>(null);
  const qqNumberRef = useRef<HTMLInputElement>(null);
  const urlRef = useRef<HTMLInputElement>(null);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const gravatarServers = [
    { label: '官方服务器', value: 'https://www.gravatar.com/avatar/' },
    { label: 'Cravatar', value: 'https://cravatar.cn/avatar/' },
    { label: 'V2EX', value: 'https://cdn.v2ex.com/gravatar/' },
    { label: '极客族', value: 'https://sdn.geekzu.org/avatar/' },
    { label: 'Loli', value: 'https://gravatar.loli.net/avatar/' },
    { label: '自定义服务器', value: 'custom' }
  ];

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await Api.getProfile();
      
      if (response.data) {
        const data = response.data;
        setProfile(data);
        setMainAvatar(data.avatar);
        
        // 设置头像相关的状态
        if (data.avatarSource) {
          setAvatarSource(data.avatarSource as AvatarSource);
          
          // 根据不同的头像来源设置对应的状态
          switch (data.avatarSource) {
            case 'qq':
              if (data.avatarQQNumber) {
                setQQNumber(data.avatarQQNumber);
                setPreviewAvatar(getQQAvatarUrl(data.avatarQQNumber));
              }
              break;
            case 'gravatar':
              if (data.avatarGravatarEmail) {
                setGravatarEmail(data.avatarGravatarEmail);
                if (data.avatarGravatarServer) {
                  if (data.avatarGravatarServer.startsWith('http')) {
                    setCustomGravatarServer(data.avatarGravatarServer);
                    setGravatarServer('custom');
                  } else {
                    setGravatarServer(data.avatarGravatarServer);
                  }
                }
                setPreviewAvatar(getGravatarUrl(data.avatarGravatarEmail));
              }
              break;
            case 'url':
              if (data.avatarCustomUrl) {
                setAvatarUrl(data.avatarCustomUrl);
                setPreviewAvatar(data.avatarCustomUrl);
              }
              break;
            case 'upload':
              setPreviewAvatar(data.avatar);
              break;
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载失败');
    } finally {
      setLoading(false);
    }
  };

  const getGravatarUrl = (email: string) => {
    const md5 = require('md5');
    const hash = md5(email.trim().toLowerCase());
    return `${gravatarServer}${hash}?s=400&d=mp`;
  };

  const getQQAvatarUrl = (qq: string) => {
    return `https://q1.qlogo.cn/g?b=qq&nk=${qq}&s=640`;
  };

  const handleAvatarSourceChange = (source: AvatarSource) => {
    setAvatarSource(source);
    if (profile) {
      let newAvatarUrl = '';
      switch (source) {
        case 'gravatar':
          // 使用当前的 gravatarEmail 或 profile.email
          const emailToUse = gravatarEmail || profile.email;
          if (emailToUse) {
            newAvatarUrl = getGravatarUrl(emailToUse);
          }
          break;
        case 'qq':
          if (qqNumber) {
            newAvatarUrl = getQQAvatarUrl(qqNumber);
          }
          break;
        case 'url':
          newAvatarUrl = avatarUrl;
          break;
        }
        if (newAvatarUrl) {
          setPreviewAvatar(newAvatarUrl);
        }
      }
    };

  const handleAvatarUpload = async (file: File) => {
    try {
      const { data } = await Api.uploadFile(file, 'avatar');
      if (data?.url) {
        setPreviewAvatar(data.url);
        // 设置头像来源为 upload
        setAvatarSource('upload');
      }
    } catch (error) {
      setError('头像上传失败');
    }
  };

  const handleUploadError = (error: string) => {
    setError(error);
  };

  const handleInputFocus = (inputType: string) => {
    setFocusedInput(inputType);
  };

  const handleQQNumberChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const qqNumber = e.target.value;
    setQQNumber(qqNumber);
    
    const qqAvatarUrl = qqNumber ? `https://q1.qlogo.cn/g?b=qq&nk=${qqNumber}&s=640` : null;
    if (qqAvatarUrl) {
      setPreviewAvatar(qqAvatarUrl);
    }

    // 保持焦点在 QQ 号码输入框
    setTimeout(() => {
      qqNumberRef.current?.focus();
    }, 0);
  };

  const handleGravatarEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setGravatarEmail(email);
    
    if (email && isValidEmail(email)) {
      const gravatarUrl = gravatarServer === 'custom' 
        ? `${customGravatarServer}${require('md5')(email.trim().toLowerCase())}?s=400&d=mp`
        : getGravatarUrl(email);
      setPreviewAvatar(gravatarUrl);
    } else {
      setPreviewAvatar(null);
    }
    // 保持焦点在 Gravatar 邮箱输入框
    setTimeout(() => {
      gravatarEmailRef.current?.focus();
    }, 0);
  };

  const handleGravatarServerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setGravatarServer(value);
    if (value !== 'custom') {
      setCustomGravatarServer('');
      // 更新预览头像
      if (gravatarEmail && isValidEmail(gravatarEmail)) {
        setPreviewAvatar(getGravatarUrl(gravatarEmail));
      }
    }
  };

  const handleCustomGravatarServerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomGravatarServer(value);
    // 更新预览头像
    if (gravatarEmail && isValidEmail(gravatarEmail)) {
      const url = `${value}${require('md5')(gravatarEmail.trim().toLowerCase())}?s=400&d=mp`;
      setPreviewAvatar(url);
    }
    // 使用 setTimeout 确保在状态更新后再设置焦点
    setTimeout(() => {
      customServerRef.current?.focus();
    }, 0);
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setAvatarUrl(url);
    
    if (url && isValidUrl(url)) {
      setPreviewAvatar(url);
    } else {
      setPreviewAvatar(null);
    }
    // 保持焦点在 URL 输入框
    setTimeout(() => {
      urlRef.current?.focus();
    }, 0);
  };

  const handleConfirmAvatar = async () => {
    if (!profile) return;
    
    try {
      let newAvatar = '';
      
      switch (avatarSource) {
        case 'upload':
          if (!previewAvatar) {
            setError('请先上传头像');
            return;
          }
          newAvatar = previewAvatar;
          await Api.updateProfile({
            ...profile,
            avatar: newAvatar,
            avatarSource: 'upload',
            // 其他来源的字段设置为 null
            avatarQQNumber: null,
            avatarGravatarEmail: null,
            avatarGravatarServer: null,
            avatarCustomUrl: null
          });
          break;

        case 'gravatar':
          newAvatar = getGravatarUrl(gravatarEmail || profile.email);
          await Api.updateProfile({
            ...profile,
            avatar: newAvatar,
            avatarSource: 'gravatar',
            email: gravatarEmail || profile.email,
            avatarGravatarEmail: gravatarEmail || profile.email,
            avatarGravatarServer: gravatarServer === 'custom' ? customGravatarServer : gravatarServer,
            // 其他来源的字段设置为 null
            avatarQQNumber: null,
            avatarCustomUrl: null
          });
          break;
        
        case 'qq':
          newAvatar = getQQAvatarUrl(qqNumber || '');
          await Api.updateProfile({
            ...profile,
            avatar: newAvatar,
            avatarSource: 'qq',
            avatarQQNumber: qqNumber,
            // 其他来源的字段设置为 null
            avatarGravatarEmail: null,
            avatarGravatarServer: null,
            avatarCustomUrl: null
          });
          break;
        
        case 'url':
          if (!avatarUrl || !isValidUrl(avatarUrl)) {
            setError('请输入有效的图片链接');
            return;
          }
          newAvatar = avatarUrl;
          await Api.updateProfile({
            ...profile,
            avatar: newAvatar,
            avatarSource: 'url',
            avatarCustomUrl: avatarUrl,
            // 其他来源的字段设置为 null
            avatarQQNumber: null,
            avatarGravatarEmail: null,
            avatarGravatarServer: null
          });
          break;
      }

      // 更新本地状态
      setProfile(prev => {
        if (!prev) return prev;
        const updatedProfile = {
          ...prev,
          avatar: newAvatar,
          avatarSource
        };

        // 根据不同的头像来源添加对应的字段
        switch (avatarSource) {
          case 'upload':
            updatedProfile.avatarQQNumber = null;
            updatedProfile.avatarGravatarEmail = null;
            updatedProfile.avatarGravatarServer = null;
            updatedProfile.avatarCustomUrl = null;
            break;
          case 'gravatar':
            updatedProfile.email = gravatarEmail || prev.email;
            updatedProfile.avatarGravatarEmail = gravatarEmail || prev.email;
            updatedProfile.avatarGravatarServer = gravatarServer === 'custom' ? customGravatarServer : gravatarServer;
            updatedProfile.avatarQQNumber = null;
            updatedProfile.avatarCustomUrl = null;
            break;
          case 'qq':
            updatedProfile.avatarQQNumber = qqNumber;
            updatedProfile.avatarGravatarEmail = null;
            updatedProfile.avatarGravatarServer = null;
            updatedProfile.avatarCustomUrl = null;
            break;
          case 'url':
            updatedProfile.avatarCustomUrl = avatarUrl;
            updatedProfile.avatarQQNumber = null;
            updatedProfile.avatarGravatarEmail = null;
            updatedProfile.avatarGravatarServer = null;
            break;
        }

        return updatedProfile;
      });

      // 更新主头像显示
      setMainAvatar(newAvatar);

      setSuccessMessage('头像更新成功！');
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      closeAvatarModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : '更新头像失败');
    }
  };

  const validateUrls = () => {
    if (!profile) return false;
    
    const urlPattern = /^https?:\/\/.+/;
    if (profile.github && !urlPattern.test(profile.github)) {
      setError('GitHub URL must be a valid URL starting with http:// or https://');
      return false;
    }
    if (profile.linkedin && !urlPattern.test(profile.linkedin)) {
      setError('LinkedIn URL must be a valid URL starting with http:// or https://');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setError(null);
    setSuccessMessage(null);

    if (!validateUrls()) {
      return;
    }

    try {
      setSaving(true);
      await Api.updateProfile(profile);
      setSuccessMessage('个人资料更新成功！');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存失败');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!profile) return;
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  const renderAvatarSettings = () => {
    return (
      <div>
        <div className="flex justify-center space-x-4 mb-4">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="radio"
              className="form-radio text-blue-600 border-gray-300 focus:ring-blue-500"
              name="avatarSource"
              checked={avatarSource === 'upload'}
              onChange={() => handleAvatarSourceChange('upload')}
            />
            <span className="ml-2 text-gray-700">上传图片</span>
          </label>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="radio"
              className="form-radio text-blue-600 border-gray-300 focus:ring-blue-500"
              name="avatarSource"
              checked={avatarSource === 'url'}
              onChange={() => handleAvatarSourceChange('url')}
            />
            <span className="ml-2 text-gray-700">图片链接</span>
          </label>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="radio"
              className="form-radio text-blue-600 border-gray-300 focus:ring-blue-500"
              name="avatarSource"
              checked={avatarSource === 'qq'}
              onChange={() => handleAvatarSourceChange('qq')}
            />
            <span className="ml-2 text-gray-700">QQ头像</span>
          </label>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="radio"
              className="form-radio text-blue-600 border-gray-300 focus:ring-blue-500"
              name="avatarSource"
              checked={avatarSource === 'gravatar'}
              onChange={() => handleAvatarSourceChange('gravatar')}
            />
            <span className="ml-2 text-gray-700">Gravatar</span>
          </label>
        </div>

        {avatarSource === 'upload' && (
          <div className="mt-4 flex flex-col items-center space-y-4">
            <FileUpload
              type="avatar"
              onUploadSuccess={(url) => setPreviewAvatar(url)}
              onUploadError={(error) => setError(error)}
              buttonText="选择图片"
              className="w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            />
          </div>
        )}

        {avatarSource === 'url' && (
          <div className="mt-2">
            <input
              ref={urlRef}
              type="url"
              value={avatarUrl}
              onChange={handleUrlChange}
              placeholder="请输入图片URL"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        )}

        {avatarSource === 'qq' && (
          <div className="mt-2">
            <input
              ref={qqNumberRef}
              type="text"
              value={qqNumber}
              onChange={handleQQNumberChange}
              placeholder="请输入QQ号"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        )}

        {avatarSource === 'gravatar' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gravatar 邮箱
              </label>
              <input
                ref={gravatarEmailRef}
                type="email"
                value={gravatarEmail}
                onChange={handleGravatarEmailChange}
                placeholder="请输入Gravatar邮箱"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                服务器
              </label>
              <select
                value={gravatarServer}
                onChange={handleGravatarServerChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                {gravatarServers.map(server => (
                  <option key={server.value} value={server.value}>
                    {server.label}
                  </option>
                ))}
              </select>
            </div>
            {gravatarServer === 'custom' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  自定义服务器地址
                </label>
                <input
                  ref={customServerRef}
                  type="url"
                  value={customGravatarServer}
                  onChange={handleCustomGravatarServerChange}
                  placeholder="请输入Gravatar服务器地址，例如：https://example.com/avatar/"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const openAvatarModal = () => {
    setIsAvatarModalOpen(true);
    // 根据当前的 avatarSource 设置焦点
    if (profile?.avatarSource) {
      setAvatarSource(profile.avatarSource as AvatarSource);
      switch (profile.avatarSource) {
        case 'qq':
          if (profile.avatarQQNumber) {
            setQQNumber(profile.avatarQQNumber);
            setPreviewAvatar(getQQAvatarUrl(profile.avatarQQNumber));
          }
          break;
        case 'gravatar':
          if (profile.avatarGravatarEmail) {
            setGravatarEmail(profile.avatarGravatarEmail);
            if (profile.avatarGravatarServer) {
              setGravatarServer(profile.avatarGravatarServer);
            }
            setPreviewAvatar(getGravatarUrl(profile.avatarGravatarEmail));
          }
          break;
        case 'url':
          if (profile.avatarCustomUrl) {
            setAvatarUrl(profile.avatarCustomUrl);
            setPreviewAvatar(profile.avatarCustomUrl);
          }
          break;
        case 'upload':
          setPreviewAvatar(profile.avatar);
          break;
      }
    } else {
      // 如果没有设置过头像来源，默认选择上传方式
      setAvatarSource('upload');
      if (profile?.avatar) {
        setPreviewAvatar(profile.avatar);
      }
    }
  };

  const closeAvatarModal = () => {
    setIsAvatarModalOpen(false);
  };

  // 添加邮箱验证函数
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const AvatarModal = () => {
    if (!isAvatarModalOpen) return null;

    const canConfirm = () => {
      if (!avatarSource || !previewAvatar) return false;
      
      switch (avatarSource) {
        case 'qq':
          return !!qqNumber;
        case 'gravatar':
          return !!gravatarEmail && isValidEmail(gravatarEmail) && 
            (gravatarServer !== 'custom' || (!!customGravatarServer && isValidUrl(customGravatarServer)));
        case 'url':
          return !!avatarUrl && isValidUrl(avatarUrl);
        case 'upload':
          return !!previewAvatar;
        default:
          return false;
      }
    };

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity" aria-hidden="true">
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>

          <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button
                  type="button"
                  className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={closeAvatarModal}
                >
                  <span className="sr-only">关闭</span>
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    更换头像
                  </h3>
                  <div className="flex flex-col items-center mb-6">
                    <div className="w-32 h-32 rounded-full bg-gray-100 border-2 border-gray-200 overflow-hidden mb-4">
                      {previewAvatar && isValidUrl(previewAvatar) ? (
                        <Image
                          src={previewAvatar}
                          alt="Preview Avatar"
                          width={128}
                          height={128}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
                          <svg 
                            className="w-16 h-16 text-gray-400" 
                            fill="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-2">
                    {renderAvatarSettings()}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 flex justify-end">
              <button
                type="button"
                className={`inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white sm:text-sm ${
                  canConfirm() && !saving
                    ? 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
                onClick={handleConfirmAvatar}
                disabled={!canConfirm() || saving}
              >
                {saving ? '保存中...' : '确认'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (loading) {
      return <LoadingSpinner size="large" className="mt-8" />;
    }

    if (!profile) {
      return <ErrorMessage message="Failed to load profile" />;
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative w-40 h-40 rounded-full bg-gray-100 border-2 border-gray-200 overflow-hidden group cursor-pointer">
              {mainAvatar ? (
                <Image
                  src={mainAvatar}
                  alt="Profile Avatar"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
                  <svg 
                    className="w-20 h-20 text-gray-400" 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
              )}
              <button
                type="button"
                onClick={openAvatarModal}
                className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <span className="text-white font-medium">更换头像</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                姓名
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={profile.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                职位
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={profile.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              个人简介
            </label>
            <textarea
              id="bio"
              name="bio"
              value={profile.bio}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-medium text-gray-700">联系方式</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  电子邮箱
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  GitHub 主页
                </label>
                <input
                  type="url"
                  id="github"
                  name="github"
                  value={profile.github || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  LinkedIn 主页
                </label>
                <input
                  type="url"
                  id="linkedin"
                  name="linkedin"
                  value={profile.linkedin || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Twitter 主页
                </label>
                <input
                  type="url"
                  id="twitter"
                  name="twitter"
                  value={profile.twitter || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telegram
                </label>
                <input
                  type="url"
                  id="telegram"
                  name="telegram"
                  value={profile.telegram || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  YouTube 频道
                </label>
                <input
                  type="url"
                  id="youtube"
                  name="youtube"
                  value={profile.youtube || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  哔哩哔哩主页
                </label>
                <input
                  type="url"
                  id="bilibili"
                  name="bilibili"
                  value={profile.bilibili || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
            onClick={handleSubmit}
            disabled={saving}
          >
            {saving ? '保存中...' : '保存'}
          </button>
        </div>
      </form>
    );
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">编辑个人资料</h1>
        {renderContent()}
        <AvatarModal />
      </div>
    </AdminLayout>
  );
};

export default ProfileEditPage; 