import React from 'react';
import { X, Printer, Download, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Campaign, MetricSummary } from '../types/campaign';
import { BmwLogo } from './BmwLogo';

interface AuditReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaigns: Campaign[];
  metrics: MetricSummary;
}

export const AuditReportModal: React.FC<AuditReportModalProps> = ({
  isOpen,
  onClose,
  campaigns,
  metrics
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({
      auditDate: new Date().toISOString(),
      auditor: 'Dr. R. Meier (Lead Q-Engineer)',
      metrics,
      campaigns
    }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `BMW-Quality-Audit-Report-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div 
        className="bg-white rounded-lg border border-slate-200 shadow-2xl max-w-3xl w-full overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
      >
        {/* Header */}
        <div className="bg-[#0b192c] text-white px-6 py-4 flex items-center justify-between border-b-2 border-[#0066b1]">
          <div className="flex items-center gap-3">
            <BmwLogo size={36} />
            <div>
              <h3 className="text-sm font-bold text-white">
                BMW Group Quality Assurance Audit Report
              </h3>
              <p className="text-xs text-slate-400">
                Official Defect Mitigation &amp; Technical Recall Log — DIN EN ISO 9001:2015
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

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700">
          {/* Executive Summary Card */}
          <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
            <div className="flex items-center justify-between mb-3 border-b border-slate-200 pb-2">
              <span className="font-bold text-slate-900 text-sm">Executive Quality Summary</span>
              <span className="text-[11px] text-slate-500">Generated: {new Date().toLocaleDateString()}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <span className="text-[11px] text-slate-500 font-semibold block">Active Safety Recalls</span>
                <span className="text-lg font-bold text-red-600 tabular-nums">{metrics.safetyRecalls}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 font-semibold block">Total Active Campaigns</span>
                <span className="text-lg font-bold text-[#0066b1] tabular-nums">{metrics.activeCampaigns}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 font-semibold block">Fleet VINs Tracked</span>
                <span className="text-lg font-bold text-slate-900 tabular-nums">{metrics.vinsTracked.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 font-semibold block">Telematics Sync</span>
                <span className="text-lg font-bold text-emerald-600 tabular-nums">{metrics.gatewaySyncRate.toFixed(1)}%</span>
              </div>
            </div>
          </div>

          {/* Audit Verification Statement */}
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-emerald-900 text-xs">Compliance Certification</h4>
              <p className="text-[11px] text-emerald-800 mt-0.5 leading-relaxed">
                All Level 1 critical campaigns have been cross-checked against NHTSA Part 573 defect submission schedules. Stop-delivery dispatch commands have been sent to authorized BMW retail centers globally via the automated central logistics interface.
              </p>
            </div>
          </div>

          {/* Critical Campaigns Table */}
          <div>
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">
              Current Critical &amp; High Priority Registry
            </h4>
            <div className="border border-slate-200 rounded-md overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="py-2 px-3 font-semibold">Campaign ID</th>
                    <th className="py-2 px-3 font-semibold">Model</th>
                    <th className="py-2 px-3 font-semibold">Subsystem</th>
                    <th className="py-2 px-3 font-semibold">Severity</th>
                    <th className="py-2 px-3 font-semibold">Status</th>
                    <th className="py-2 px-3 font-semibold text-right">VINs</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {campaigns.slice(0, 5).map((c) => (
                    <tr key={c.id}>
                      <td className="py-2 px-3 font-mono font-semibold text-slate-900">{c.id}</td>
                      <td className="py-2 px-3 font-medium text-slate-800">{c.model}</td>
                      <td className="py-2 px-3 text-slate-600">{c.subsystem}</td>
                      <td className="py-2 px-3 font-semibold">{c.severity}</td>
                      <td className="py-2 px-3">
                        <span className="font-semibold text-[10px] uppercase">{c.status}</span>
                      </td>
                      <td className="py-2 px-3 text-right tabular-nums">{c.impactedVins.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded hover:bg-slate-100 font-medium text-xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              Print
            </button>
            <button
              type="button"
              onClick={handleExportJson}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded hover:bg-slate-100 font-medium text-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Export JSON
            </button>
          </div>

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
