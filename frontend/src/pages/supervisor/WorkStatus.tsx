import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { PageHeader, ProtoLabel, StatusBadge } from '../Dashboard';
import { Play, Pause, CheckCircle, AlertTriangle, Clock, MessageSquare, AlertCircle } from 'lucide-react';

interface WorkTask {
  id: string;
  title: string;
  department: string;
  corridor: string;
  location: string;
  status: string;
  duration: number;
  assigned_block?: string;
  work_notes?: string;
}

export default function WorkStatus() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<WorkTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [modalTask, setModalTask] = useState<{ task: WorkTask; action: string } | null>(null);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadData = () => {
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
    loadData();
  }, []);

  const handleActionClick = (task: WorkTask, action: string) => {
    setModalTask({ task, action });
    setNotes('');
  };

  const confirmWorkAction = async () => {
    if (!modalTask) return;
    setSubmitting(true);

    const payload = {
      action: modalTask.action,
      user: user?.name || 'Site Supervisor',
      role: user?.department || 'Supervisor',
      notes: notes.trim(),
    };

    try {
      const res = await api.updateWorkStatus(modalTask.task.id, payload);
      setTasks(prev => prev.map(t => t.id === modalTask.task.id ? { ...t, ...res } : t));
    } catch {
      // Local fallback
      const statusMap: Record<string, string> = {
        START: 'IN_PROGRESS',
        PAUSE: 'PAUSED',
        RESUME: 'IN_PROGRESS',
        COMPLETE: 'COMPLETED',
        REPORT_DELAY: 'DELAYED',
        REPORT_ISSUE: 'ISSUE_REPORTED',
      };
      setTasks(prev => prev.map(t => t.id === modalTask.task.id ? { ...t, status: statusMap[modalTask.action] || 'IN_PROGRESS', work_notes: notes.trim() } : t));
    } finally {
      setSubmitting(false);
      setModalTask(null);
      setNotes('');
    }
  };

  return (
    <div className="space-y-4">
      <PageHeader title="Work Execution Status" subtitle="Live track possession & site maintenance progress management" role={user?.department || 'Operations'} />

      {error && (
        <div className="bg-amber-50 border border-amber-300 p-3 flex items-center justify-between text-[12.5px] text-amber-900">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="text-amber-700 shrink-0" />
            <span>Unable to sync live work status with backend API. Offline fallback mode active.</span>
          </div>
          <button onClick={loadData} className="px-2.5 py-1 bg-amber-200 hover:bg-amber-300 font-bold text-amber-900 text-[11px]">
            Retry Sync
          </button>
        </div>
      )}

      {/* Task cards list */}
      {loading ? (
        <div className="bg-white border border-grey-300 p-8 text-center text-grey-600 text-[13px]">
          Loading field work tasks...
        </div>
      ) : tasks.length === 0 ? (
        <div className="bg-white border border-grey-300 p-8 text-center text-grey-600 text-[13px]">
          No work tasks assigned.
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map(t => (
            <div key={t.id} className="bg-white border border-grey-300 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-[13px] text-navy-900">{t.id}</span>
                  <span className="font-semibold text-navy-900 text-[14px]">{t.title}</span>
                  <span className="px-2 py-0.5 text-[11px] font-bold border bg-grey-100 border-grey-300 text-navy-900">{t.department}</span>
                </div>
                <StatusBadge status={t.status} />
              </div>

              <div className="grid grid-cols-3 gap-2 text-[12.5px] text-grey-700 bg-grey-50 p-2.5 border border-grey-200">
                <div>Corridor: <strong className="text-navy-900">{t.corridor}</strong></div>
                <div>Location: <strong className="text-navy-900">{t.location}</strong></div>
                <div>Assigned Block: <strong className="font-mono text-navy-900">{t.assigned_block || 'BLK-003'}</strong></div>
              </div>

              {t.work_notes && (
                <div className="text-[12px] text-grey-700 bg-amber-50 p-2 border border-amber-200 flex items-start gap-2">
                  <MessageSquare size={14} className="text-amber-700 mt-0.5 shrink-0" />
                  <span><strong>Site Log Notes:</strong> {t.work_notes}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-1 border-t border-grey-200">
                {t.status !== 'IN_PROGRESS' && t.status !== 'COMPLETED' && (
                  <button
                    onClick={() => handleActionClick(t, 'START')}
                    className="flex items-center gap-1 px-3 py-1.5 bg-navy-900 text-white text-[12px] font-bold hover:bg-navy-800"
                  >
                    <Play size={14} /> Start Work
                  </button>
                )}

                {t.status === 'IN_PROGRESS' && (
                  <>
                    <button
                      onClick={() => handleActionClick(t, 'PAUSE')}
                      className="flex items-center gap-1 px-3 py-1.5 border border-amber-700 text-amber-800 text-[12px] font-bold hover:bg-amber-50"
                    >
                      <Pause size={14} /> Pause Work
                    </button>
                    <button
                      onClick={() => handleActionClick(t, 'COMPLETE')}
                      className="flex items-center gap-1 px-3 py-1.5 bg-success-700 text-white text-[12px] font-bold hover:bg-success-800"
                    >
                      <CheckCircle size={14} /> Complete Work
                    </button>
                  </>
                )}

                {t.status === 'PAUSED' && (
                  <button
                    onClick={() => handleActionClick(t, 'RESUME')}
                    className="flex items-center gap-1 px-3 py-1.5 bg-navy-900 text-white text-[12px] font-bold hover:bg-navy-800"
                  >
                    <Play size={14} /> Resume Work
                  </button>
                )}

                <button
                  onClick={() => handleActionClick(t, 'REPORT_DELAY')}
                  className="flex items-center gap-1 px-2.5 py-1.5 border border-grey-400 text-grey-800 text-[12px] font-semibold hover:bg-grey-100"
                >
                  <Clock size={14} /> Report Delay
                </button>
                <button
                  onClick={() => handleActionClick(t, 'REPORT_ISSUE')}
                  className="flex items-center gap-1 px-2.5 py-1.5 border border-critical-700 text-critical-700 text-[12px] font-semibold hover:bg-critical-100"
                >
                  <AlertTriangle size={14} /> Report Issue
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation & Note Modal */}
      {modalTask && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md border-2 border-navy-900 shadow-xl">
            <div className="bg-navy-900 text-white px-4 py-2.5 flex justify-between items-center">
              <span className="font-bold text-[14px]">Update Work Status: {modalTask.action.replace('_', ' ')}</span>
              <button onClick={() => setModalTask(null)} className="text-white hover:text-grey-300 font-bold">&times;</button>
            </div>
            <div className="p-4 space-y-3 text-[13px]">
              <p className="text-grey-700">Target Task: <strong className="text-navy-900">{modalTask.task.id} — {modalTask.task.title}</strong></p>
              <div>
                <label className="block text-[12px] font-bold text-navy-900 mb-1">Field Supervisor Notes / Report Remarks</label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="e.g. Track machine positioned at Km 142/8. Crew safety check completed..."
                  rows={3}
                  className="w-full border border-grey-300 p-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>
            <div className="border-t border-grey-200 px-4 py-2.5 flex justify-end gap-2 bg-grey-50">
              <button
                disabled={submitting}
                onClick={() => setModalTask(null)}
                className="px-3.5 py-1.5 border border-grey-300 text-[12.5px] font-semibold hover:bg-grey-200"
              >
                Cancel
              </button>
              <button
                disabled={submitting}
                onClick={confirmWorkAction}
                className="px-4 py-1.5 bg-navy-900 text-white text-[12.5px] font-bold hover:bg-navy-800"
              >
                {submitting ? 'Updating...' : `Confirm ${modalTask.action}`}
              </button>
            </div>
          </div>
        </div>
      )}

      <ProtoLabel />
    </div>
  );
}

const DEMO_TASKS: WorkTask[] = [
  { id: 'TSK-0001', title: 'Deep Screening of Track Geometry', department: 'Engineering', corridor: 'NDLS-CNB', location: 'Km 142/8 - 144/2', status: 'APPROVED', duration: 4, assigned_block: 'BLK-003' },
  { id: 'TSK-0002', title: 'OHE Cantilever Realignment', department: 'Traction', corridor: 'NDLS-CNB', location: 'Km 143/0 - 144/0', status: 'IN_PROGRESS', duration: 3, assigned_block: 'BLK-003', work_notes: 'Tower wagon active on Line 2.' },
  { id: 'TSK-0003', title: 'Point Machine Contact Servicing', department: 'S&T', corridor: 'NDLS-CNB', location: 'CNB Yard Line 4', status: 'PENDING_APPROVAL', duration: 2, assigned_block: 'BLK-004' },
];
