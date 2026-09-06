import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { PageHeader, ProtoLabel } from '../Dashboard';
import { Truck, CheckCircle2, AlertCircle } from 'lucide-react';

interface Resource {
  id: string;
  name: string;
  type: string;
  department: string;
  availability: string;
  current_assignment: string;
  status: string;
}

export default function Resources() {
  const { user } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filterDept, setFilterDept] = useState('');

  const loadResources = () => {
    setLoading(true);
    setError(false);
    // Fetch assets or fallback to resource list
    api.getAssets()
      .then(d => {
        if (Array.isArray(d) && d.length > 0) {
          const mapped: Resource[] = d.map(a => ({
            id: a.id,
            name: a.name,
            type: a.type || 'Equipment',
            department: a.department || 'Engineering',
            availability: a.availability || '85%',
            current_assignment: a.condition === 'Degraded' ? 'Maintenance Assigned' : 'Unassigned / Ready',
            status: a.condition || 'OPERATIONAL'
          }));
          setResources(mapped);
        } else {
          setResources(DEMO_RESOURCES);
        }
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setResources(DEMO_RESOURCES);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadResources();
  }, []);

  const filtered = resources.filter(r => !filterDept || r.department === filterDept);

  return (
    <div className="space-y-4">
      <PageHeader title="Maintenance Resources" subtitle="Track machines, tower wagons, equipment & specialized crew availability" role={user?.department || 'Operations'} />

      {/* Filter toolbar */}
      <div className="flex items-center justify-between">
        <select
          value={filterDept}
          onChange={e => setFilterDept(e.target.value)}
          className="border border-grey-300 px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          <option value="">All Departments</option>
          <option value="Engineering">Engineering (Track Machines / BCM / CSM)</option>
          <option value="Traction">Traction (OHE Tower Wagons)</option>
          <option value="S&T">S&T (Testing Vans & Signal Tools)</option>
        </select>
        <span className="text-[12px] bg-grey-100 border border-grey-300 px-2.5 py-1 font-bold text-navy-900">
          Total Resources: {filtered.length}
        </span>
      </div>

      {error && (
        <div className="bg-amber-50 border border-amber-300 p-3 flex items-center justify-between text-[12.5px] text-amber-900">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="text-amber-700 shrink-0" />
            <span>Unable to load live resource inventory from backend API. Displaying static resources.</span>
          </div>
          <button onClick={loadResources} className="px-2.5 py-1 bg-amber-200 hover:bg-amber-300 font-bold text-amber-900 text-[11px]">
            Retry
          </button>
        </div>
      )}

      {/* Resources Table */}
      <div className="bg-white border border-grey-300 overflow-x-auto">
        <table className="w-full text-[13px] text-left">
          <thead className="bg-grey-100 border-b border-grey-300 font-semibold text-navy-900">
            <tr>
              <th className="px-4 py-2.5">Resource ID</th>
              <th className="px-4 py-2.5">Resource Name</th>
              <th className="px-4 py-2.5">Type</th>
              <th className="px-4 py-2.5">Department</th>
              <th className="px-4 py-2.5">Availability</th>
              <th className="px-4 py-2.5">Current Assignment</th>
              <th className="px-4 py-2.5">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-grey-300">
            {loading ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-grey-600">Loading resources...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-grey-600">No records found.</td></tr>
            ) : filtered.map(r => (
              <tr key={r.id} className="hover:bg-grey-100">
                <td className="px-4 py-2.5 font-mono text-[12px] font-bold text-navy-900">{r.id}</td>
                <td className="px-4 py-2.5 font-semibold text-navy-900 flex items-center gap-2">
                  <Truck size={15} className="text-navy-700 shrink-0" />
                  {r.name}
                </td>
                <td className="px-4 py-2.5 text-grey-700">{r.type}</td>
                <td className="px-4 py-2.5">
                  <span className="px-2 py-0.5 text-[11px] font-bold border bg-grey-100 border-grey-300 text-navy-900">
                    {r.department}
                  </span>
                </td>
                <td className="px-4 py-2.5 font-bold text-navy-900">{r.availability}</td>
                <td className="px-4 py-2.5 text-grey-700">{r.current_assignment}</td>
                <td className="px-4 py-2.5">
                  <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 border ${
                    r.status === 'Degraded' || r.status === 'Poor' ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-green-100 text-green-800 border-green-300'
                  }`}>
                    <CheckCircle2 size={12} /> {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ProtoLabel />
    </div>
  );
}

const DEMO_RESOURCES: Resource[] = [
  { id: 'RES-TRK-01', name: 'Ballast Cleaning Machine (BCM-802)', type: 'Track Machine', department: 'Engineering', availability: '94%', current_assignment: 'BLK-003 (NDLS-CNB)', status: 'OPERATIONAL' },
  { id: 'RES-TRK-02', name: 'Continuous Surface Miner (CSM-44)', type: 'Track Machine', department: 'Engineering', availability: '88%', current_assignment: 'Unassigned', status: 'READY' },
  { id: 'RES-OHE-01', name: '8-Wheeler OHE Tower Wagon (TW-102)', type: 'Traction Vehicle', department: 'Traction', availability: '92%', current_assignment: 'BLK-003 (NDLS-CNB)', status: 'OPERATIONAL' },
  { id: 'RES-SIG-01', name: 'S&T Point Testing Unit Van (STV-04)', type: 'Testing Van', department: 'S&T', availability: '96%', current_assignment: 'CNB Yard', status: 'OPERATIONAL' },
];
