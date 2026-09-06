import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { PageHeader, ProtoLabel, StatusBadge } from '../Dashboard';
import { Search, Eye, AlertCircle } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  department: string;
  corridor: string;
  location: string;
  severity: string;
  criticality: string;
  duration: number;
  priority_level: string;
  priority_score: number;
  status: string;
  assigned_block?: string;
}

export default function AssignedTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const fetchTasks = () => {
    setLoading(true);
    setError(false);
    api.getMaintenance()
      .then(d => {
        setTasks(Array.isArray(d) ? d : DEMO_TASKS);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setTasks(DEMO_TASKS);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const filtered = tasks.filter(t => {
    if (search && !t.title.toLowerCase().includes(search.toLowerCase()) && !t.id.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <PageHeader title="Assigned Tasks" subtitle="Sectional maintenance task queue for supervisor execution" role={user?.department || 'Operations'} />

      {/* Search Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={16} className="absolute left-3 top-2.5 text-grey-600" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search assigned tasks..."
            className="w-full pl-9 pr-3 py-2 border border-grey-300 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
      </div>

      {/* Error state alert */}
      {error && (
        <div className="bg-amber-50 border border-amber-300 p-3 flex items-center justify-between text-[12.5px] text-amber-900">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="text-amber-700 shrink-0" />
            <span>Unable to connect to live backend API. Displaying fallback dataset.</span>
          </div>
          <button onClick={fetchTasks} className="px-2.5 py-1 bg-amber-200 hover:bg-amber-300 font-bold text-amber-900 text-[11px]">
            Retry
          </button>
        </div>
      )}

      {/* Task table */}
      <div className="bg-white border border-grey-300 overflow-x-auto">
        <table className="w-full text-[13px] text-left">
          <thead className="bg-grey-100 border-b border-grey-300 font-semibold text-navy-900">
            <tr>
              <th className="px-4 py-2.5">Task ID</th>
              <th className="px-4 py-2.5">Work Description</th>
              <th className="px-4 py-2.5">Department</th>
              <th className="px-4 py-2.5">Corridor / Location</th>
              <th className="px-4 py-2.5">Assigned Block</th>
              <th className="px-4 py-2.5">Priority</th>
              <th className="px-4 py-2.5">Planned Duration</th>
              <th className="px-4 py-2.5">Status</th>
              <th className="px-4 py-2.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-grey-300">
            {loading ? (
              <tr><td colSpan={9} className="px-4 py-8 text-center text-grey-600">Loading assigned tasks...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={9} className="px-4 py-8 text-center text-grey-600">No records found.</td></tr>
            ) : filtered.map(t => (
              <tr key={t.id} className="hover:bg-grey-100">
                <td className="px-4 py-2.5 font-mono text-[12px] font-bold text-navy-900">{t.id}</td>
                <td className="px-4 py-2.5 font-semibold text-navy-900">{t.title}</td>
                <td className="px-4 py-2.5">
                  <span className="px-2 py-0.5 text-[11px] font-bold border bg-grey-100 border-grey-300 text-navy-900">
                    {t.department}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-grey-600">{t.corridor} — {t.location}</td>
                <td className="px-4 py-2.5 font-mono text-[12px] text-navy-900 font-bold">{t.assigned_block || 'BLK-003'}</td>
                <td className="px-4 py-2.5">
                  <span className={`font-bold ${t.priority_score >= 80 ? 'text-critical-700' : 'text-warning-700'}`}>
                    {t.priority_score} ({t.priority_level})
                  </span>
                </td>
                <td className="px-4 py-2.5">{t.duration} hours</td>
                <td className="px-4 py-2.5"><StatusBadge status={t.status} /></td>
                <td className="px-4 py-2.5 text-right">
                  <button onClick={() => setSelectedTask(t)} className="inline-flex items-center gap-1 text-[12px] font-bold text-navy-900 hover:text-blue-600">
                    <Eye size={14} /> Detail
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Task detail modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white border-2 border-navy-900 w-full max-w-lg p-5 space-y-3 shadow-lg">
            <div className="flex justify-between items-start border-b border-grey-300 pb-2">
              <div>
                <span className="font-mono text-[12px] font-bold text-navy-900">{selectedTask.id}</span>
                <h3 className="font-bold text-[16px] text-navy-900">{selectedTask.title}</h3>
              </div>
              <StatusBadge status={selectedTask.status} />
            </div>
            <div className="grid grid-cols-2 gap-2 text-[13px]">
              <div><span className="text-grey-600">Department:</span> <strong>{selectedTask.department}</strong></div>
              <div><span className="text-grey-600">Corridor:</span> <strong>{selectedTask.corridor}</strong></div>
              <div><span className="text-grey-600">Location:</span> <strong>{selectedTask.location}</strong></div>
              <div><span className="text-grey-600">Assigned Block:</span> <strong className="font-mono">{selectedTask.assigned_block || 'BLK-003'}</strong></div>
              <div><span className="text-grey-600">Planned Duration:</span> <strong>{selectedTask.duration}h</strong></div>
              <div><span className="text-grey-600">Priority Score:</span> <strong>{selectedTask.priority_score} ({selectedTask.priority_level})</strong></div>
            </div>
            <div className="flex justify-end pt-2">
              <button onClick={() => setSelectedTask(null)} className="px-4 py-1.5 bg-navy-900 text-white text-[12.5px] font-bold">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <ProtoLabel />
    </div>
  );
}

const DEMO_TASKS: Task[] = [
  { id: 'TSK-0001', title: 'Deep Screening of Track Geometry', department: 'Engineering', corridor: 'NDLS-CNB', location: 'Km 142/8 - 144/2', severity: 'HIGH', criticality: 'CRITICAL', duration: 4, priority_level: 'CRITICAL', priority_score: 92, status: 'APPROVED', assigned_block: 'BLK-003' },
  { id: 'TSK-0002', title: 'OHE Cantilever Realignment', department: 'Traction', corridor: 'NDLS-CNB', location: 'Km 143/0 - 144/0', severity: 'HIGH', criticality: 'HIGH', duration: 3, priority_level: 'HIGH', priority_score: 84, status: 'APPROVED', assigned_block: 'BLK-003' },
  { id: 'TSK-0003', title: 'Point Machine Contact Servicing', department: 'S&T', corridor: 'NDLS-CNB', location: 'CNB Yard Line 4', severity: 'HIGH', criticality: 'HIGH', duration: 2, priority_level: 'HIGH', priority_score: 78, status: 'PENDING_APPROVAL', assigned_block: 'BLK-004' },
];
