import { useState } from 'react';
import { api } from '../services/api';
import { PageHeader, ProtoLabel, KPICard } from './Dashboard';
import { useAuth } from '../context/AuthContext';
import { Cpu, Activity, CheckCircle, AlertTriangle, Clock } from 'lucide-react';

interface OptResult {
  assignments: Array<{ task_id: string; task_title: string; department: string; block_id: string; corridor: string; date: string; start: string; end: string; priority_level: string; collocated: boolean; collocated_with: string[]; train_conflict: boolean }>;
  unscheduled: Array<{ task_id: string; task_title: string; reason: string }>;
  block_plans: Array<{ block_id: string; corridor: string; section: string; date: string; start: string; end: string; departments: string[]; tasks: unknown[]; is_multi_department: boolean; explanation: string }>;
  metrics: Record<string, unknown>;
}

export default function Optimization() {
  const { user } = useAuth();
  const [corridor, setCorridor] = useState('');
  const [planType, setPlanType] = useState('weekly');
  const [result, setResult] = useState<OptResult | null>(null);
  const [loading, setLoading] = useState(false);

  const run = () => {
    setLoading(true);
    api.runOptimization(corridor || undefined, planType)
      .then(d => { setResult(d); setLoading(false); })
      .catch(() => setLoading(false));
  };

  const m = result?.metrics as Record<string, number> | undefined;

  return (
    <div className="space-y-4">
      <PageHeader title="Optimization engine" subtitle="Multi-department block plan generation" role={user?.department || ''} />

      <div className="flex items-center gap-3 flex-wrap">
        <select value={corridor} onChange={e => setCorridor(e.target.value)}
          className="border border-grey-300 px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-600">
          <option value="">All corridors</option>
          <option value="NDLS-CNB (New Delhi - Kanpur Central)">NDLS-CNB</option>
          <option value="HWH-KGP (Howrah - Kharagpur)">HWH-KGP</option>
          <option value="CSMT-PUNE (Mumbai CSMT - Pune)">CSMT-PUNE</option>
        </select>
        <select value={planType} onChange={e => setPlanType(e.target.value)}
          className="border border-grey-300 px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-600">
          <option value="weekly">Weekly plan</option>
          <option value="monthly">Monthly plan</option>
        </select>
        <button onClick={run} disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-navy-700 text-white text-[13px] font-medium hover:bg-navy-900 disabled:opacity-50 transition-colors">
          <Cpu size={16} /> {loading ? 'Optimizing...' : 'Run optimization'}
        </button>
      </div>

      {loading && (
        <div className="bg-info-100 border border-info-700 p-4 text-[13px] text-info-700 flex items-center gap-2">
          <div className="w-full bg-grey-200 h-2 overflow-hidden"><div className="h-full bg-navy-700 animate-pulse w-3/4" /></div>
          Optimization in progress...
        </div>
      )}

      {result && m && (
        <>
          <div className="grid grid-cols-4 gap-4">
            <KPICard label="Tasks scheduled" value={m.tasks_scheduled ?? 0} icon={CheckCircle} color="text-success-700" />
            <KPICard label="Blocks used" value={m.blocks_used ?? 0} icon={Clock} />
            <KPICard label="Multi-dept blocks" value={m.multi_department_blocks ?? 0} icon={Activity} color="text-blue-600" />
            <KPICard label="Train conflicts" value={m.train_conflicts ?? 0} icon={AlertTriangle} color="text-critical-700" />
          </div>

          {/* Block Plans */}
          <div className="space-y-3">
            <h3 className="text-[16px] font-semibold text-navy-900">Generated block plans</h3>
            {result.block_plans.map(bp => (
              <div key={bp.block_id} className={`bg-white border ${bp.is_multi_department ? 'border-blue-600' : 'border-grey-300'} p-4`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-navy-900">{bp.block_id}</span>
                    <span className="text-[12px] text-grey-600">{bp.corridor.split(' ')[0]}</span>
                    <span className="text-[12px] text-grey-600">{bp.date} {bp.start}-{bp.end}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {bp.departments.map(d => (
                      <span key={d} className="text-[11px] px-2 py-0.5 bg-info-100 text-info-700 font-semibold">{d}</span>
                    ))}
                    {bp.is_multi_department && (
                      <span className="text-[11px] px-2 py-0.5 bg-success-100 text-success-700 font-semibold">CO-LOCATED</span>
                    )}
                  </div>
                </div>
                <p className="text-[12px] text-grey-600 bg-grey-50 p-2 border border-grey-100">{bp.explanation}</p>
              </div>
            ))}
          </div>

          {result.unscheduled.length > 0 && (
            <div className="bg-white border border-warning-700 p-4">
              <h3 className="text-[14px] font-semibold text-warning-700 mb-2">Unscheduled tasks ({result.unscheduled.length})</h3>
              {result.unscheduled.map(u => (
                <div key={u.task_id} className="flex items-center justify-between text-[13px] py-1 border-b border-grey-100 last:border-0">
                  <span className="font-medium">{u.task_id}</span>
                  <span className="text-grey-600 text-[12px]">{u.reason}</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
      <ProtoLabel />
    </div>
  );
}
