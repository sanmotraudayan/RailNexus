import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { hasPermission, type RoleKey } from '../../config/roles';
import { ShieldAlert } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
  allowedRoles?: RoleKey[];
}

export default function ProtectedRoute({ children, requiredPermission, allowedRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <AccessRestricted />;
  }

  if (requiredPermission && !hasPermission(user.role, requiredPermission)) {
    return <AccessRestricted />;
  }

  return <>{children}</>;
}

function AccessRestricted() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <ShieldAlert size={48} className="text-critical-700 mb-4" />
      <h2 className="text-[20px] font-semibold text-navy-900 mb-2">ACCESS RESTRICTED</h2>
      <p className="text-grey-600 text-sm mb-6">This module is not available for your current role.</p>
      <a
        href="/dashboard"
        className="px-4 py-2 bg-navy-700 text-white text-sm font-medium hover:bg-navy-900 transition-colors"
      >
        Return to Home Dashboard
      </a>
    </div>
  );
}
