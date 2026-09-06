import { useAuth } from '../context/AuthContext';
import { AlertTriangle, Clock, CheckCircle, Activity, Bell, ArrowUpRight } from 'lucide-react';

// KPI Card component
function KPICard({ label, value, color = 'text-navy-900', icon: Icon }: {
  label: string; value: string | number; color?: string; icon?: React.ComponentType<{ size?: number; className?: string }>;
}) {
  return (
    <div className="bg-white p-4 border border-grey-300 flex flex-col justify-between h-[100px]">
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-grey-600 uppercase font-semibold tracking-wide">{label}</span>
        {Icon && <Icon size={16} className="text-grey-600" />}
      </div>
      <span className={`text-[28px] font-bold ${color}`} style={{ fontVariantNumeric: 'tabular-nums' }}>{value}</span>
    </div>
  );
}

// Status badge component
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; text: string; icon: string }> = {
    CRITICAL: { bg: 'bg-critical-100', text: 'text-critical-700', icon: '●' },
    HIGH: { bg: 'bg-warning-100', text: 'text-warning-700', icon: '●' },
    MEDIUM: { bg: 'bg-info-100', text: 'text-info-700', icon: '●' },
    LOW: { bg: 'bg-grey-100', text: 'text-grey-600', icon: '●' },
    AVAILABLE: { bg: 'bg-success-100', text: 'text-success-700', icon: '●' },
    CONFLICT: { bg: 'bg-critical-100', text: 'text-critical-700', icon: '▲' },
  };
  const s = map[status] || map.MEDIUM;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold ${s.bg} ${s.text}`}>
      {s.icon} {status}
    </span>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  if (!user) return null;



  // Render role-specific dashboard
  if (user.role === 'planner') return <PlannerDashboard />;
  if (user.role === 'engineering') return <DeptDashboard dept="Engineering" />;
  if (user.role === 'traction') return <DeptDashboard dept="Traction" />;
  if (user.role === 's_and_t') return <DeptDashboard dept="S&T" />;
  if (user.role === 'supervisor') return <SupervisorDashboard />;
  if (user.role === 'admin') return <AdminDashboard />;

  return <div>Unknown role</div>;
}

function PlannerDashboard() {
  return (
    <div className="space-y-6">
      <PageHeader title="Operations Dashboard" subtitle="Cross-department overview and coordination" role="Railway Planner" />
      
      <div className="grid grid-cols-4 gap-4">
        <KPICard label="Asset availability" value="92%" color="text-success-700" icon={Activity} />
        <KPICard label="Active blocks" value={12} icon={Clock} />
        <KPICard label="Critical tasks" value={8} color="text-critical-700" icon={AlertTriangle} />
        <KPICard label="Pending approvals" value={5} color="text-warning-700" icon={CheckCircle} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-grey-300">
          <div className="bg-navy-900 text-white px-4 py-2 text-[13px] font-semibold">Priority summary</div>
          <div className="p-4 space-y-2">
            {['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map(level => (
              <div key={level} className="flex items-center justify-between text-[13px]">
                <StatusBadge status={level} />
                <span className="font-bold" style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {level === 'CRITICAL' ? 8 : level === 'HIGH' ? 14 : level === 'MEDIUM' ? 22 : 16}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-grey-300">
          <div className="bg-navy-900 text-white px-4 py-2 text-[13px] font-semibold">Department coordination</div>
          <div className="p-4 space-y-2">
            {['Engineering', 'Traction', 'S&T'].map(dept => (
              <div key={dept} className="flex items-center justify-between text-[13px] py-1 border-b border-grey-100 last:border-0">
                <span>{dept}</span>
                <div className="flex items-center gap-3">
                  <span className="text-grey-600">{dept === 'Engineering' ? 24 : dept === 'Traction' ? 18 : 18} tasks</span>
                  <ArrowUpRight size={14} className="text-blue-600" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white border border-grey-300">
        <div className="bg-navy-900 text-white px-4 py-2 text-[13px] font-semibold">Recent notifications</div>
        <div className="divide-y divide-grey-100">
          <NotifRow icon={AlertTriangle} color="text-critical-700" title="Critical defect detected" desc="High-urgency USFD defect flagged on NDLS-CNB corridor KM 142+300m" time="10 mins ago" />
          <NotifRow icon={Activity} color="text-warning-700" title="Block window conflict" desc="Overlap detected between Train #12015 and S&T Block #BLK-004" time="35 mins ago" />
          <NotifRow icon={CheckCircle} color="text-info-700" title="Optimization complete" desc="Weekly block plan generated 14 co-located block proposals." time="2 hours ago" />
        </div>
      </div>
      <ProtoLabel />
    </div>
  );
}

function DeptDashboard({ dept }: { dept: string }) {
  return (
    <div className="space-y-6">
      <PageHeader title={`${dept} Dashboard`} subtitle={`${dept} maintenance overview`} role={dept} />
      
      <div className="grid grid-cols-4 gap-4">
        <KPICard label={`Open ${dept.toLowerCase()} defects`} value={7} color="text-critical-700" icon={AlertTriangle} />
        <KPICard label="Critical tasks" value={3} color="text-warning-700" icon={Clock} />
        <KPICard label="Assigned blocks" value={4} icon={Activity} />
        <KPICard label="Pending requests" value={2} icon={Bell} />
      </div>

      <div className="bg-white border border-grey-300">
        <div className="bg-navy-900 text-white px-4 py-2 text-[13px] font-semibold">Upcoming blocks</div>
        <table className="w-full text-[13px]">
          <thead>
            <tr className="bg-navy-900 text-white text-[12px] font-semibold">
              <th className="px-4 py-2 text-left">Block ID</th>
              <th className="px-4 py-2 text-left">Corridor</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Time</th>
              <th className="px-4 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {[
              { id: 'BLK-003', corridor: 'NDLS-CNB', date: '2026-09-07', time: '02:00-05:00', status: 'AVAILABLE' },
              { id: 'BLK-008', corridor: 'HWH-KGP', date: '2026-09-08', time: '10:00-13:00', status: 'AVAILABLE' },
            ].map((b, i) => (
              <tr key={b.id} className={i % 2 === 0 ? 'bg-white' : 'bg-grey-50'}>
                <td className="px-4 py-2 font-medium">{b.id}</td>
                <td className="px-4 py-2">{b.corridor}</td>
                <td className="px-4 py-2">{b.date}</td>
                <td className="px-4 py-2">{b.time}</td>
                <td className="px-4 py-2"><StatusBadge status={b.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ProtoLabel />
    </div>
  );
}

function SupervisorDashboard() {
  return (
    <div className="space-y-6">
      <PageHeader title="Supervisor Dashboard" subtitle="Today's maintenance execution" role="Maintenance Supervisor" />
      <div className="grid grid-cols-4 gap-4">
        <KPICard label="Today's tasks" value={5} icon={Clock} />
        <KPICard label="Active work" value={2} color="text-success-700" icon={Activity} />
        <KPICard label="Delayed tasks" value={1} color="text-critical-700" icon={AlertTriangle} />
        <KPICard label="Completed" value={3} color="text-success-700" icon={CheckCircle} />
      </div>
      <ProtoLabel />
    </div>
  );
}

function AdminDashboard() {
  return (
    <div className="space-y-6">
      <PageHeader title="System Administration" subtitle="User and system management" role="Administrator" />
      <div className="grid grid-cols-4 gap-4">
        <KPICard label="Total users" value={6} />
        <KPICard label="Active users" value={4} color="text-success-700" />
        <KPICard label="Departments" value={4} />
        <KPICard label="System status" value="OK" color="text-success-700" />
      </div>
      <ProtoLabel />
    </div>
  );
}

function PageHeader({ title, subtitle, role }: { title: string; subtitle: string; role: string }) {
  return (
    <div className="flex justify-between items-center pb-4 border-b border-grey-300">
      <div>
        <h2 className="text-[20px] font-semibold text-navy-900">{title}</h2>
        <p className="text-[13px] text-grey-600 mt-0.5">{subtitle}</p>
      </div>
      <div className="text-[11px] text-grey-600">Role: <span className="font-bold text-navy-900">{role}</span></div>
    </div>
  );
}

function NotifRow({ icon: Icon, color, title, desc, time }: {
  icon: React.ComponentType<{ size?: number; className?: string }>; color: string; title: string; desc: string; time: string;
}) {
  return (
    <div className="flex items-start gap-3 px-4 py-3">
      <Icon size={16} className={`${color} mt-0.5 flex-shrink-0`} />
      <div className="flex-1">
        <p className="text-[13px] font-semibold text-ink-900">{title}</p>
        <p className="text-[12px] text-grey-600 mt-0.5">{desc}</p>
      </div>
      <span className="text-[11px] text-grey-600 whitespace-nowrap">{time}</span>
    </div>
  );
}

function ProtoLabel() {
  return (
    <p className="text-[11px] text-grey-600 text-center mt-4 border-t border-grey-100 pt-3">
      Prototype Simulation — All data is synthetic
    </p>
  );
}

export { StatusBadge, KPICard, PageHeader, ProtoLabel };
