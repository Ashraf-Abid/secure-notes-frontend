import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const linkClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? 'font-semibold text-blue-600' : 'text-gray-600 hover:text-gray-900';

export function Layout() {
  const { user, logout } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  return (
    <>
      <header className="border-b border-gray-200 bg-white">
        <nav className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-5 gap-y-2 px-4 py-3 text-sm">
          <span className="font-bold">Secure Notes</span>
          <NavLink to="/" end className={linkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/notes" className={linkClass}>
            My notes
          </NavLink>
          {isAdmin && (
            <>
              <NavLink to="/admin/users" className={linkClass}>
                Users
              </NavLink>
              <NavLink to="/admin/notes" className={linkClass}>
                All notes
              </NavLink>
              <NavLink to="/admin/aggregations" className={linkClass}>
                Aggregations
              </NavLink>
            </>
          )}
          <div className="ml-auto flex items-center gap-3">
            <span className="text-gray-700">
              {user?.name}
              {isAdmin && <span className="ml-2 rounded bg-purple-100 px-2 py-0.5 text-xs text-purple-700">ADMIN</span>}
            </span>
            <button onClick={logout} className="btn-secondary py-1">
              Logout
            </button>
          </div>
        </nav>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6">
        <Outlet />
      </main>
    </>
  );
}
