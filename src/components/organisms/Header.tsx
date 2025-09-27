import React, { memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginButton from '../molecules/LoginButton';

const Header: React.FC = memo(() => {
  const navigate = useNavigate();

  const handleLogoClick = useCallback(() => {
    // 홈 페이지로 이동 후 최상단으로 스크롤
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [navigate]);

  const handleLogoKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleLogoClick();
    }
  }, [handleLogoClick]);

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-white/10 py-4"
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div 
          className="flex items-center gap-3 cursor-pointer transition-opacity hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 rounded-lg p-2"
          onClick={handleLogoClick}
          onKeyDown={handleLogoKeyDown}
          tabIndex={0}
          role="button"
          aria-label="EasyTrax 홈으로 이동"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
            ET
          </div>
          <h1 className="text-white text-2xl font-bold">EasyTrax</h1>
        </div>
        
        <nav 
          className="hidden md:flex items-center gap-8"
          role="navigation"
          aria-label="주요 네비게이션"
        >
          <a 
            className="text-white/80 font-medium transition-colors hover:text-white focus:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 rounded px-2 py-1 cursor-pointer"
            tabIndex={0}
            role="button"
            aria-label="HS 코드 분류 서비스"
          >
            HS 코드 분류
          </a>
          <a 
            className="text-white/80 font-medium transition-colors hover:text-white focus:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 rounded px-2 py-1 cursor-pointer"
            tabIndex={0}
            role="button"
            aria-label="AI 어시스턴트 서비스"
          >
            AI 어시스턴트
          </a>
          <a 
            className="text-white/80 font-medium transition-colors hover:text-white focus:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 rounded px-2 py-1 cursor-pointer"
            tabIndex={0}
            role="button"
            aria-label="라벨 및 서류 분석 서비스"
          >
            라벨/서류 분석
          </a>
          <a 
            className="text-white/80 font-medium transition-colors hover:text-white focus:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 rounded px-2 py-1 cursor-pointer"
            tabIndex={0}
            role="button"
            aria-label="프로젝트 관리 서비스"
          >
            프로젝트 관리
          </a>
        </nav>
        
        <LoginButton />
      </div>
    </header>
  );
});

Header.displayName = 'Header';

export default Header;