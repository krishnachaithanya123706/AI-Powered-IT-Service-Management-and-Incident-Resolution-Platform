import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Incidents from './pages/Incidents';
import Infrastructure from './pages/Infrastructure';
import ServiceCatalog from './pages/ServiceCatalog';
import ChangeManagement from './pages/ChangeManagement';
import AICopilot from './pages/AICopilot';

import IncidentDetailModal from './components/IncidentDetailModal';
import NewIncidentModal from './components/NewIncidentModal';
import NewServiceReqModal from './components/NewServiceReqModal';
import NewChangeModal from './components/NewChangeModal';

import { api } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [isNewIncidentOpen, setIsNewIncidentOpen] = useState(false);
  const [isNewRequestOpen, setIsNewRequestOpen] = useState(false);
  const [isNewChangeOpen, setIsNewChangeOpen] = useState(false);

  const [activeIncidentsCount, setActiveIncidentsCount] = useState(0);

  const loadHeaderMetrics = async () => {
    try {
      const metrics = await api.getMetrics();
      setActiveIncidentsCount(metrics.activeIncidents || 0);
    } catch (err) {
      console.error('Failed to fetch header metrics:', err);
    }
  };

  useEffect(() => {
    loadHeaderMetrics();
  }, []);

  const handleCreateIncident = async (formData) => {
    await api.createIncident(formData);
    await loadHeaderMetrics();
  };

  const handleCreateServiceRequest = async (formData) => {
    await api.createServiceRequest(formData);
  };

  const handleCreateChangeRequest = async (formData) => {
    await api.createChangeRequest(formData);
  };

  const handleResolveWithAI = async (incidentId) => {
    await api.resolveIncidentWithAI(incidentId);
    await loadHeaderMetrics();
  };

  return (
    <div className="app-container">
      {/* Navigation Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Body */}
      <div className="main-content">
        <Navbar activeIncidentsCount={activeIncidentsCount} />

        {activeTab === 'dashboard' && (
          <Dashboard
            onSelectIncident={(inc) => setSelectedIncident(inc)}
            onOpenNewIncident={() => setIsNewIncidentOpen(true)}
          />
        )}

        {activeTab === 'incidents' && (
          <Incidents
            onSelectIncident={(inc) => setSelectedIncident(inc)}
            onOpenNewIncident={() => setIsNewIncidentOpen(true)}
            onMetricsUpdate={loadHeaderMetrics}
          />
        )}

        {activeTab === 'infrastructure' && (
          <Infrastructure
            onAlertSimulated={() => {
              loadHeaderMetrics();
            }}
            onMetricsUpdate={loadHeaderMetrics}
          />
        )}

        {activeTab === 'catalog' && (
          <ServiceCatalog
            onOpenNewRequest={() => setIsNewRequestOpen(true)}
          />
        )}

        {activeTab === 'changes' && (
          <ChangeManagement
            onOpenNewChange={() => setIsNewChangeOpen(true)}
          />
        )}

        {activeTab === 'copilot' && (
          <AICopilot />
        )}
      </div>

      {/* Basic Modals */}
      {selectedIncident && (
        <IncidentDetailModal
          incident={selectedIncident}
          onClose={() => setSelectedIncident(null)}
          onResolveWithAI={handleResolveWithAI}
        />
      )}

      {isNewIncidentOpen && (
        <NewIncidentModal
          onClose={() => setIsNewIncidentOpen(false)}
          onSubmit={handleCreateIncident}
        />
      )}

      {isNewRequestOpen && (
        <NewServiceReqModal
          onClose={() => setIsNewRequestOpen(false)}
          onSubmit={handleCreateServiceRequest}
        />
      )}

      {isNewChangeOpen && (
        <NewChangeModal
          onClose={() => setIsNewChangeOpen(false)}
          onSubmit={handleCreateChangeRequest}
        />
      )}
    </div>
  );
}
