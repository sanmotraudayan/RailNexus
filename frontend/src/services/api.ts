const API_BASE = 'http://localhost:8000';

async function fetchJSON(url: string, options?: RequestInit) {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  return res.json();
}

export const api = {
  // Auth
  login: (role: string) => fetchJSON('/api/auth/login', { method: 'POST', body: JSON.stringify({ role }) }),

  // Assets
  getAssets: (department?: string) => fetchJSON(`/api/assets${department ? `?department=${department}` : ''}`),
  getAsset: (id: string) => fetchJSON(`/api/assets/${id}`),

  // Maintenance
  getMaintenance: (department?: string) => fetchJSON(`/api/maintenance${department ? `?department=${department}` : ''}`),
  getMaintenanceTask: (id: string) => fetchJSON(`/api/maintenance/${id}`),
  createMaintenance: (data: Record<string, unknown>) => fetchJSON('/api/maintenance', { method: 'POST', body: JSON.stringify(data) }),
  updateMaintenance: (id: string, data: Record<string, unknown>) => fetchJSON(`/api/maintenance/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  // Trains
  getTrains: () => fetchJSON('/api/trains'),

  // Blocks
  getBlocks: () => fetchJSON('/api/blocks'),

  // Priority
  analyzePriority: (taskId: string) => fetchJSON('/api/priority/analyze', { method: 'POST', body: JSON.stringify({ task_id: taskId }) }),
  analyzeAllPriorities: () => fetchJSON('/api/priority/analyze-all', { method: 'POST' }),

  // Optimization
  runOptimization: (corridor?: string, planType?: string) =>
    fetchJSON('/api/optimization/run', { method: 'POST', body: JSON.stringify({ corridor, plan_type: planType || 'weekly' }) }),

  // Plans
  getPlans: () => fetchJSON('/api/plans'),
  createPlan: (data: Record<string, unknown>) => fetchJSON('/api/plans', { method: 'POST', body: JSON.stringify(data) }),

  // Approvals
  getApprovals: () => fetchJSON('/api/approvals'),
  createApproval: (data: Record<string, unknown>) => fetchJSON('/api/approvals', { method: 'POST', body: JSON.stringify(data) }),

  // What-If
  runWhatIf: (data: Record<string, unknown>) => fetchJSON('/api/whatif', { method: 'POST', body: JSON.stringify(data) }),

  // Notifications
  getNotifications: () => fetchJSON('/api/notifications'),

  // Audit
  getAudit: () => fetchJSON('/api/audit'),

  // Users
  getUsers: () => fetchJSON('/api/users'),
};
