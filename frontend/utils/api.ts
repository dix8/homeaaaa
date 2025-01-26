import { Profile, Skill, Project } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

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

class Api {
  private static getHeaders(isFileUpload = false): Record<string, string> {
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = {};
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    if (!isFileUpload) {
      headers['Content-Type'] = 'application/json';
    }
    
    return headers;
  }

  private static async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Something went wrong');
    }
    return await response.json();
  }

  // Auth
  static async login(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return this.handleResponse<{ token: string }>(response);
  }

  // Profile
  static async getProfile() {
    const response = await fetch(`${API_BASE_URL}/profile`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse<Profile>(response);
  }

  static async updateProfile(profile: Partial<Profile>) {
    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(profile),
    });
    return this.handleResponse<Profile>(response);
  }

  // Skills
  static async getSkills() {
    const response = await fetch(`${API_BASE_URL}/skills`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse<Skill[]>(response);
  }

  static async createSkill(skill: Omit<Skill, 'id'>) {
    const response = await fetch(`${API_BASE_URL}/skills`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(skill),
    });
    return this.handleResponse<Skill>(response);
  }

  static async updateSkill(id: number, skill: Partial<Skill>) {
    const response = await fetch(`${API_BASE_URL}/skills/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(skill),
    });
    return this.handleResponse<Skill>(response);
  }

  static async deleteSkill(id: number) {
    const response = await fetch(`${API_BASE_URL}/skills/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    return this.handleResponse<void>(response);
  }

  // Projects
  static async getProjects() {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse<Project[]>(response);
  }

  static async createProject(project: Omit<Project, 'id'>) {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(project),
    });
    return this.handleResponse<Project>(response);
  }

  static async updateProject(id: number, data: Partial<Project>) {
    try {
      // 确保 technologies 是字符串格式
      const technologies = Array.isArray(data.technologies) 
        ? JSON.stringify(data.technologies) 
        : '[]';

      const projectData = {
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl,
        projectUrl: data.projectUrl,
        technologies,
        createdAt: data.createdAt,
        updatedAt: new Date().toISOString()
      };

      console.log('Sending project data to server:', projectData);

      const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
        method: 'PUT',
        headers: {
          ...this.getHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Server error response:', errorData);
        throw new Error(errorData?.message || '更新项目失败');
      }

      return this.handleResponse<Project>(response);
    } catch (error) {
      console.error('Update project error:', error);
      throw error instanceof Error ? error : new Error('更新项目失败');
    }
  }

  static async deleteProject(id: number) {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    return this.handleResponse<void>(response);
  }

  // File uploads
  static async uploadFile(file: File, type: 'avatar' | 'project' | 'favicon' | 'logo'): Promise<ApiResponse<{ url: string }>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    const response = await fetch(`${API_BASE_URL}/upload/${type}`, {
      method: 'POST',
      headers: {
        ...this.getHeaders(true),
      },
      body: formData,
    });
    return this.handleResponse<{ url: string }>(response);
  }

  static async getSettings(): Promise<ApiResponse<SiteSettings>> {
    const response = await fetch(`${API_BASE_URL}/settings`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse<SiteSettings>(response);
  }

  static async updateSettings(settings: SiteSettings): Promise<ApiResponse<SiteSettings>> {
    const response = await fetch(`${API_BASE_URL}/settings`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(settings),
    });
    return this.handleResponse<SiteSettings>(response);
  }
}

export default Api; 