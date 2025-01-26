import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface LayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: LayoutProps) => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link href="/admin/dashboard" className="flex items-center">
                <span className="text-xl font-bold">Admin Dashboard</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/admin/profile" className="text-gray-700 hover:text-gray-900">
                Profile
              </Link>
              <Link href="/admin/skills" className="text-gray-700 hover:text-gray-900">
                Skills
              </Link>
              <Link href="/admin/projects" className="text-gray-700 hover:text-gray-900">
                Projects
              </Link>
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-800"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout; 