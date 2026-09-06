import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { PageHeader, ProtoLabel } from './Dashboard';
import { useAuth } from '../context/AuthContext';
import { AlertTriangle, Activity, CheckCircle, Info } from 'lucide-react';

interface Notif { id: string; title: string; message: string; type: string; timestamp: string; read: boolean; }

export default function Notifications() {
  const { user } = useAuth();
  const [notifs, setNotifs] = useState<Notif[]>([]);

  useEffect(() => {
    api.getNotifications().then(d => setNotifs(Array.isArray(d) ? d : [])).catch(() => {});
  }, []);

  const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
    CRITICAL: AlertTriangle, WARNING: Activity, INFO: CheckCircle,
  };
  const colorMap: Record<string, string> = {
    CRITICAL: 'text-critical-700 bg-critical-100 border-critical-700',
    WARNING: 'text-warning-700 bg-warning-100 border-warning-700',
    INFO: 'text-info-700 bg-info-100 border-info-700',
  };

  return (
    <div className="space-y-4">
      <PageHeader title="Notifications" subtitle="System alerts and updates" role={user?.department || ''} />
      <div className="space-y-2">
        {notifs.map(n => {
          const Icon = iconMap[n.type] || Info;
          const colors = colorMap[n.type] || colorMap.INFO;
          return (
            <div key={n.id} className={`flex items-start gap-3 p-4 border ${colors} ${n.read ? 'opacity-70' : ''}`}>
              <Icon size={18} className="mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-[13px] font-semibold">{n.title}</p>
                <p className="text-[12px] mt-0.5">{n.message}</p>
              </div>
              <span className="text-[11px] whitespace-nowrap">{n.timestamp}</span>
            </div>
          );
        })}
        {notifs.length === 0 && <p className="text-[13px] text-grey-600 text-center py-8">No notifications</p>}
      </div>
      <ProtoLabel />
    </div>
  );
}
