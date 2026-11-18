import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { api, getErrorMessage } from '../../api/client';
import { Alert } from '../../components/Alert';
import { PaginationControls } from '../../components/PaginationControls';
import { useAuth } from '../../context/AuthContext';
import { PaginatedResponse, Pagination, User } from '../../types';

const PAGE_SIZE = 10;

export function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;

  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState<string>((location.state as { message?: string } | null)?.message ?? '');

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get<PaginatedResponse<User>>('/users', { params: { page, limit: PAGE_SIZE } });
      setUsers(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  async function handleDelete(user: User) {
    if (!window.confirm(`Delete ${user.name}? Their notes and posts will be deleted too.`)) return;
    setMessage('');
    setError('');
    try {
      await api.delete(`/users/${user._id}`);
      setMessage('User deleted');
      if (users.length === 1 && page > 1) {
        setSearchParams({ page: String(page - 1) });
      } else {
        loadUsers();
      }
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Manage users</h1>
        <Link to="/admin/users/new" className="btn-primary">
          New user
        </Link>
      </div>

      {message && <Alert type="success">{message}</Alert>}
      {error && <Alert type="error">{error}</Alert>}

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <div className="card overflow-x-auto p-0">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-2 font-medium">Name</th>
                <th className="px-4 py-2 font-medium">Email</th>
                <th className="px-4 py-2 font-medium">Role</th>
                <th className="px-4 py-2 font-medium">Interests</th>
                <th className="px-4 py-2 font-medium">Joined</th>
                <th className="px-4 py-2" />
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const isSelf = user._id === currentUser?._id;
                return (
                  <tr key={user._id} className="border-b border-gray-100 last:border-0">
                    <td className="px-4 py-2">
                      {user.name}
                      {isSelf && <span className="ml-1 text-xs text-gray-500">(you)</span>}
                    </td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2">{user.role}</td>
                    <td className="px-4 py-2 text-gray-600">{user.interests.join(', ') || '-'}</td>
                    <td className="px-4 py-2 text-gray-600">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="whitespace-nowrap px-4 py-2 text-right">
                      <Link to={`/admin/notes?userId=${user._id}`} className="mr-3 text-blue-600 hover:underline">
                        Notes
                      </Link>
                      <Link to={`/admin/aggregations?userId=${user._id}`} className="mr-3 text-blue-600 hover:underline">
                        Posts
                      </Link>
                      <Link to={`/admin/users/${user._id}/edit`} className="mr-3 text-blue-600 hover:underline">
                        Edit
                      </Link>
                      {!isSelf && (
                        <button onClick={() => handleDelete(user)} className="text-red-600 hover:underline">
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {pagination && !loading && (
        <PaginationControls pagination={pagination} onPageChange={(p) => setSearchParams({ page: String(p) })} />
      )}
    </div>
  );
}
