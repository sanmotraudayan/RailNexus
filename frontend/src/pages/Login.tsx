import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { RoleKey } from '../config/roles';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [role, setRole] = useState<RoleKey>('planner');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      login(role);
      setMessage('Access configured successfully. Redirecting to your RailNexus Home Dashboard...');
      setTimeout(() => navigate('/dashboard'), 1200);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-grey-50 flex flex-col justify-center py-12 px-4">
      <div className="mx-auto w-full max-w-md flex flex-col items-center">
        <h2 className="text-center text-[24px] font-bold text-navy-900">RailNexus</h2>
        <p className="mt-1 text-center text-[13px] text-grey-600">Prototype Authentication Portal — Role-Based Access</p>
        <div className="mt-3 bg-warning-100 text-warning-700 text-[11px] font-bold px-3 py-1 border border-warning-700">
          Prototype Environment — SIH 2026 Demonstration
        </div>
      </div>

      <div className="mt-8 mx-auto w-full max-w-md">
        <div className="bg-white py-8 px-6 border border-grey-300">
          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label htmlFor="employeeId" className="block text-[13px] font-medium text-ink-900">
                Employee ID <span className="text-critical-700">*</span> <span className="sr-only">(required)</span>
              </label>
              <input id="employeeId" type="text" required defaultValue="EMP-1001"
                className="mt-1 block w-full px-3 py-2 border border-grey-300 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2" />
            </div>

            <div>
              <label htmlFor="password" className="block text-[13px] font-medium text-ink-900">
                Password <span className="text-critical-700">*</span> <span className="sr-only">(required)</span>
              </label>
              <input id="password" type="password" required defaultValue="password123"
                className="mt-1 block w-full px-3 py-2 border border-grey-300 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2" />
            </div>

            <div>
              <label htmlFor="role" className="block text-[13px] font-medium text-ink-900">
                Department / Role <span className="text-critical-700">*</span> <span className="sr-only">(required)</span>
              </label>
              <select id="role" value={role} onChange={(e) => setRole(e.target.value as RoleKey)}
                className="mt-1 block w-full px-3 py-2 border border-grey-300 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2">
                <option value="planner">Railway Planner / Operations Manager</option>
                <option value="engineering">Engineering</option>
                <option value="traction">Traction</option>
                <option value="s_and_t">S&T</option>
                <option value="supervisor">Maintenance Supervisor</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center text-[13px] text-ink-900">
                <input type="checkbox" className="mr-2 border-grey-300" /> Remember session
              </label>
              <button type="button" className="text-[13px] text-blue-600 hover:underline">Forgot Password?</button>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-2.5 bg-navy-700 text-white text-[13px] font-medium hover:bg-navy-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:opacity-50 transition-colors">
              {loading ? 'Authenticating...' : 'Sign in'}
            </button>
          </form>

          {message && (
            <div className="mt-4 p-3 bg-success-100 border border-success-700 text-success-700 text-[13px] flex items-center">
              <span className="mr-2">&#10003;</span> {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
