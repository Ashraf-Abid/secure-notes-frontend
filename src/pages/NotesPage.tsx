import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { api, getErrorMessage } from '../api/client';
import { Alert } from '../components/Alert';
import { PaginationControls } from '../components/PaginationControls';
import { Note, PaginatedResponse, Pagination } from '../types';

const PAGE_SIZE = 5;

export function NotesPage() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;

  const [notes, setNotes] = useState<Note[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState<string>((location.state as { message?: string } | null)?.message ?? '');

  const loadNotes = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get<PaginatedResponse<Note>>('/notes', { params: { page, limit: PAGE_SIZE } });
      setNotes(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  async function handleDelete(note: Note) {
    if (!window.confirm(`Delete "${note.title}"?`)) return;
    setMessage('');
    setError('');
    try {
      await api.delete(`/notes/${note._id}`);
      setMessage('Note deleted');
      if (notes.length === 1 && page > 1) {
        setSearchParams({ page: String(page - 1) });
      } else {
        loadNotes();
      }
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">My notes</h1>
        <Link to="/notes/new" className="btn-primary">
          New note
        </Link>
      </div>

      {message && <Alert type="success">{message}</Alert>}
      {error && <Alert type="error">{error}</Alert>}

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : notes.length === 0 ? (
        <p className="text-gray-500">{page > 1 ? 'No notes on this page.' : 'You have no notes yet.'}</p>
      ) : (
        <ul className="space-y-3">
          {notes.map((note) => (
            <li key={note._id} className="card">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="font-medium">{note.title}</h2>
                  <p className="mt-1 line-clamp-3 whitespace-pre-wrap text-sm text-gray-700">{note.content}</p>
                  <p className="mt-2 text-xs text-gray-500">Updated {new Date(note.updatedAt).toLocaleString()}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Link to={`/notes/${note._id}/edit`} className="btn-secondary py-1">
                    Edit
                  </Link>
                  <button onClick={() => handleDelete(note)} className="btn-danger py-1">
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {pagination && !loading && (
        <PaginationControls pagination={pagination} onPageChange={(p) => setSearchParams({ page: String(p) })} />
      )}
    </div>
  );
}
