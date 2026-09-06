import { useState } from 'react';
import { PageHeader, ProtoLabel } from './Dashboard';
import { useAuth } from '../context/AuthContext';
import { CheckSquare, X, Edit } from 'lucide-react';

interface PlanItem {
  id: string; block_id: string; corridor: string; date: string; departments: string[];
  explanation: string; status: string;
}

const DEMO_PLANS: PlanItem[] = [
  { id: 'PLN-001', block_id: 'BLK-003', corridor: 'NDLS-CNB', date: '2026-09-07', departments: ['Engineering', 'S&T'], explanation: 'Co-located Engineering and S&T tasks in shared possession window.', status: 'AI_RECOMMENDED' },
  { id: 'PLN-002', block_id: 'BLK-008', corridor: 'HWH-KGP', date: '2026-09-08', departments: ['Traction'], explanation: 'OHE maintenance scheduled during low-traffic window.', status: 'AI_RECOMMENDED' },
  { id: 'PLN-003', block_id: 'BLK-012', corridor: 'CSMT-PUNE', date: '2026-09-09', departments: ['Engineering', 'Traction', 'S&T'], explanation: 'All three departments co-located for maximum block utilization.', status: 'PENDING_APPROVAL' },
];

export default function Approvals() {
  const { user } = useAuth();
  const [plans, setPlans] = useState(DEMO_PLANS);
  const [modal, setModal] = useState<{ plan: PlanItem; action: string } | null>(null);
  const [comment, setComment] = useState('');

  const handleAction = (plan: PlanItem, action: string) => {
    setModal({ plan, action });
  };

  const confirmAction = () => {
    if (!modal) return;
    setPlans(prev => prev.map(p =>
      p.id === modal.plan.id
        ? { ...p, status: modal.action === 'APPROVE' ? 'APPROVED' : modal.action === 'REJECT' ? 'REJECTED' : 'MODIFIED' }
        : p
    ));
    setModal(null);
    setComment('');
  };

  const statusColor: Record<string, string> = {
    AI_RECOMMENDED: 'bg-info-100 text-info-700',
    PENDING_APPROVAL: 'bg-warning-100 text-warning-700',
    APPROVED: 'bg-success-100 text-success-700',
    REJECTED: 'bg-critical-100 text-critical-700',
    MODIFIED: 'bg-warning-100 text-warning-700',
  };

  return (
    <div className="space-y-4">
      <PageHeader title="Approvals" subtitle="Review and approve AI-recommended block plans" role={user?.department || ''} />

      <div className="space-y-3">
        {plans.map(p => (
          <div key={p.id} className="bg-white border border-grey-300 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="font-bold text-navy-900">{p.id}</span>
                <span className="text-[12px] text-grey-600">{p.block_id} | {p.corridor} | {p.date}</span>
              </div>
              <span className={`text-[11px] px-2 py-0.5 font-semibold ${statusColor[p.status] || ''}`}>
                {p.status.replace(/_/g, ' ')}
              </span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              {p.departments.map(d => (
                <span key={d} className="text-[11px] px-2 py-0.5 bg-grey-100 text-grey-600 font-semibold">{d}</span>
              ))}
            </div>
            <p className="text-[12px] text-grey-600 bg-grey-50 p-2 border border-grey-100 mb-3">{p.explanation}</p>
            {(p.status === 'AI_RECOMMENDED' || p.status === 'PENDING_APPROVAL') && (
              <div className="flex items-center gap-2 justify-end">
                <button onClick={() => handleAction(p, 'REJECT')}
                  className="flex items-center gap-1 px-3 py-1.5 border border-critical-700 text-critical-700 text-[13px] hover:bg-critical-100 transition-colors">
                  <X size={14} /> Reject
                </button>
                <button onClick={() => handleAction(p, 'MODIFY')}
                  className="flex items-center gap-1 px-3 py-1.5 border border-navy-700 text-navy-700 text-[13px] hover:bg-grey-50 transition-colors">
                  <Edit size={14} /> Modify
                </button>
                <button onClick={() => handleAction(p, 'APPROVE')}
                  className="flex items-center gap-1 px-3 py-1.5 bg-navy-700 text-white text-[13px] hover:bg-navy-900 transition-colors">
                  <CheckSquare size={14} /> Approve
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Approval Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md border border-grey-300">
            <div className="bg-navy-900 text-white px-4 py-3">
              <span className="font-semibold text-[14px]">{modal.action} — {modal.plan.id}</span>
            </div>
            <div className="p-4 space-y-3 text-[13px]">
              <p>AI recommendation: <span className="font-medium">{modal.plan.explanation}</span></p>
              <div>
                <label className="block text-[13px] font-medium text-ink-900 mb-1">
                  Comment <span className="text-grey-600">(optional)</span>
                </label>
                <textarea value={comment} onChange={e => setComment(e.target.value)} rows={3}
                  className="w-full border border-grey-300 p-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-600" />
              </div>
            </div>
            <div className="border-t border-grey-100 px-4 py-3 flex justify-end gap-2">
              <button onClick={() => { setModal(null); setComment(''); }}
                className="px-4 py-1.5 border border-grey-300 text-[13px] hover:bg-grey-50">Cancel</button>
              <button onClick={confirmAction}
                className="px-4 py-1.5 bg-navy-700 text-white text-[13px] hover:bg-navy-900">Confirm {modal.action.toLowerCase()}</button>
            </div>
          </div>
        </div>
      )}
      <ProtoLabel />
    </div>
  );
}
