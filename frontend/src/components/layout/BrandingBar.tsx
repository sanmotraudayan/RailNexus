import { User, LogOut } from 'lucide-react';
import { useAuth, ROLES } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

export default function BrandingBar() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="bg-white h-[72px] flex items-center justify-between px-6 border-b border-grey-100">
      <div className="flex items-center space-x-3">
        <img src="/emblem.png" alt="Logo" className="h-16 object-contain mix-blend-multiply" />
      </div>
      
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-navy-900 font-bold text-[18px]">{t('RailNexus — Intelligent Block Planning')}</h1>
      </div>

      <div className="flex items-center space-x-3">
        {user ? (
          <>
            <div className="flex flex-col items-end">
              <span className="text-[13px] font-semibold text-navy-900">{user.name}</span>
              <span className="text-[11px] text-grey-600">{t(ROLES[user.role]?.label || '')}</span>
            </div>
            <div className="w-9 h-9 bg-grey-100 rounded-full flex items-center justify-center border border-grey-300 text-navy-700">
              <User size={18} />
            </div>
            <button
              onClick={handleLogout}
              className="ml-2 p-2 text-grey-600 hover:text-critical-700 transition-colors"
              title={t('Sign out')}
            >
              <LogOut size={18} />
            </button>
          </>
        ) : (
          <span className="text-sm text-grey-600">Not signed in</span>
        )}
      </div>
    </div>
  );
}
