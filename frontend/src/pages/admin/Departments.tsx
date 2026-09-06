import { PageHeader, ProtoLabel } from '../Dashboard';
import { useAuth } from '../../context/AuthContext';
import { Building, Database, Wrench, Shield } from 'lucide-react';

const DEPARTMENTS = [
  { name: 'Engineering (Civil / Track)', code: 'TMS', icon: Wrench, head: 'Sr. DEN (Co)', assetCount: 42, activeTasks: 14, description: 'Track geometry, rail replacements, ballast cleaning, turnout overhauls.' },
  { name: 'Traction Distribution (Electrical)', code: 'TDMS', icon: Database, head: 'Sr. DEE (TRD)', assetCount: 28, activeTasks: 8, description: 'Overhead Equipment (OHE), power supply, traction substations, cantilevers.' },
  { name: 'Signal & Telecom', code: 'SMS', icon: Shield, head: 'Sr. DSTE', assetCount: 35, activeTasks: 11, description: 'Point machines, track circuits, signaling interlocking, axle counters.' },
  { name: 'Operations & Planning', code: 'OPT', icon: Building, head: 'Sr. DOM (Co)', assetCount: 12, activeTasks: 4, description: 'Sectional control, master block scheduling, train movement optimization.' },
  { name: 'Maintenance Field Supervisors', code: 'FLD', icon: Wrench, head: 'SSE (In-Charge)', assetCount: 18, activeTasks: 9, description: 'On-ground block execution, safety clearance, machinery deployment.' },
  { name: 'System Administration', code: 'ADM', icon: Shield, head: 'Sr. DEDP', assetCount: 6, activeTasks: 1, description: 'IT infrastructure, RBAC security, audit trails, database administration.' },
];

export default function Departments() {
  const { user } = useAuth();

  return (
    <div className="space-y-4">
      <PageHeader title="Department Governance" subtitle="Railway departmental metadata & asset allocation" role={user?.department || 'Administration'} />

      <div className="grid grid-cols-2 gap-4">
        {DEPARTMENTS.map(d => {
          const Icon = d.icon;
          return (
            <div key={d.code} className="bg-white border border-grey-300 p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-grey-200 pb-2">
                <div className="flex items-center gap-2">
                  <Icon size={18} className="text-navy-900" />
                  <h4 className="font-bold text-[14px] text-navy-900">{d.name}</h4>
                </div>
                <span className="font-mono text-[11px] font-bold px-2 py-0.5 bg-navy-900 text-white">{d.code}</span>
              </div>

              <p className="text-[12px] text-grey-600">{d.description}</p>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-grey-100 text-[12px]">
                <div>
                  <span className="text-grey-500 block text-[11px]">Dept Head</span>
                  <span className="font-semibold text-navy-900">{d.head}</span>
                </div>
                <div>
                  <span className="text-grey-500 block text-[11px]">Track Assets</span>
                  <span className="font-semibold text-navy-900">{d.assetCount} units</span>
                </div>
                <div>
                  <span className="text-grey-500 block text-[11px]">Active Requests</span>
                  <span className="font-bold text-blue-700">{d.activeTasks} tasks</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <ProtoLabel />
    </div>
  );
}
