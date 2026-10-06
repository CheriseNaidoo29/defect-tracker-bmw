import React, { useState } from 'react';
import { X, ShieldAlert, CheckCircle2, AlertTriangle, Cpu, Radio, Wrench, Factory } from 'lucide-react';
import { Campaign, CampaignStatus } from '../types/campaign';

interface DossierModalProps {
  campaign: Campaign | null;
  onClose: () => void;
  onUpdateStatus: (campaignId: string, newStatus: CampaignStatus) => void;
}

export const DossierModal: React.FC<DossierModalProps> = ({
  campaign,
  onClose,
  onUpdateStatus
}) => {
  if (!campaign) return null;

  const [currentStatus, setCurrentStatus] = useState<CampaignStatus>(campaign.status);

  const handleStatusChange = (status: CampaignStatus) => {
    setCurrentStatus(status);
    onUpdateStatus(campaign.id, status);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div 
        className="bg-white rounded-lg border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-labelledby="dossier-title"
      >
        {/* Modal Header */}
        <div className="bg-[#0b192c] text-white px-6 py-4 flex items-center justify-between border-b-2 border-[#0066b1]">
          <div className="flex items-center gap-3">
            <span className="font-mono text-base font-bold text-sky-400 bg-sky-950/80 px-2.5 py-1 rounded border border-sky-800">
              {campaign.id}
            </span>
            <div>
              <h3 id="dossier-title" className="text-sm font-bold text-white">
                Technical Dossier &amp; Root Cause Analysis
              </h3>
              <p className="text-xs text-slate-400">
                Vehicle Platform: <span className="text-white font-medium">{campaign.model}</span>
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

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-md">
            <div>
              <span className="block text-[11px] text-slate-500 uppercase font-semibold">Subsystem</span>
              <span className="font-semibold text-slate-900">{campaign.subsystem}</span>
            </div>
            <div>
              <span className="block text-[11px] text-slate-500 uppercase font-semibold">Severity</span>
              <span className="font-semibold text-slate-900">{campaign.severity}</span>
            </div>
            <div>
              <span className="block text-[11px] text-slate-500 uppercase font-semibold">Impacted VINs</span>
              <span className="font-semibold text-slate-900">{campaign.impactedVins.toLocaleString()}</span>
            </div>
            <div>
              <span className="block text-[11px] text-slate-500 uppercase font-semibold">Logged Date</span>
              <span className="font-semibold text-slate-900">{campaign.loggedDate}</span>
            </div>
          </div>

          {/* Diagnostic Code & Manufacturing Facility */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-2.5 p-3 bg-blue-50/60 border border-blue-200/80 rounded-md">
              <Cpu className="w-4 h-4 text-[#0066b1] shrink-0 mt-0.5" />
              <div>
                <span className="block font-semibold text-slate-900">Telematics DTC Identifier</span>
                <span className="font-mono text-[11px] text-blue-900 font-medium">
                  {campaign.dtcCode || 'DTC_0x1B2004_CAN_ERR'}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 bg-slate-50 border border-slate-200 rounded-md">
              <Factory className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
              <div>
                <span className="block font-semibold text-slate-900">Manufacturing Facility</span>
                <span className="text-slate-700">
                  {campaign.plantOrigin || 'Dingolfing Assembly (Werk 02.40)'}
                </span>
              </div>
            </div>
          </div>

          {/* Technical Observation */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-1.5 flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-slate-600" />
              Technical Observation / Engineering Telemetry
            </h4>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-md font-mono text-[11px] text-slate-800 leading-relaxed whitespace-pre-line">
              {campaign.technicalObservation || 'Continuous monitoring logged via high-frequency telematics gateway. Root cause telemetry isolated to hardware revision tolerance.'}
            </div>
          </div>

          {/* Action Protocols & Status Adjustment */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Campaign Operational Status</h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {(['STOP DELIVERY', 'INVESTIGATING', 'OTA STAGED', 'TSB ISSUED', 'RESOLVED'] as CampaignStatus[]).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => handleStatusChange(st)}
                  className={`px-2.5 py-1.5 rounded text-[11px] font-semibold border transition-all cursor-pointer ${
                    currentStatus === st
                      ? 'bg-[#0066b1] text-white border-[#0066b1] shadow-xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Regulatory Flags */}
          <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center gap-3 text-[11px]">
            <span className="font-semibold text-slate-600">Regulatory Flags:</span>
            {campaign.nhtsaFilingRequired && (
              <span className="px-2 py-0.5 bg-red-50 text-red-700 border border-red-200 rounded font-medium">
                NHTSA Form 573 Mandatory
              </span>
            )}
            {campaign.issueStopDelivery && (
              <span className="px-2 py-0.5 bg-orange-50 text-orange-700 border border-orange-200 rounded font-medium">
                Dealer Stop-Sale In Effect
              </span>
            )}
            {campaign.otaPatchCandidate && (
              <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded font-medium">
                OTA Staged for Deployment
              </span>
            )}
            {campaign.supplierAuditRequested && (
              <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded font-medium">
                Tier-1 Supplier Audit Initiated
              </span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Responsible Engineer: <strong className="text-slate-700">{campaign.responsibleEngineer || 'Dr. R. Meier'}</strong>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold bg-[#0066b1] hover:bg-[#00508c] text-white rounded transition-colors cursor-pointer"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
