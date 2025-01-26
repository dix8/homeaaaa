import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/layouts/AdminLayout';
import Api from '../../utils/api';
import { Skill } from '../../types';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

const SkillsPage: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Partial<Skill>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // 技能分类选项
  const categories = ['前端开发', '后端开发', '数据库', '开发工具', '其他'];

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    try {
      setLoading(true);
      const { data } = await Api.getSkills();
      if (data) {
        // 按类别排序
        setSkills(data.sort((a, b) => a.category.localeCompare(b.category)));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载技能列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSkill.id) {
        // 更新现有技能
        await Api.updateSkill(editingSkill.id, editingSkill);
        setSuccessMessage('技能更新成功！');
      } else {
        // 创建新技能
        await Api.createSkill(editingSkill as Omit<Skill, 'id'>);
        setSuccessMessage('技能添加成功！');
      }
      
      // 重新加载技能列表
      await loadSkills();
      // 重置表单
      setIsEditing(false);
      setEditingSkill({});
      
      // 3秒后清除成功消息
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存失败');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('确定要删除这个技能吗？')) {
      return;
    }

    try {
      await Api.deleteSkill(id);
      setSuccessMessage('技能删除成功！');
      await loadSkills();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : '删除失败');
    }
  };

  const startEdit = (skill?: Skill) => {
    setIsEditing(true);
    setEditingSkill(skill || {});
    setError(null);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditingSkill({});
    setError(null);
  };

  const renderSkillForm = () => (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-medium mb-4">
          {editingSkill.id ? '编辑技能' : '添加技能'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              名称
            </label>
            <input
              type="text"
              value={editingSkill.name || ''}
              onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              类别
            </label>
            <select
              value={editingSkill.category || ''}
              onChange={(e) => setEditingSkill({ ...editingSkill, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">选择类别</option>
              <option value="后端开发">后端开发</option>
              <option value="前端开发">前端开发</option>
              <option value="开发工具">开发工具</option>
              <option value="数据库">数据库</option>
              <option value="云服务">云服务</option>
              <option value="其他">其他</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              熟练度 ({editingSkill.proficiency || 0}%)
            </label>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={editingSkill.proficiency || 0}
              onChange={(e) => setEditingSkill({ ...editingSkill, proficiency: parseInt(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {error && <ErrorMessage message={error} />}

          <div className="flex justify-end space-x-3 mt-4">
            <button
              type="button"
              onClick={cancelEdit}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderSkillsList = () => {
    if (loading) {
      return <LoadingSpinner size="large" className="mt-8" />;
    }

    if (skills.length === 0) {
      return (
        <div className="text-center text-gray-500 mt-8">
          还没有添加任何技能
        </div>
      );
    }

    // 按类别分组显示技能
    const groupedSkills = skills.reduce((acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    }, {} as Record<string, Skill[]>);

    return (
      <div className="space-y-6">
        {Object.entries(groupedSkills).map(([category, skills]) => (
          <div key={category} className="bg-white shadow rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b">
              <h3 className="text-lg font-medium text-gray-900">{category}</h3>
            </div>
            <ul className="divide-y divide-gray-200">
              {skills.map((skill) => (
                <li key={skill.id} className="px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">{skill.name}</h4>
                      <div className="mt-1">
                        <div className="bg-gray-200 rounded-full h-2 w-full">
                          <div
                            className="bg-blue-600 rounded-full h-2"
                            style={{ width: `${skill.proficiency}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-500 mt-1">
                          熟练度: {skill.proficiency}%
                        </span>
                      </div>
                    </div>
                    <div className="ml-4 flex space-x-2">
                      <button
                        onClick={() => startEdit(skill)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        编辑
                      </button>
                      <button
                        onClick={() => handleDelete(skill.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        删除
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">技能管理</h1>
          <button
            onClick={() => startEdit()}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            添加技能
          </button>
        </div>

        {successMessage && (
          <div className="mb-4 bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded">
            {successMessage}
          </div>
        )}

        {renderSkillsList()}
        {isEditing && renderSkillForm()}
      </div>
    </AdminLayout>
  );
};

export default SkillsPage; 