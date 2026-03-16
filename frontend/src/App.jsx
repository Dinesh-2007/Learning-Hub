import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import Sidebar from './components/Sidebar';
import ChatBot from './components/ChatBot';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Schedule from './pages/Schedule';
import ScheduleCreate from './pages/ScheduleCreate';
import ResourceHub from './pages/ResourceHub';
import Progress from './pages/Progress';
import MockTests from './pages/MockTests';
import TakeTest from './pages/TakeTest';
import TestResults from './pages/TestResults';
import Analysis from './pages/Analysis';
import Readiness from './pages/Readiness';
import Notes from './pages/Notes';
import Analytics from './pages/Analytics';
import Gamification from './pages/Gamification';
import Notifications from './pages/Notifications';
import Interview from './pages/Interview';
import LearningResources from './pages/LearningResources';
import ProgressAnalytics from './pages/ProgressAnalytics';
import { ROUTE_PATHS } from './config/routeConfig';
import './index.css';

function ProtectedLayout() {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Outlet />
      </main>
      <ChatBot />
    </div>
  );
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/" />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" toastOptions={{
          style: { background: '#ffffff', color: '#1f2430', border: '1px solid #e5e8f2', boxShadow: '0 12px 28px rgba(31,36,48,0.12)' }
        }} />
        <Routes>
          <Route path={ROUTE_PATHS.login} element={<PublicRoute><Login /></PublicRoute>} />
          <Route path={ROUTE_PATHS.register} element={<PublicRoute><Register /></PublicRoute>} />
          <Route element={<ProtectedLayout />}>
            <Route path={ROUTE_PATHS.dashboard} element={<Dashboard />} />
            <Route path={ROUTE_PATHS.studyPlanner} element={<Schedule />} />
            <Route path={ROUTE_PATHS.learningResources} element={<LearningResources />} />
            <Route path={ROUTE_PATHS.progressAnalytics} element={<ProgressAnalytics />} />
            <Route path={ROUTE_PATHS.readinessCheck} element={<Readiness />} />
            <Route path={ROUTE_PATHS.reminders} element={<Notifications />} />
            <Route path={ROUTE_PATHS.schedule} element={<Schedule />} />
            <Route path={ROUTE_PATHS.scheduleCreate} element={<ScheduleCreate />} />
            <Route path={ROUTE_PATHS.resources} element={<ResourceHub />} />
            <Route path={ROUTE_PATHS.resourceById} element={<ResourceHub />} />
            <Route path={ROUTE_PATHS.progress} element={<Progress />} />
            <Route path={ROUTE_PATHS.tests} element={<MockTests />} />
            <Route path={ROUTE_PATHS.takeTest} element={<TakeTest />} />
            <Route path={ROUTE_PATHS.testResults} element={<TestResults />} />
            <Route path={ROUTE_PATHS.analysis} element={<Analysis />} />
            <Route path={ROUTE_PATHS.readiness} element={<Readiness />} />
            <Route path={ROUTE_PATHS.notes} element={<Notes />} />
            <Route path={ROUTE_PATHS.noteById} element={<Notes />} />
            <Route path={ROUTE_PATHS.analytics} element={<Analytics />} />
            <Route path={ROUTE_PATHS.gamification} element={<Gamification />} />
            <Route path={ROUTE_PATHS.notifications} element={<Notifications />} />
            <Route path={ROUTE_PATHS.interview} element={<Navigate to={ROUTE_PATHS.interviewDefault} replace />} />
            <Route path={ROUTE_PATHS.interviewSection} element={<Interview />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
