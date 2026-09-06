import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { PageHeader, ProtoLabel } from './Dashboard';
import { useAuth } from '../context/AuthContext';

interface AuditEntry { id: string; user: string; role: string; action: string; module: string; description: string; timestamp: string; }

export default function Audit() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<AuditEntry[]>([]);

  useEffect(() => {
    api.getAudit().then(d => setLogs(Array.isArray(d) ? d : [])).catch(() => {});
  }, []);

  return (
    <div className="space-y-4">
      <PageHeader title="Audit trail" subtitle="System activity log" role={user?.department || ''} />
      <div className="bg-white border border-grey-300 overflow-auto">
        <table className="w-full text-[13px]">
          <thead className="sticky top-0">
            <tr className="bg-navy-900 text-white text-[12px] font-semibold">
              <th className="px-3 py-2 text-left">Timestamp</th>
              <th className="px-3 py-2 text-left">User</th>
              <th className="px-3 py-2 text-left">Role</th>
              <th className="px-3 py-2 text-left">Action</th>
              <th className="px-3 py-2 text-left">Module</th>
              <th className="px-3 py-2 text-left">Description</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((l, i) => (
              <tr key={l.id} className={i % 2 === 0 ? 'bg-white' : 'bg-grey-50'} style={{ height: '40px' }}>
                <td className="px-3 py-2 font-mono text-[12px]">{l.timestamp}</td>
                <td className="px-3 py-2">{l.user}</td>
                <td className="px-3 py-2 text-[12px]">{l.role}</td>
                <td className="px-3 py-2 font-medium">{l.action}</td>
                <td className="px-3 py-2">{l.module}</td>
                <td className="px-3 py-2 text-[12px] text-grey-600">{l.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ProtoLabel />
    </div>
  );
}
