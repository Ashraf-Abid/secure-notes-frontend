import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './routes/ProtectedRoute';

function Placeholder({ title }: { title: string }) {
  return <h1 className="p-6 text-xl font-semibold">{title}</h1>;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Placeholder title="Login" />} />
          <Route path="/register" element={<Placeholder title="Register" />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Placeholder title="Dashboard" />} />
            <Route path="/notes" element={<Placeholder title="My notes" />} />
            <Route path="/notes/new" element={<Placeholder title="Create note" />} />
            <Route path="/notes/:id/edit" element={<Placeholder title="Edit note" />} />
          </Route>

          <Route element={<ProtectedRoute adminOnly />}>
            <Route path="/admin/users" element={<Placeholder title="Manage users" />} />
            <Route path="/admin/users/new" element={<Placeholder title="Create user" />} />
            <Route path="/admin/users/:id/edit" element={<Placeholder title="Edit user" />} />
            <Route path="/admin/notes" element={<Placeholder title="All notes" />} />
            <Route path="/admin/aggregations" element={<Placeholder title="Aggregation results" />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
