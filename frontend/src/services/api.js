const API_BASE_URL = '/api';

async function request(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `HTTP error! Status: ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.error(`API Error on ${endpoint}:`, err);
    throw err;
  }
}

export const api = {
  // Metrics
  getMetrics: () => request('/metrics'),

  // Incidents
  getIncidents: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status && filters.status !== 'All') params.append('status', filters.status);
    if (filters.priority && filters.priority !== 'All') params.append('priority', filters.priority);
    if (filters.category && filters.category !== 'All') params.append('category', filters.category);
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return request(`/incidents${queryString}`);
  },

  getIncidentById: (id) => request(`/incidents/${id}`),

  createIncident: (data) => request('/incidents', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  updateIncident: (id, data) => request(`/incidents/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  }),

  deleteIncident: (id) => request(`/incidents/${id}`, {
    method: 'DELETE'
  }),

  resolveIncidentWithAI: (id) => request(`/incidents/${id}/ai-resolve`, {
    method: 'POST'
  }),

  // Assets
  getAssets: () => request('/assets'),

  getAssetById: (id) => request(`/assets/${id}`),

  createAsset: (data) => request('/assets', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  updateAsset: (id, data) => request(`/assets/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  }),

  deleteAsset: (id) => request(`/assets/${id}`, {
    method: 'DELETE'
  }),

  simulateAssetAlert: (assetId) => request('/assets/simulate-alert', {
    method: 'POST',
    body: JSON.stringify({ assetId })
  }),

  // Service Requests
  getServiceRequests: () => request('/service-requests'),

  getServiceRequestById: (id) => request(`/service-requests/${id}`),

  createServiceRequest: (data) => request('/service-requests', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  updateServiceRequest: (id, data) => request(`/service-requests/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  }),

  deleteServiceRequest: (id) => request(`/service-requests/${id}`, {
    method: 'DELETE'
  }),

  // Change Requests
  getChangeRequests: () => request('/change-requests'),

  getChangeRequestById: (id) => request(`/change-requests/${id}`),

  createChangeRequest: (data) => request('/change-requests', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  updateChangeRequest: (id, data) => request(`/change-requests/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  }),

  deleteChangeRequest: (id) => request(`/change-requests/${id}`, {
    method: 'DELETE'
  }),

  // Knowledge Base & Operations Runbooks (Feature 1)
  getKnowledgeBase: (category = '', search = '') => {
    const params = new URLSearchParams();
    if (category && category !== 'All') params.append('category', category);
    if (search) params.append('search', search);
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return request(`/knowledge-base${queryString}`);
  },

  getKBArticleById: (id) => request(`/knowledge-base/${id}`),

  createKBArticle: (data) => request('/knowledge-base', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  deleteKBArticle: (id) => request(`/knowledge-base/${id}`, {
    method: 'DELETE'
  }),

  // Advanced ITSM Analytics (Feature 2)
  getAnalytics: () => request('/analytics'),

  // AI Copilot
  sendCopilotPrompt: (prompt) => request('/copilot/chat', {
    method: 'POST',
    body: JSON.stringify({ prompt })
  }),

  // Activity Audit Stream
  getActivityLogs: () => request('/activity-logs')
};
