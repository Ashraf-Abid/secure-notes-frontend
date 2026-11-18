import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api, getErrorMessage } from '../../api/client';
import { Alert } from '../../components/Alert';
import { PaginationControls } from '../../components/PaginationControls';
import { useUserOptions } from '../../hooks/useUserOptions';
import { AdminNote, PaginatedResponse, Pagination } from '../../types';

const PAGE_SIZE = 10;

export function AdminNotesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const userId = searchParams.get('userId') ?? '';
  const users = useUserOptions();

  const [notes, setNotes] = useState<AdminNote[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError('');
    api
      .get<PaginatedResponse<AdminNote>>('/admin/notes', {
        params: { page, limit: PAGE_SIZE, userId: userId || undefined },
      })
      .then((res) => {
        if (ignore) return;
        setNotes(res.data.data);
        setPagination(res.data.pagination);
      })
      .catch((err) => !ignore && setError(getErrorMessage(err)))
      .finally(() => !ignore && setLoading(false));
    return () => {
      ignore = true;
    };
  }, [page, userId]);

  function changePage(p: number) {
    setSearchParams(userId ? { userId, page: String(p) } : { page: String(p) });
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold">All notes</h1>
        <div className="flex items-center gap-2 text-sm">
          <label htmlFor="userFilter" className="text-gray-600">
            User
          </label>
          <select
            id="userFilter"
            className="input w-56"
            value={userId}
            onChange={(e) => setSearchParams(e.target.value ? { userId: e.target.value } : {})}
          >
            <option value="">All users</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>
                {u.name} ({u.email})
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && <Alert type="error">{error}</Alert>}

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : notes.length === 0 ? (
        <p className="text-gray-500">No notes found.</p>
      ) : (
        <ul className="space-y-3">
          {notes.map((note) => (
            <li key={note._id} className="card">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="font-medium">{note.title}</h2>
                <span className="text-xs text-gray-500">
                  {note.user.name} · {note.user.email}
                </span>
              </div>
              <p className="mt-1 line-clamp-3 whitespace-pre-wrap text-sm text-gray-700">{note.content}</p>
              <p className="mt-2 text-xs text-gray-500">Updated {new Date(note.updatedAt).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}

      {pagination && !loading && <PaginationControls pagination={pagination} onPageChange={changePage} />}
    </div>
  );
}
