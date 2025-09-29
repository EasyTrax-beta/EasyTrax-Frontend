import axios from 'axios';
import { 
  ApiResponse, 
  Project, 
  ProjectCreateRequest, 
  ProjectUpdateRequest, 
  ProjectListResponse,
  ProjectStatusUpdateRequest,
  ProjectProgressUpdateRequest,
  ProjectStatus,
  Priority
} from '../types';
import { API_BASE_URL } from '../constants/api';

export const projectService = {
  // 프로젝트 생성
  async createProject(data: ProjectCreateRequest): Promise<ApiResponse<Project>> {
    const response = await axios.post(`${API_BASE_URL}/api/projects`, data);
    return response.data;
  },

  // 프로젝트 목록 조회 (페이징)
  async getProjects(params?: {
    status?: ProjectStatus;
    priority?: Priority;
    page?: number;
    size?: number;
    sort?: string; // 정렬 파라미터 추가
  }): Promise<ApiResponse<ProjectListResponse>> {
    const response = await axios.get(`${API_BASE_URL}/api/projects`, { params });
    return response.data;
  },

  // 프로젝트 상세 조회
  async getProject(projectId: number): Promise<ApiResponse<Project>> {
    const response = await axios.get(`${API_BASE_URL}/api/projects/${projectId}`);
    return response.data;
  },

  // 프로젝트 수정
  async updateProject(projectId: number, data: ProjectUpdateRequest): Promise<ApiResponse<Project>> {
    const response = await axios.put(`${API_BASE_URL}/api/projects/${projectId}`, data);
    return response.data;
  },

  // 프로젝트 삭제
  async deleteProject(projectId: number): Promise<ApiResponse<null>> {
    const response = await axios.delete(`${API_BASE_URL}/api/projects/${projectId}`);
    return response.data;
  },

  // 프로젝트 상태 변경
  async updateProjectStatus(projectId: number, data: ProjectStatusUpdateRequest): Promise<ApiResponse<Project>> {
    const response = await axios.patch(`${API_BASE_URL}/api/projects/${projectId}/status`, data);
    return response.data;
  },

  // 프로젝트 진행률 업데이트
  async updateProjectProgress(projectId: number, data: ProjectProgressUpdateRequest): Promise<ApiResponse<Project>> {
    const response = await axios.patch(`${API_BASE_URL}/api/projects/${projectId}/progress`, data);
    return response.data;
  }
};