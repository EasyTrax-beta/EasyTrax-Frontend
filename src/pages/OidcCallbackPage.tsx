import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth';
import { getErrorMessage, getOriginalErrorMessage } from '../utils/errorMessages';

const OidcCallbackPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleCallback = useCallback(async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const urlError = urlParams.get('error');

    // URL에서 에러가 있는 경우 조기 반환
    if (urlError) {
      const userMessage = getErrorMessage(urlError);
      setError(userMessage);
      console.error('OAuth error from URL:', urlError);
      return;
    }

    // 인증 코드가 없는 경우 조기 반환
    if (!code) {
      const userMessage = getErrorMessage('인증 코드를 받지 못했습니다.');
      setError(userMessage);
      console.error('No authorization code received');
      return;
    }

    try {
      setError(null);

      // 카카오 토큰 교환 및 로그인 처리
      await authService.handleOidcCallback(code);
      
      // 로그인 성공 후 메인 페이지로 리다이렉트
      navigate('/', { replace: true });
      
    } catch (error) {
      const userMessage = getErrorMessage(error);
      const originalError = getOriginalErrorMessage(error);
      
      console.error('OIDC Callback error:', originalError);
      setError(userMessage);
    }
  }, [navigate]);

  useEffect(() => {
    handleCallback();
  }, [handleCallback]);

  const handleRetry = () => {
    window.location.href = '/';
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 flex flex-col items-center justify-center p-6">
        <div className="bg-white/10 backdrop-blur-sm border border-red-500/30 rounded-2xl p-10 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">!</span>
          </div>
          <h2 className="text-red-400 text-xl font-semibold mb-3">
            로그인 실패
          </h2>
          <p className="text-white/70 text-sm mb-6">
            {error}
          </p>
          <button
            onClick={handleRetry}
            className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white border-none rounded-lg px-6 py-3 text-sm font-semibold cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/30"
          >
            메인으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 flex flex-col items-center justify-center p-6">
      <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-10 text-center max-w-md w-full">
        <div className="w-10 h-10 border-4 border-white/20 border-t-indigo-500 rounded-full animate-spin mx-auto mb-6"></div>
        <h2 className="text-white text-xl font-semibold mb-3">
          로그인 처리 중
        </h2>
        <p className="text-white/70 text-sm">
          잠시만 기다려주세요...
        </p>
      </div>
    </div>
  );
};

export default OidcCallbackPage;