export interface Profile {
  id: number;
  name: string;
  title: string;
  bio: string;
  avatar: string | null;
  email: string;
  github?: string | null;
  linkedin?: string | null;
  twitter?: string | null;
  telegram?: string | null;
  youtube?: string | null;
  bilibili?: string | null;
  avatarSource?: string | null;
  avatarQQNumber?: string | null;
  avatarGravatarEmail?: string | null;
  avatarGravatarServer?: string | null;
  avatarCustomUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Skill {
  id: number;
  name: string;
  category: string;
  proficiency: number;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  projectUrl?: string;
  technologies: string[];
  createdAt: string;
  updatedAt: string;
} 