import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { AuthProvider } from './context/AuthContext';
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';
import { NoteFormPage } from './pages/NoteFormPage';
import { NotesPage } from './pages/NotesPage';
import { RegisterPage } from './pages/RegisterPage';
import { GuestRoute } from './routes/GuestRoute';
import { ProtectedRoute } from './routes/ProtectedRoute';

function Placeholder({ title }: { title: string }) {
  return <h1 className="text-xl font-semibold">{title}</h1>;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/notes" element={<NotesPage />} />
              <Route path="/notes/new" element={<NoteFormPage />} />
              <Route path="/notes/:id/edit" element={<NoteFormPage />} />

              <Route element={<ProtectedRoute adminOnly />}>
                <Route path="/admin/users" element={<Placeholder title="Manage users" />} />
                <Route path="/admin/users/new" element={<Placeholder title="Create user" />} />
                <Route path="/admin/users/:id/edit" element={<Placeholder title="Edit user" />} />
                <Route path="/admin/notes" element={<Placeholder title="All notes" />} />
                <Route path="/admin/aggregations" element={<Placeholder title="Aggregation results" />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
