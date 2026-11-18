import { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api, getErrorMessage } from '../api/client';
import { Alert } from '../components/Alert';
import { ApiResponse, Note } from '../types';

export function NoteFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(Boolean(id));
  const [loadFailed, setLoadFailed] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    api
      .get<ApiResponse<Note>>(`/notes/${id}`)
      .then((res) => {
        setTitle(res.data.data.title);
        setContent(res.data.data.content);
      })
      .catch((err) => {
        setError(getErrorMessage(err));
        setLoadFailed(true);
      })
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (id) {
        await api.patch(`/notes/${id}`, { title, content });
      } else {
        await api.post('/notes', { title, content });
      }
      navigate('/notes', { state: { message: id ? 'Note updated' : 'Note created' } });
    } catch (err) {
      setError(getErrorMessage(err));
      setSubmitting(false);
    }
  }

  if (loading) return <p className="text-gray-500">Loading...</p>;

  return (
    <div className="max-w-2xl">
      <h1 className="mb-4 text-xl font-semibold">{id ? 'Edit note' : 'New note'}</h1>
      {error && <Alert type="error">{error}</Alert>}

      {loadFailed ? (
        <Link to="/notes" className="btn-secondary">
          Back to notes
        </Link>
      ) : (
        <form onSubmit={handleSubmit} className="card space-y-4">
          <div>
            <label htmlFor="title" className="label">
              Title
            </label>
            <input
              id="title"
              className="input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={200}
              required
            />
          </div>
          <div>
            <label htmlFor="content" className="label">
              Content
            </label>
            <textarea
              id="content"
              className="input min-h-[200px]"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={10000}
              required
            />
          </div>
          <div className="flex gap-3">
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : id ? 'Save changes' : 'Create note'}
            </button>
            <Link to="/notes" className="btn-secondary">
              Cancel
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
