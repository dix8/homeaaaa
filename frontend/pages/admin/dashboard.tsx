import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../components/admin/Layout';
import Api from '../../utils/api';

interface DashboardStats {
  skillsCount: number;
  projectsCount: number;
  lastUpdated: string;
}

const AdminDashboard = () => {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    skillsCount: 0,
    projectsCount: 0,
    lastUpdated: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    // 获取统计数据
    const fetchStats = async () => {
      try {
        const [skillsRes, projectsRes] = await Promise.all([
          Api.getSkills(),
          Api.getProjects(),
        ]);

        setStats({
          skillsCount: skillsRes.data?.length || 0,
          projectsCount: projectsRes.data?.length || 0,
          lastUpdated: new Date().toLocaleString(),
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    fetchStats();
  }, [router]);

  const QuickActionCard = ({ title, count, href }: { title: string; count: number; href: string }) => (
    <div 
      onClick={() => router.push(href)}
      className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
    >
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="text-3xl font-bold text-blue-600 mt-2">{count}</p>
      <p className="text-sm text-gray-500 mt-2">Click to manage</p>
    </div>
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500">
            Last updated: {stats.lastUpdated}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <QuickActionCard
            title="Skills"
            count={stats.skillsCount}
            href="/admin/skills"
          />
          <QuickActionCard
            title="Projects"
            count={stats.projectsCount}
            href="/admin/projects"
          />
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
            <div className="space-y-3 mt-4">
              <button
                onClick={() => router.push('/admin/profile')}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Update Profile
              </button>
              <button
                onClick={() => router.push('/admin/skills/new')}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Add New Skill
              </button>
              <button
                onClick={() => router.push('/admin/projects/new')}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Add New Project
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Updates</h2>
          <div className="space-y-4">
            {/* 这里可以添加最近的更新记录 */}
            <p className="text-gray-500">No recent updates</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard; 