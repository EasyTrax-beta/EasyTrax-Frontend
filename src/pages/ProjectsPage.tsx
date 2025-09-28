import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Project, ProjectStatus, Priority } from '../types';
import { projectService } from '../services/project';
import ProjectCard from '../components/molecules/ProjectCard';
import Header from '../components/organisms/Header';

const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  
  // 필터 상태
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | ''>('');
  const [priorityFilter, setPriorityFilter] = useState<Priority | ''>('');
  const [sortOption, setSortOption] = useState<string>('createdAt,desc'); // 기본값: 최신순

  const pageSize = 9; // 3x3 그리드

  const fetchProjects = async (page: number = 0) => {
    // 로그인 상태 확인
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setLoading(false);
      setError('로그인이 필요합니다. 카카오 로그인을 해주세요.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page,
        size: pageSize,
        sort: sortOption,
        ...(statusFilter && { status: statusFilter }),
        ...(priorityFilter && { priority: priorityFilter })
      };
      
      const response = await projectService.getProjects(params);
      
      if (response.success) {
        setProjects(response.data.content);
        setTotalPages(response.data.totalPages);
        setTotalElements(response.data.totalElements);
        setCurrentPage(page);
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      console.error('프로젝트 목록 조회 실패:', err);
      
      if (err.response?.status === 401) {
        setError('인증이 만료되었습니다. 다시 로그인해주세요.');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      } else if (err.response?.status === 403) {
        setError('접근 권한이 없습니다. 관리자에게 문의하거나 다시 로그인해주세요.');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      } else if (err.code === 'NETWORK_ERROR' || err.message?.includes('Network Error')) {
        setError('백엔드 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.');
      } else {
        setError(err.response?.data?.message || '프로젝트 목록을 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects(0);
  }, [statusFilter, priorityFilter, sortOption]);

  const handleDelete = async (projectId: number) => {
    if (!window.confirm('정말로 이 프로젝트를 삭제하시겠습니까?')) return;
    
    try {
      const response = await projectService.deleteProject(projectId);
      if (response.success) {
        await fetchProjects(currentPage);
        alert('프로젝트가 삭제되었습니다.');
      } else {
        alert(response.message);
      }
    } catch (err) {
      alert('프로젝트 삭제에 실패했습니다.');
      console.error('프로젝트 삭제 실패:', err);
    }
  };

  const handlePageChange = (page: number) => {
    fetchProjects(page);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-6 py-8 pt-24">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-6 py-8 pt-24">
        {/* 헤더 */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">프로젝트 관리</h1>
            <p className="text-gray-600">총 {totalElements}개의 프로젝트</p>
          </div>
          
          <Link 
            to="/projects/new"
            className="mt-4 md:mt-0 bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors font-medium"
          >
            + 새 프로젝트
          </Link>
        </div>

        {/* 필터 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                상태 필터
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as ProjectStatus | '')}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">전체</option>
                <option value="IN_PROGRESS">진행중</option>
                <option value="COMPLETED">완료</option>
                <option value="ON_HOLD">보류</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                우선순위 필터
              </label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value as Priority | '')}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">전체</option>
                <option value="HIGH">높음</option>
                <option value="MEDIUM">보통</option>
                <option value="LOW">낮음</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                정렬
              </label>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="createdAt,desc">최신순 (생성일)</option>
                <option value="createdAt,asc">오래된순 (생성일)</option>
                <option value="updatedAt,desc">최근 수정순</option>
                <option value="projectName,asc">프로젝트명 (가나다순)</option>
                <option value="projectName,desc">프로젝트명 (역순)</option>
                <option value="priority,desc">우선순위 높음</option>
                <option value="priority,asc">우선순위 낮음</option>
              </select>
            </div>
          </div>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* 프로젝트 그리드 */}
        {projects.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 text-6xl mb-4">📋</div>
            <h3 className="text-xl font-medium text-gray-600 mb-2">프로젝트가 없습니다</h3>
            <p className="text-gray-500 mb-6">첫 번째 프로젝트를 생성해보세요.</p>
            <Link 
              to="/projects/new"
              className="inline-block bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors font-medium"
            >
              + 새 프로젝트 생성
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onDelete={handleDelete}
                />
              ))}
            </div>

            {/* 페이지네이션 */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                  className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  이전
                </button>
                
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handlePageChange(index)}
                    className={`px-3 py-2 border rounded-lg ${
                      currentPage === index
                        ? 'bg-primary-500 text-white border-primary-500'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages - 1}
                  className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  다음
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;