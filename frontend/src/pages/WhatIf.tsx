import { useState } from 'react';
import { api } from '../services/api';
import { PageHeader, ProtoLabel } from './Dashboard';
import { useAuth } from '../context/AuthContext';
import { GitBranch } from 'lucide-react';

export default function WhatIf() {
  const { user } = useAuth();
  const [event, setEvent] = useState('new_critical_defect');
  const [corridor, setCorridor] = useState('NDLS-CNB (New Delhi - Kanpur Central)');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const run = () => {
    setLoading(true);
    api.runWhatIf({
      corridor,
      scenario: {
        event,
        title: event === 'new_critical_defect' ? 'Emergency Rail Fracture Detection' : undefined,
        department: 'Engineering',
        duration: 2.5,
        block_id: 'BLK-003',
        task_id: 'TSK-0001',
        new_priority: 'CRITICAL',
      },
    }).then(d => { setResult(d); setLoading(false); }).catch(() => setLoading(false));
  };

  const b = result?.baseline?.metrics;
  const u = result?.updated?.metrics;
  const c = result?.comparison;

  return (
    <div className="space-y-4">
      <PageHeader title="What-if simulation" subtitle="Compare impact of scenario changes on the block plan" role={user?.department || ''} />

      <div className="flex items-center gap-3 flex-wrap">
        <select value={event} onChange={e => setEvent(e.target.value)}
          className="border border-grey-300 px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-600">
          <option value="new_critical_defect">New critical defect</option>
          <option value="block_unavailable">Block unavailable</option>
          <option value="priority_change">Priority change</option>
        </select>
        <select value={corridor} onChange={e => setCorridor(e.target.value)}
          className="border border-grey-300 px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-600">
          <option value="NDLS-CNB (New Delhi - Kanpur Central)">NDLS-CNB</option>
          <option value="HWH-KGP (Howrah - Kharagpur)">HWH-KGP</option>
          <option value="CSMT-PUNE (Mumbai CSMT - Pune)">CSMT-PUNE</option>
        </select>
        <button onClick={run} disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-navy-700 text-white text-[13px] font-medium hover:bg-navy-900 disabled:opacity-50 transition-colors">
          <GitBranch size={16} /> {loading ? 'Simulating...' : 'Run simulation'}
        </button>
      </div>

      {result && b && u && (
        <>
          <h3 className="text-[16px] font-semibold text-navy-900 mt-4">Before / After comparison</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border border-grey-300 p-4">
              <p className="text-[12px] font-semibold text-grey-600 uppercase mb-3">Baseline plan</p>
              <div className="space-y-2 text-[13px]">
                <MRow label="Tasks scheduled" value={b.tasks_scheduled} />
                <MRow label="Blocks used" value={b.blocks_used} />
                <MRow label="Block hours" value={b.total_block_hours} />
                <MRow label="Critical scheduled" value={b.critical_tasks_scheduled} />
                <MRow label="Train conflicts" value={b.train_conflicts} />
              </div>
            </div>
            <div className="bg-white border border-blue-600 p-4">
              <p className="text-[12px] font-semibold text-blue-600 uppercase mb-3">Updated plan (after scenario)</p>
              <div className="space-y-2 text-[13px]">
                <MRow label="Tasks scheduled" value={u.tasks_scheduled} delta={u.tasks_scheduled - b.tasks_scheduled} />
                <MRow label="Blocks used" value={u.blocks_used} delta={u.blocks_used - b.blocks_used} />
                <MRow label="Block hours" value={u.total_block_hours} delta={u.total_block_hours - b.total_block_hours} />
                <MRow label="Critical scheduled" value={u.critical_tasks_scheduled} delta={u.critical_tasks_scheduled - b.critical_tasks_scheduled} />
                <MRow label="Train conflicts" value={u.train_conflicts} delta={u.train_conflicts - b.train_conflicts} />
              </div>
            </div>
          </div>

          {c && (
            <div className="bg-white border border-grey-300 p-4">
              <p className="text-[12px] font-semibold text-grey-600 uppercase mb-2">Changes</p>
              <div className="grid grid-cols-3 gap-4 text-[13px]">
                <div>
                  <p className="text-success-700 font-semibold mb-1">Added tasks</p>
                  {c.added_tasks?.length > 0 ? c.added_tasks.map((t: string) => (
                    <p key={t} className="text-[12px]">+ {t}</p>
                  )) : <p className="text-grey-600 text-[12px]">None</p>}
                </div>
                <div>
                  <p className="text-critical-700 font-semibold mb-1">Removed tasks</p>
                  {c.removed_tasks?.length > 0 ? c.removed_tasks.map((t: string) => (
                    <p key={t} className="text-[12px]">- {t}</p>
                  )) : <p className="text-grey-600 text-[12px]">None</p>}
                </div>
                <div>
                  <p className="text-warning-700 font-semibold mb-1">Rescheduled</p>
                  <p className="text-[12px] text-grey-600">{c.rescheduled_tasks?.length || 0} tasks</p>
                </div>
              </div>
            </div>
          )}
        </>
      )}
      <ProtoLabel />
    </div>
  );
}

function MRow({ label, value, delta }: { label: string; value: number; delta?: number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-grey-600">{label}</span>
      <div className="flex items-center gap-2">
        <span className="font-bold" style={{ fontVariantNumeric: 'tabular-nums' }}>{value}</span>
        {delta !== undefined && delta !== 0 && (
          <span className={`text-[11px] font-bold ${delta > 0 ? 'text-success-700' : 'text-critical-700'}`}>
            {delta > 0 ? `+${delta}` : delta}
          </span>
        )}
      </div>
    </div>
  );
}
