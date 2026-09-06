import { ArrowRight, Box, Wrench, Calendar, Train, ShieldCheck, AlertTriangle } from 'lucide-react';

interface RelationshipGraphProps {
  assetId?: string;
  assetName?: string;
  taskTitle?: string;
  department?: string;
  blockId?: string;
  corridor?: string;
  priorityLevel?: string;
  isCollocated?: boolean;
  hasConflict?: boolean;
}

export default function RelationshipGraph({
  assetId = 'AST-TRK-102',
  assetName = 'Switch Expansion Joint',
  taskTitle = 'Deep Screening of Track',
  department = 'Engineering',
  blockId = 'BLK-003',
  corridor = 'NDLS-CNB',
  priorityLevel = 'CRITICAL',
  isCollocated = true,
  hasConflict = false,
}: RelationshipGraphProps) {
  return (
    <div className="bg-white border border-grey-300 p-4 space-y-3">
      <div className="flex items-center justify-between border-b border-grey-200 pb-2">
        <h4 className="font-bold text-[13px] text-navy-900 flex items-center gap-2">
          <Box size={16} className="text-navy-700" />
          Entity Dependency & Operational Relationship Map (Read-Only)
        </h4>
        <span className="text-[11px] font-mono px-2 py-0.5 bg-grey-100 border border-grey-300 font-semibold text-grey-700">
          Visual Relationship Inspector
        </span>
      </div>

      <div className="flex items-center justify-between gap-2 overflow-x-auto py-2 text-[12px]">
        {/* Node 1: Asset */}
        <div className="min-w-[130px] p-2.5 bg-grey-50 border border-grey-300 rounded-none space-y-1">
          <span className="text-[10px] font-bold text-grey-600 uppercase block">Asset</span>
          <p className="font-mono font-bold text-navy-900">{assetId}</p>
          <p className="text-[11px] text-grey-700 truncate max-w-[120px]">{assetName}</p>
        </div>

        <ArrowRight size={16} className="text-grey-400 shrink-0" />

        {/* Node 2: Maintenance Task */}
        <div className="min-w-[140px] p-2.5 bg-grey-50 border border-navy-300 rounded-none space-y-1">
          <span className="text-[10px] font-bold text-blue-700 uppercase block">Maintenance Task</span>
          <p className="font-bold text-navy-900 truncate max-w-[130px]">{taskTitle}</p>
          <span className={`inline-block text-[10px] font-bold px-1.5 py-0.2 border ${
            priorityLevel === 'CRITICAL' ? 'bg-critical-100 text-critical-700 border-critical-300' : 'bg-warning-100 text-warning-700 border-warning-300'
          }`}>
            {priorityLevel}
          </span>
        </div>

        <ArrowRight size={16} className="text-grey-400 shrink-0" />

        {/* Node 3: Department */}
        <div className="min-w-[120px] p-2.5 bg-grey-50 border border-grey-300 rounded-none space-y-1">
          <span className="text-[10px] font-bold text-grey-600 uppercase block">Department</span>
          <p className="font-bold text-navy-900 flex items-center gap-1">
            <Wrench size={13} className="text-navy-700" /> {department}
          </p>
          <span className="text-[10px] text-grey-600">Owning Unit</span>
        </div>

        <ArrowRight size={16} className="text-grey-400 shrink-0" />

        {/* Node 4: Block Window */}
        <div className="min-w-[130px] p-2.5 bg-grey-50 border border-grey-300 rounded-none space-y-1">
          <span className="text-[10px] font-bold text-grey-600 uppercase block">Block Window</span>
          <p className="font-mono font-bold text-navy-900 flex items-center gap-1">
            <Calendar size={13} className="text-navy-700" /> {blockId}
          </p>
          {isCollocated && (
            <span className="inline-block text-[10px] font-bold px-1.5 py-0.2 bg-purple-100 text-purple-800 border border-purple-300">
              Multi-Dept Co-located
            </span>
          )}
        </div>

        <ArrowRight size={16} className="text-grey-400 shrink-0" />

        {/* Node 5: Corridor / Train Impact */}
        <div className={`min-w-[130px] p-2.5 border rounded-none space-y-1 ${
          hasConflict ? 'bg-critical-100 border-critical-300' : 'bg-grey-50 border-grey-300'
        }`}>
          <span className="text-[10px] font-bold text-grey-600 uppercase block">Corridor / Train</span>
          <p className="font-bold text-navy-900 flex items-center gap-1">
            <Train size={13} className="text-navy-700" /> {corridor}
          </p>
          {hasConflict ? (
            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-critical-700">
              <AlertTriangle size={11} /> Train Conflict Detected
            </span>
          ) : (
            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-success-700">
              <ShieldCheck size={11} /> Conflict-Free Window
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
