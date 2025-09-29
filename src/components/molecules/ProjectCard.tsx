import React from 'react';
import { Link } from 'react-router-dom';
import { Project } from '../../types';

interface ProjectCardProps {
  project: Project;
  onEdit?: (project: Project) => void;
  onDelete?: (projectId: number) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onEdit, onDelete }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-700';
      case 'COMPLETED':
        return 'bg-green-100 text-green-700';
      case 'ON_HOLD':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS':
        return '진행중';
      case 'COMPLETED':
        return '완료';
      case 'ON_HOLD':
        return '보류';
      default:
        return '알수없음';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-100 text-red-700';
      case 'MEDIUM':
        return 'bg-orange-100 text-orange-700';
      case 'LOW':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return '높음';
      case 'MEDIUM':
        return '보통';
      case 'LOW':
        return '낮음';
      default:
        return '알수없음';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // 버튼 클릭 시에는 카드 클릭 이벤트 차단
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    // 카드 클릭 시 상세 페이지로 이동
    window.location.href = `/projects/${project.id}`;
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-lg border border-primary-100 hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
      onClick={handleCardClick}
    >
      {/* 상단 그라데이션 바 */}
      <div className="h-2 bg-gradient-to-r from-primary-500 to-primary-300 rounded-t-xl"></div>
      
      <div className="p-6">
        {/* 헤더 - 레이아웃 개선 */}
        <div className="mb-4">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-xl font-semibold text-gray-800 pr-4 leading-tight">
              {project.projectName}
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(project.status)}`}>
              {getStatusText(project.status)}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getPriorityColor(project.priority)}`}>
              {getPriorityText(project.priority)}
            </span>
          </div>
        </div>
        
        {/* 제품명 */}
        <div className="mb-3">
          <p className="text-sm text-gray-500">제품명</p>
          <p className="text-gray-700 font-medium">{project.productName}</p>
        </div>

        {/* 대상 국가 */}
        <div className="mb-4">
          <p className="text-sm text-gray-500">대상 국가</p>
          <p className="text-gray-700">{project.targetCountry}</p>
        </div>
        
        {/* 설명 */}
        {project.description && (
          <div className="mb-4">
            <p className="text-gray-600 text-sm line-clamp-2">{project.description}</p>
          </div>
        )}

        {/* 날짜 정보 */}
        <div className="mb-4 grid grid-cols-2 gap-4 text-xs text-gray-500">
          <div>
            <p>생성일</p>
            <p className="text-gray-700">{formatDate(project.createdAt)}</p>
          </div>
          {project.expectedCompletionDate && (
            <div>
              <p>예상 완료일</p>
              <p className="text-gray-700">{formatDate(project.expectedCompletionDate)}</p>
            </div>
          )}
        </div>
        
        {/* 액션 버튼 - 삭제 버튼만 유지 */}
        <div className="flex justify-end">
          {onDelete && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onDelete(project.id);
              }}
              className="px-3 py-1 text-xs border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
            >
              삭제
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;