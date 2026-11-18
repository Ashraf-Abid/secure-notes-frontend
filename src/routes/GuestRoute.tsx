import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function GuestRoute() {
  const { user, loading } = useAuth();

  if (loading) return <p className="p-6 text-gray-500">Loading...</p>;
  if (user) return <Navigate to="/" replace />;

  return <Outlet />;
}
