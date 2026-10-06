export interface AngularFileCode {
  filename: string;
  language: string;
  description: string;
  code: string;
}

export const ANGULAR_CODE_FILES: AngularFileCode[] = [
  {
    filename: 'campaign-central.component.ts',
    language: 'typescript',
    description: 'Angular 18+ Standalone Component with Signals & Reactive Forms',
    code: `import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Campaign, CampaignStatus, SeverityLevel } from './models/campaign.model';
import { CampaignService } from './services/campaign.service';

@Component({
  selector: 'app-campaign-central',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './campaign-central.component.html',
  styleUrls: ['./campaign-central.component.css']
})
export class CampaignCentralComponent {
  // Reactive form for defect logging
  defectForm: FormGroup;

  // Search & Filter signals
  searchQuery = signal<string>('');
  selectedSeverity = signal<string>('All');
  selectedStatus = signal<string>('All');
  currentPage = signal<number>(1);
  pageSize = 5;

  // Selected campaign for technical dossier modal
  activeCampaign = signal<Campaign | null>(null);
  showAuditModal = signal<boolean>(false);

  // Computed signals
  allCampaigns = this.campaignService.campaigns;
  metrics = this.campaignService.metrics;

  filteredCampaigns = computed(() => {
    let list = this.allCampaigns();
    const query = this.searchQuery().toLowerCase().trim();
    const sev = this.selectedSeverity();
    const stat = this.selectedStatus();

    if (query) {
      list = list.filter(c => 
        c.id.toLowerCase().includes(query) ||
        c.model.toLowerCase().includes(query) ||
        c.subsystem.toLowerCase().includes(query)
      );
    }

    if (sev !== 'All') {
      list = list.filter(c => c.severity === sev);
    }

    if (stat !== 'All') {
      list = list.filter(c => c.status === stat);
    }

    return list;
  });

  paginatedCampaigns = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filteredCampaigns().slice(start, start + this.pageSize);
  });

  totalPages = computed(() => {
    return Math.max(1, Math.ceil(this.filteredCampaigns().length / this.pageSize));
  });

  constructor(
    private fb: FormBuilder,
    public campaignService: CampaignService
  ) {
    this.defectForm = this.fb.group({
      campaignCode: ['', [Validators.required]],
      defectClass: ['Safety Recall (NHTSA)', Validators.required],
      model: ['5 Series / i5 (G60)', Validators.required],
      subsystem: ['High-Voltage Battery / BMS', Validators.required],
      severity: ['L1 Critical', Validators.required],
      affectedUnits: ['', [Validators.pattern('^[0-9]*$')]],
      technicalObservation: ['', Validators.required],
      nhtsaFilingRequired: [true],
      issueStopDelivery: [true],
      otaPatchCandidate: [false],
      supplierAuditRequested: [false]
    });
  }

  onCommitCampaign(): void {
    if (this.defectForm.invalid) {
      this.defectForm.markAllAsTouched();
      return;
    }

    const formValue = this.defectForm.value;
    const units = parseInt(formValue.affectedUnits, 10) || 12480;

    const newCampaign: Campaign = {
      id: formValue.campaignCode.trim() || \`CC-2025-\${Math.floor(100 + Math.random() * 900)}\`,
      model: formValue.model,
      subsystem: formValue.subsystem,
      severity: formValue.severity as SeverityLevel,
      status: formValue.issueStopDelivery ? 'STOP DELIVERY' : formValue.otaPatchCandidate ? 'OTA STAGED' : 'INVESTIGATING',
      impactedVins: units,
      loggedDate: new Date().toISOString().split('T')[0],
      defectClass: formValue.defectClass,
      technicalObservation: formValue.technicalObservation,
      nhtsaFilingRequired: formValue.nhtsaFilingRequired,
      issueStopDelivery: formValue.issueStopDelivery,
      otaPatchCandidate: formValue.otaPatchCandidate,
      supplierAuditRequested: formValue.supplierAuditRequested
    };

    this.campaignService.addCampaign(newCampaign);
    this.defectForm.reset({
      campaignCode: '',
      defectClass: 'Safety Recall (NHTSA)',
      model: '5 Series / i5 (G60)',
      subsystem: 'High-Voltage Battery / BMS',
      severity: 'L1 Critical',
      affectedUnits: '',
      technicalObservation: '',
      nhtsaFilingRequired: true,
      issueStopDelivery: true,
      otaPatchCandidate: false,
      supplierAuditRequested: false
    });
  }

  onReset(): void {
    this.defectForm.reset({
      campaignCode: '',
      defectClass: 'Safety Recall (NHTSA)',
      model: '5 Series / i5 (G60)',
      subsystem: 'High-Voltage Battery / BMS',
      severity: 'L1 Critical',
      affectedUnits: '',
      technicalObservation: '',
      nhtsaFilingRequired: true,
      issueStopDelivery: true,
      otaPatchCandidate: false,
      supplierAuditRequested: false
    });
  }

  setPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  exportCsv(): void {
    this.campaignService.exportCsv(this.filteredCampaigns());
  }

  selectCampaign(campaign: Campaign): void {
    this.activeCampaign.set(campaign);
  }

  closeDossier(): void {
    this.activeCampaign.set(null);
  }
}`
  },
  {
    filename: 'campaign-central.component.html',
    language: 'html',
    description: 'Angular Template HTML matching exact visual layout & styling',
    code: `<!-- HEADER -->
<header class="bg-[#0b192c] text-white border-b-2 border-[#0066b1] sticky top-0 z-40 shadow-md">
  <div class="max-w-[1440px] mx-auto px-6 py-3.5 flex items-center justify-between gap-4">
    <!-- Brand Group -->
    <div class="flex items-center gap-3.5">
      <!-- BMW Roundel Mark -->
      <div class="w-10 h-10 rounded-full border-2 border-white bg-black relative overflow-hidden shrink-0 shadow-[0_0_8px_rgba(0,102,177,0.4)]">
        <div class="w-full h-full grid grid-cols-2 grid-rows-2">
          <div class="bg-[#0066b1]"></div>
          <div class="bg-white"></div>
          <div class="bg-white"></div>
          <div class="bg-[#0066b1]"></div>
        </div>
      </div>
      <div class="flex flex-col">
        <div class="flex items-center gap-2.5">
          <h1 class="text-lg font-bold tracking-tight text-white leading-tight">BMW Campaign Central</h1>
          <span class="bg-[#0066b1]/30 border border-[#0066b1]/80 text-[#93c5fd] text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded">
            QUALITY OPS
          </span>
        </div>
        <p class="text-xs text-slate-400 font-normal tracking-wide mt-0.5">
          Corporate Defect Mitigation & Technical Recall Management
        </p>
      </div>
    </div>

    <!-- Status & User Profile -->
    <div class="flex items-center gap-4">
      <div class="flex items-center gap-2 bg-[#142338] border border-slate-700/80 px-3 py-1.5 rounded-full text-xs text-slate-300">
        <span class="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_#22c55e]"></span>
        <span class="text-xs">Telematics Gateway Active</span>
      </div>

      <div class="flex items-center gap-2.5 pl-3 border-l border-slate-700">
        <div class="w-8 h-8 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center text-xs font-semibold text-white">
          DR
        </div>
        <div class="flex flex-col text-left">
          <span class="text-xs font-semibold text-white leading-tight">Dr. R. Meier</span>
          <span class="text-[11px] text-slate-400 leading-tight">Lead Q-Engineer</span>
        </div>
      </div>
    </div>
  </div>
</header>

<!-- METRIC STATS BAR -->
<section class="bg-white border-b border-slate-200 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
  <div class="max-w-[1440px] mx-auto px-6 flex flex-wrap items-center justify-between gap-4">
    <div class="flex flex-wrap items-center gap-8">
      <div class="flex items-baseline gap-2">
        <span class="text-xl sm:text-2xl font-bold text-red-600 tabular-nums">{{ metrics().safetyRecalls }}</span>
        <span class="text-xs font-semibold text-slate-500 tracking-wider uppercase">SAFETY RECALLS</span>
      </div>
      <div class="flex items-baseline gap-2">
        <span class="text-xl sm:text-2xl font-bold text-[#0066b1] tabular-nums">{{ metrics().activeCampaigns }}</span>
        <span class="text-xs font-semibold text-slate-500 tracking-wider uppercase">ACTIVE TECHNICAL CAMPAIGNS</span>
      </div>
      <div class="flex items-baseline gap-2">
        <span class="text-xl sm:text-2xl font-bold text-slate-900 tabular-nums">{{ metrics().vinsTracked | number }}</span>
        <span class="text-xs font-semibold text-slate-500 tracking-wider uppercase">VIN UNITS TRACKED</span>
      </div>
      <div class="flex items-baseline gap-2">
        <span class="text-xl sm:text-2xl font-bold text-slate-900 tabular-nums">{{ metrics().gatewaySyncRate }}%</span>
        <span class="text-xs font-semibold text-slate-500 tracking-wider uppercase">GATEWAY SYNC RATE</span>
      </div>
    </div>

    <div class="flex items-center gap-2.5">
      <button (click)="exportCsv()" class="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50">
        Export CSV
      </button>
      <button (click)="showAuditModal.set(true)" class="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50">
        Audit Report
      </button>
    </div>
  </div>
</section>

<!-- MAIN TWO-COLUMN WORKBENCH -->
<main class="max-w-[1440px] mx-auto px-6 py-6">
  <div class="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 items-start">

    <!-- LEFT COLUMN: LOG DEFECT CAMPAIGN FORM -->
    <section class="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      <div class="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-white">
        <div>
          <h2 class="text-base font-bold text-slate-900 leading-tight">Log Defect Campaign</h2>
          <p class="text-xs text-slate-500 mt-0.5">Initiate QA investigation or service bulletin</p>
        </div>
        <span class="text-[11px] font-semibold tracking-wider text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
          NEW ENTRY
        </span>
      </div>

      <form [formGroup]="defectForm" (ngSubmit)="onCommitCampaign()" class="p-5 flex flex-col gap-4">
        <!-- Campaign Code & Defect Class -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Campaign Code <span class="text-red-500">*</span></label>
            <input type="text" formControlName="campaignCode" placeholder="e.g., CC-2025-081"
              class="w-full px-3 py-2 text-xs font-mono text-slate-900 bg-white border border-slate-300 rounded focus:border-[#0066b1] outline-none" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Defect Class <span class="text-red-500">*</span></label>
            <select formControlName="defectClass" class="w-full px-3 py-2 text-xs text-slate-800 bg-white border border-slate-300 rounded focus:border-[#0066b1] outline-none">
              <option value="Safety Recall (NHTSA)">Safety Recall (NHTSA)</option>
              <option value="Technical Service (TSB)">Technical Service (TSB)</option>
              <option value="OTA Software Bug">OTA Software Bug</option>
              <option value="Sub-assembly Flaw">Sub-assembly Flaw</option>
            </select>
          </div>
        </div>

        <!-- Vehicle Line & Affected Subsystem -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Vehicle Line / Model <span class="text-red-500">*</span></label>
            <select formControlName="model" class="w-full px-3 py-2 text-xs text-slate-800 bg-white border border-slate-300 rounded focus:border-[#0066b1] outline-none">
              <option value="5 Series / i5 (G60)">5 Series / i5 (G60)</option>
              <option value="7 Series / i7 (G70)">7 Series / i7 (G70)</option>
              <option value="X5 / X5 M (G05)">X5 / X5 M (G05)</option>
              <option value="iX SUV (I20)">iX SUV (I20)</option>
              <option value="M3 / M4 Competition">M3 / M4 Competition</option>
              <option value="Cross-Platform Unified">Cross-Platform Unified</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Affected Subsystem <span class="text-red-500">*</span></label>
            <select formControlName="subsystem" class="w-full px-3 py-2 text-xs text-slate-800 bg-white border border-slate-300 rounded focus:border-[#0066b1] outline-none">
              <option value="High-Voltage Battery / BMS">High-Voltage Battery / BMS</option>
              <option value="Integrated Braking (IBS)">Integrated Braking (IBS)</option>
              <option value="HV Cell Module Sensor">HV Cell Module Sensor</option>
              <option value="iDrive 9 OS Telematics">iDrive 9 OS Telematics</option>
              <option value="Air Suspension Valve Block">Air Suspension Valve Block</option>
              <option value="Diff Sensor Wiring Harness">Diff Sensor Wiring Harness</option>
            </select>
          </div>
        </div>

        <!-- Severity Level & Est Units -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Severity Level <span class="text-red-500">*</span></label>
            <select formControlName="severity" class="w-full px-3 py-2 text-xs text-slate-800 bg-white border border-slate-300 rounded focus:border-[#0066b1] outline-none">
              <option value="L1 Critical">Level 1 - Critical (Stop Sale)</option>
              <option value="L2 High">Level 2 - High (Dealer Rework)</option>
              <option value="L3 Medium">Level 3 - Medium (Next Service)</option>
              <option value="L4 Low">Level 4 - Low (Advisory)</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Est. Affected Units</label>
            <input type="number" formControlName="affectedUnits" placeholder="e.g. 14500"
              class="w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded focus:border-[#0066b1] outline-none" />
          </div>
        </div>

        <!-- Technical Observation -->
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Technical Observation / Symptom <span class="text-red-500">*</span></label>
          <textarea rows="3" formControlName="technicalObservation" placeholder="Specify telematics error codes, fault symptoms observed under DIN testing, or supplier component lot..."
            class="w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded focus:border-[#0066b1] outline-none resize-y min-h-[76px]"></textarea>
        </div>

        <!-- Compliance & Action Triggers -->
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1.5">Compliance & Action Triggers</label>
          <div class="grid grid-cols-2 gap-2">
            <label class="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700 cursor-pointer">
              <input type="checkbox" formControlName="nhtsaFilingRequired" class="w-4 h-4 text-[#0066b1] rounded" />
              <span>NHTSA Filing Required</span>
            </label>
            <label class="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700 cursor-pointer">
              <input type="checkbox" formControlName="issueStopDelivery" class="w-4 h-4 text-[#0066b1] rounded" />
              <span>Issue Stop-Delivery Order</span>
            </label>
            <label class="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700 cursor-pointer">
              <input type="checkbox" formControlName="otaPatchCandidate" class="w-4 h-4 text-[#0066b1] rounded" />
              <span>OTA Patch Candidate</span>
            </label>
            <label class="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700 cursor-pointer">
              <input type="checkbox" formControlName="supplierAuditRequested" class="w-4 h-4 text-[#0066b1] rounded" />
              <span>Supplier Audit Requested</span>
            </label>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center gap-2.5 pt-3 border-t border-slate-200">
          <button type="submit" class="flex-1 px-4 py-2 bg-[#0066b1] hover:bg-[#00508c] text-white text-xs font-semibold rounded shadow-sm">
            Commit Campaign
          </button>
          <button type="button" (click)="onReset()" class="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-medium rounded">
            Reset
          </button>
        </div>
      </form>
    </section>

    <!-- RIGHT COLUMN: ACTIVE DEFECT TRACKING REGISTRY -->
    <section class="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      <div class="px-5 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 bg-white">
        <div>
          <h2 class="text-base font-bold text-slate-900 leading-tight">Active Defect Tracking Registry</h2>
          <p class="text-xs text-slate-500 mt-0.5">Real-time campaign telemetry and engineering oversight</p>
        </div>
        <div class="text-xs text-slate-500 font-medium">
          Showing <span class="font-semibold text-slate-800">{{ paginatedCampaigns().length }}</span> of <span class="font-semibold text-slate-800">{{ filteredCampaigns().length }}</span> records
        </div>
      </div>

      <!-- Search & Filters -->
      <div class="p-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div class="flex-1 min-w-[240px]">
          <input type="text" [value]="searchQuery()" (input)="searchQuery.set($any($event.target).value); currentPage.set(1)"
            placeholder="Search campaign ID, model, or subsystem..."
            class="w-full px-3 py-1.5 text-xs text-slate-800 bg-white border border-slate-300 rounded focus:border-[#0066b1] outline-none" />
        </div>
        <div class="flex items-center gap-2.5">
          <select [value]="selectedSeverity()" (change)="selectedSeverity.set($any($event.target).value); currentPage.set(1)"
            class="px-3 py-1.5 text-xs text-slate-700 bg-white border border-slate-300 rounded focus:border-[#0066b1] outline-none">
            <option value="All">All Severities</option>
            <option value="L1 Critical">L1 - Critical</option>
            <option value="L2 High">L2 - High</option>
            <option value="L3 Medium">L3 - Medium</option>
          </select>
          <select [value]="selectedStatus()" (change)="selectedStatus.set($any($event.target).value); currentPage.set(1)"
            class="px-3 py-1.5 text-xs text-slate-700 bg-white border border-slate-300 rounded focus:border-[#0066b1] outline-none">
            <option value="All">Status: All</option>
            <option value="STOP DELIVERY">Stop Delivery</option>
            <option value="INVESTIGATING">Investigating</option>
            <option value="OTA STAGED">OTA Staged</option>
            <option value="TSB ISSUED">TSB Issued</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto min-h-[320px]">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="border-b border-slate-200 bg-white text-slate-600 font-semibold tracking-wider uppercase text-[11px]">
              <th class="py-3 px-4 font-semibold">CAMPAIGN ID</th>
              <th class="py-3 px-4 font-semibold">MODEL / PLATFORM</th>
              <th class="py-3 px-4 font-semibold">SUBSYSTEM</th>
              <th class="py-3 px-4 font-semibold">SEVERITY</th>
              <th class="py-3 px-4 font-semibold">STATUS</th>
              <th class="py-3 px-4 font-semibold">IMPACTED VINS</th>
              <th class="py-3 px-4 font-semibold">LOGGED DATE</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            @for (camp of paginatedCampaigns(); track camp.id) {
              <tr (click)="selectCampaign(camp)" class="hover:bg-slate-50 transition-colors cursor-pointer">
                <td class="py-3 px-4 font-mono font-semibold text-slate-900 whitespace-nowrap">{{ camp.id }}</td>
                <td class="py-3 px-4 font-semibold text-slate-900 whitespace-nowrap">{{ camp.model }}</td>
                <td class="py-3 px-4 text-slate-700 whitespace-nowrap">{{ camp.subsystem }}</td>
                <td class="py-3 px-4 whitespace-nowrap">
                  <span class="inline-flex items-center gap-1.5 text-xs text-slate-800">
                    <span [class]="camp.severity === 'L1 Critical' ? 'w-2 h-2 rounded-full bg-red-600' : camp.severity === 'L2 High' ? 'w-2 h-2 rounded-full bg-amber-500' : 'w-2 h-2 rounded-full bg-blue-500'"></span>
                    <span>{{ camp.severity }}</span>
                  </span>
                </td>
                <td class="py-3 px-4 whitespace-nowrap">
                  <span [ngClass]="{
                    'text-red-600 bg-red-50/80 border-red-200': camp.status === 'STOP DELIVERY',
                    'text-blue-600 bg-blue-50/80 border-blue-200': camp.status === 'INVESTIGATING',
                    'text-amber-700 bg-amber-50/80 border-amber-300': camp.status === 'OTA STAGED' || camp.status === 'TSB ISSUED',
                    'text-emerald-700 bg-emerald-50/80 border-emerald-300': camp.status === 'RESOLVED'
                  }" class="inline-block px-2.5 py-0.5 text-[10px] font-semibold tracking-wider border rounded">
                    {{ camp.status }}
                  </span>
                </td>
                <td class="py-3 px-4 text-slate-700 tabular-nums whitespace-nowrap">{{ camp.impactedVins | number }}</td>
                <td class="py-3 px-4 text-slate-700 whitespace-nowrap">{{ camp.loggedDate }}</td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <!-- Pagination Footer -->
      <div class="px-5 py-3 border-t border-slate-200 bg-white flex items-center justify-between gap-4 text-xs text-slate-500">
        <div>Showing pages <span class="font-semibold text-slate-800">{{ currentPage() }}</span> of <span class="font-semibold text-slate-800">{{ totalPages() }}</span></div>
        <div class="flex items-center gap-1">
          <button [disabled]="currentPage() <= 1" (click)="setPage(currentPage() - 1)" class="px-2.5 py-1 rounded border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-40">Previous</button>
          <button (click)="setPage(1)" [class]="currentPage() === 1 ? 'bg-[#0066b1] text-white' : 'bg-white text-slate-700'" class="w-7 h-7 rounded border border-slate-200 font-semibold text-xs">1</button>
          <button (click)="setPage(2)" [class]="currentPage() === 2 ? 'bg-[#0066b1] text-white' : 'bg-white text-slate-700'" class="w-7 h-7 rounded border border-slate-200 font-semibold text-xs">2</button>
          <button (click)="setPage(3)" [class]="currentPage() === 3 ? 'bg-[#0066b1] text-white' : 'bg-white text-slate-700'" class="w-7 h-7 rounded border border-slate-200 font-semibold text-xs">3</button>
          <button [disabled]="currentPage() >= totalPages()" (click)="setPage(currentPage() + 1)" class="px-2.5 py-1 rounded border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-40">Next</button>
        </div>
      </div>
    </section>

  </div>
</main>`
  },
  {
    filename: 'models/campaign.model.ts',
    language: 'typescript',
    description: 'TypeScript Models & Types',
    code: `export type SeverityLevel = 'L1 Critical' | 'L2 High' | 'L3 Medium' | 'L4 Low';

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
}`
  },
  {
    filename: 'services/campaign.service.ts',
    language: 'typescript',
    description: 'Angular Injectable Service with Signals for State Management',
    code: `import { Injectable, signal, computed } from '@angular/core';
import { Campaign, MetricSummary } from '../models/campaign.model';

@Injectable({
  providedIn: 'root'
})
export class CampaignService {
  private _campaigns = signal<Campaign[]>([
    {
      id: 'CC-2025-079',
      model: 'i5 eDrive40 / M60',
      subsystem: 'Integrated Braking (IBS)',
      severity: 'L1 Critical',
      status: 'STOP DELIVERY',
      impactedVins: 12480,
      loggedDate: '2025-03-24',
      defectClass: 'Safety Recall (NHTSA)',
      technicalObservation: 'Loss of hydraulic brake boost assist detected in sensor telemetry; fallback hydraulic system engaged.',
      nhtsaFilingRequired: true,
      issueStopDelivery: true,
      otaPatchCandidate: false,
      supplierAuditRequested: true
    },
    {
      id: 'CC-2025-074',
      model: 'iX xDrive50',
      subsystem: 'HV Cell Module Sensor',
      severity: 'L1 Critical',
      status: 'INVESTIGATING',
      impactedVins: 8920,
      loggedDate: '2025-03-21',
      defectClass: 'Safety Recall (NHTSA)',
      technicalObservation: 'Thermistor micro-crack causing erroneous thermal runaway threshold trip on Cell Block #4.',
      nhtsaFilingRequired: true,
      issueStopDelivery: false,
      otaPatchCandidate: true,
      supplierAuditRequested: true
    },
    {
      id: 'CC-2025-062',
      model: '760i / i7 xDrive60',
      subsystem: 'iDrive 9 OS Telematics',
      severity: 'L2 High',
      status: 'OTA STAGED',
      impactedVins: 34150,
      loggedDate: '2025-03-18',
      defectClass: 'OTA Software Bug',
      technicalObservation: 'Head unit reboot cycle occurs during high LTE/5G handoff traffic in tunnel infrastructure.',
      nhtsaFilingRequired: false,
      issueStopDelivery: false,
      otaPatchCandidate: true,
      supplierAuditRequested: false
    },
    {
      id: 'CC-2025-058',
      model: 'X5 xDrive40i / M60i',
      subsystem: 'Air Suspension Valve Block',
      severity: 'L2 High',
      status: 'TSB ISSUED',
      impactedVins: 21700,
      loggedDate: '2025-03-15',
      defectClass: 'Technical Service (TSB)',
      technicalObservation: 'Pneumatic valve solenoid sealing ring tolerance variation under sub-zero ambient temperatures (-15C).',
      nhtsaFilingRequired: false,
      issueStopDelivery: false,
      otaPatchCandidate: false,
      supplierAuditRequested: true
    },
    {
      id: 'CC-2025-041',
      model: 'M3 Competition xDrive',
      subsystem: 'Diff Sensor Wiring Harness',
      severity: 'L3 Medium',
      status: 'RESOLVED',
      impactedVins: 4210,
      loggedDate: '2025-02-28',
      defectClass: 'Sub-assembly Flaw',
      technicalObservation: 'Rear differential temperature sensor harness routing clearance defect with anti-roll bar mount.',
      nhtsaFilingRequired: false,
      issueStopDelivery: false,
      otaPatchCandidate: false,
      supplierAuditRequested: false
    }
  ]);

  readonly campaigns = this._campaigns.asReadonly();

  readonly metrics = computed<MetricSummary>(() => {
    const list = this._campaigns();
    const safetyRecalls = list.filter(c => c.severity === 'L1 Critical' || c.status === 'STOP DELIVERY').length;
    const activeCampaigns = 38; // System tracked baseline
    const vinsTracked = 182490;
    const gatewaySyncRate = 99.1;

    return {
      safetyRecalls: Math.max(14, safetyRecalls),
      activeCampaigns: Math.max(activeCampaigns, list.length),
      vinsTracked,
      gatewaySyncRate
    };
  });

  addCampaign(campaign: Campaign): void {
    this._campaigns.update(current => [campaign, ...current]);
  }

  exportCsv(items: Campaign[]): void {
    const headers = ['Campaign ID', 'Model', 'Subsystem', 'Severity', 'Status', 'Impacted VINs', 'Logged Date'];
    const rows = items.map(c => [
      c.id,
      \`"\${c.model}"\`,
      \`"\${c.subsystem}"\`,
      c.severity,
      c.status,
      c.impactedVins,
      c.loggedDate
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', \`BMW-Defect-Registry-\${new Date().toISOString().split('T')[0]}.csv\`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
}`
  }
];
