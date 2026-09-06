import { PageHeader, ProtoLabel } from '../Dashboard';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, Lock } from 'lucide-react';

interface RoleDef {
  key: string; label: string; department: string; description: string; permissions: string[];
}

const ROLES_LIST: RoleDef[] = [
  {
    key: 'planner',
    label: 'Sectional Controller / Block Planner (ROLE_OPT)',
    department: 'Operations',
    description: 'Master Scheduling, Multi-Department Block Packing, AI Optimization, What-If Simulation, and Final Plan Approvals.',
    permissions: ['view_all_departments', 'run_priority', 'run_optimization', 'run_whatif', 'approve', 'modify', 'reject', 'view_kpis', 'view_reports', 'view_audit']
  },
  {
    key: 'engineering',
    label: 'Track / Works Engineer (ROLE_ENG / TMS)',
    department: 'Engineering',
    description: 'Track asset monitoring, track defect reporting, TMS block requisitions, assigned work execution tracking.',
    permissions: ['view_maintenance', 'create_maintenance', 'edit_maintenance', 'view_assets', 'view_priority', 'view_assigned_blocks', 'view_work_status']
  },
  {
    key: 'traction',
    label: 'Traction / OHE Engineer (ROLE_TRD / TDMS)',
    department: 'Traction',
    description: 'Overhead Equipment (OHE) wire inspection, substation maintenance, power block requisitions, TDMS work tracking.',
    permissions: ['view_maintenance', 'create_maintenance', 'edit_maintenance', 'view_assets', 'view_priority', 'view_assigned_blocks', 'view_work_status']
  },
  {
    key: 's_and_t',
    label: 'Signal & Telecom Engineer (ROLE_SIG / SMS)',
    department: 'S&T',
    description: 'Point machine replacement, track circuit inspection, interlocking testing, SMS block requisitions.',
    permissions: ['view_maintenance', 'create_maintenance', 'edit_maintenance', 'view_assets', 'view_priority', 'view_assigned_blocks', 'view_work_status']
  },
  {
    key: 'supervisor',
    label: 'Maintenance Supervisor (Field Unit)',
    department: 'Operations / Field',
    description: 'On-ground task execution, block granting confirmation, delay reporting, resource deployment, work completion logging.',
    permissions: ['view_assigned_tasks', 'start_work', 'pause_work', 'complete_work', 'report_delay', 'report_issue', 'view_resources']
  },
  {
    key: 'admin',
    label: 'System Administrator (ROLE_ADM)',
    department: 'IT / Administration',
    description: 'System user management, role governance, security audit trail monitoring, system status health checks.',
    permissions: ['manage_users', 'manage_roles', 'manage_departments', 'view_config', 'view_audit', 'view_system_status']
  }
];

export default function Roles() {
  const { user } = useAuth();

  return (
    <div className="space-y-4">
      <PageHeader title="Role Architecture & RBAC" subtitle="Role-based permission groups and access governance" role={user?.department || 'Administration'} />

      <div className="bg-white border border-grey-300 p-4 space-y-4">
        <div className="flex items-center gap-2 border-b border-grey-200 pb-3">
          <ShieldCheck size={18} className="text-navy-900" />
          <h3 className="font-bold text-[14px] text-navy-900">Configured Operational Role Hierarchy</h3>
        </div>

        <div className="space-y-3">
          {ROLES_LIST.map(r => (
            <div key={r.key} className="border border-grey-300 p-3.5 bg-grey-50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[13.5px] text-navy-900">{r.label}</span>
                <span className="text-[11px] px-2 py-0.5 bg-navy-900 text-white font-bold">{r.department}</span>
              </div>
              <p className="text-[12px] text-grey-700">{r.description}</p>
              <div className="pt-2 border-t border-grey-200">
                <span className="text-[11px] font-bold text-navy-900 flex items-center gap-1 mb-1.5">
                  <Lock size={12} /> Assigned Permission Grants:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {r.permissions.map(p => (
                    <span key={p} className="text-[10.5px] font-mono px-2 py-0.5 bg-white border border-grey-300 text-grey-800">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ProtoLabel />
    </div>
  );
}
