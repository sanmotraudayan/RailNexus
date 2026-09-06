import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { StatusBadge, PageHeader, ProtoLabel } from './Dashboard';
import { useAuth } from '../context/AuthContext';

interface Block {
  id: string; corridor: string; section: string; date: string;
  start: string; end: string; duration: number; availability: string;
}

export default function Blocks() {
  const { user } = useAuth();
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getBlocks().then(d => { setBlocks(Array.isArray(d) ? d : []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-4">
      <PageHeader title="Block availability" subtitle="View and manage corridor block windows" role={user?.department || ''} />
      <div className="bg-white border border-grey-300 overflow-auto">
        <table className="w-full text-[13px]">
          <thead className="sticky top-0">
            <tr className="bg-navy-900 text-white text-[12px] font-semibold">
              <th className="px-3 py-2 text-left">Block ID</th>
              <th className="px-3 py-2 text-left">Corridor</th>
              <th className="px-3 py-2 text-left">Section</th>
              <th className="px-3 py-2 text-left">Date</th>
              <th className="px-3 py-2 text-left">Start</th>
              <th className="px-3 py-2 text-left">End</th>
              <th className="px-3 py-2 text-left">Duration</th>
              <th className="px-3 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className="text-center py-8 text-grey-600">Loading...</td></tr>
            ) : blocks.map((b, i) => (
              <tr key={b.id} className={i % 2 === 0 ? 'bg-white' : 'bg-grey-50'} style={{ height: '40px' }}>
                <td className="px-3 py-2 font-medium">{b.id}</td>
                <td className="px-3 py-2">{b.corridor.split(' ')[0]}</td>
                <td className="px-3 py-2 text-[12px]">{b.section}</td>
                <td className="px-3 py-2">{b.date}</td>
                <td className="px-3 py-2 font-mono">{b.start}</td>
                <td className="px-3 py-2 font-mono">{b.end}</td>
                <td className="px-3 py-2" style={{ fontVariantNumeric: 'tabular-nums' }}>{b.duration}h</td>
                <td className="px-3 py-2"><StatusBadge status={b.availability} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ProtoLabel />
    </div>
  );
}
