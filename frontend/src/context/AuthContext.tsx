import { createContext, useContext, useState, type ReactNode } from 'react';
import { type RoleKey, ROLES } from '../config/roles';

interface AuthUser {
  id: string;
  name: string;
  role: RoleKey;
  department: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (role: RoleKey) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
});

const DEMO_USERS: Record<RoleKey, AuthUser> = {
  planner:     { id: 'usr-1', name: 'Rajesh Sharma', role: 'planner',     department: 'Operations' },
  engineering: { id: 'usr-2', name: 'Amit Kumar',    role: 'engineering', department: 'Engineering' },
  traction:    { id: 'usr-3', name: 'Suresh Verma',  role: 'traction',    department: 'Traction' },
  s_and_t:     { id: 'usr-4', name: 'Priya Patel',   role: 's_and_t',     department: 'S&T' },
  supervisor:  { id: 'usr-5', name: 'Vikram Singh',  role: 'supervisor',  department: 'Operations' },
  admin:       { id: 'usr-6', name: 'Admin System',  role: 'admin',       department: 'IT' },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const saved = sessionStorage.getItem('railnexus_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (role: RoleKey) => {
    const u = DEMO_USERS[role];
    setUser(u);
    sessionStorage.setItem('railnexus_user', JSON.stringify(u));
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('railnexus_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export { ROLES };
