import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { PageHeader, ProtoLabel } from './Dashboard';
import { useAuth } from '../context/AuthContext';

interface TrainItem {
  id: string; number: string; name: string; type: string;
  corridor: string; departure: string; arrival: string; priority: string;
}

export default function Trains() {
  const { user } = useAuth();
  const [trains, setTrains] = useState<TrainItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getTrains().then(d => { setTrains(Array.isArray(d) ? d : []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const priorityColor: Record<string, string> = { HIGH: 'text-critical-700', MEDIUM: 'text-warning-700', LOW: 'text-grey-600' };

  return (
    <div className="space-y-4">
      <PageHeader title="Train schedule" subtitle="Corridor train movements and priorities" role={user?.department || ''} />
      <div className="bg-white border border-grey-300 overflow-auto">
        <table className="w-full text-[13px]">
          <thead className="sticky top-0">
            <tr className="bg-navy-900 text-white text-[12px] font-semibold">
              <th className="px-3 py-2 text-left">Train #</th>
              <th className="px-3 py-2 text-left">Name</th>
              <th className="px-3 py-2 text-left">Type</th>
              <th className="px-3 py-2 text-left">Corridor</th>
              <th className="px-3 py-2 text-left">Departure</th>
              <th className="px-3 py-2 text-left">Arrival</th>
              <th className="px-3 py-2 text-left">Priority</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="text-center py-8 text-grey-600">Loading...</td></tr>
            ) : trains.map((t, i) => (
              <tr key={t.id} className={i % 2 === 0 ? 'bg-white' : 'bg-grey-50'} style={{ height: '40px' }}>
                <td className="px-3 py-2 font-medium">{t.number}</td>
                <td className="px-3 py-2">{t.name}</td>
                <td className="px-3 py-2 text-[12px]">{t.type}</td>
                <td className="px-3 py-2 text-[12px]">{t.corridor.split(' ')[0]}</td>
                <td className="px-3 py-2 font-mono">{t.departure}</td>
                <td className="px-3 py-2 font-mono">{t.arrival}</td>
                <td className={`px-3 py-2 font-semibold ${priorityColor[t.priority] || ''}`}>{t.priority}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ProtoLabel />
    </div>
  );
}
