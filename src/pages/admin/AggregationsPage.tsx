import { FormEvent, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api, getErrorMessage } from '../../api/client';
import { Alert } from '../../components/Alert';
import { PaginationControls } from '../../components/PaginationControls';
import { useUserOptions } from '../../hooks/useUserOptions';
import { ApiResponse, InterestGroup, PaginatedResponse, Pagination, UserPosts } from '../../types';

export function AggregationsPage() {
  return (
    <div className="space-y-10">
      <h1 className="text-xl font-semibold">Aggregation results</h1>
      <InterestGroups />
      <UserPostsLookup />
    </div>
  );
}

function InterestGroups() {
  const [input, setInput] = useState('');
  const [interest, setInterest] = useState('');
  const [page, setPage] = useState(1);
  const [groups, setGroups] = useState<InterestGroup[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError('');
    api
      .get<PaginatedResponse<InterestGroup>>('/admin/users/grouped-by-interests', {
        params: { page, limit: 6, interest: interest || undefined },
      })
      .then((res) => {
        if (ignore) return;
        setGroups(res.data.data);
        setPagination(res.data.pagination);
      })
      .catch((err) => !ignore && setError(getErrorMessage(err)))
      .finally(() => !ignore && setLoading(false));
    return () => {
      ignore = true;
    };
  }, [interest, page]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setInterest(input.trim());
    setPage(1);
  }

  function clearFilter() {
    setInput('');
    setInterest('');
    setPage(1);
  }

  return (
    <section>
      <h2 className="mb-3 font-semibold">Users grouped by interests</h2>
      <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
        <input
          id="interestFilter"
          className="input max-w-xs"
          placeholder="Filter by interest, e.g. chess"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" className="btn-primary">
          Filter
        </button>
        {interest && (
          <button type="button" className="btn-secondary" onClick={clearFilter}>
            Clear
          </button>
        )}
      </form>

      {error && <Alert type="error">{error}</Alert>}

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : groups.length === 0 ? (
        <p className="text-gray-500">No users found{interest && ` with interest "${interest}"`}.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <div key={group.interest} className="card">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-medium capitalize">{group.interest}</h3>
                <span className="rounded bg-blue-50 px-2 py-0.5 text-xs text-blue-700">
                  {group.count} {group.count === 1 ? 'user' : 'users'}
                </span>
              </div>
              <ul className="space-y-1 text-sm">
                {group.users.map((u) => (
                  <li key={u._id}>
                    {u.name} <span className="text-gray-500">· {u.email}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {pagination && !loading && <PaginationControls pagination={pagination} onPageChange={setPage} />}
    </section>
  );
}

function UserPostsLookup() {
  const [searchParams] = useSearchParams();
  const users = useUserOptions();
  const [userId, setUserId] = useState(searchParams.get('userId') ?? '');
  const [page, setPage] = useState(1);
  const [result, setResult] = useState<UserPosts | null>(null);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!userId) {
      setResult(null);
      return;
    }
    let ignore = false;
    setLoading(true);
    setError('');
    api
      .get<ApiResponse<UserPosts> & { pagination: Pagination }>(`/users/${userId}/posts`, { params: { page, limit: 5 } })
      .then((res) => {
        if (ignore) return;
        setResult(res.data.data);
        setPagination(res.data.pagination);
      })
      .catch((err) => {
        if (ignore) return;
        setResult(null);
        setError(getErrorMessage(err));
      })
      .finally(() => !ignore && setLoading(false));
    return () => {
      ignore = true;
    };
  }, [userId, page]);

  return (
    <section>
      <h2 className="mb-3 font-semibold">Posts of a user</h2>
      <select
        id="postsUser"
        className="input mb-4 max-w-xs"
        value={userId}
        onChange={(e) => {
          setUserId(e.target.value);
          setPage(1);
        }}
      >
        <option value="">Select a user</option>
        {users.map((u) => (
          <option key={u._id} value={u._id}>
            {u.name} ({u.email})
          </option>
        ))}
      </select>

      {error && <Alert type="error">{error}</Alert>}

      {!userId ? (
        <p className="text-gray-500">Select a user to see their posts.</p>
      ) : loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        result && (
          <div>
            <p className="mb-3 text-sm text-gray-600">
              Posts by <span className="font-medium text-gray-900">{result.user.name}</span>
            </p>
            {result.posts.length === 0 ? (
              <p className="text-gray-500">This user has no posts.</p>
            ) : (
              <ul className="space-y-3">
                {result.posts.map((post) => (
                  <li key={post._id} className="card">
                    <h3 className="font-medium">{post.title}</h3>
                    <p className="mt-1 whitespace-pre-wrap text-sm text-gray-700">{post.content}</p>
                    <p className="mt-2 text-xs text-gray-500">{new Date(post.createdAt).toLocaleString()}</p>
                  </li>
                ))}
              </ul>
            )}
            {pagination && <PaginationControls pagination={pagination} onPageChange={setPage} />}
          </div>
        )
      )}
    </section>
  );
}
