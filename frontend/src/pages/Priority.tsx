import { useState } from 'react';
import { api } from '../services/api';
import { StatusBadge, PageHeader, ProtoLabel } from './Dashboard';
import { useAuth } from '../context/AuthContext';
import { Cpu, AlertTriangle } from 'lucide-react';

interface PriorityResult {
  task_id: string; priority_score: number; priority_level: string;
  priority_reason: string; contributing_factors: Record<string, { value: string; score: number; weight: number }>;
}

export default function Priority() {
  const { user } = useAuth();
  const [results, setResults] = useState<PriorityResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<PriorityResult | null>(null);

  const runAll = () => {
    setLoading(true);
    api.analyzeAllPriorities()
      .then(d => { setResults(d.results || []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  return (
    <div className="space-y-4">
      <PageHeader title="Priority analysis" subtitle="AI-powered maintenance task prioritization" role={user?.department || ''} />

      <div className="flex items-center gap-3">
        <button onClick={runAll} disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-navy-700 text-white text-[13px] font-medium hover:bg-navy-900 disabled:opacity-50 transition-colors">
          <Cpu size={16} /> {loading ? 'Analyzing...' : 'Run priority analysis'}
        </button>
        {results.length > 0 && <span className="text-[12px] text-grey-600">{results.length} tasks analyzed</span>}
      </div>

      {results.length > 0 && (
        <div className="bg-white border border-grey-300 overflow-auto">
          <table className="w-full text-[13px]">
            <thead className="sticky top-0">
              <tr className="bg-navy-900 text-white text-[12px] font-semibold">
                <th className="px-3 py-2 text-left">Task ID</th>
                <th className="px-3 py-2 text-left">Priority level</th>
                <th className="px-3 py-2 text-left">Score</th>
                <th className="px-3 py-2 text-left">Explanation</th>
              </tr>
            </thead>
            <tbody>
              {results.sort((a, b) => b.priority_score - a.priority_score).map((r, i) => (
                <tr key={r.task_id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-grey-50'} hover:bg-info-100 cursor-pointer`}
                    onClick={() => setSelected(r)} style={{ height: '40px' }}>
                  <td className="px-3 py-2 font-medium text-blue-600">{r.task_id}</td>
                  <td className="px-3 py-2"><StatusBadge status={r.priority_level} /></td>
                  <td className="px-3 py-2 font-bold" style={{ fontVariantNumeric: 'tabular-nums' }}>{r.priority_score}</td>
                  <td className="px-3 py-2 text-[12px] max-w-[500px] truncate">{r.priority_reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setSelected(null)}>
          <div className="bg-white w-full max-w-lg border border-grey-300" onClick={e => e.stopPropagation()}>
            <div className="bg-navy-900 text-white px-4 py-3 flex justify-between items-center">
              <span className="font-semibold text-[14px]">Priority explanation — {selected.task_id}</span>
              <button onClick={() => setSelected(null)} className="text-white hover:text-grey-300">&times;</button>
            </div>
            <div className="p-4 space-y-3 text-[13px]">
              <div className="flex items-center gap-2 mb-2">
                <StatusBadge status={selected.priority_level} />
                <span className="font-bold" style={{ fontVariantNumeric: 'tabular-nums' }}>Score: {selected.priority_score}/100</span>
              </div>
              <div className="flex items-start gap-2 bg-info-100 p-3 border border-info-700">
                <AlertTriangle size={16} className="text-info-700 mt-0.5 flex-shrink-0" />
                <p>{selected.priority_reason}</p>
              </div>
              <p className="text-[12px] font-semibold text-grey-600 uppercase mt-3">Contributing factors</p>
              <div className="space-y-2">
                {Object.entries(selected.contributing_factors || {}).map(([key, f]) => (
                  <div key={key} className="flex items-center justify-between bg-grey-50 px-3 py-2 border border-grey-100">
                    <span className="capitalize">{key.replace(/_/g, ' ')}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-grey-600 text-[12px]">{f.value}</span>
                      <div className="w-16 h-2 bg-grey-200 overflow-hidden">
                        <div className="h-full bg-navy-700" style={{ width: `${f.score}%` }} />
                      </div>
                      <span className="font-bold w-8 text-right" style={{ fontVariantNumeric: 'tabular-nums' }}>{f.score}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      <ProtoLabel />
    </div>
  );
}
