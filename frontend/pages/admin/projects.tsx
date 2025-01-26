import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/layouts/AdminLayout';
import Api from '../../utils/api';
import { Project, Skill } from '../../types';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import FileUpload from '../../components/common/FileUpload';
import ImagePreview from '../../components/common/ImagePreview';

const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProject, setEditingProject] = useState<Partial<Project>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTechnology, setSelectedTechnology] = useState<string>('');
  const [previewImage, setPreviewImage] = useState<{ url: string; title: string } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterProjects();
  }, [searchTerm, selectedTechnology, projects, sortBy]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [projectsRes, skillsRes] = await Promise.all([
        Api.getProjects(),
        Api.getSkills()
      ]);
      
      if (projectsRes.data) {
        const projectsWithParsedTechnologies = projectsRes.data.map(project => ({
          ...project,
          technologies: typeof project.technologies === 'string' 
            ? JSON.parse(project.technologies) 
            : project.technologies || []
        }));
        const sortedProjects = sortProjects(projectsWithParsedTechnologies);
        setProjects(sortedProjects);
        setFilteredProjects(sortedProjects);
      }
      if (skillsRes.data) {
        setSkills(skillsRes.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载数据失败');
    } finally {
      setLoading(false);
    }
  };

  const filterProjects = () => {
    let filtered = [...projects];

    // 应用排序
    filtered = sortProjects(filtered);

    // 应用搜索
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(project => 
        project.title.toLowerCase().includes(searchLower) ||
        project.description.toLowerCase().includes(searchLower)
      );
    }

    // 应用技术筛选
    if (selectedTechnology) {
      filtered = filtered.filter(project =>
        project.technologies.includes(selectedTechnology)
      );
    }

    setFilteredProjects(filtered);
  };

  const sortProjects = (projectsToSort: Project[]) => {
    return [...projectsToSort].sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
    });
  };

  const handleSortChange = (newSortBy: 'newest' | 'oldest') => {
    setSortBy(newSortBy);
    setProjects(sortProjects(projects));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      
      // 验证必填字段
      if (!editingProject.title?.trim()) {
        setError('请输入项目标题');
        return;
      }
      if (!editingProject.description?.trim()) {
        setError('请输入项目描述');
        return;
      }

      // 准备提交的数据
      const now = new Date().toISOString();
      const projectData = {
        title: editingProject.title.trim(),
        description: editingProject.description.trim(),
        imageUrl: editingProject.imageUrl || '',
        projectUrl: editingProject.projectUrl || '',
        technologies: Array.isArray(editingProject.technologies) ? editingProject.technologies : [],
        createdAt: editingProject.id ? editingProject.createdAt || now : now,
        updatedAt: now
      };

      console.log('Submitting project data:', projectData);

      if (editingProject.id) {
        await Api.updateProject(editingProject.id, projectData);
        setSuccessMessage('项目更新成功！');
      } else {
        await Api.createProject(projectData);
        setSuccessMessage('项目添加成功！');
      }
      
      await loadData();
      setIsEditing(false);
      setEditingProject({});
      
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Project submission error:', err);
      setError(err instanceof Error ? err.message : '保存失败，请检查所有必填字段');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('确定要删除这个项目吗？')) {
      return;
    }

    try {
      await Api.deleteProject(id);
      setSuccessMessage('项目删除成功！');
      await loadData();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : '删除失败');
    }
  };

  const startEdit = (project?: Project) => {
    setIsEditing(true);
    setEditingProject(project || { technologies: [] });
    setError(null);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditingProject({});
    setError(null);
  };

  const handleImageUpload = async (file: File) => {
    try {
      const { data } = await Api.uploadFile(file, 'project');
      if (data?.url) {
        setEditingProject(prev => ({
          ...prev,
          imageUrl: data.url
        }));
      }
    } catch (error) {
      console.error('Failed to upload image:', error);
      setError('图片上传失败');
    }
  };

  const handleTechnologyChange = (technology: string, checked: boolean) => {
    const technologies = editingProject.technologies || [];
    if (checked) {
      setEditingProject(prev => ({
        ...prev,
        technologies: [...technologies, technology]
      }));
    } else {
      setEditingProject(prev => ({
        ...prev,
        technologies: technologies.filter(t => t !== technology)
      }));
    }
  };

  const renderProjectForm = () => (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl my-8">
        <h3 className="text-lg font-medium mb-4">
          {editingProject.id ? '编辑项目' : '添加项目'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">项目图片</label>
            <div className="space-y-4">
              {editingProject.imageUrl && (
                <img
                  src={editingProject.imageUrl}
                  alt="Project preview"
                  className="h-32 w-48 object-cover rounded"
                />
              )}
              <div className="flex flex-col space-y-4">
                <input
                  type="url"
                  value={editingProject.imageUrl || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, imageUrl: e.target.value })}
                  placeholder="输入图片URL"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="text-sm text-gray-500">或</div>
                <FileUpload
                  type="project"
                  onUploadSuccess={(url: string) => setEditingProject({ ...editingProject, imageUrl: url })}
                  onUploadError={(error: string) => setError(error)}
                  buttonText={editingProject.imageUrl ? "更换图片" : "上传图片"}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">标题</label>
            <input
              type="text"
              value={editingProject.title || ''}
              onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">描述</label>
            <textarea
              value={editingProject.description || ''}
              onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">项目链接</label>
            <input
              type="url"
              value={editingProject.projectUrl || ''}
              onChange={(e) => setEditingProject({ ...editingProject, projectUrl: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">使用的技术</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {skills.map((skill) => (
                <label key={skill.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={(editingProject.technologies || []).includes(skill.name)}
                    onChange={(e) => handleTechnologyChange(skill.name, e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{skill.name}</span>
                </label>
              ))}
            </div>
          </div>

          {error && <ErrorMessage message={error} />}

          <div className="flex justify-end space-x-3 mt-4">
            <button
              type="button"
              onClick={cancelEdit}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderProjectsList = () => {
    if (loading) {
      return <LoadingSpinner size="large" className="mt-8" />;
    }

    if (filteredProjects.length === 0) {
      return (
        <div className="text-center text-gray-500 mt-8">
          {projects.length === 0 ? '还没有添加任何项目' : '没有找到匹配的项目'}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProjects.map((project) => (
          <div key={project.id} className="bg-white shadow rounded-lg overflow-hidden">
            <div 
              className="relative h-48 cursor-pointer group"
              onClick={() => setPreviewImage({ 
                url: project.imageUrl || '', 
                title: project.title 
              })}
            >
              {project.imageUrl ? (
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-full object-contain bg-gray-50 p-2"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-50 p-2">
                  <div className="text-center">
                    <svg 
                      className="mx-auto h-12 w-12 text-gray-400" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor" 
                      aria-hidden="true"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                      />
                    </svg>
                    <p className="mt-2 text-sm text-gray-500">暂无图片</p>
                  </div>
                </div>
              )}
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-200" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {project.imageUrl ? (
                  <svg 
                    className="w-12 h-12 text-white" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                    />
                  </svg>
                ) : (
                  <svg 
                    className="w-12 h-12 text-white" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M12 4v16m8-8H4" 
                    />
                  </svg>
                )}
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-medium text-gray-900">{project.title}</h3>
                    {project.projectUrl && (
                      <a
                        href={project.projectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-600 hover:text-blue-800"
                      >
                        <svg 
                          className="w-5 h-5" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
                          />
                        </svg>
                      </a>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-gray-500 line-clamp-2">{project.description}</p>
                </div>
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      startEdit(project);
                    }}
                    className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-50"
                  >
                    <svg 
                      className="w-5 h-5" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
                      />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(project.id);
                    }}
                    className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50"
                  >
                    <svg 
                      className="w-5 h-5" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderFilters = () => (
    <div className="mb-6 space-y-4">
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="搜索项目..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="w-48">
          <select
            value={selectedTechnology}
            onChange={(e) => setSelectedTechnology(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">所有技术</option>
            {Array.from(new Set(skills.map(skill => skill.name))).map(tech => (
              <option key={tech} value={tech}>{tech}</option>
            ))}
          </select>
        </div>
        <div className="w-48">
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value as 'newest' | 'oldest')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="newest">最新优先</option>
            <option value="oldest">最早优先</option>
          </select>
        </div>
      </div>
      {filteredProjects.length > 0 && (
        <div className="text-sm text-gray-500">
          显示 {filteredProjects.length} 个项目（共 {projects.length} 个）
        </div>
      )}
    </div>
  );

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">项目管理</h1>
          <button
            onClick={() => startEdit()}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            添加项目
          </button>
        </div>

        {successMessage && (
          <div className="mb-4 bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded">
            {successMessage}
          </div>
        )}

        {renderFilters()}
        {renderProjectsList()}
        {isEditing && renderProjectForm()}
        {previewImage && (
          <ImagePreview
            imageUrl={previewImage.url}
            title={previewImage.title}
            onClose={() => setPreviewImage(null)}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default ProjectsPage; 