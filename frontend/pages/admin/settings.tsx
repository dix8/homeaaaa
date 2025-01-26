import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/layouts/AdminLayout';
import Api from '../../utils/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import FileUpload from '../../components/common/FileUpload';
import Image from 'next/image';

interface SiteSettings {
  id: number;
  title: string;
  pageTitle: string;
  favicon: string | null;
  logo: string | null;
  description: string | null;
  keywords: string | null;
  copyright: string | null;
  icp: string | null;
  gongan: string | null;
}

const defaultSettings: Omit<SiteSettings, 'id'> = {
  title: '个人主页',
  pageTitle: '个人主页',
  favicon: null,
  logo: null,
  description: '',
  keywords: '',
  copyright: '',
  icp: '',
  gongan: ''
};

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [logoInputType, setLogoInputType] = useState<'upload' | 'url'>('upload');
  const [faviconInputType, setFaviconInputType] = useState<'upload' | 'url'>('upload');
  const [logoUrl, setLogoUrl] = useState('');
  const [faviconUrl, setFaviconUrl] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await Api.getSettings();
      if (response.error) {
        setError(response.error);
        return;
      }
      if (response.data) {
        setSettings(response.data);
        if (response.data.logo) {
          setLogoUrl(response.data.logo);
        }
        if (response.data.favicon) {
          setFaviconUrl(response.data.favicon);
        }
      } else {
        setError('无法加载设置数据');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载设置失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    try {
      setSaving(true);
      setError(null);
      setSuccessMessage(null);

      const updatedSettings = {
        ...settings,
        title: settings.title,
        pageTitle: settings.pageTitle,
        logo: logoInputType === 'url' ? logoUrl : settings.logo,
        favicon: faviconInputType === 'url' ? faviconUrl : settings.favicon,
        description: settings.description,
        keywords: settings.keywords,
        copyright: settings.copyright,
        icp: settings.icp,
        gongan: settings.gongan
      };

      const response = await Api.updateSettings(updatedSettings);
      if (response.error) {
        setError(response.error);
        return;
      }
      if (response.data) {
        setSettings(response.data);
        setSuccessMessage('设置已保存');
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存设置失败');
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (file: File, type: 'favicon' | 'logo') => {
    try {
      const response = await Api.uploadFile(file, type);
      if (response.error) {
        setError(response.error);
        return;
      }
      if (response.data?.url && settings) {
        setSettings({
          ...settings,
          [type]: response.data.url
        });
        if (type === 'logo') {
          setLogoUrl(response.data.url);
        } else {
          setFaviconUrl(response.data.url);
        }
      }
    } catch (error) {
      setError('文件上传失败');
    }
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center">
          <LoadingSpinner size="large" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
              网站设置
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={settings?.pageTitle || ''}
                  onChange={(e) => setSettings(prev => prev ? { ...prev, pageTitle: e.target.value } : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="请输入网站 Title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  网站标题
                </label>
                <input
                  type="text"
                  value={settings?.title || ''}
                  onChange={(e) => setSettings(prev => prev ? { ...prev, title: e.target.value } : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="请输入网站标题"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo
                </label>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        value="upload"
                        checked={logoInputType === 'upload'}
                        onChange={(e) => setLogoInputType(e.target.value as 'upload' | 'url')}
                        className="form-radio"
                      />
                      <span className="ml-2">上传图片</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        value="url"
                        checked={logoInputType === 'url'}
                        onChange={(e) => setLogoInputType(e.target.value as 'upload' | 'url')}
                        className="form-radio"
                      />
                      <span className="ml-2">图片链接</span>
                    </label>
                  </div>
                  
                  {logoInputType === 'upload' ? (
                    <FileUpload
                      type="logo"
                      onUploadSuccess={(url) => handleFileUpload(new File([], url), 'logo')}
                      onUploadError={(error) => setError(error)}
                      buttonText="上传 Logo"
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    />
                  ) : (
                    <input
                      type="url"
                      value={logoUrl}
                      onChange={(e) => setLogoUrl(e.target.value)}
                      placeholder="请输入 Logo URL"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  )}
                  
                  {settings?.logo && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 mb-2">当前 Logo:</p>
                      <img
                        src={settings.logo}
                        alt="Logo"
                        className="max-h-20 object-contain"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Favicon
                </label>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        value="upload"
                        checked={faviconInputType === 'upload'}
                        onChange={(e) => setFaviconInputType(e.target.value as 'upload' | 'url')}
                        className="form-radio"
                      />
                      <span className="ml-2">上传图片</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        value="url"
                        checked={faviconInputType === 'url'}
                        onChange={(e) => setFaviconInputType(e.target.value as 'upload' | 'url')}
                        className="form-radio"
                      />
                      <span className="ml-2">图片链接</span>
                    </label>
                  </div>
                  
                  {faviconInputType === 'upload' ? (
                    <FileUpload
                      type="favicon"
                      onUploadSuccess={(url) => handleFileUpload(new File([], url), 'favicon')}
                      onUploadError={(error) => setError(error)}
                      buttonText="上传 Favicon"
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    />
                  ) : (
                    <input
                      type="url"
                      value={faviconUrl}
                      onChange={(e) => setFaviconUrl(e.target.value)}
                      placeholder="请输入 Favicon URL"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  )}
                  
                  {settings?.favicon && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 mb-2">当前 Favicon:</p>
                      <img
                        src={settings.favicon}
                        alt="Favicon"
                        className="max-h-8 object-contain"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  网站描述
                </label>
                <textarea
                  value={settings?.description || ''}
                  onChange={(e) => setSettings(prev => prev ? { ...prev, description: e.target.value } : null)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  关键词
                </label>
                <input
                  type="text"
                  value={settings?.keywords || ''}
                  onChange={(e) => setSettings(prev => prev ? { ...prev, keywords: e.target.value } : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="用逗号分隔关键词"
                />
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">底部信息设置</h4>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      版权信息
                    </label>
                    <input
                      type="text"
                      value={settings?.copyright || ''}
                      onChange={(e) => setSettings(prev => prev ? { ...prev, copyright: e.target.value } : null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="例如：© 2024 您的名字. All rights reserved."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ICP备案号
                    </label>
                    <input
                      type="text"
                      value={settings?.icp || ''}
                      onChange={(e) => setSettings(prev => prev ? { ...prev, icp: e.target.value } : null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="例如：京ICP备XXXXXXXX号"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      如果没有备案号可以留空
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      公安备案号
                    </label>
                    <input
                      type="text"
                      value={settings?.gongan || ''}
                      onChange={(e) => setSettings(prev => prev ? { ...prev, gongan: e.target.value } : null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="例如：京公网安备 XXXXXXXXXXXX号"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      如果没有公安备案号可以留空
                    </p>
                  </div>
                </div>
              </div>

              {error && <ErrorMessage message={error} />}
              
              {successMessage && (
                <div className="bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded">
                  {successMessage}
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
                >
                  {saving ? '保存中...' : '保存设置'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SettingsPage; 