import React, { memo } from 'react';
import Button from '../atoms/Button';

const Hero: React.FC = memo(() => {
  return (
    <section 
      className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 relative flex items-center overflow-hidden"
      role="main"
      aria-labelledby="hero-title"
    >
      {/* Background Graphics */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(59, 130, 246, 0.05) 0%, transparent 50%)
          `
        }}
      />
      
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-20 items-center relative z-10 text-center lg:text-left">
        <div className="text-white">
          <h1 
            id="hero-title"
            className="text-5xl lg:text-6xl font-bold leading-tight mb-6 bg-gradient-to-br from-white to-slate-200 bg-clip-text text-transparent"
          >
            EasyTrax
          </h1>
          <p className="text-xl lg:text-2xl leading-relaxed mb-4 text-white/80">
            AI 기반 통관거부사례 분석 및 규제 준수 지원 시스템
          </p>
          <p className="text-base lg:text-lg leading-relaxed mb-10 text-white/70">
            수출 프로젝트를 빠르고 정확하게 관리하세요
          </p>
          <div className="flex flex-col lg:flex-row gap-4 items-center lg:items-start">
            <Button variant="primary" size="large">
              AI 어시스턴트
            </Button>
            <Button variant="secondary" size="large">
              수출 프로젝트 관리
            </Button>
          </div>
        </div>
        
        <div className="relative">
          <div className="w-full h-96 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-blue-500/10 rounded-3xl border border-white/10 flex items-center justify-center relative overflow-hidden">
            {/* Animated Overlay */}
            <div 
              className="absolute inset-0 animate-float"
              style={{
                background: `
                  linear-gradient(45deg, transparent 48%, rgba(99, 102, 241, 0.1) 49%, rgba(99, 102, 241, 0.1) 51%, transparent 52%),
                  linear-gradient(-45deg, transparent 48%, rgba(139, 92, 246, 0.1) 49%, rgba(139, 92, 246, 0.1) 51%, transparent 52%)
                `,
                backgroundSize: '20px 20px'
              }}
            />
            <div className="text-center text-white z-10 relative">
              <h3 className="text-3xl lg:text-4xl font-semibold mb-4 opacity-90">
                AI 기반 분석
              </h3>
              <p className="text-base lg:text-lg opacity-70">
                통관거부사례 및 규제정보를<br />
                실시간으로 분석합니다
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

Hero.displayName = 'Hero';

export default Hero;