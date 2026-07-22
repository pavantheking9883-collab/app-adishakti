import React from 'react';

interface BrandLogoProps {
  size?: number;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ size = 48, className = '' }) => {
  return (
    <div
      className={`relative flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <img
        src="/logo_transparent.png"
        alt="ADISHAKTI Official Logo"
        className="w-full h-full object-contain filter drop-shadow-sm"
      />
    </div>
  );
};
