import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { getSidebarItems } from '../../config/roles';
import {
  LayoutDashboard, Wrench, Database, Calendar, Train,
  BarChart3, Cpu, ClipboardList, GitBranch, CheckSquare,
  FileText, Bell, Shield, HelpCircle, Settings, Users,
  UserCog, Building, Activity, ListChecks,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ComponentType<{ size?: number }>> = {
  LayoutDashboard, Wrench, Database, Calendar, Train,
  BarChart3, Cpu, ClipboardList, GitBranch, CheckSquare,
  FileText, Bell, Shield, HelpCircle, Settings, Users,
  UserCog, Building, Activity, ListChecks,
};

export default function RoleBasedSidebar() {
  const { user } = useAuth();
  const { t } = useLanguage();
  if (!user) return null;

  const items = getSidebarItems(user.role);

  return (
    <aside className="w-[240px] min-w-[240px] bg-white border-r border-grey-300 flex flex-col overflow-y-auto">
      <div className="px-4 py-3 border-b border-grey-300">
        <p className="text-[11px] text-grey-600 uppercase font-semibold tracking-wide">{t('Navigation') || 'Navigation'}</p>
      </div>
      <nav className="flex-1 py-1">
        {items.map(item => {
          const Icon = ICON_MAP[item.icon] || LayoutDashboard;
          return (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 text-[13px] transition-colors duration-150 ${
                  isActive
                    ? 'border-l-[3px] border-navy-900 bg-grey-100 font-semibold text-navy-900'
                    : 'border-l-[3px] border-transparent text-ink-900 hover:bg-grey-50'
                }`
              }
            >
              <Icon size={18} />
              <span>{t(item.label)}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
