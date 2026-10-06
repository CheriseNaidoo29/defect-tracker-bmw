import React, { useState } from 'react';
import { X, Copy, Check, FileCode2, Download } from 'lucide-react';
import { ANGULAR_CODE_FILES, AngularFileCode } from '../angular-code/angular-files';

interface AngularCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AngularCodeModal: React.FC<AngularCodeModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<number>(0);
  const [copied, setCopied] = useState(false);

  const currentFile = ANGULAR_CODE_FILES[activeTab] || ANGULAR_CODE_FILES[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([currentFile.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = currentFile.filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div 
        className="bg-[#0b192c] text-white rounded-lg border border-slate-700 shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between bg-[#07162c]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400 font-bold text-xs">
              NG
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Generated Angular 18+ Architecture
                <span className="text-[10px] bg-red-950 text-red-400 border border-red-800 px-1.5 py-0.5 rounded uppercase">
                  Standalone &amp; Signals
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Pixel-perfect match to BMW Campaign Central dashboard design
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1 rounded-md hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="px-6 pt-3 bg-[#0d1e36] border-b border-slate-700/80 flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex items-center gap-1">
            {ANGULAR_CODE_FILES.map((file, idx) => (
              <button
                key={file.filename}
                type="button"
                onClick={() => setActiveTab(idx)}
                className={`px-3 py-2 text-xs font-mono rounded-t transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  activeTab === idx
                    ? 'bg-[#0f172a] text-sky-400 border-t-2 border-t-[#0066b1] border-x border-slate-700 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <FileCode2 className="w-3.5 h-3.5 text-slate-400" />
                <span>{file.filename}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 pb-1.5">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-medium border border-slate-600 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-medium border border-slate-600 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
          </div>
        </div>

        {/* File Description */}
        <div className="px-6 py-2 bg-[#091422] border-b border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <span>{currentFile.description}</span>
          <span className="font-mono text-slate-500">{currentFile.language}</span>
        </div>

        {/* Code Viewport */}
        <div className="p-4 bg-[#070e18] overflow-auto flex-1 font-mono text-xs text-slate-200 leading-relaxed selection:bg-[#0066b1]/50">
          <pre className="overflow-x-auto whitespace-pre font-mono">
            <code>{currentFile.code}</code>
          </pre>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-[#0d1e36] border-t border-slate-700 flex items-center justify-between text-xs text-slate-400">
          <span>Includes BMW color tokens, responsive two-column grid, and reactive validation.</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold bg-[#0066b1] hover:bg-[#00508c] text-white rounded transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
