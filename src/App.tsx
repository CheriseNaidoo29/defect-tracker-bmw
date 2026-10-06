/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { MetricsBar } from './components/MetricsBar';
import { DefectForm } from './components/DefectForm';
import { DefectRegistryTable } from './components/DefectRegistryTable';
import { DossierModal } from './components/DossierModal';
import { AuditReportModal } from './components/AuditReportModal';
import { AngularCodeModal } from './components/AngularCodeModal';
import { INITIAL_CAMPAIGNS } from './data/campaigns';
import { Campaign, CampaignStatus, MetricSummary } from './types/campaign';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS);
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Modals state
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isAngularModalOpen, setIsAngularModalOpen] = useState(false);

  // Notification Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Metrics calculation
  const metrics: MetricSummary = useMemo(() => {
    const safetyCount = campaigns.filter(
      (c) => c.severity === 'L1 Critical' || c.status === 'STOP DELIVERY'
    ).length;
    return {
      safetyRecalls: Math.max(14, safetyCount),
      activeCampaigns: Math.max(38, campaigns.length),
      vinsTracked: 182490 + campaigns.length * 150,
      gatewaySyncRate: 99.1,
    };
  }, [campaigns]);

  // Filtering campaigns
  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((c) => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        c.id.toLowerCase().includes(query) ||
        c.model.toLowerCase().includes(query) ||
        c.subsystem.toLowerCase().includes(query);

      const matchesSeverity =
        severityFilter === 'All' || c.severity === severityFilter;

      const matchesStatus =
        statusFilter === 'All' || c.status === statusFilter;

      return matchesSearch && matchesSeverity && matchesStatus;
    });
  }, [campaigns, searchQuery, severityFilter, statusFilter]);

  // Pagination slicing
  const paginatedCampaigns = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredCampaigns.slice(start, start + pageSize);
  }, [filteredCampaigns, currentPage, pageSize]);

  // Handlers
  const handleAddCampaign = (newCamp: Campaign) => {
    setCampaigns((prev) => [newCamp, ...prev]);
    setCurrentPage(1);
    showToast(`Campaign ${newCamp.id} committed. Gateway telemetry notified.`);
  };

  const handleUpdateStatus = (campaignId: string, newStatus: CampaignStatus) => {
    setCampaigns((prev) =>
      prev.map((c) => (c.id === campaignId ? { ...c, status: newStatus } : c))
    );
    if (selectedCampaign && selectedCampaign.id === campaignId) {
      setSelectedCampaign({ ...selectedCampaign, status: newStatus });
    }
    showToast(`Status for ${campaignId} updated to ${newStatus}`);
  };

  const handleExportCsv = () => {
    const headers = [
      'Campaign ID',
      'Model / Platform',
      'Subsystem',
      'Severity',
      'Status',
      'Impacted VINs',
      'Logged Date',
    ];
    const rows = filteredCampaigns.map((c) => [
      c.id,
      `"${c.model}"`,
      `"${c.subsystem}"`,
      c.severity,
      c.status,
      c.impactedVins,
      c.loggedDate,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `BMW-Campaign-Central-${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    link.remove();

    showToast(`Exported ${filteredCampaigns.length} campaigns to CSV`);
  };

  return (
    <div className="min-h-screen bg-[#f4f6f9] flex flex-col text-slate-800">
      {/* Top Header Navigation */}
      <Header onOpenAngularCode={() => setIsAngularModalOpen(true)} />

      {/* Metric Stats Banner */}
      <MetricsBar
        metrics={metrics}
        onExportCsv={handleExportCsv}
        onOpenAuditReport={() => setIsAuditModalOpen(true)}
      />

      {/* Main Two-Column Workbench */}
      <main className="max-w-[1440px] w-full mx-auto px-6 py-6 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 items-start">
          {/* Left Column: Log Defect Campaign Form */}
          <DefectForm onAddCampaign={handleAddCampaign} />

          {/* Right Column: Active Defect Tracking Registry */}
          <DefectRegistryTable
            campaigns={paginatedCampaigns}
            totalRecords={filteredCampaigns.length}
            searchQuery={searchQuery}
            onSearchChange={(q) => {
              setSearchQuery(q);
              setCurrentPage(1);
            }}
            severityFilter={severityFilter}
            onSeverityFilterChange={(sev) => {
              setSeverityFilter(sev);
              setCurrentPage(1);
            }}
            statusFilter={statusFilter}
            onStatusFilterChange={(stat) => {
              setStatusFilter(stat);
              setCurrentPage(1);
            }}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            pageSize={pageSize}
            onSelectCampaign={setSelectedCampaign}
          />
        </div>
      </main>

      {/* Technical Dossier Modal */}
      <DossierModal
        campaign={selectedCampaign}
        onClose={() => setSelectedCampaign(null)}
        onUpdateStatus={handleUpdateStatus}
      />

      {/* Audit Report Modal */}
      <AuditReportModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        campaigns={campaigns}
        metrics={metrics}
      />

      {/* Angular Code Export Modal */}
      <AngularCodeModal
        isOpen={isAngularModalOpen}
        onClose={() => setIsAngularModalOpen(false)}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0b192c] text-white border border-[#0066b1] px-4 py-3 rounded-md shadow-xl flex items-center gap-2.5 text-xs animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
