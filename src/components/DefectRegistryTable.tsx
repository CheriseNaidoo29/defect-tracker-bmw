import React from 'react';
import { Search, ChevronRight } from 'lucide-react';
import { Campaign, CampaignStatus, SeverityLevel } from '../types/campaign';

interface DefectRegistryTableProps {
  campaigns: Campaign[];
  totalRecords: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  severityFilter: string;
  onSeverityFilterChange: (severity: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  onSelectCampaign: (campaign: Campaign) => void;
}

export const DefectRegistryTable: React.FC<DefectRegistryTableProps> = ({
  campaigns,
  totalRecords,
  searchQuery,
  onSearchChange,
  severityFilter,
  onSeverityFilterChange,
  statusFilter,
  onStatusFilterChange,
  currentPage,
  onPageChange,
  pageSize,
  onSelectCampaign
}) => {
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));

  const renderSeverity = (sev: SeverityLevel) => {
    switch (sev) {
      case 'L1 Critical':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs text-slate-800">
            <span className="w-2 h-2 rounded-full bg-red-600 inline-block shadow-[0_0_4px_rgba(220,38,38,0.5)]"></span>
            <span>L1 Critical</span>
          </span>
        );
      case 'L2 High':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs text-slate-800">
            <span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span>
            <span>L2 High</span>
          </span>
        );
      case 'L3 Medium':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs text-slate-800">
            <span className="w-2 h-2 rounded-full bg-blue-500 inline-block"></span>
            <span>L3 Medium</span>
          </span>
        );
      case 'L4 Low':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs text-slate-800">
            <span className="w-2 h-2 rounded-full bg-slate-400 inline-block"></span>
            <span>L4 Low</span>
          </span>
        );
      default:
        return <span>{sev}</span>;
    }
  };

  const renderStatusBadge = (status: CampaignStatus) => {
    switch (status) {
      case 'STOP DELIVERY':
        return (
          <span className="inline-block px-2.5 py-0.5 text-[10px] font-semibold tracking-wider text-red-600 bg-red-50/80 border border-red-200 rounded">
            STOP DELIVERY
          </span>
        );
      case 'INVESTIGATING':
        return (
          <span className="inline-block px-2.5 py-0.5 text-[10px] font-semibold tracking-wider text-blue-600 bg-blue-50/80 border border-blue-200 rounded">
            INVESTIGATING
          </span>
        );
      case 'OTA STAGED':
        return (
          <span className="inline-block px-2.5 py-0.5 text-[10px] font-semibold tracking-wider text-amber-700 bg-amber-50/80 border border-amber-300 rounded">
            OTA STAGED
          </span>
        );
      case 'TSB ISSUED':
        return (
          <span className="inline-block px-2.5 py-0.5 text-[10px] font-semibold tracking-wider text-amber-700 bg-amber-50/80 border border-amber-300 rounded">
            TSB ISSUED
          </span>
        );
      case 'RESOLVED':
        return (
          <span className="inline-block px-2.5 py-0.5 text-[10px] font-semibold tracking-wider text-emerald-700 bg-emerald-50/80 border border-emerald-300 rounded">
            RESOLVED
          </span>
        );
      default:
        return (
          <span className="inline-block px-2 py-0.5 text-[10px] font-semibold text-slate-700 bg-slate-100 border border-slate-300 rounded">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      {/* Card Header */}
      <div className="px-5 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 bg-white">
        <div>
          <h2 className="text-base font-bold text-slate-900 leading-tight">
            Active Defect Tracking Registry
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time campaign telemetry and engineering oversight
          </p>
        </div>
        <div className="text-xs text-slate-500 font-medium">
          Showing <span className="font-semibold text-slate-800">{campaigns.length}</span> of{' '}
          <span className="font-semibold text-slate-800">{totalRecords}</span> records
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search campaign ID, model, or subsystem..."
            className="w-full pl-8 pr-3 py-1.5 text-xs text-slate-800 bg-white border border-slate-300 rounded focus:border-[#0066b1] focus:ring-1 focus:ring-[#0066b1] outline-none transition-colors"
          />
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <select
            value={severityFilter}
            onChange={(e) => onSeverityFilterChange(e.target.value)}
            className="px-3 py-1.5 text-xs text-slate-700 bg-white border border-slate-300 rounded focus:border-[#0066b1] outline-none cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2214%22%20height%3D%2214%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23475569%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:14px] bg-[right_8px_center] bg-no-repeat pr-7"
          >
            <option value="All">All Severities</option>
            <option value="L1 Critical">L1 - Critical</option>
            <option value="L2 High">L2 - High</option>
            <option value="L3 Medium">L3 - Medium</option>
            <option value="L4 Low">L4 - Low</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="px-3 py-1.5 text-xs text-slate-700 bg-white border border-slate-300 rounded focus:border-[#0066b1] outline-none cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2214%22%20height%3D%2214%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23475569%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:14px] bg-[right_8px_center] bg-no-repeat pr-7"
          >
            <option value="All">Status: All</option>
            <option value="STOP DELIVERY">Stop Delivery</option>
            <option value="INVESTIGATING">Investigating</option>
            <option value="OTA STAGED">OTA Staged</option>
            <option value="TSB ISSUED">TSB Issued</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto min-h-[320px]">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-white text-slate-600 font-semibold tracking-wider uppercase text-[11px]">
              <th className="py-3 px-4 font-semibold">CAMPAIGN ID</th>
              <th className="py-3 px-4 font-semibold">MODEL / PLATFORM</th>
              <th className="py-3 px-4 font-semibold">SUBSYSTEM</th>
              <th className="py-3 px-4 font-semibold">SEVERITY</th>
              <th className="py-3 px-4 font-semibold">STATUS</th>
              <th className="py-3 px-4 font-semibold">IMPACTED VINS</th>
              <th className="py-3 px-4 font-semibold">LOGGED DATE</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {campaigns.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-500">
                  No defect campaigns match your search and filter criteria.
                </td>
              </tr>
            ) : (
              campaigns.map((camp) => (
                <tr
                  key={camp.id}
                  onClick={() => onSelectCampaign(camp)}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                >
                  <td className="py-3 px-4 font-mono font-semibold text-slate-900 group-hover:text-[#0066b1] transition-colors whitespace-nowrap">
                    {camp.id}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-900 whitespace-nowrap">
                    {camp.model}
                  </td>
                  <td className="py-3 px-4 text-slate-700 whitespace-nowrap">
                    {camp.subsystem}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {renderSeverity(camp.severity)}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {renderStatusBadge(camp.status)}
                  </td>
                  <td className="py-3 px-4 text-slate-700 tabular-nums whitespace-nowrap">
                    {camp.impactedVins.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-slate-700 whitespace-nowrap">
                    {camp.loggedDate}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-5 py-3 border-t border-slate-200 bg-white flex items-center justify-between gap-4 text-xs text-slate-500">
        <div>
          Showing pages <span className="font-semibold text-slate-800">{currentPage}</span> of{' '}
          <span className="font-semibold text-slate-800">{totalPages}</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="px-2.5 py-1 rounded border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium text-xs"
          >
            Previous
          </button>

          {Array.from({ length: Math.min(3, totalPages) }, (_, i) => i + 1).map((pg) => (
            <button
              key={pg}
              type="button"
              onClick={() => onPageChange(pg)}
              className={`w-7 h-7 flex items-center justify-center rounded text-xs font-semibold transition-colors ${
                currentPage === pg
                  ? 'bg-[#0066b1] text-white border border-[#0066b1]'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {pg}
            </button>
          ))}

          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="px-2.5 py-1 rounded border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium text-xs"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
