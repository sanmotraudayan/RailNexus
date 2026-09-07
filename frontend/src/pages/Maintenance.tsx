import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import { StatusBadge, PageHeader, ProtoLabel } from './Dashboard';
import { Search, Eye, AlertTriangle, Plus, CheckCircle2, X } from 'lucide-react';

interface Task {
  id: string; title: string; department: string; corridor: string; location: string;
  severity: string; criticality: string; urgency: string; duration: number;
  priority_level: string; priority_score: number; priority_explanation: string; status: string;
  deadline: string; asset_id: string;
}

export default function Maintenance() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [selected, setSelected] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  // New Block Request Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCorridor, setNewCorridor] = useState('NDLS-CNB');
  const [newLocation, setNewLocation] = useState('');
  const [newSeverity, setNewSeverity] = useState('HIGH');
  const [newCriticality] = useState('HIGH');
  const [newUrgency, setNewUrgency] = useState('IMMEDIATE');
  const [newDuration, setNewDuration] = useState<number>(3);
  const [newAssetId, setNewAssetId] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Determine user department mapping
  const userDept = user?.department || (
    user?.role === 'engineering' ? 'Engineering' :
    user?.role === 'traction' ? 'Traction' :
    user?.role === 's_and_t' ? 'S&T' : 'Engineering'
  );

  const canRequestBlock = user?.role === 'engineering' || user?.role === 'traction' || user?.role === 's_and_t' || user?.role === 'planner' || user?.role === 'admin';

  useEffect(() => {
    setLoading(true);
    const dept = (user?.role === 'engineering' || user?.role === 'traction' || user?.role === 's_and_t')
      ? user?.department : undefined;
    api.getMaintenance(dept).then(d => { setTasks(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => {
        setTasks(DEMO_TASKS);
        setLoading(false);
      });
  }, [user]);

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const handleCreateBlockRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newLocation.trim()) {
      setFormError('Work description and Location marker are required.');
      return;
    }

    setFormError('');
    setSubmitting(true);

    // Calculate synthetic score based on inputs
    const baseScore = newUrgency === 'IMMEDIATE' ? 88 : newUrgency === 'WITHIN_24H' ? 74 : 58;
    const priorityLevel = baseScore >= 80 ? 'CRITICAL' : baseScore >= 65 ? 'HIGH' : 'MEDIUM';

    const newTaskData = {
      id: `TSK-${Math.floor(1000 + Math.random() * 9000)}`,
      title: newTitle.trim(),
      department: userDept,
      corridor: newCorridor,
      location: newLocation.trim(),
      severity: newSeverity,
      criticality: newCriticality,
      urgency: newUrgency,
      duration: Number(newDuration),
      priority_level: priorityLevel,
      priority_score: baseScore,
      priority_explanation: `Submitted by ${user?.name || 'Department Officer'} (${userDept}). Urgent maintenance window requested at ${newLocation}.`,
      status: 'PENDING_APPROVAL',
      deadline: '2026-09-08',
      asset_id: newAssetId.trim() || `AST-${userDept.substring(0, 3).toUpperCase()}-99`,
      submitted_by: user?.name || 'Officer'
    };

    try {
      const created = await api.createMaintenance(newTaskData);
      setTasks(prev => [created, ...prev]);
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setShowCreateModal(false);
        setNewTitle('');
        setNewLocation('');
        setNewAssetId('');
        setSubmitting(false);
      }, 1000);
    } catch {
      setFormError('Unable to connect to backend server. Saved locally for prototype session.');
      setTasks(prev => [newTaskData, ...prev]);
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setShowCreateModal(false);
        setNewTitle('');
        setNewLocation('');
        setNewAssetId('');
        setSubmitting(false);
      }, 1000);
    }
  };

  const filtered = tasks.filter(t => {
    if (search && !t.title.toLowerCase().includes(search.toLowerCase()) && !t.id.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterDept && t.department !== filterDept) return false;
    if (filterPriority && t.priority_level !== filterPriority) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <PageHeader title="Maintenance requests" subtitle="View and manage maintenance tasks across departments" role={user?.department || ''} />
        {canRequestBlock && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 bg-saffron-500 hover:bg-saffron-600 text-ink-900 text-[13px] font-bold px-4 py-2 shadow-sm transition-colors cursor-pointer"
          >
            <Plus size={16} /> {t('Request New Block')} ({userDept})
          </button>
        )}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 max-w-xs">
          <Search size={16} className="absolute left-3 top-2.5 text-grey-600" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t('Search tasks...')}
            className="w-full pl-9 pr-3 py-2 border border-grey-300 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-600" />
        </div>
        <select value={filterDept} onChange={e => setFilterDept(e.target.value)}
          className="border border-grey-300 px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-600">
          <option value="">{t('All departments')}</option>
          <option value="Engineering">Engineering (TMS)</option>
          <option value="Traction">Traction (TDMS)</option>
          <option value="S&T">S&T (SMS)</option>
        </select>
        <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)}
          className="border border-grey-300 px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-600">
          <option value="">{t('All priorities')}</option>
          <option value="CRITICAL">{t('CRITICAL')}</option>
          <option value="HIGH">{t('HIGH')}</option>
          <option value="MEDIUM">{t('MEDIUM')}</option>
          <option value="LOW">{t('LOW')}</option>
        </select>
      </div>

      {/* Task table */}
      <div className="bg-white border border-grey-300 overflow-x-auto">
        <table className="w-full text-[13px] text-left">
          <thead className="bg-grey-100 border-b border-grey-300 font-semibold text-navy-900">
            <tr>
              <th className="px-4 py-2.5">{t('ID')}</th>
              <th className="px-4 py-2.5">{t('Title')}</th>
              <th className="px-4 py-2.5">{t('Department')}</th>
              <th className="px-4 py-2.5">{t('Corridor / Location')}</th>
              <th className="px-4 py-2.5">{t('Priority Score')}</th>
              <th className="px-4 py-2.5">{t('Duration')}</th>
              <th className="px-4 py-2.5">{t('Status')}</th>
              <th className="px-4 py-2.5">{t('Actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-grey-300">
            {loading ? (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-grey-600">{t('Loading maintenance requests...')}</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-grey-600">{t('No maintenance requests found.')}</td></tr>
            ) : filtered.map(task => (
              <tr key={task.id} className="hover:bg-grey-100">
                <td className="px-4 py-2.5 font-mono text-[12px] font-bold text-navy-900">{task.id}</td>
                <td className="px-4 py-2.5 font-semibold text-navy-900">{task.title}</td>
                <td className="px-4 py-2.5">
                  <span className={`px-2 py-0.5 text-[11px] font-bold border ${
                    task.department === 'Engineering' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                    task.department === 'Traction' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                    'bg-purple-100 text-purple-800 border-purple-300'
                  }`}>
                    {task.department}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-grey-600">{task.corridor} — {task.location}</td>
                <td className="px-4 py-2.5">
                  <span className={`font-bold ${task.priority_score >= 80 ? 'text-critical-700' : task.priority_score >= 60 ? 'text-warning-700' : 'text-success-700'}`}>
                    {task.priority_score} ({task.priority_level})
                  </span>
                </td>
                <td className="px-4 py-2.5">{task.duration}h</td>
                <td className="px-4 py-2.5"><StatusBadge status={task.status} /></td>
                <td className="px-4 py-2.5">
                  <button onClick={() => setSelected(task)}
                    className="flex items-center gap-1 text-[12px] font-bold text-navy-900 hover:text-blue-600">
                    <Eye size={14} /> {t('Detail')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal: Request New Block */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white border-2 border-navy-900 w-full max-w-lg shadow-xl">
            <div className="bg-navy-900 text-white px-4 py-3 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-[15px]">Submit New Block Request ({userDept})</h3>
                <p className="text-[11px] text-grey-200">TMS / SMS / TDMS Maintenance Requisition Entry</p>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="text-white hover:text-grey-300">
                <X size={18} />
              </button>
            </div>

            {submitSuccess ? (
              <div className="p-8 text-center space-y-3">
                <CheckCircle2 size={48} className="mx-auto text-success-700 animate-bounce" />
                <h4 className="font-bold text-[16px] text-navy-900">Block Request Submitted Successfully!</h4>
                <p className="text-[13px] text-grey-600">Request has been routed to the AI Priority Engine and Sectional Controller.</p>
              </div>
            ) : (
              <form onSubmit={handleCreateBlockRequest} className="p-4 space-y-3.5 text-[13px]">
                {formError && (
                  <div className="p-2.5 bg-amber-50 border border-amber-300 text-amber-900 text-[12px] font-semibold flex items-center justify-between">
                    <span>{formError}</span>
                    <button type="button" onClick={() => setFormError('')} className="font-bold text-amber-900">&times;</button>
                  </div>
                )}

                <div>
                  <label className="block font-semibold text-navy-900 mb-1">Work Description / Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Deep Screening of Track / OHE Cantilever Inspection"
                    value={newTitle}
                    onChange={e => { setNewTitle(e.target.value); if (formError) setFormError(''); }}
                    className="w-full border border-grey-300 px-3 py-2 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-navy-900 mb-1">Corridor Section</label>
                    <select
                      value={newCorridor}
                      onChange={e => setNewCorridor(e.target.value)}
                      className="w-full border border-grey-300 px-3 py-2 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    >
                      <option value="NDLS-CNB">NDLS-CNB (New Delhi - Kanpur)</option>
                      <option value="HWH-PRYJ">HWH-PRYJ (Howrah - Prayagraj)</option>
                      <option value="BCT-BRC">BCT-BRC (Mumbai - Vadodara)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-navy-900 mb-1">Location / Km Marker *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Km 142/8 - 144/2"
                      value={newLocation}
                      onChange={e => { setNewLocation(e.target.value); if (formError) setFormError(''); }}
                      className="w-full border border-grey-300 px-3 py-2 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-navy-900 mb-1">Severity</label>
                    <select
                      value={newSeverity}
                      onChange={e => setNewSeverity(e.target.value)}
                      className="w-full border border-grey-300 px-2 py-1.5 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    >
                      <option value="CRITICAL">CRITICAL</option>
                      <option value="HIGH">HIGH</option>
                      <option value="MEDIUM">MEDIUM</option>
                      <option value="LOW">LOW</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-navy-900 mb-1">Urgency</label>
                    <select
                      value={newUrgency}
                      onChange={e => setNewUrgency(e.target.value)}
                      className="w-full border border-grey-300 px-2 py-1.5 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    >
                      <option value="IMMEDIATE">IMMEDIATE</option>
                      <option value="WITHIN_24H">WITHIN 24H</option>
                      <option value="SCHEDULED">SCHEDULED</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-navy-900 mb-1">Duration (Hours)</label>
                    <input
                      type="number"
                      min={1}
                      max={12}
                      value={newDuration}
                      onChange={e => setNewDuration(Number(e.target.value))}
                      className="w-full border border-grey-300 px-2 py-1.5 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-navy-900 mb-1">Asset ID (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. AST-TRK-102 or AST-OHE-44"
                    value={newAssetId}
                    onChange={e => setNewAssetId(e.target.value)}
                    className="w-full border border-grey-300 px-3 py-2 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2 border-t border-grey-200">
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 bg-grey-200 hover:bg-grey-300 text-navy-900 font-semibold text-[13px] disabled:opacity-50"
                  >
                    {t('Cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 bg-navy-900 hover:bg-navy-800 text-white font-bold text-[13px] shadow-sm disabled:opacity-50 flex items-center gap-2"
                  >
                    {submitting ? t('Submitting...') : t('Submit Requisition')}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Modal: View Detail */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white border-2 border-navy-900 w-full max-w-lg p-5 space-y-4 shadow-lg">
            <div className="flex justify-between items-start border-b border-grey-300 pb-3">
              <div>
                <span className="font-mono text-[12px] font-bold text-navy-900">{selected.id}</span>
                <h3 className="font-bold text-[16px] text-navy-900">{selected.title}</h3>
              </div>
              <StatusBadge status={selected.status} />
            </div>

            <div className="grid grid-cols-2 gap-3 text-[13px]">
              <div><span className="text-grey-600">Department:</span> <strong className="text-navy-900">{selected.department}</strong></div>
              <div><span className="text-grey-600">Corridor:</span> <strong className="text-navy-900">{selected.corridor}</strong></div>
              <div><span className="text-grey-600">Location:</span> <strong className="text-navy-900">{selected.location}</strong></div>
              <div><span className="text-grey-600">Duration:</span> <strong className="text-navy-900">{selected.duration} hours</strong></div>
              <div><span className="text-grey-600">Asset ID:</span> <strong className="font-mono text-navy-900">{selected.asset_id}</strong></div>
              <div><span className="text-grey-600">Deadline:</span> <strong className="text-navy-900">{selected.deadline}</strong></div>
            </div>

            <div className="bg-grey-100 p-3 border border-grey-300 space-y-1">
              <div className="flex items-center gap-2">
                <AlertTriangle size={16} className="text-warning-700" />
                <span className="font-bold text-[13px] text-navy-900">Explainable AI Priority Score: {selected.priority_score} ({selected.priority_level})</span>
              </div>
              <p className="text-[12px] text-grey-600 leading-relaxed">{selected.priority_explanation}</p>
            </div>

            <div className="flex justify-end pt-2">
              <button onClick={() => setSelected(null)}
                className="bg-navy-900 text-white text-[13px] font-bold px-4 py-2 hover:bg-navy-800">
                {t('Close')}
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
  { id: 'REQ-101', title: 'Deep Screening of Track', department: 'Engineering', corridor: 'NDLS-CNB', location: 'Km 142/8 - 144/2', severity: 'HIGH', criticality: 'CRITICAL', urgency: 'IMMEDIATE', duration: 4, priority_level: 'CRITICAL', priority_score: 92, priority_explanation: 'Critical track geometry defect detected on high-density corridor. Requires immediate block.', status: 'APPROVED', deadline: '2026-09-07', asset_id: 'AST-TRK-102' },
  { id: 'REQ-102', title: 'OHE Cantilever Inspection & Wire Tightening', department: 'Traction', corridor: 'NDLS-CNB', location: 'Km 143/0 - 144/0', severity: 'HIGH', criticality: 'HIGH', urgency: 'WITHIN_24H', duration: 3, priority_level: 'HIGH', priority_score: 84, priority_explanation: 'High alignment deviation reported. Co-location with REQ-101 recommended.', status: 'CO_LOCATED', deadline: '2026-09-07', asset_id: 'AST-OHE-44' },
  { id: 'REQ-103', title: 'Point Machine Replacement', department: 'S&T', corridor: 'NDLS-CNB', location: 'CNB Yard Line 4', severity: 'HIGH', criticality: 'HIGH', urgency: 'WITHIN_24H', duration: 2, priority_level: 'HIGH', priority_score: 78, priority_explanation: 'Signaling failure risk on turnout. Recommended for shadow block.', status: 'PENDING_APPROVAL', deadline: '2026-09-08', asset_id: 'AST-SIG-89' },
  { id: 'REQ-104', title: 'Ballast Cleaning Machine (BCM) Working', department: 'Engineering', corridor: 'HWH-PRYJ', location: 'Km 420/1 - 425/0', severity: 'MEDIUM', criticality: 'MEDIUM', urgency: 'SCHEDULED', duration: 5, priority_level: 'MEDIUM', priority_score: 65, priority_explanation: 'Routine track maintenance. Lower traffic impact window available.', status: 'PENDING_APPROVAL', deadline: '2026-09-10', asset_id: 'AST-TRK-305' },
  { id: 'REQ-105', title: 'Transformer Maintenance at Substation', department: 'Traction', corridor: 'BCT-BRC', location: 'ST Substation', severity: 'MEDIUM', criticality: 'MEDIUM', urgency: 'SCHEDULED', duration: 4, priority_level: 'MEDIUM', priority_score: 58, priority_explanation: 'Scheduled power block. No passenger train impact expected.', status: 'APPROVED', deadline: '2026-09-09', asset_id: 'AST-OHE-12' },
];
