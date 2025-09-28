import React, { memo } from 'react';
import type { StepNumberProps } from '../../types';

interface StepFeature {
  text: string;
}

interface StepCardProps {
  number: 1 | 2 | 3;
  title: string;
  description: string;
  features: StepFeature[];
  infoBox: {
    type: 'info' | 'warning';
    text: string;
  };
}

const StepNumberComponent: React.FC<StepNumberProps> = ({ number, children }) => {
  const bgColors = {
    1: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
    2: 'bg-gradient-to-br from-indigo-500 to-indigo-600', 
    3: 'bg-gradient-to-br from-purple-500 to-purple-600'
  };
  
  return (
    <div 
      className={`w-12 h-12 ${bgColors[number]} rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-xl`}
      role="img"
      aria-label={`단계 ${number}`}
    >
      {children}
    </div>
  );
};

const StepNumber = memo(StepNumberComponent);
StepNumber.displayName = 'StepNumber';

const StepCardComponent: React.FC<StepCardProps> = ({ 
  number, 
  title, 
  description, 
  features, 
  infoBox 
}) => {
  const infoBoxStyles = {
    info: 'bg-blue-500/10 border-blue-500/20 text-blue-500',
    warning: 'bg-amber-500/10 border-amber-500/20 text-amber-500'
  };

  const infoIconStyles = {
    info: 'bg-blue-500 text-white',
    warning: 'bg-amber-500 text-white'
  };

  const infoIcon = {
    info: 'i',
    warning: '!'
  };

  return (
    <article 
      className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:bg-white/8 hover:border-indigo-500/30 flex flex-col h-full"
      role="region"
      aria-labelledby={`step-${number}-title`}
    >
      <StepNumber number={number}>{number}</StepNumber>
      
      <h3 
        id={`step-${number}-title`}
        className="text-xl font-semibold text-white mb-4"
      >
        {title}
      </h3>
      
      <p className="text-sm leading-relaxed text-white/70 mb-6">
        {description}
      </p>
      
      <div className="flex flex-col gap-2 items-start flex-grow">
        {features.map((feature, index) => (
          <div 
            key={index}
            className="flex items-center gap-2 text-sm text-white/80"
          >
            <span 
              className="text-emerald-500 font-bold"
              aria-hidden="true"
            >
              ✓
            </span>
            <span>{feature.text}</span>
          </div>
        ))}
      </div>
      
      <div 
        className={`${infoBoxStyles[infoBox.type]} border rounded-xl p-4 mt-6 flex items-start gap-2`}
        role="note"
        aria-label={infoBox.type === 'info' ? '정보' : '주의사항'}
      >
        <div className={`w-4 h-4 ${infoIconStyles[infoBox.type]} rounded-full flex items-center justify-center`}>
          <span className="text-xs font-bold">
            {infoIcon[infoBox.type]}
          </span>
        </div>
        <p className="text-xs text-white/80 m-0">
          {infoBox.text}
        </p>
      </div>
    </article>
  );
};

const StepCard = memo(StepCardComponent);

StepCard.displayName = 'StepCard';

export default StepCard;