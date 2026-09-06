import { Outlet, Navigate } from 'react-router-dom';
import UtilityBar from './UtilityBar';
import BrandingBar from './BrandingBar';
import IdentityStripe from './IdentityStripe';
import Footer from './Footer';
import RoleBasedSidebar from './RoleBasedSidebar';
import { useAuth } from '../../context/AuthContext';

export default function MainLayout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-grey-50">
      <UtilityBar />
      <BrandingBar />
      <IdentityStripe />
      
      <div className="flex flex-1 overflow-hidden">
        <RoleBasedSidebar />
        
        <main id="main-content" className="flex-1 overflow-auto">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
}
