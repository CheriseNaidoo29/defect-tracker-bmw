import React from 'react';

interface BmwLogoProps {
  className?: string;
  size?: number;
}

export const BmwLogo: React.FC<BmwLogoProps> = ({ className = '', size = 40 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-label="BMW Roundel"
    >
      {/* Outer subtle chrome ring */}
      <circle cx="50" cy="50" r="48" stroke="#ffffff" strokeWidth="2.5" fill="#000000" />
      
      {/* Inner quadrant container */}
      <circle cx="50" cy="50" r="38" fill="#ffffff" />
      
      {/* Top-Left Quadrant: BMW Blue */}
      <path d="M 50 12 A 38 38 0 0 0 12 50 L 50 50 Z" fill="#0066B1" />
      
      {/* Top-Right Quadrant: White */}
      <path d="M 50 12 A 38 38 0 0 1 88 50 L 50 50 Z" fill="#FFFFFF" />
      
      {/* Bottom-Left Quadrant: White */}
      <path d="M 12 50 A 38 38 0 0 0 50 88 L 50 50 Z" fill="#FFFFFF" />
      
      {/* Bottom-Right Quadrant: BMW Blue */}
      <path d="M 50 88 A 38 38 0 0 0 88 50 L 50 50 Z" fill="#0066B1" />

      {/* Cross divider lines */}
      <line x1="50" y1="12" x2="50" y2="88" stroke="#000000" strokeWidth="1.2" />
      <line x1="12" y1="50" x2="88" y2="50" stroke="#000000" strokeWidth="1.2" />
      
      {/* Outer boundary of inner quadrants */}
      <circle cx="50" cy="50" r="38" stroke="#ffffff" strokeWidth="1.5" />
    </svg>
  );
};
