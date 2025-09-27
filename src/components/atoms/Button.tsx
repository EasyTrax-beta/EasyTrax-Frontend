import React, { memo } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'kakao' | 'default';
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = memo(({ 
  children, 
  variant = 'default', 
  size = 'medium', 
  onClick, 
  disabled, 
  className = '', 
  ...props 
}) => {
  const baseClasses = 'font-semibold cursor-pointer transition-all duration-200 flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none';
  
  const variantClasses = {
    primary: 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white border-none hover:shadow-lg hover:shadow-indigo-500/30',
    secondary: 'bg-transparent text-indigo-500 border-2 border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/30',
    kakao: 'bg-yellow-400 text-black border-none hover:shadow-lg hover:shadow-yellow-400/30',
    default: 'bg-gray-100 text-gray-700 border-none hover:shadow-lg hover:shadow-gray-500/30'
  };
  
  const sizeClasses = {
    large: 'rounded-xl px-8 py-4 text-lg',
    medium: 'rounded-lg px-6 py-3 text-base',
    small: 'rounded-lg px-4 py-2 text-sm'
  };
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
  
  return (
    <button
      className={classes}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;