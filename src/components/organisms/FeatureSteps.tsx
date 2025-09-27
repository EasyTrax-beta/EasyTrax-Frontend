import React, { memo } from 'react';
import StepCard from '../molecules/StepCard';
import InfoPanel from './InfoPanel';

const STEPS_DATA = [
  {
    number: 1 as const,
    title: '파일 업로드',
    description: '참고서류 및 이미지 업로드\nHS 코드 분류에 필요한 문서를 업로드하세요',
    features: [
      { text: '제품 사진: 제품, 형태, 크기 등' },
      { text: '인증서: 품질인증, 안전인증 등' },
      { text: '라벨/포장: 제품명, 원산지, 성분 등' },
      { text: '사진: 제품 외관, 포장 상태 등' }
    ],
    infoBox: {
      type: 'info' as const,
      text: '지원 형식: PDF, JPG, PNG, DOC, DOCX (최대 10MB)'
    }
  },
  {
    number: 2 as const,
    title: '정보 수정',
    description: 'AI 추출 결과 검토 및 수정\n자동으로 추출된 정보를 확인하고 보완하세요',
    features: [
      { text: '업로드 가이드' },
      { text: '제품 사진: 제품, 형태, 크기 등' },
      { text: '인증서: 품질인증, 안전인증 등' },
      { text: '라벨/포장: 제품명, 원산지, 성분 등' },
      { text: '사진: 제품 외관, 포장 상태 등' }
    ],
    infoBox: {
      type: 'info' as const,
      text: '팁: 더 많은 정보를 제공할수록 정확한 HS 코드 분류가 가능합니다.'
    }
  },
  {
    number: 3 as const,
    title: '결과 확인',
    description: 'HS 코드 및 분류 근거\n최종 HS 코드와 상세한 분류 근거를 확인하세요',
    features: [
      { text: 'HS 코드 및 분류 근거' }
    ],
    infoBox: {
      type: 'warning' as const,
      text: '주의: AI 분류 결과는 참고용이며, 최종 확인은 전문가와 상담하시기 바랍니다.'
    }
  }
];

const FeatureSteps: React.FC = memo(() => {
  return (
    <section 
      className="bg-slate-900 py-20 relative"
      aria-labelledby="feature-steps-title"
    >
      <div className="max-w-7xl mx-auto px-6">
        <header className="text-center mb-20">
          <h2 
            id="feature-steps-title"
            className="text-4xl font-bold text-white mb-4"
          >
            HS 코드 분류
          </h2>
          <p className="text-lg text-white/70">
            AI 기반 HS 코드 자동 분류 시스템
          </p>
        </header>
        
        <div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-8"
          role="group"
          aria-label="HS 코드 분류 단계"
        >
          {STEPS_DATA.map((step) => (
            <StepCard
              key={step.number}
              number={step.number}
              title={step.title}
              description={step.description}
              features={step.features}
              infoBox={step.infoBox}
            />
          ))}
        </div>
        
        <div className="mt-16">
          <InfoPanel />
        </div>
      </div>
    </section>
  );
});

FeatureSteps.displayName = 'FeatureSteps';

export default FeatureSteps;