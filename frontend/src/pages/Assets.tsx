import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { StatusBadge, PageHeader, ProtoLabel } from './Dashboard';
import { Search, Eye } from 'lucide-react';

interface Asset {
  id: string; name: string; type: string; department: string; location: string;
  corridor: string; criticality: string; condition: string; last_maintenance: string;
  next_maintenance: string; availability: string; open_defects: number;
}

export default function Assets() {
  const { user } = useAuth();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [selected, setSelected] = useState<Asset | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const dept = (user?.role === 'engineering' || user?.role === 'traction' || user?.role === 's_and_t') ? user?.department : undefined;
    api.getAssets(dept).then(d => { setAssets(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [user]);

  const filtered = assets.filter(a => {
    if (search && !a.name.toLowerCase().includes(search.toLowerCase()) && !a.id.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterDept && a.department !== filterDept) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <PageHeader title="Assets" subtitle="Asset inventory and condition monitoring" role={user?.department || ''} />
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={16} className="absolute left-3 top-2.5 text-grey-600" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search assets..."
            className="w-full pl-9 pr-3 py-2 border border-grey-300 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-600" />
        </div>
        <select value={filterDept} onChange={e => setFilterDept(e.target.value)}
          className="border border-grey-300 px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-600">
          <option value="">All departments</option>
          <option value="Engineering">Engineering</option>
          <option value="Traction">Traction</option>
          <option value="S&T">S&T</option>
        </select>
        <div className="flex-1" />
        <span className="text-[12px] text-grey-600">{filtered.length} assets</span>
      </div>
      <div className="bg-white border border-grey-300 overflow-auto">
        <table className="w-full text-[13px]">
          <thead className="sticky top-0">
            <tr className="bg-navy-900 text-white text-[12px] font-semibold">
              <th className="px-3 py-2 text-left">Asset ID</th>
              <th className="px-3 py-2 text-left">Name</th>
              <th className="px-3 py-2 text-left">Type</th>
              <th className="px-3 py-2 text-left">Department</th>
              <th className="px-3 py-2 text-left">Criticality</th>
              <th className="px-3 py-2 text-left">Condition</th>
              <th className="px-3 py-2 text-left">Availability</th>
              <th className="px-3 py-2 text-left">Open defects</th>
              <th className="px-3 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={9} className="text-center py-8 text-grey-600">Loading...</td></tr>
            ) : filtered.slice(0, 30).map((a, i) => (
              <tr key={a.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-grey-50'} hover:bg-info-100 cursor-pointer`}
                  style={{ height: '40px' }} onClick={() => setSelected(a)}>
                <td className="px-3 py-2 font-medium text-blue-600">{a.id}</td>
                <td className="px-3 py-2">{a.name}</td>
                <td className="px-3 py-2 text-[12px]">{a.type}</td>
                <td className="px-3 py-2">{a.department}</td>
                <td className="px-3 py-2"><StatusBadge status={a.criticality} /></td>
                <td className="px-3 py-2">{a.condition}</td>
                <td className="px-3 py-2 font-bold" style={{ fontVariantNumeric: 'tabular-nums' }}>{a.availability}</td>
                <td className="px-3 py-2 font-bold" style={{ fontVariantNumeric: 'tabular-nums' }}>{a.open_defects}</td>
                <td className="px-3 py-2 text-center"><button className="text-blue-600 hover:text-navy-900"><Eye size={16} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setSelected(null)}>
          <div className="bg-white w-full max-w-lg border border-grey-300" onClick={e => e.stopPropagation()}>
            <div className="bg-navy-900 text-white px-4 py-3 flex justify-between items-center">
              <span className="font-semibold">Asset — {selected.id}</span>
              <button onClick={() => setSelected(null)} className="text-white hover:text-grey-300">&times;</button>
            </div>
            <div className="p-4 space-y-2 text-[13px]">
              <DR l="Name" v={selected.name} /><DR l="Type" v={selected.type} /><DR l="Department" v={selected.department} />
              <DR l="Corridor" v={selected.corridor} /><DR l="Location" v={selected.location} /><DR l="Criticality" v={selected.criticality} />
              <DR l="Condition" v={selected.condition} /><DR l="Last maintenance" v={selected.last_maintenance} />
              <DR l="Next maintenance" v={selected.next_maintenance} /><DR l="Availability" v={selected.availability} />
              <DR l="Open defects" v={String(selected.open_defects)} />
            </div>
          </div>
        </div>
      )}
      <ProtoLabel />
    </div>
  );
}

function DR({ l, v }: { l: string; v: string }) {
  return <div className="flex"><span className="w-32 text-grey-600 font-medium flex-shrink-0">{l}</span><span>{v}</span></div>;
}
