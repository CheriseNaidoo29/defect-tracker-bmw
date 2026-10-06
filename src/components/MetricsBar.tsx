import React from 'react';
import { Download, FileText } from 'lucide-react';
import { MetricSummary } from '../types/campaign';

interface MetricsBarProps {
  metrics: MetricSummary;
  onExportCsv: () => void;
  onOpenAuditReport: () => void;
}

export const MetricsBar: React.FC<MetricsBarProps> = ({
  metrics,
  onExportCsv,
  onOpenAuditReport
}) => {
  return (
    <section className="bg-white border-b border-slate-200 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      <div className="max-w-[1440px] mx-auto px-6 flex flex-wrap items-center justify-between gap-4">
        {/* Metric figures */}
        <div className="flex flex-wrap items-center gap-7 sm:gap-10">
          <div className="flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-bold text-red-600 tabular-nums">
              {metrics.safetyRecalls}
            </span>
            <span className="text-xs font-semibold text-slate-500 tracking-wider uppercase">
              Safety Recalls
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-bold text-[#0066b1] tabular-nums">
              {metrics.activeCampaigns}
            </span>
            <span className="text-xs font-semibold text-slate-500 tracking-wider uppercase">
              Active Technical Campaigns
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-bold text-slate-900 tabular-nums">
              {metrics.vinsTracked.toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-slate-500 tracking-wider uppercase">
              VIN Units Tracked
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-bold text-slate-900 tabular-nums">
              {metrics.gatewaySyncRate.toFixed(1)}%
            </span>
            <span className="text-xs font-semibold text-slate-500 tracking-wider uppercase">
              Gateway Sync Rate
            </span>
          </div>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onExportCsv}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 hover:border-slate-400 transition-colors shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>Export CSV</span>
          </button>
          <button
            type="button"
            onClick={onOpenAuditReport}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 hover:border-slate-400 transition-colors shadow-xs cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-slate-600" />
            <span>Audit Report</span>
          </button>
        </div>
      </div>
    </section>
  );
};
