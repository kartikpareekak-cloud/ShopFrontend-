import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  console.log('ProtectedRoute: Checking access', {
    user: user ? { email: user.email, role: user.role } : null,
    loading,
    requireAdmin,
    location: location.pathname
  });

  if (loading) {
    console.log('ProtectedRoute: Still loading...');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    console.log('ProtectedRoute: No user found, redirecting to login');
    const redirectTo = requireAdmin ? '/admin/login' : '/login';
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (requireAdmin && user.role !== 'admin') {
    console.log('ProtectedRoute: User is not admin, redirecting to admin login');
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  console.log('ProtectedRoute: Access granted');
  return <>{children}</>;
};

export default ProtectedRoute;
