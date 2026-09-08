import { useState, useCallback } from 'react';
import { api } from '../services/api';
import { StatusBadge, PageHeader, ProtoLabel } from './Dashboard';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Cpu, AlertTriangle } from 'lucide-react';

interface PriorityResult {
  task_id: string; title?: string; department?: string; corridor?: string; priority_score: number; priority_level: string;
  priority_reason: string; contributing_factors: Record<string, { value: string; score: number; weight: number }>;
}

export default function Priority() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [results, setResults] = useState<PriorityResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  const [selected, setSelected] = useState<PriorityResult | null>(null);

  const initialDept = (user?.role === 'engineering' || user?.role === 'traction' || user?.role === 's_and_t') ? (user?.department || '') : '';
  const [filterDept, setFilterDept] = useState(initialDept);

  const fetchPriorities = useCallback((dept?: string) => {
    setLoading(true);
    api.analyzeAllPriorities(dept || undefined)
      .then(d => {
        setResults(d.results || []);
        setLoading(false);
        setHasRun(true);
      })
      .catch(() => {
        setLoading(false);
        setHasRun(true);
      });
  }, []);

  const handleDeptChange = (dept: string) => {
    setFilterDept(dept);
    if (hasRun) {
      fetchPriorities(dept);
    }
  };

  const runAll = () => {
    fetchPriorities(filterDept);
  };

  return (
    <div className="space-y-4">
      <PageHeader title="Priority analysis" subtitle="AI-powered maintenance task prioritization" role={user?.department || ''} />

      <div className="flex items-center gap-3">
        <button onClick={runAll} disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-navy-700 text-white text-[13px] font-medium hover:bg-navy-900 disabled:opacity-50 transition-colors">
          <Cpu size={16} /> {loading ? t('Analyzing...') : t('Run priority analysis')}
        </button>

        <select value={filterDept} onChange={e => handleDeptChange(e.target.value)}
          className="border border-grey-300 px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white">
          <option value="">{t('All departments') || 'All departments'}</option>
          <option value="Engineering">Engineering</option>
          <option value="Traction">Traction</option>
          <option value="S&T">S&T</option>
        </select>

        {hasRun && <span className="text-[12px] text-grey-600">{results.length} {t('tasks analyzed')}</span>}
      </div>

      {!hasRun ? (
        <div className="bg-white border border-grey-300 p-12 text-center text-[13px] text-grey-600 space-y-2">
          <Cpu size={32} className="mx-auto text-grey-400 mb-2" />
          <p className="font-semibold text-navy-900 text-[14px]">Priority Analysis Ready</p>
          <p className="text-grey-600 text-[13px]">Click <strong className="text-navy-900">Run priority analysis</strong> above to calculate AI priority scores for maintenance tasks.</p>
        </div>
      ) : loading ? (
        <div className="bg-white border border-grey-300 p-8 text-center text-[13px] text-grey-600">
          Analyzing maintenance tasks...
        </div>
      ) : results.length > 0 ? (
        <div className="bg-white border border-grey-300 overflow-auto">
          <table className="w-full text-[13px]">
            <thead className="sticky top-0">
              <tr className="bg-navy-900 text-white text-[12px] font-semibold">
                <th className="px-3 py-2 text-left">{t('Task ID')}</th>
                <th className="px-3 py-2 text-left">{t('Title') || 'Title'}</th>
                <th className="px-3 py-2 text-left">{t('Department') || 'Department'}</th>
                <th className="px-3 py-2 text-left">{t('Priority level')}</th>
                <th className="px-3 py-2 text-left">{t('Score')}</th>
                <th className="px-3 py-2 text-left">{t('Explanation')}</th>
              </tr>
            </thead>
            <tbody>
              {results.sort((a, b) => b.priority_score - a.priority_score).map((r, i) => (
                <tr key={r.task_id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-grey-50'} hover:bg-info-100 cursor-pointer`}
                    onClick={() => setSelected(r)} style={{ height: '40px' }}>
                  <td className="px-3 py-2 font-medium text-blue-600">{r.task_id}</td>
                  <td className="px-3 py-2 max-w-[200px] truncate font-medium">{r.title || '-'}</td>
                  <td className="px-3 py-2 text-[12px]">{r.department || '-'}</td>
                  <td className="px-3 py-2"><StatusBadge status={r.priority_level} /></td>
                  <td className="px-3 py-2 font-bold" style={{ fontVariantNumeric: 'tabular-nums' }}>{r.priority_score}</td>
                  <td className="px-3 py-2 text-[12px] max-w-[400px] truncate">{r.priority_reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white border border-grey-300 p-8 text-center text-[13px] text-grey-600">
          No tasks found for priority analysis in the selected department.
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setSelected(null)}>
          <div className="bg-white w-full max-w-lg border border-grey-300" onClick={e => e.stopPropagation()}>
            <div className="bg-navy-900 text-white px-4 py-3 flex justify-between items-center">
              <span className="font-semibold text-[14px]">{t('Priority explanation')} — {selected.task_id}</span>
              <button onClick={() => setSelected(null)} className="text-white hover:text-grey-300">&times;</button>
            </div>
            <div className="p-4 space-y-3 text-[13px]">
              {selected.title && <div className="font-bold text-[14px] text-navy-900">{selected.title}</div>}
              {selected.department && (
                <div className="text-[12px] text-grey-600">
                  Department: <span className="font-medium text-black">{selected.department}</span>
                  {selected.corridor && <> | Corridor: <span className="font-medium text-black">{selected.corridor}</span></>}
                </div>
              )}
              <div className="flex items-center gap-2 mb-2">
                <StatusBadge status={selected.priority_level} />
                <span className="font-bold" style={{ fontVariantNumeric: 'tabular-nums' }}>{t('Score')}: {selected.priority_score}/100</span>
              </div>
              <div className="flex items-start gap-2 bg-info-100 p-3 border border-info-700">
                <AlertTriangle size={16} className="text-info-700 mt-0.5 flex-shrink-0" />
                <p>{selected.priority_reason}</p>
              </div>
              <p className="text-[12px] font-semibold text-grey-600 uppercase mt-3">{t('Contributing factors')}</p>
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
