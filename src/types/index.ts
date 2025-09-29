// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  code: string;
  message: string;
  data: T;
}

// Auth Types
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface UserInfo {
  email: string;
  name: string;
  profileImageUrl: string;
  roleType: 'ROLE_USER' | 'ROLE_ADMIN' | 'ROLE_GUEST';
}

// Project Types
export type Country = 
  | 'KOREA' | 'CHINA' | 'USA' | 'JAPAN'
  | 'GERMANY' | 'FRANCE' | 'UK' | 'ITALY' | 'SPAIN'
  | 'NETHERLANDS' | 'BELGIUM' | 'CANADA' | 'AUSTRALIA'
  | 'SINGAPORE' | 'HONG_KONG' | 'THAILAND' | 'VIETNAM'
  | 'INDIA' | 'BRAZIL' | 'MEXICO' | 'RUSSIA';

export type ProjectStatus = 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD';
export type Priority = 'HIGH' | 'MEDIUM' | 'LOW';

export interface Project {
  id: number;
  projectName: string;
  productName: string;
  targetCountry: Country;
  description?: string;
  expectedCompletionDate?: string;
  priority: Priority;
  status: ProjectStatus;
  progressPercentage: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectCreateRequest {
  projectName: string;
  productName: string;
  targetCountry: Country;
  description?: string;
  expectedCompletionDate?: string;
  priority: Priority;
}

export interface ProjectUpdateRequest {
  projectName?: string;
  productName?: string;
  targetCountry?: Country;
  description?: string;
  expectedCompletionDate?: string;
  priority?: Priority;
}

export interface ProjectListResponse {
  content: Project[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface ProjectStatusUpdateRequest {
  status: ProjectStatus;
}

export interface ProjectProgressUpdateRequest {
  progressPercentage: number;
}

import React from 'react';

// Component Props Types
export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export interface StepNumberProps {
  number: 1 | 2 | 3;
  children: React.ReactNode;
}

// Kakao SDK Types
declare global {
  interface Window {
    Kakao: {
      init: (appKey: string) => void;
      isInitialized: () => boolean;
      Auth: {
        authorize: (options: {
          redirectUri: string;
          scope: string;
        }) => void;
        logout: () => void;
      };
    };
  }
}