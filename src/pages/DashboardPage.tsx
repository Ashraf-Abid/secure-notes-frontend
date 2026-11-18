import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function DashboardPage() {
  const { user } = useAuth();
  if (!user) return null;

  const isAdmin = user.role === 'ADMIN';

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Welcome, {user.name}</h1>

      <div className="card space-y-2 text-sm">
        <p>
          <span className="text-gray-500">Email:</span> {user.email}
        </p>
        <p>
          <span className="text-gray-500">Role:</span> {user.role}
        </p>
        <p>
          <span className="text-gray-500">Interests:</span>{' '}
          {user.interests.length ? user.interests.join(', ') : 'None'}
        </p>
        <p>
          <span className="text-gray-500">Member since:</span> {new Date(user.createdAt).toLocaleDateString()}
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link to="/notes" className="btn-secondary">
          My notes
        </Link>
        <Link to="/notes/new" className="btn-primary">
          New note
        </Link>
      </div>

      {isAdmin && (
        <div>
          <h2 className="mb-3 font-semibold">Admin</h2>
          <div className="flex flex-wrap gap-3">
            <Link to="/admin/users" className="btn-secondary">
              Manage users
            </Link>
            <Link to="/admin/notes" className="btn-secondary">
              All notes
            </Link>
            <Link to="/admin/aggregations" className="btn-secondary">
              Aggregation results
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
