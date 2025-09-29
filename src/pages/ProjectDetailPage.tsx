import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Project } from '../types';
import { projectService } from '../services/project';
import Header from '../components/organisms/Header';

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProject = useCallback(async () => {
    if (!id) {
      setError('프로젝트 ID가 없습니다.');
      setLoading(false);
      return;
    }

    // 로그인 상태 확인
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setError('로그인이 필요합니다. 카카오 로그인을 해주세요.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await projectService.getProject(parseInt(id));
      
      if (response.success) {
        setProject(response.data);
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('인증이 만료되었습니다. 다시 로그인해주세요.');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      } else {
        setError('프로젝트 정보를 불러오는데 실패했습니다.');
      }
      console.error('프로젝트 상세 조회 실패:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  const handleDelete = async () => {
    if (!project || !window.confirm('정말로 이 프로젝트를 삭제하시겠습니까?')) return;
    
    try {
      const response = await projectService.deleteProject(project.id);
      if (response.success) {
        alert('프로젝트가 삭제되었습니다.');
        navigate('/projects');
      } else {
        alert(response.message);
      }
    } catch (err) {
      alert('프로젝트 삭제에 실패했습니다.');
      console.error('프로젝트 삭제 실패:', err);
    }
  };

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
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-6 py-8 pt-24">
          <div className="text-center py-16">
            <div className="text-red-400 text-6xl mb-4">❌</div>
            <h3 className="text-xl font-medium text-gray-600 mb-2">
              {error || '프로젝트를 찾을 수 없습니다'}
            </h3>
            <Link 
              to="/projects"
              className="inline-block bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors font-medium"
            >
              프로젝트 목록으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-6 py-8 pt-24">
        <div className="max-w-4xl mx-auto">
          {/* 상단 네비게이션 */}
          <div className="mb-6">
            <Link 
              to="/projects"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              ← 프로젝트 목록으로 돌아가기
            </Link>
          </div>

          {/* 헤더 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  {project.projectName}
                </h1>
                <p className="text-gray-600">프로젝트 ID: {project.id}</p>
              </div>
              
              <div className="flex space-x-3 mt-4 md:mt-0">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                  {getStatusText(project.status)}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(project.priority)}`}>
                  {getPriorityText(project.priority)}
                </span>
              </div>
            </div>


            {/* 액션 버튼 */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <Link
                to={`/projects/${project.id}/edit`}
                className="flex-1 bg-primary-500 text-white py-3 px-6 rounded-lg hover:bg-primary-600 transition-colors text-center font-medium"
              >
                프로젝트 수정
              </Link>
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-500 text-white py-3 px-6 rounded-lg hover:bg-red-600 transition-colors font-medium"
              >
                프로젝트 삭제
              </button>
            </div>
          </div>

          {/* 상세 정보 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 기본 정보 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">기본 정보</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">제품명</label>
                  <p className="text-gray-800 font-medium">{project.productName}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">대상 국가</label>
                  <p className="text-gray-800">{project.targetCountry}</p>
                </div>
                
                {project.description && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">프로젝트 설명</label>
                    <p className="text-gray-800 leading-relaxed">{project.description}</p>
                  </div>
                )}
              </div>
            </div>

            {/* 일정 정보 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">일정 정보</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">생성일</label>
                  <p className="text-gray-800">{formatDate(project.createdAt)}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">최근 수정일</label>
                  <p className="text-gray-800">{formatDate(project.updatedAt)}</p>
                </div>
                
                {project.expectedCompletionDate && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">예상 완료일</label>
                    <p className="text-gray-800">{formatDate(project.expectedCompletionDate)}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 관련 기능 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mt-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">관련 기능</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link
                to={`/hs-codes?projectId=${project.id}`}
                className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors text-center"
              >
                <div className="text-2xl mb-2">🔍</div>
                <h3 className="font-medium text-gray-800 mb-1">HS 코드 분류</h3>
                <p className="text-sm text-gray-600">AI 기반 HS 코드 자동 분류</p>
              </Link>
              
              <Link
                to={`/commercial-invoices?projectId=${project.id}`}
                className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors text-center"
              >
                <div className="text-2xl mb-2">📄</div>
                <h3 className="font-medium text-gray-800 mb-1">상업송장</h3>
                <p className="text-sm text-gray-600">상업송장 생성 및 관리</p>
              </Link>
              
              <Link
                to={`/nutrition-labels?projectId=${project.id}`}
                className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors text-center"
              >
                <div className="text-2xl mb-2">🏷️</div>
                <h3 className="font-medium text-gray-800 mb-1">영양성분표</h3>
                <p className="text-sm text-gray-600">영양성분표 생성 및 분석</p>
              </Link>
              
              <Link
                to={`/chatbot?projectId=${project.id}`}
                className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors text-center"
              >
                <div className="text-2xl mb-2">🤖</div>
                <h3 className="font-medium text-gray-800 mb-1">AI 상담</h3>
                <p className="text-sm text-gray-600">규제정보 및 상담 서비스</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;