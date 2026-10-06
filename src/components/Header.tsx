import React from 'react';
import { BmwLogo } from './BmwLogo';
import { Code2 } from 'lucide-react';

interface HeaderProps {
  onOpenAngularCode: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAngularCode }) => {
  return (
    <header className="bg-[#0b192c] text-white border-b-2 border-[#0066b1] sticky top-0 z-40 shadow-md">
      <div className="max-w-[1440px] mx-auto px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Brand Group */}
        <div className="flex items-center gap-3.5">
          <BmwLogo size={42} />
          <div className="flex flex-col">
            <div className="flex items-center gap-2.5">
              <h1 className="text-lg font-bold tracking-tight text-white leading-tight">
                BMW Campaign Central
              </h1>
              <span className="bg-[#0066b1]/30 border border-[#0066b1]/80 text-[#93c5fd] text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded">
                QUALITY OPS
              </span>
            </div>
            <p className="text-xs text-slate-400 font-normal tracking-wide mt-0.5">
              Corporate Defect Mitigation &amp; Technical Recall Management
            </p>
          </div>
        </div>

        {/* Right Status & Profile Controls */}
        <div className="flex items-center gap-4">
          {/* Angular Code Generator Button */}
          <button 
            type="button"
            onClick={onOpenAngularCode}
            title="View complete Angular 18+ component and template code"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0066b1]/25 hover:bg-[#0066b1]/45 border border-[#0066b1]/60 text-sky-200 text-xs font-medium rounded transition-colors shadow-sm cursor-pointer"
          >
            <Code2 className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">Angular Code</span>
          </button>

          {/* Telematics Gateway Indicator */}
          <div className="flex items-center gap-2 bg-[#142338] border border-slate-700/80 px-3 py-1.5 rounded-full text-xs text-slate-300 shadow-inner">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_#22c55e]"></span>
            </span>
            <span className="tracking-wide text-[11px] sm:text-xs">Telematics Gateway Active</span>
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-2.5 pl-3 border-l border-slate-700">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center text-xs font-semibold text-white tracking-wider">
              DR
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-semibold text-white leading-tight">Dr. R. Meier</span>
              <span className="text-[11px] text-slate-400 leading-tight">Lead Q-Engineer</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
