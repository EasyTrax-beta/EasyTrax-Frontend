import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProjectCreateRequest, Country, Priority } from '../types';
import { projectService } from '../services/project';
import Header from '../components/organisms/Header';

const ProjectCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 로그인 상태 확인
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('로그인이 필요합니다.');
      navigate('/');
    }
  }, [navigate]);
  
  const [formData, setFormData] = useState<ProjectCreateRequest>({
    projectName: '',
    productName: '',
    targetCountry: 'USA',
    description: '',
    expectedCompletionDate: '',
    priority: 'MEDIUM'
  });

  const countries: { value: Country; label: string }[] = [
    { value: 'USA', label: '미국' },
    { value: 'CHINA', label: '중국' },
    { value: 'JAPAN', label: '일본' },
    { value: 'GERMANY', label: '독일' },
    { value: 'FRANCE', label: '프랑스' },
    { value: 'UK', label: '영국' },
    { value: 'ITALY', label: '이탈리아' },
    { value: 'SPAIN', label: '스페인' },
    { value: 'NETHERLANDS', label: '네덜란드' },
    { value: 'BELGIUM', label: '벨기에' }
  ];

  const priorities: { value: Priority; label: string }[] = [
    { value: 'HIGH', label: '높음' },
    { value: 'MEDIUM', label: '보통' },
    { value: 'LOW', label: '낮음' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.projectName.trim()) {
      setError('프로젝트명을 입력해주세요.');
      return;
    }
    
    if (!formData.productName.trim()) {
      setError('제품명을 입력해주세요.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const submitData = {
        ...formData,
        projectName: formData.projectName.trim(),
        productName: formData.productName.trim(),
        description: formData.description.trim() || undefined,
        expectedCompletionDate: formData.expectedCompletionDate || undefined
      };
      
      const response = await projectService.createProject(submitData);
      
      if (response.success) {
        alert('프로젝트가 성공적으로 생성되었습니다.');
        navigate('/projects');
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      console.error('프로젝트 생성 실패:', err);
      
      if (err.response?.status === 401) {
        setError('인증이 만료되었습니다. 다시 로그인해주세요.');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setTimeout(() => navigate('/'), 2000);
      } else if (err.response?.status === 403) {
        setError('접근 권한이 없습니다. 관리자에게 문의하거나 다시 로그인해주세요.');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setTimeout(() => navigate('/'), 2000);
      } else if (err.response?.status === 400) {
        setError(err.response?.data?.message || '입력값이 올바르지 않습니다.');
      } else if (err.code === 'NETWORK_ERROR' || err.message?.includes('Network Error')) {
        setError('백엔드 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.');
      } else {
        setError(err.response?.data?.message || '프로젝트 생성에 실패했습니다. 잠시 후 다시 시도해주세요.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-6 py-8 pt-24">
        <div className="max-w-2xl mx-auto">
          {/* 헤더 */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">새 프로젝트 생성</h1>
            <p className="text-gray-600">수출 프로젝트의 기본 정보를 입력해주세요.</p>
          </div>

          {/* 폼 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 에러 메시지 */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-600">{error}</p>
                </div>
              )}

              {/* 프로젝트명 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  프로젝트명 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleInputChange}
                  maxLength={100}
                  placeholder="프로젝트명을 입력하세요"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              {/* 제품명 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  제품명 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="productName"
                  value={formData.productName}
                  onChange={handleInputChange}
                  maxLength={50}
                  placeholder="제품명을 입력하세요"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              {/* 대상 국가 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  대상 국가 <span className="text-red-500">*</span>
                </label>
                <select
                  name="targetCountry"
                  value={formData.targetCountry}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                >
                  {countries.map(country => (
                    <option key={country.value} value={country.value}>
                      {country.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* 우선순위 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  우선순위 <span className="text-red-500">*</span>
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                >
                  {priorities.map(priority => (
                    <option key={priority.value} value={priority.value}>
                      {priority.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* 예상 완료일 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  예상 완료일
                </label>
                <input
                  type="date"
                  name="expectedCompletionDate"
                  value={formData.expectedCompletionDate}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* 설명 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  프로젝트 설명
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  maxLength={1000}
                  rows={4}
                  placeholder="프로젝트에 대한 상세 설명을 입력하세요"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                />
                <p className="text-sm text-gray-500 mt-1">
                  {formData.description.length}/1000자
                </p>
              </div>

              {/* 버튼 */}
              <div className="flex space-x-4 pt-6">
                <button
                  type="button"
                  onClick={() => navigate('/projects')}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {loading ? '생성 중...' : '프로젝트 생성'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCreatePage;