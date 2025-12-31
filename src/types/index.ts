// src/types/index.ts

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  age?: number;
  weight?: number;
  height?: number;
  gender?: 'male' | 'female' | 'other';
  createdAt?: string;
  updatedAt?: string;
}

export interface PosturalDeviation {
  id: string;
  name: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  affectedArea: string;
  recommendations?: string[];
}

export interface PosturalAnalysis {
  id: string;
  userId: string;
  date: string;
  deviations: PosturalDeviation[];
  overallScore: number;
  imageUrl?: string;
  videoUrl?: string;
  notes?: string;
  landmarks?: any;
  createdAt?: string;
  updatedAt?: string;
}