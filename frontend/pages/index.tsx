import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import ProfileSection from '../components/ProfileSection';
import SkillsSection from '../components/SkillsSection';
import ProjectsSection from '../components/ProjectsSection';
import Api from '../utils/api';
import { Profile, Skill, Project } from '../types';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

interface HomeProps {
  settings?: {
    title?: string;
    description?: string;
    favicon?: string;
    pageTitle?: string;
  };
}

export default function Home({ settings }: HomeProps) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [profileRes, skillsRes, projectsRes] = await Promise.all([
          Api.getProfile(),
          Api.getSkills(),
          Api.getProjects()
        ]);

        if (profileRes.error) {
          setError(profileRes.error);
          return;
        }
        if (skillsRes.error) {
          setError(skillsRes.error);
          return;
        }
        if (projectsRes.error) {
          setError(projectsRes.error);
          return;
        }

        setProfile(profileRes.data || null);
        setSkills(skillsRes.data || []);
        const projectsWithParsedTechnologies = (projectsRes.data || []).map(project => ({
          ...project,
          technologies: typeof project.technologies === 'string'
            ? JSON.parse(project.technologies)
            : project.technologies || []
        }));
        setProjects(projectsWithParsedTechnologies);
      } catch (err) {
        setError(err instanceof Error ? err.message : '加载数据失败');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="flex justify-center py-12">
            <LoadingSpinner size="large" />
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <ErrorMessage message={error} />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div>
      <Head>
        <title>{settings?.pageTitle || settings?.title || '个人主页'}</title>
        <meta name="description" content={settings?.description || profile?.bio || '个人主页'} />
        {settings?.favicon && <link rel="icon" href={settings.favicon} />}
      </Head>

      <div className="min-h-screen bg-gray-100">
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0 space-y-8">
            <ProfileSection profile={profile || undefined} loading={loading} />
            <SkillsSection skills={skills} />
            <ProjectsSection projects={projects} />
          </div>
        </main>
      </div>
    </div>
  );
} 