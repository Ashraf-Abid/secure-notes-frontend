import { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api, getErrorMessage } from '../../api/client';
import { Alert } from '../../components/Alert';
import { useAuth } from '../../context/AuthContext';
import { ApiResponse, Role, User } from '../../types';

export function UserFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, refreshUser } = useAuth();
  const isSelf = Boolean(id) && id === currentUser?._id;

  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'USER' as Role, interests: '' });
  const [loading, setLoading] = useState(Boolean(id));
  const [loadFailed, setLoadFailed] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    let ignore = false;
    api
      .get<ApiResponse<User>>(`/users/${id}`)
      .then((res) => {
        if (ignore) return;
        const user = res.data.data;
        setForm({ name: user.name, email: user.email, password: '', role: user.role, interests: user.interests.join(', ') });
        setLoading(false);
      })
      .catch((err) => {
        if (ignore) return;
        setError(getErrorMessage(err));
        setLoadFailed(true);
        setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [id]);

  function update(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const body: Record<string, unknown> = {
      name: form.name,
      email: form.email,
      interests: form.interests
        .split(',')
        .map((i) => i.trim())
        .filter(Boolean),
    };
    if (!isSelf) body.role = form.role;
    if (form.password) body.password = form.password;

    try {
      if (id) {
        await api.patch(`/users/${id}`, body);
        if (isSelf) await refreshUser();
      } else {
        await api.post('/users', body);
      }
      navigate('/admin/users', { state: { message: id ? 'User updated' : 'User created' } });
    } catch (err) {
      setError(getErrorMessage(err));
      setSubmitting(false);
    }
  }

  if (loading) return <p className="text-gray-500">Loading...</p>;

  return (
    <div className="max-w-xl">
      <h1 className="mb-4 text-xl font-semibold">{id ? 'Edit user' : 'New user'}</h1>
      {error && <Alert type="error">{error}</Alert>}

      {loadFailed ? (
        <Link to="/admin/users" className="btn-secondary">
          Back to users
        </Link>
      ) : (
        <form onSubmit={handleSubmit} className="card space-y-4">
          <div>
            <label htmlFor="name" className="label">
              Name
            </label>
            <input id="name" className="input" value={form.name} onChange={(e) => update('name', e.target.value)} required />
          </div>
          <div>
            <label htmlFor="email" className="label">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="input"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="label">
              {id ? 'New password' : 'Password'}
            </label>
            <input
              id="password"
              type="password"
              className="input"
              value={form.password}
              onChange={(e) => update('password', e.target.value)}
              minLength={8}
              required={!id}
            />
            {id && <p className="mt-1 text-xs text-gray-500">Leave empty to keep the current password</p>}
          </div>
          <div>
            <label htmlFor="role" className="label">
              Role
            </label>
            <select
              id="role"
              className="input"
              value={form.role}
              onChange={(e) => update('role', e.target.value)}
              disabled={isSelf}
            >
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
            {isSelf && <p className="mt-1 text-xs text-gray-500">You cannot change your own role</p>}
          </div>
          <div>
            <label htmlFor="interests" className="label">
              Interests
            </label>
            <input
              id="interests"
              className="input"
              placeholder="chess, reading"
              value={form.interests}
              onChange={(e) => update('interests', e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : id ? 'Save changes' : 'Create user'}
            </button>
            <Link to="/admin/users" className="btn-secondary">
              Cancel
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
