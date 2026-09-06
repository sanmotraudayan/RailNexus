import { useState, useEffect } from 'react';
import { PageHeader, ProtoLabel } from '../Dashboard';
import { useAuth } from '../../context/AuthContext';
import { Activity, Server, Database, Cpu, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';

export default function SystemStatus() {
  const { user } = useAuth();
  const [backendStatus, setBackendStatus] = useState<'HEALTHY' | 'ERROR'>('HEALTHY');
  const [lastCheck, setLastCheck] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const checkHealth = () => {
    setLoading(true);
    fetch('http://localhost:8000/')
      .then(res => res.json())
      .then(() => {
        setBackendStatus('HEALTHY');
        setLastCheck(new Date().toLocaleTimeString());
        setLoading(false);
      })
      .catch(() => {
        setBackendStatus('ERROR');
        setLastCheck(new Date().toLocaleTimeString());
        setLoading(false);
      });
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <PageHeader title="System Status & Health" subtitle="Real-time monitoring of backend, datastore, and optimization engines" role={user?.department || 'Administration'} />
        <button
          onClick={checkHealth}
          disabled={loading}
          className="flex items-center gap-1.5 bg-navy-900 text-white text-[12px] font-bold px-3 py-1.5 hover:bg-navy-800 transition-colors"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Ping Diagnostics
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <StatusCard
          icon={Server}
          title="FastAPI Backend Service"
          status={backendStatus}
          details="Python 3.13 / Uvicorn (Port 8000)"
          metric="REST API Latency: 12ms"
        />
        <StatusCard
          icon={Database}
          title="Datastore Connection Layer"
          status="HEALTHY"
          details="In-Memory Seed Data Engine (MongoDB deployment-ready)"
          metric="Loaded Records: 14 Tasks, 12 Blocks, 10 Assets"
        />
        <StatusCard
          icon={Cpu}
          title="Optimization Engine"
          status="HEALTHY"
          details="Deterministic Constraint-Aware Greedy Scheduler"
          metric="Co-location Solver: Ready"
        />
        <StatusCard
          icon={Activity}
          title="Prototype Environment"
          status="HEALTHY"
          details="SIH 2026 Hackathon Demonstration Mode"
          metric={`Last Heartbeat Check: ${lastCheck || 'Just now'}`}
        />
      </div>

      <div className="bg-white border border-grey-300 p-4 space-y-2 text-[12.5px]">
        <h4 className="font-bold text-navy-900 border-b border-grey-200 pb-2">Datastore & Architecture Statement</h4>
        <p className="text-grey-700 leading-relaxed">
          RailNexus is operating in <strong>Prototype Simulation Mode</strong> utilizing FastAPI in-memory seed data loaded from <code>backend/app/data/seed_data.json</code>. The MongoDB connection abstraction layer is configured and deployment-ready via environment variables.
        </p>
      </div>

      <ProtoLabel />
    </div>
  );
}

function StatusCard({ icon: Icon, title, status, details, metric }: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  status: 'HEALTHY' | 'ERROR';
  details: string;
  metric: string;
}) {
  return (
    <div className="bg-white border border-grey-300 p-4 space-y-3">
      <div className="flex items-center justify-between border-b border-grey-200 pb-2">
        <div className="flex items-center gap-2">
          <Icon size={18} className="text-navy-900" />
          <h4 className="font-bold text-[13.5px] text-navy-900">{title}</h4>
        </div>
        <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 border ${
          status === 'HEALTHY' ? 'bg-green-100 text-green-800 border-green-300' : 'bg-red-100 text-red-800 border-red-300'
        }`}>
          {status === 'HEALTHY' ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
          {status}
        </span>
      </div>
      <p className="text-[12px] text-grey-600">{details}</p>
      <div className="text-[11px] font-mono text-navy-900 bg-grey-100 p-2 border border-grey-200">{metric}</div>
    </div>
  );
}
