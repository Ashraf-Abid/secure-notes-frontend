import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { getErrorMessage } from '../api/client';
import { Alert } from '../components/Alert';
import { AuthCard } from '../components/AuthCard';
import { useAuth } from '../context/AuthContext';

export function RegisterPage() {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', interests: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function update(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
        interests: form.interests
          .split(',')
          .map((i) => i.trim())
          .filter(Boolean),
      });
    } catch (err) {
      setError(getErrorMessage(err));
      setSubmitting(false);
    }
  }

  return (
    <AuthCard title="Create an account">
      {error && <Alert type="error">{error}</Alert>}
      <form onSubmit={handleSubmit} className="space-y-4">
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
            Password
          </label>
          <input
            id="password"
            type="password"
            className="input"
            value={form.password}
            onChange={(e) => update('password', e.target.value)}
            minLength={8}
            required
          />
          <p className="mt-1 text-xs text-gray-500">At least 8 characters</p>
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
          <p className="mt-1 text-xs text-gray-500">Optional, separated by commas</p>
        </div>
        <button type="submit" className="btn-primary w-full" disabled={submitting}>
          {submitting ? 'Creating account...' : 'Register'}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-600">
        Already registered?{' '}
        <Link to="/login" className="text-blue-600 hover:underline">
          Log in
        </Link>
      </p>
    </AuthCard>
  );
}
