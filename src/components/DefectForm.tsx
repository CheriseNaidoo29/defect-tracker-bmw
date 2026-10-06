import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { Campaign, DefectClass, SeverityLevel } from '../types/campaign';

interface DefectFormProps {
  onAddCampaign: (campaign: Campaign) => void;
}

export const DefectForm: React.FC<DefectFormProps> = ({ onAddCampaign }) => {
  const [campaignCode, setCampaignCode] = useState('');
  const [defectClass, setDefectClass] = useState<DefectClass>('Safety Recall (NHTSA)');
  const [model, setModel] = useState('5 Series / i5 (G60)');
  const [subsystem, setSubsystem] = useState('High-Voltage Battery / BMS');
  const [severity, setSeverity] = useState<SeverityLevel>('L1 Critical');
  const [affectedUnits, setAffectedUnits] = useState('');
  const [technicalObservation, setTechnicalObservation] = useState('');

  // Checkbox triggers (matching screenshot state: first two checked by default)
  const [nhtsaFilingRequired, setNhtsaFilingRequired] = useState(true);
  const [issueStopDelivery, setIssueStopDelivery] = useState(true);
  const [otaPatchCandidate, setOtaPatchCandidate] = useState(false);
  const [supplierAuditRequested, setSupplierAuditRequested] = useState(false);

  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const code = campaignCode.trim() || `CC-2025-${Math.floor(100 + Math.random() * 900)}`;
    const units = parseInt(affectedUnits, 10) || Math.floor(2500 + Math.random() * 15000);

    const newCampaign: Campaign = {
      id: code,
      model,
      subsystem,
      severity,
      status: issueStopDelivery 
        ? 'STOP DELIVERY' 
        : otaPatchCandidate 
          ? 'OTA STAGED' 
          : 'INVESTIGATING',
      impactedVins: units,
      loggedDate: new Date().toISOString().split('T')[0],
      defectClass,
      technicalObservation: technicalObservation || 'Observed anomaly during DIN endurance cycle; pending physical teardown analysis.',
      nhtsaFilingRequired,
      issueStopDelivery,
      otaPatchCandidate,
      supplierAuditRequested,
      plantOrigin: 'Dingolfing Plant 02.40',
      dtcCode: 'SYS_DIAG_' + Math.floor(1000 + Math.random() * 9000),
      responsibleEngineer: 'Dr. R. Meier'
    };

    onAddCampaign(newCampaign);

    // Reset fields to neat defaults
    setCampaignCode('');
    setAffectedUnits('');
    setTechnicalObservation('');
    setFormError(null);
  };

  const handleReset = () => {
    setCampaignCode('');
    setDefectClass('Safety Recall (NHTSA)');
    setModel('5 Series / i5 (G60)');
    setSubsystem('High-Voltage Battery / BMS');
    setSeverity('L1 Critical');
    setAffectedUnits('');
    setTechnicalObservation('');
    setNhtsaFilingRequired(true);
    setIssueStopDelivery(true);
    setOtaPatchCandidate(false);
    setSupplierAuditRequested(false);
    setFormError(null);
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      {/* Card Header */}
      <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-white">
        <div>
          <h2 className="text-base font-bold text-slate-900 leading-tight">
            Log Defect Campaign
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Initiate QA investigation or service bulletin
          </p>
        </div>
        <span className="text-[11px] font-semibold tracking-wider text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
          NEW ENTRY
        </span>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
        {formError && (
          <div className="p-2.5 text-xs text-red-700 bg-red-50 border border-red-200 rounded">
            {formError}
          </div>
        )}

        {/* Campaign Code & Defect Class */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Campaign Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={campaignCode}
              onChange={(e) => setCampaignCode(e.target.value)}
              placeholder="e.g., CC-2025-081"
              className="w-full px-3 py-2 text-xs font-mono text-slate-900 bg-white border border-slate-300 rounded focus:border-[#0066b1] focus:ring-1 focus:ring-[#0066b1] outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Defect Class <span className="text-red-500">*</span>
            </label>
            <select
              value={defectClass}
              onChange={(e) => setDefectClass(e.target.value as DefectClass)}
              className="w-full px-3 py-2 text-xs text-slate-800 bg-white border border-slate-300 rounded focus:border-[#0066b1] focus:ring-1 focus:ring-[#0066b1] outline-none transition-colors appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2214%22%20height%3D%2214%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23475569%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:14px] bg-[right_10px_center] bg-no-repeat pr-8"
            >
              <option value="Safety Recall (NHTSA)">Safety Recall (NHTSA)</option>
              <option value="Technical Service (TSB)">Technical Service (TSB)</option>
              <option value="OTA Software Bug">OTA Software Bug</option>
              <option value="Sub-assembly Flaw">Sub-assembly Flaw</option>
              <option value="Supplier Quality Alert">Supplier Quality Alert</option>
            </select>
          </div>
        </div>

        {/* Vehicle Line / Model & Affected Subsystem */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Vehicle Line / Model <span className="text-red-500">*</span>
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full px-3 py-2 text-xs text-slate-800 bg-white border border-slate-300 rounded focus:border-[#0066b1] focus:ring-1 focus:ring-[#0066b1] outline-none transition-colors appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2214%22%20height%3D%2214%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23475569%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:14px] bg-[right_10px_center] bg-no-repeat pr-8"
            >
              <option value="5 Series / i5 (G60)">5 Series / i5 (G60)</option>
              <option value="7 Series / i7 (G70)">7 Series / i7 (G70)</option>
              <option value="X5 / X5 M (G05)">X5 / X5 M (G05)</option>
              <option value="iX SUV (I20)">iX SUV (I20)</option>
              <option value="M3 / M4 Competition">M3 / M4 Competition</option>
              <option value="i4 eDrive40 / M50 (G26)">i4 eDrive40 / M50 (G26)</option>
              <option value="Cross-Platform Unified">Cross-Platform Unified</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Affected Subsystem <span className="text-red-500">*</span>
            </label>
            <select
              value={subsystem}
              onChange={(e) => setSubsystem(e.target.value)}
              className="w-full px-3 py-2 text-xs text-slate-800 bg-white border border-slate-300 rounded focus:border-[#0066b1] focus:ring-1 focus:ring-[#0066b1] outline-none transition-colors appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2214%22%20height%3D%2214%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23475569%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:14px] bg-[right_10px_center] bg-no-repeat pr-8"
            >
              <option value="High-Voltage Battery / BMS">High-Voltage Battery / BMS</option>
              <option value="Integrated Braking (IBS)">Integrated Braking (IBS)</option>
              <option value="HV Cell Module Sensor">HV Cell Module Sensor</option>
              <option value="iDrive 9 OS Telematics">iDrive 9 OS Telematics</option>
              <option value="Air Suspension Valve Block">Air Suspension Valve Block</option>
              <option value="Diff Sensor Wiring Harness">Diff Sensor Wiring Harness</option>
              <option value="Driving Assistant Pro (ADAS)">Driving Assistant Pro (ADAS)</option>
              <option value="eDrive Synchronous Motor">eDrive Synchronous Motor</option>
            </select>
          </div>
        </div>

        {/* Severity Level & Est Affected Units */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Severity Level <span className="text-red-500">*</span>
            </label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value as SeverityLevel)}
              className="w-full px-3 py-2 text-xs text-slate-800 bg-white border border-slate-300 rounded focus:border-[#0066b1] focus:ring-1 focus:ring-[#0066b1] outline-none transition-colors appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2214%22%20height%3D%2214%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23475569%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:14px] bg-[right_10px_center] bg-no-repeat pr-8"
            >
              <option value="L1 Critical">Level 1 - Critical (Stop Sale)</option>
              <option value="L2 High">Level 2 - High (Dealer Rework)</option>
              <option value="L3 Medium">Level 3 - Medium (Next Service)</option>
              <option value="L4 Low">Level 4 - Low (Advisory)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Est. Affected Units
            </label>
            <input
              type="number"
              value={affectedUnits}
              onChange={(e) => setAffectedUnits(e.target.value)}
              placeholder="e.g. 14500"
              className="w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded focus:border-[#0066b1] focus:ring-1 focus:ring-[#0066b1] outline-none transition-colors"
            />
          </div>
        </div>

        {/* Technical Observation / Symptom */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Technical Observation / Symptom <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={3}
            value={technicalObservation}
            onChange={(e) => setTechnicalObservation(e.target.value)}
            placeholder="Specify telematics error codes, fault symptoms observed under DIN testing, or supplier component lot..."
            className="w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded focus:border-[#0066b1] focus:ring-1 focus:ring-[#0066b1] outline-none transition-colors resize-y min-h-[76px]"
          />
        </div>

        {/* Compliance & Action Triggers */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Compliance &amp; Action Triggers
          </label>
          <div className="grid grid-cols-2 gap-2">
            <label className="flex items-center gap-2 p-2 bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded cursor-pointer transition-colors text-xs text-slate-700 font-medium">
              <input
                type="checkbox"
                checked={nhtsaFilingRequired}
                onChange={(e) => setNhtsaFilingRequired(e.target.checked)}
                className="w-4 h-4 rounded text-[#0066b1] focus:ring-[#0066b1] border-slate-300"
              />
              <span>NHTSA Filing Required</span>
            </label>

            <label className="flex items-center gap-2 p-2 bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded cursor-pointer transition-colors text-xs text-slate-700 font-medium">
              <input
                type="checkbox"
                checked={issueStopDelivery}
                onChange={(e) => setIssueStopDelivery(e.target.checked)}
                className="w-4 h-4 rounded text-[#0066b1] focus:ring-[#0066b1] border-slate-300"
              />
              <span>Issue Stop-Delivery Order</span>
            </label>

            <label className="flex items-center gap-2 p-2 bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded cursor-pointer transition-colors text-xs text-slate-700 font-medium">
              <input
                type="checkbox"
                checked={otaPatchCandidate}
                onChange={(e) => setOtaPatchCandidate(e.target.checked)}
                className="w-4 h-4 rounded text-[#0066b1] focus:ring-[#0066b1] border-slate-300"
              />
              <span>OTA Patch Candidate</span>
            </label>

            <label className="flex items-center gap-2 p-2 bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded cursor-pointer transition-colors text-xs text-slate-700 font-medium">
              <input
                type="checkbox"
                checked={supplierAuditRequested}
                onChange={(e) => setSupplierAuditRequested(e.target.checked)}
                className="w-4 h-4 rounded text-[#0066b1] focus:ring-[#0066b1] border-slate-300"
              />
              <span>Supplier Audit Requested</span>
            </label>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2.5 pt-3 border-t border-slate-200 mt-1">
          <button
            type="submit"
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#0066b1] hover:bg-[#00508c] text-white text-xs font-semibold rounded shadow-sm transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Commit Campaign</span>
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-medium rounded transition-colors cursor-pointer"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};
