import { PageHeader, ProtoLabel, KPICard } from './Dashboard';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, Clock, Activity, AlertTriangle, Download, FileText } from 'lucide-react';

export default function Reports() {
  const { user } = useAuth();

  const handleExportCSV = () => {
    const csvContent = `Metric,Baseline (Manual),Optimized Plan,Variance
Blocks Used,18,12,-6
Total Block Hours,54h,38h,-16h
Critical Tasks Completed,5/8,8/8,+3
Train Conflicts,4,1,-3
Coordinated Work,2,7,+5
Track Utilization,62%,89%,+27%`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `RailNexus_KPI_Report_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportSummary = () => {
    const summaryText = `==================================================
RAILNEXUS — OPTIMIZED BLOCK PLAN EXECUTIVE REPORT
Generated on: ${new Date().toLocaleString()}
Division: NDLS / Northern Railway (Synthetic Demo Data)
==================================================

1. EXECUTIVE SUMMARY
Optimized schedule achieved 89% track utilization and reduced train conflicts from 4 to 1 while ensuring 100% critical task completion.

2. METRIC COMPARISON
- Total Maintenance Blocks: Baseline 18 -> Optimized 12 (-33.3%)
- Block Window Duration: Baseline 54h -> Optimized 38h (-29.6%)
- Critical Maintenance Completion: Baseline 5/8 -> Optimized 8/8 (+37.5%)
- Spatial-Temporal Co-locations: Baseline 2 -> Optimized 7 (+250%)

3. PROTOTYPE SIMULATION NOTICE
All figures are produced via synthetic scheduling optimization algorithms for SIH 2026 evaluation.
==================================================`;

    const blob = new Blob([summaryText], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `RailNexus_Executive_Summary_${new Date().toISOString().slice(0,10)}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <PageHeader title="Reports / KPIs" subtitle="Baseline vs optimized plan comparison" role={user?.department || ''} />
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 bg-white border border-grey-300 text-navy-900 text-[12px] font-bold px-3 py-1.5 hover:bg-grey-100 transition-colors"
          >
            <Download size={14} /> Export CSV
          </button>
          <button
            onClick={handleExportSummary}
            className="flex items-center gap-1.5 bg-navy-900 text-white text-[12px] font-bold px-3 py-1.5 hover:bg-navy-800 transition-colors"
          >
            <FileText size={14} /> Download Summary Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <KPICard label="Blocks used" value={12} icon={Clock} />
        <KPICard label="Total block hours" value={38} icon={Activity} />
        <KPICard label="Critical completed" value={8} color="text-success-700" icon={CheckCircle} />
        <KPICard label="Train conflicts" value={1} color="text-critical-700" icon={AlertTriangle} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-grey-300 p-4">
          <p className="text-[12px] font-semibold text-grey-600 uppercase mb-3">Baseline (manual)</p>
          <div className="space-y-2 text-[13px]">
            <CRow l="Blocks" v="18" /><CRow l="Block hours" v="54h" /><CRow l="Critical tasks" v="5/8" />
            <CRow l="Conflicts" v="4" /><CRow l="Coordinated" v="2" /><CRow l="Utilization" v="62%" />
          </div>
        </div>
        <div className="bg-white border border-blue-600 p-4">
          <p className="text-[12px] font-semibold text-blue-600 uppercase mb-3">Optimized plan</p>
          <div className="space-y-2 text-[13px]">
            <CRow l="Blocks" v="12" d="-6" /><CRow l="Block hours" v="38h" d="-16h" />
            <CRow l="Critical tasks" v="8/8" d="+3" /><CRow l="Conflicts" v="1" d="-3" />
            <CRow l="Coordinated" v="7" d="+5" /><CRow l="Utilization" v="89%" d="+27%" />
          </div>
        </div>
      </div>

      <p className="text-[11px] text-warning-700 bg-warning-100 border border-warning-700 px-3 py-2 text-center font-semibold">
        Prototype Simulation — All metrics are generated from synthetic demo data
      </p>
      <ProtoLabel />
    </div>
  );
}

function CRow({ l, v, d }: { l: string; v: string; d?: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-grey-600">{l}</span>
      <div className="flex items-center gap-2">
        <span className="font-bold" style={{ fontVariantNumeric: 'tabular-nums' }}>{v}</span>
        {d && <span className={`text-[11px] font-bold ${d.startsWith('-') || d.startsWith('+') ? (d.includes('-') && l !== 'Blocks' && l !== 'Block hours' && l !== 'Conflicts' ? 'text-critical-700' : 'text-success-700') : 'text-success-700'}`}>{d}</span>}
      </div>
    </div>
  );
}
