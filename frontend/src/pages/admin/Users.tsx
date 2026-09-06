import { useState, useEffect } from 'react';
import { PageHeader, ProtoLabel } from '../Dashboard';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Users as UsersIcon, CheckCircle, XCircle } from 'lucide-react';

interface UserRecord {
  id: string; employee_id: string; name: string; department: string; role: string; status: string; last_activity: string;
}

export default function Users() {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getUsers()
      .then(d => {
        setUsers(Array.isArray(d) ? d : DEMO_USERS);
        setLoading(false);
      })
      .catch(() => {
        setUsers(DEMO_USERS);
        setLoading(false);
      });
  }, []);

  const toggleUserStatus = (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'DISABLED' : 'ACTIVE';
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: nextStatus } : u));
    fetch(`http://localhost:8000/api/users/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: nextStatus })
    }).catch(() => {});
  };

  return (
    <div className="space-y-4">
      <PageHeader title="User Governance" subtitle="System user administration & access status" role={user?.department || 'Administration'} />

      <div className="bg-white border border-grey-300 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <UsersIcon size={18} className="text-navy-900" />
            <h3 className="font-bold text-[14px] text-navy-900">Registered System Personnel</h3>
          </div>
          <span className="text-[12px] bg-grey-100 border border-grey-300 px-2.5 py-0.5 font-bold text-navy-900">
            Total Users: {users.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[13px] text-left">
            <thead className="bg-grey-100 border-b border-grey-300 font-semibold text-navy-900">
              <tr>
                <th className="px-4 py-2.5">Emp ID</th>
                <th className="px-4 py-2.5">Name</th>
                <th className="px-4 py-2.5">Department</th>
                <th className="px-4 py-2.5">Role Designation</th>
                <th className="px-4 py-2.5">Status</th>
                <th className="px-4 py-2.5">Last Activity</th>
                <th className="px-4 py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-grey-300">
              {loading ? (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-grey-600">Loading user registry...</td></tr>
              ) : users.map(u => (
                <tr key={u.id} className="hover:bg-grey-100">
                  <td className="px-4 py-2.5 font-mono text-[12px] font-bold text-navy-900">{u.employee_id || u.id}</td>
                  <td className="px-4 py-2.5 font-semibold text-navy-900">{u.name}</td>
                  <td className="px-4 py-2.5 text-grey-700">{u.department}</td>
                  <td className="px-4 py-2.5">
                    <span className="px-2 py-0.5 bg-grey-100 border border-grey-300 text-[11px] font-bold text-navy-900">
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 border ${
                      u.status === 'ACTIVE' ? 'bg-green-100 text-green-800 border-green-300' : 'bg-grey-200 text-grey-700 border-grey-400'
                    }`}>
                      {u.status === 'ACTIVE' ? <CheckCircle size={12} /> : <XCircle size={12} />}
                      {u.status}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 font-mono text-[12px] text-grey-600">{u.last_activity || '2026-09-07 01:00'}</td>
                  <td className="px-4 py-2.5 text-right">
                    <button
                      onClick={() => toggleUserStatus(u.id, u.status)}
                      className={`text-[11px] font-bold px-2.5 py-1 border transition-colors ${
                        u.status === 'ACTIVE' ? 'border-critical-700 text-critical-700 hover:bg-critical-100' : 'border-success-700 text-success-700 hover:bg-success-100'
                      }`}
                    >
                      {u.status === 'ACTIVE' ? 'Disable Access' : 'Enable Access'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ProtoLabel />
    </div>
  );
}

const DEMO_USERS: UserRecord[] = [
  { id: 'USR-001', employee_id: 'IR-88401', name: 'Rajesh Sharma', department: 'Operations', role: 'Sectional Controller', status: 'ACTIVE', last_activity: '2026-09-07 01:12' },
  { id: 'USR-002', employee_id: 'IR-44120', name: 'Priya Verma', department: 'Engineering (TMS)', role: 'Sr. Track Engineer', status: 'ACTIVE', last_activity: '2026-09-07 00:45' },
  { id: 'USR-003', employee_id: 'IR-91204', name: 'Amitabh Sen', department: 'Signal & Telecom (SMS)', role: 'S&T Executive', status: 'ACTIVE', last_activity: '2026-09-06 23:30' },
  { id: 'USR-004', employee_id: 'IR-63301', name: 'Vikram Joshi', department: 'Traction (TDMS)', role: 'OHE Distribution Engineer', status: 'ACTIVE', last_activity: '2026-09-06 22:15' },
  { id: 'USR-005', employee_id: 'IR-10022', name: 'Anil Kumar', department: 'Operations', role: 'Division Operations Manager', status: 'ACTIVE', last_activity: '2026-09-07 01:05' },
  { id: 'USR-006', employee_id: 'IR-99001', name: 'System Admin', department: 'Administration', role: 'System Administrator', status: 'ACTIVE', last_activity: '2026-09-07 01:14' },
];
