import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Maintenance from './pages/Maintenance';
import Assets from './pages/Assets';
import Blocks from './pages/Blocks';
import Trains from './pages/Trains';
import Priority from './pages/Priority';
import Optimization from './pages/Optimization';
import WhatIf from './pages/WhatIf';
import Approvals from './pages/Approvals';
import Reports from './pages/Reports';
import Notifications from './pages/Notifications';
import Audit from './pages/Audit';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/maintenance" element={<ProtectedRoute requiredPermission="view_maintenance"><Maintenance /></ProtectedRoute>} />
            <Route path="/assets" element={<ProtectedRoute requiredPermission="view_assets"><Assets /></ProtectedRoute>} />
            <Route path="/blocks" element={<Blocks />} />
            <Route path="/assigned-blocks" element={<Blocks />} />
            <Route path="/trains" element={<ProtectedRoute allowedRoles={['planner']}><Trains /></ProtectedRoute>} />
            <Route path="/priority" element={<ProtectedRoute requiredPermission="view_priority"><Priority /></ProtectedRoute>} />
            <Route path="/optimization" element={<ProtectedRoute requiredPermission="run_optimization"><Optimization /></ProtectedRoute>} />
            <Route path="/plans" element={<ProtectedRoute allowedRoles={['planner']}><Approvals /></ProtectedRoute>} />
            <Route path="/whatif" element={<ProtectedRoute requiredPermission="run_whatif"><WhatIf /></ProtectedRoute>} />
            <Route path="/approvals" element={<ProtectedRoute requiredPermission="approve"><Approvals /></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute requiredPermission="view_kpis"><Reports /></ProtectedRoute>} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/audit" element={<ProtectedRoute requiredPermission="view_audit"><Audit /></ProtectedRoute>} />
            <Route path="/assigned-tasks" element={<ProtectedRoute allowedRoles={['supervisor']}><Maintenance /></ProtectedRoute>} />
            <Route path="/work-status" element={<ProtectedRoute allowedRoles={['engineering','traction','s_and_t','supervisor']}><Maintenance /></ProtectedRoute>} />
            <Route path="/resources" element={<ProtectedRoute allowedRoles={['supervisor']}><Assets /></ProtectedRoute>} />
            <Route path="/users" element={<ProtectedRoute allowedRoles={['admin']}><Audit /></ProtectedRoute>} />
            <Route path="/roles" element={<ProtectedRoute allowedRoles={['admin']}><Audit /></ProtectedRoute>} />
            <Route path="/departments" element={<ProtectedRoute allowedRoles={['admin']}><Audit /></ProtectedRoute>} />
            <Route path="/system-status" element={<ProtectedRoute allowedRoles={['admin']}><Reports /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute allowedRoles={['planner','admin']}><Reports /></ProtectedRoute>} />
            <Route path="/help" element={<div className="text-[13px] text-grey-600 py-12 text-center">Help documentation will be available here.</div>} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
