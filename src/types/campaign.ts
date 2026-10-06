export type SeverityLevel = 'L1 Critical' | 'L2 High' | 'L3 Medium' | 'L4 Low';

export type CampaignStatus = 
  | 'STOP DELIVERY' 
  | 'INVESTIGATING' 
  | 'OTA STAGED' 
  | 'TSB ISSUED' 
  | 'RESOLVED';

export type DefectClass = 
  | 'Safety Recall (NHTSA)'
  | 'Technical Service (TSB)'
  | 'OTA Software Bug'
  | 'Sub-assembly Flaw'
  | 'Supplier Quality Alert';

export interface Campaign {
  id: string; // e.g., CC-2025-079
  model: string; // e.g., i5 eDrive40 / M60
  subsystem: string; // e.g., Integrated Braking (IBS)
  severity: SeverityLevel;
  status: CampaignStatus;
  impactedVins: number;
  loggedDate: string; // YYYY-MM-DD
  defectClass?: DefectClass;
  technicalObservation?: string;
  nhtsaFilingRequired?: boolean;
  issueStopDelivery?: boolean;
  otaPatchCandidate?: boolean;
  supplierAuditRequested?: boolean;
  plantOrigin?: string;
  dtcCode?: string;
  responsibleEngineer?: string;
}

export interface MetricSummary {
  safetyRecalls: number;
  activeCampaigns: number;
  vinsTracked: number;
  gatewaySyncRate: number;
}
