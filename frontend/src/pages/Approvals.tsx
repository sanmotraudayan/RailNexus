import { useState, useEffect } from 'react';
import { PageHeader, ProtoLabel } from './Dashboard';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import { CheckSquare, X, Edit, Clock, ShieldAlert } from 'lucide-react';

interface PlanItem {
  id: string; block_id: string; corridor: string; date: string; departments: string[];
  explanation: string; status: string;
}

interface ApprovalRecord {
  id: string; plan_id: string; action: string; user: string; role: string; comment: string; timestamp: string;
}

export default function Approvals() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [plans, setPlans] = useState<PlanItem[]>([]);
  const [approvals, setApprovals] = useState<ApprovalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ plan: PlanItem; action: string } | null>(null);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const canApprove = user?.role === 'planner' || user?.role === 'admin';

  useEffect(() => {
    setLoading(true);
    Promise.all([api.getPlans(), api.getApprovals()])
      .then(([pList, aList]) => {
        setPlans(Array.isArray(pList) && pList.length > 0 ? pList : DEMO_PLANS);
        setApprovals(Array.isArray(aList) ? aList : []);
        setLoading(false);
      })
      .catch(() => {
        setPlans(DEMO_PLANS);
        setLoading(false);
      });
  }, []);

  const handleAction = (plan: PlanItem, action: string) => {
    setModal({ plan, action });
  };

  const confirmAction = async () => {
    if (!modal) return;
    setSubmitting(true);

    const payload = {
      plan_id: modal.plan.id,
      action: modal.action,
      user: user?.name || 'Sectional Controller',
      role: user?.department || 'Operations',
      comment: comment.trim(),
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19)
    };

    try {
      const res = await api.createApproval(payload);
      setApprovals(prev => [res, ...prev]);
      setPlans(prev => prev.map(p =>
        p.id === modal.plan.id || p.block_id === modal.plan.id
          ? { ...p, status: modal.action === 'APPROVE' ? 'APPROVED' : modal.action === 'REJECT' ? 'REJECTED' : 'MODIFIED' }
          : p
      ));
    } catch {
      // Fallback local update
      setPlans(prev => prev.map(p =>
        p.id === modal.plan.id
          ? { ...p, status: modal.action === 'APPROVE' ? 'APPROVED' : modal.action === 'REJECT' ? 'REJECTED' : 'MODIFIED' }
          : p
      ));
    } finally {
      setSubmitting(false);
      setModal(null);
      setComment('');
    }
  };

  const statusColor: Record<string, string> = {
    AI_RECOMMENDED: 'bg-blue-100 text-blue-800 border-blue-300',
    PENDING_APPROVAL: 'bg-amber-100 text-amber-800 border-amber-300',
    APPROVED: 'bg-green-100 text-green-800 border-green-300',
    REJECTED: 'bg-red-100 text-red-800 border-red-300',
    MODIFIED: 'bg-purple-100 text-purple-800 border-purple-300',
  };

  return (
    <div className="space-y-4">
      <PageHeader title="Approvals" subtitle="Review and approve AI-recommended block plans" role={user?.department || ''} />

      {!canApprove && (
        <div className="bg-amber-50 border border-amber-300 p-3 flex items-center gap-2 text-[12.5px] text-amber-900">
          <ShieldAlert size={16} className="text-amber-700 shrink-0" />
          <span><strong>Read-Only Mode:</strong> Only Sectional Controllers (Block Planners) and System Admins have operational authority to approve or reject master block plans.</span>
        </div>
      )}

      {loading ? (
        <div className="bg-white border border-grey-300 p-8 text-center text-grey-600 text-[13px]">
          Loading operational block plans...
        </div>
      ) : plans.length === 0 ? (
        <div className="bg-white border border-grey-300 p-8 text-center text-grey-600 text-[13px]">
          No pending or approved plans available.
        </div>
      ) : (
        <div className="space-y-3">
          {plans.map(p => (
            <div key={p.id} className="bg-white border border-grey-300 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-navy-900 font-mono text-[13px]">{p.id}</span>
                  <span className="text-[12px] text-grey-600 font-mono">{p.block_id} | Corridor: {p.corridor} | Date: {p.date}</span>
                </div>
                <span className={`text-[11px] px-2.5 py-0.5 font-bold border ${statusColor[p.status] || ''}`}>
                  {p.status.replace(/_/g, ' ')}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-grey-600">Departments involved:</span>
                {p.departments.map(d => (
                  <span key={d} className="text-[11px] px-2 py-0.5 bg-grey-100 border border-grey-300 text-navy-900 font-semibold">{d}</span>
                ))}
              </div>

              <p className="text-[12px] text-grey-700 bg-grey-50 p-2.5 border border-grey-200">{p.explanation}</p>

              {canApprove && (p.status === 'AI_RECOMMENDED' || p.status === 'PENDING_APPROVAL') && (
                <div className="flex items-center gap-2 justify-end pt-1">
                  <button onClick={() => handleAction(p, 'REJECT')}
                    className="flex items-center gap-1 px-3 py-1.5 border border-critical-700 text-critical-700 text-[12.5px] font-bold hover:bg-critical-100 transition-colors">
                    <X size={14} /> {t('Reject')}
                  </button>
                  <button onClick={() => handleAction(p, 'MODIFY')}
                    className="flex items-center gap-1 px-3 py-1.5 border border-navy-700 text-navy-700 text-[12.5px] font-bold hover:bg-grey-100 transition-colors">
                    <Edit size={14} /> {t('Modify')}
                  </button>
                  <button onClick={() => handleAction(p, 'APPROVE')}
                    className="flex items-center gap-1 px-3 py-1.5 bg-navy-900 text-white text-[12.5px] font-bold hover:bg-navy-800 transition-colors">
                    <CheckSquare size={14} /> {t('Approve Plan')}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Approval Audit Trail History */}
      {approvals.length > 0 && (
        <div className="bg-white border border-grey-300 p-4 space-y-3">
          <h3 className="font-bold text-[13px] text-navy-900 flex items-center gap-2 border-b border-grey-200 pb-2">
            <Clock size={15} /> Recent Approval History & Audit Trail
          </h3>
          <div className="divide-y divide-grey-200 max-h-48 overflow-y-auto text-[12px]">
            {approvals.map(a => (
              <div key={a.id} className="py-2 flex items-center justify-between">
                <div>
                  <span className="font-bold text-navy-900">{a.plan_id}</span> — <span className="font-semibold">{a.action}</span> by <span className="text-grey-700">{a.user} ({a.role})</span>
                  {a.comment && <p className="text-[11px] text-grey-600 italic">"{a.comment}"</p>}
                </div>
                <span className="text-[11px] text-grey-500 font-mono">{a.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Approval Action Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md border-2 border-navy-900 shadow-xl">
            <div className="bg-navy-900 text-white px-4 py-3 flex justify-between items-center">
              <span className="font-bold text-[14px]">{modal.action} Master Plan — {modal.plan.id}</span>
              <button onClick={() => { setModal(null); setComment(''); }} className="text-white hover:text-grey-300">
                <X size={16} />
              </button>
            </div>
            <div className="p-4 space-y-3 text-[13px]">
              <p className="text-grey-700">Plan details: <span className="font-semibold text-navy-900">{modal.plan.explanation}</span></p>
              <div>
                <label className="block text-[12px] font-bold text-navy-900 mb-1">
                  Officer Operational Justification / Reason <span className="text-grey-600 font-normal">(Optional)</span>
                </label>
                <textarea
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder="e.g. Approved following track clearance check with Sectional Engineer..."
                  rows={3}
                  className="w-full border border-grey-300 p-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>
            <div className="border-t border-grey-200 px-4 py-3 flex justify-end gap-2 bg-grey-50">
              <button
                disabled={submitting}
                onClick={() => { setModal(null); setComment(''); }}
                className="px-4 py-1.5 border border-grey-300 text-[12.5px] font-semibold hover:bg-grey-200"
              >
                {t('Cancel')}
              </button>
              <button
                disabled={submitting}
                onClick={confirmAction}
                className="px-4 py-1.5 bg-navy-900 text-white text-[12.5px] font-bold hover:bg-navy-800"
              >
                {submitting ? t('Submitting...') : `${t('Confirm')} ${modal.action}`}
              </button>
            </div>
          </div>
        </div>
      )}

      <ProtoLabel />
    </div>
  );
}

const DEMO_PLANS: PlanItem[] = [
  { id: 'PLN-001', block_id: 'BLK-003', corridor: 'NDLS-CNB', date: '2026-09-07', departments: ['Engineering', 'S&T'], explanation: 'Co-located Engineering and S&T tasks in shared possession window.', status: 'AI_RECOMMENDED' },
  { id: 'PLN-002', block_id: 'BLK-008', corridor: 'HWH-KGP', date: '2026-09-08', departments: ['Traction'], explanation: 'OHE maintenance scheduled during low-traffic window.', status: 'AI_RECOMMENDED' },
  { id: 'PLN-003', block_id: 'BLK-012', corridor: 'CSMT-PUNE', date: '2026-09-09', departments: ['Engineering', 'Traction', 'S&T'], explanation: 'All three departments co-located for maximum block utilization.', status: 'PENDING_APPROVAL' },
];
