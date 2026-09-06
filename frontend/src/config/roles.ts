// ── Role & Permission Configuration ──
// Single source of truth for all role-based access control.

export type RoleKey = 'planner' | 'engineering' | 'traction' | 's_and_t' | 'supervisor' | 'admin';

export interface RoleConfig {
  key: RoleKey;
  label: string;
  department: string;
  permissions: string[];
  sidebarItems: string[];
  dashboardWidgets: string[];
}

export const ROLES: Record<RoleKey, RoleConfig> = {
  planner: {
    key: 'planner',
    label: 'Railway Planner / Operations Manager',
    department: 'Operations',
    permissions: [
      'view_all_departments', 'compare_requests', 'run_priority', 'run_optimization',
      'generate_plans', 'review_conflicts', 'run_whatif', 'approve', 'modify', 'reject',
      'view_kpis', 'view_reports', 'view_audit', 'view_assets', 'view_blocks',
      'view_trains', 'view_maintenance', 'view_notifications',
    ],
    sidebarItems: [
      'dashboard', 'maintenance', 'assets', 'blocks', 'trains',
      'priority', 'optimization', 'plans', 'whatif', 'approvals',
      'reports', 'notifications', 'audit', 'help', 'settings',
    ],
    dashboardWidgets: [
      'asset_availability', 'active_blocks', 'conflicts', 'critical_tasks',
      'upcoming_blocks', 'priority_summary', 'pending_approvals',
      'optimization_status', 'whatif_alerts', 'recent_activity',
    ],
  },
  engineering: {
    key: 'engineering',
    label: 'Engineering',
    department: 'Engineering',
    permissions: [
      'view_maintenance', 'create_maintenance', 'edit_maintenance', 'view_assets',
      'view_priority', 'view_assigned_blocks', 'view_work_status', 'view_notifications',
    ],
    sidebarItems: [
      'dashboard', 'maintenance', 'assets', 'priority', 'assigned_blocks',
      'work_status', 'notifications', 'help',
    ],
    dashboardWidgets: [
      'open_defects', 'critical_tasks', 'track_availability',
      'assigned_work', 'upcoming_blocks', 'pending_requests', 'notifications',
    ],
  },
  traction: {
    key: 'traction',
    label: 'Traction',
    department: 'Traction',
    permissions: [
      'view_maintenance', 'create_maintenance', 'edit_maintenance', 'view_assets',
      'view_priority', 'view_assigned_blocks', 'view_work_status', 'view_notifications',
    ],
    sidebarItems: [
      'dashboard', 'maintenance', 'assets', 'priority', 'assigned_blocks',
      'work_status', 'notifications', 'help',
    ],
    dashboardWidgets: [
      'open_defects', 'critical_tasks', 'traction_availability',
      'assigned_work', 'upcoming_blocks', 'pending_requests', 'notifications',
    ],
  },
  s_and_t: {
    key: 's_and_t',
    label: 'S&T',
    department: 'S&T',
    permissions: [
      'view_maintenance', 'create_maintenance', 'edit_maintenance', 'view_assets',
      'view_priority', 'view_assigned_blocks', 'view_work_status', 'view_notifications',
    ],
    sidebarItems: [
      'dashboard', 'maintenance', 'assets', 'priority', 'assigned_blocks',
      'work_status', 'notifications', 'help',
    ],
    dashboardWidgets: [
      'open_defects', 'critical_tasks', 'st_availability',
      'assigned_work', 'upcoming_blocks', 'pending_requests', 'notifications',
    ],
  },
  supervisor: {
    key: 'supervisor',
    label: 'Maintenance Supervisor',
    department: 'Operations',
    permissions: [
      'view_assigned_tasks', 'start_work', 'pause_work', 'complete_work',
      'report_delay', 'report_issue', 'view_approved_plans', 'view_resources',
      'view_notifications',
    ],
    sidebarItems: [
      'dashboard', 'assigned_tasks', 'blocks', 'work_status',
      'resources', 'notifications', 'help',
    ],
    dashboardWidgets: [
      'todays_tasks', 'active_work', 'upcoming_blocks',
      'delayed_tasks', 'resources', 'completed_tasks', 'issues',
    ],
  },
  admin: {
    key: 'admin',
    label: 'Administrator',
    department: 'IT',
    permissions: [
      'manage_users', 'manage_roles', 'manage_departments', 'view_config',
      'view_audit', 'manage_notifications', 'view_system_status',
    ],
    sidebarItems: [
      'dashboard', 'users', 'roles', 'departments', 'audit',
      'settings', 'system_status', 'notifications', 'help',
    ],
    dashboardWidgets: [
      'total_users', 'active_users', 'departments',
      'system_status', 'configuration', 'audit_activity', 'notifications',
    ],
  },
};

export interface SidebarItem {
  id: string;
  label: string;
  icon: string;
  path: string;
}

export const ALL_SIDEBAR_ITEMS: Record<string, SidebarItem> = {
  dashboard:       { id: 'dashboard',       label: 'Dashboard',            icon: 'LayoutDashboard', path: '/dashboard' },
  maintenance:     { id: 'maintenance',     label: 'Maintenance Requests', icon: 'Wrench',          path: '/maintenance' },
  assets:          { id: 'assets',          label: 'Assets',               icon: 'Database',        path: '/assets' },
  blocks:          { id: 'blocks',          label: 'Block Availability',   icon: 'Calendar',        path: '/blocks' },
  trains:          { id: 'trains',          label: 'Train Schedule',       icon: 'Train',           path: '/trains' },
  priority:        { id: 'priority',        label: 'Priority Analysis',    icon: 'BarChart3',       path: '/priority' },
  optimization:    { id: 'optimization',    label: 'Optimization',         icon: 'Cpu',             path: '/optimization' },
  plans:           { id: 'plans',           label: 'Block Plans',          icon: 'ClipboardList',   path: '/plans' },
  whatif:          { id: 'whatif',          label: 'What-If Simulation',   icon: 'GitBranch',       path: '/whatif' },
  approvals:       { id: 'approvals',       label: 'Approvals',            icon: 'CheckSquare',     path: '/approvals' },
  reports:         { id: 'reports',         label: 'Reports / KPIs',       icon: 'FileText',        path: '/reports' },
  notifications:   { id: 'notifications',   label: 'Notifications',        icon: 'Bell',            path: '/notifications' },
  audit:           { id: 'audit',           label: 'Audit Trail',          icon: 'Shield',          path: '/audit' },
  help:            { id: 'help',            label: 'Help',                 icon: 'HelpCircle',      path: '/help' },
  settings:        { id: 'settings',        label: 'Settings',             icon: 'Settings',        path: '/settings' },
  assigned_blocks: { id: 'assigned_blocks', label: 'Assigned Blocks',      icon: 'Calendar',        path: '/assigned-blocks' },
  assigned_tasks:  { id: 'assigned_tasks',  label: 'Assigned Tasks',       icon: 'ListChecks',      path: '/assigned-tasks' },
  work_status:     { id: 'work_status',     label: 'Work Status',          icon: 'Activity',        path: '/work-status' },
  resources:       { id: 'resources',       label: 'Resources',            icon: 'Users',           path: '/resources' },
  users:           { id: 'users',           label: 'Users',                icon: 'Users',           path: '/users' },
  roles:           { id: 'roles',           label: 'Roles',                icon: 'UserCog',         path: '/roles' },
  departments:     { id: 'departments',     label: 'Departments',          icon: 'Building',        path: '/departments' },
  system_status:   { id: 'system_status',   label: 'System Status',        icon: 'Activity',        path: '/system-status' },
};

export function hasPermission(role: RoleKey, permission: string): boolean {
  return ROLES[role]?.permissions.includes(permission) ?? false;
}

export function getSidebarItems(role: RoleKey): SidebarItem[] {
  const config = ROLES[role];
  if (!config) return [];
  return config.sidebarItems
    .map(id => ALL_SIDEBAR_ITEMS[id])
    .filter(Boolean);
}
