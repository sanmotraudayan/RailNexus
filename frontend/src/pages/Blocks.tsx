import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { StatusBadge, PageHeader, ProtoLabel } from './Dashboard';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';

interface TaskSummary {
  task_id: string;
  task_title?: string;
  department?: string;
  duration?: number;
}

interface Block {
  id: string; corridor: string; section: string; date: string;
  start: string; end: string; duration: number; availability: string;
  departments?: string[];
  assigned_tasks?: TaskSummary[];
}

export default function Blocks() {
  const { user } = useAuth();
  const location = useLocation();
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Block | null>(null);

  const isAssignedBlocksPage = location.pathname.includes('assigned-blocks');
  const initialDept = (user?.role === 'engineering' || user?.role === 'traction' || user?.role === 's_and_t')
    ? (user?.department || '')
    : '';
  
  const [filterDept, setFilterDept] = useState(initialDept);

  useEffect(() => {
    setLoading(true);
    api.getBlocks(filterDept || undefined)
      .then(d => { setBlocks(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [filterDept]);

  const pageTitle = isAssignedBlocksPage || (user?.role === 'engineering' || user?.role === 'traction' || user?.role === 's_and_t')
    ? 'Assigned Blocks'
    : 'Block availability';

  const pageSubtitle = isAssignedBlocksPage || (user?.role === 'engineering' || user?.role === 'traction' || user?.role === 's_and_t')
    ? 'View maintenance block windows assigned to departments'
    : 'View and manage corridor block windows';

  return (
    <div className="space-y-4">
      <PageHeader title={pageTitle} subtitle={pageSubtitle} role={user?.department || ''} />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <label className="text-[13px] font-medium text-grey-600">Filter Department:</label>
          <select value={filterDept} onChange={e => setFilterDept(e.target.value)}
            className="border border-grey-300 px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white">
            <option value="">All departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Traction">Traction</option>
            <option value="S&T">S&T</option>
          </select>
        </div>
        <span className="text-[12px] text-grey-600">{blocks.length} blocks found</span>
      </div>

      <div className="bg-white border border-grey-300 overflow-auto">
        <table className="w-full text-[13px]">
          <thead className="sticky top-0">
            <tr className="bg-navy-900 text-white text-[12px] font-semibold">
              <th className="px-3 py-2 text-left">Block ID</th>
              <th className="px-3 py-2 text-left">Corridor</th>
              <th className="px-3 py-2 text-left">Section</th>
              <th className="px-3 py-2 text-left">Date</th>
              <th className="px-3 py-2 text-left">Time Window</th>
              <th className="px-3 py-2 text-left">Duration</th>
              <th className="px-3 py-2 text-left">Assigned Departments</th>
              <th className="px-3 py-2 text-left">Tasks</th>
              <th className="px-3 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={9} className="text-center py-8 text-grey-600">Loading...</td></tr>
            ) : blocks.length === 0 ? (
              <tr><td colSpan={9} className="text-center py-8 text-grey-600">No blocks found for the selected department.</td></tr>
            ) : blocks.map((b, i) => (
              <tr key={b.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-grey-50'} hover:bg-info-100 cursor-pointer`}
                  onClick={() => setSelected(b)} style={{ height: '40px' }}>
                <td className="px-3 py-2 font-medium text-blue-600">{b.id}</td>
                <td className="px-3 py-2">{b.corridor.split(' ')[0]}</td>
                <td className="px-3 py-2 text-[12px]">{b.section}</td>
                <td className="px-3 py-2">{b.date}</td>
                <td className="px-3 py-2 font-mono text-[12px]">{b.start} - {b.end}</td>
                <td className="px-3 py-2 font-bold" style={{ fontVariantNumeric: 'tabular-nums' }}>{b.duration}h</td>
                <td className="px-3 py-2">
                  <div className="flex flex-wrap gap-1">
                    {(b.departments && b.departments.length > 0) ? (
                      b.departments.map(d => (
                        <span key={d} className="px-2 py-0.5 text-[11px] font-semibold bg-navy-100 text-navy-900 rounded">
                          {d}
                        </span>
                      ))
                    ) : (
                      <span className="text-grey-600 text-[11px]">Unassigned</span>
                    )}
                  </div>
                </td>
                <td className="px-3 py-2 font-semibold" style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {b.assigned_tasks ? b.assigned_tasks.length : 0} task(s)
                </td>
                <td className="px-3 py-2"><StatusBadge status={b.availability} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setSelected(null)}>
          <div className="bg-white w-full max-w-lg border border-grey-300" onClick={e => e.stopPropagation()}>
            <div className="bg-navy-900 text-white px-4 py-3 flex justify-between items-center">
              <span className="font-semibold text-[14px]">Block Details — {selected.id}</span>
              <button onClick={() => setSelected(null)} className="text-white hover:text-grey-300">&times;</button>
            </div>
            <div className="p-4 space-y-3 text-[13px]">
              <div className="grid grid-cols-2 gap-2 bg-grey-50 p-3 border border-grey-200">
                <div><span className="text-grey-600">Corridor:</span> <span className="font-semibold">{selected.corridor}</span></div>
                <div><span className="text-grey-600">Section:</span> <span className="font-semibold">{selected.section}</span></div>
                <div><span className="text-grey-600">Date:</span> <span className="font-semibold">{selected.date}</span></div>
                <div><span className="text-grey-600">Time:</span> <span className="font-semibold">{selected.start} - {selected.end} ({selected.duration}h)</span></div>
                <div><span className="text-grey-600">Status:</span> <StatusBadge status={selected.availability} /></div>
              </div>

              <div>
                <span className="font-semibold text-navy-900 block mb-1">Assigned Departments</span>
                <div className="flex flex-wrap gap-1.5">
                  {selected.departments && selected.departments.length > 0 ? (
                    selected.departments.map(d => (
                      <span key={d} className="px-2.5 py-1 text-[12px] font-bold bg-navy-700 text-white rounded">
                        {d}
                      </span>
                    ))
                  ) : (
                    <span className="text-grey-600 text-[12px]">None</span>
                  )}
                </div>
              </div>

              <div>
                <span className="font-semibold text-navy-900 block mb-1">Scheduled Tasks</span>
                {selected.assigned_tasks && selected.assigned_tasks.length > 0 ? (
                  <div className="space-y-1.5 max-h-40 overflow-y-auto">
                    {selected.assigned_tasks.map((t, idx) => (
                      <div key={t.task_id || idx} className="bg-grey-50 p-2 border border-grey-200 text-[12px] flex justify-between items-center">
                        <div>
                          <span className="font-bold text-blue-600">{t.task_id}</span>
                          {t.task_title && <span className="ml-2 text-black">{t.task_title}</span>}
                        </div>
                        {t.department && <span className="text-navy-900 font-semibold px-2 py-0.5 bg-grey-200 rounded text-[11px]">{t.department}</span>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[12px] text-grey-600 italic">No specific tasks linked to this block window yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <ProtoLabel />
    </div>
  );
}
