import React from 'react';

interface LovableLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const LovableLogo = ({ size = 'md', className = '' }: LovableLogoProps) => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };
  
  return (
    <div className={`rounded ${sizes[size]} bg-gradient-to-r from-rose-500 to-purple-500 ${className}`}>
      {/* This is a simplified version of the Lovable logo */}
    </div>
  );
};

export default LovableLogo;