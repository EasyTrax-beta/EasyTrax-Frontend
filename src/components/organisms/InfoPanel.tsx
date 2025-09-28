import React, { memo } from 'react';

const InfoPanelComponent: React.FC = () => {
  return (
    <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">i</span>
        </div>
        <h3 className="text-white text-lg font-semibold m-0">
          HS 코드 분류 정보
        </h3>
      </div>
      
      <div className="text-white/80 text-sm leading-relaxed">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="text-white text-sm font-semibold mb-2">
              HS 코드란?
            </h4>
            <p className="m-0 text-xs">
              Harmonized System Code의 약자로, 국제적으로 통일된 상품 분류 체계입니다. 
              수출입 통관 시 필수적으로 필요한 코드입니다.
            </p>
          </div>
          
          <div>
            <h4 className="text-white text-sm font-semibold mb-2">
              분류 과정
            </h4>
            <ol className="pl-4 m-0 text-xs space-y-1">
              <li>제품 정보 추출 (OCR)</li>
              <li>AI 기반 분류 분석</li>
              <li>법적 근거 검증</li>
              <li>최종 코드 확정</li>
            </ol>
          </div>
          
          <div>
            <h4 className="text-white text-sm font-semibold mb-2">
              지원 국가
            </h4>
            <div className="flex flex-wrap gap-1">
              <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded px-2 py-0.5 text-xs">
                한국
              </span>
              <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded px-2 py-0.5 text-xs">
                미국
              </span>
              <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded px-2 py-0.5 text-xs">
                중국
              </span>
              <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded px-2 py-0.5 text-xs">
                일본
              </span>
            </div>
          </div>
        </div>
        
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 mt-6 flex items-center gap-2">
          <div className="w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">!</span>
          </div>
          <p className="text-xs text-amber-300 m-0">
            주의: AI 분류 결과는 참고용이며, 최종 확인은 전문가와 상담하시기 바랍니다.
          </p>
        </div>
      </div>
    </div>
  );
};

const InfoPanel = memo(InfoPanelComponent);

InfoPanel.displayName = 'InfoPanel';

export default InfoPanel;