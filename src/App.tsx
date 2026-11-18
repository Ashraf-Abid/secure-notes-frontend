import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { AuthProvider } from './context/AuthContext';
import { AdminNotesPage } from './pages/admin/AdminNotesPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AggregationsPage } from './pages/admin/AggregationsPage';
import { UserFormPage } from './pages/admin/UserFormPage';
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';
import { NoteFormPage } from './pages/NoteFormPage';
import { NotesPage } from './pages/NotesPage';
import { RegisterPage } from './pages/RegisterPage';
import { GuestRoute } from './routes/GuestRoute';
import { ProtectedRoute } from './routes/ProtectedRoute';

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
                <Route path="/admin/users" element={<AdminUsersPage />} />
                <Route path="/admin/users/new" element={<UserFormPage />} />
                <Route path="/admin/users/:id/edit" element={<UserFormPage />} />
                <Route path="/admin/notes" element={<AdminNotesPage />} />
                <Route path="/admin/aggregations" element={<AggregationsPage />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
