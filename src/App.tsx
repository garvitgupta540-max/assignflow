import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Pages
import { LandingPage } from './pages/Landing/LandingPage';
import { LoginPage } from './pages/Auth/LoginPage';
import { RegisterPage, ForgotPasswordPage } from './pages/Auth/RegisterPage';
import { OnboardingPage } from './pages/Auth/OnboardingPage';

// Student Pages
import { StudentDashboard } from './pages/Student/StudentDashboard';
import { StudentAssignments } from './pages/Student/StudentAssignments';
import { AssignmentDetail } from './pages/Student/AssignmentDetail';
import { StudentSubmissions } from './pages/Student/StudentSubmissions';
import { StudentNotifications } from './pages/Student/StudentNotifications';
import { StudentProfile } from './pages/Student/StudentProfile';

// Teacher Pages
import { TeacherDashboard } from './pages/Teacher/TeacherDashboard';
import { TeacherAssignments } from './pages/Teacher/TeacherAssignments';
import { CreateAssignment } from './pages/Teacher/CreateAssignment';
import { ViewSubmissions } from './pages/Teacher/ViewSubmissions';
import { EvaluateSubmission } from './pages/Teacher/EvaluateSubmission';
import { TeacherStudents } from './pages/Teacher/TeacherStudents';
import { TeacherProfile } from './pages/Teacher/TeacherProfile';

// Admin Pages
import { AdminDashboard } from './pages/Admin/AdminDashboard';
import { AdminUsers } from './pages/Admin/AdminUsers';
import { AdminReports } from './pages/Admin/AdminReports';

// Shared Community Page
import { CommunityPage } from './pages/Community/CommunityPage';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('student' | 'teacher' | 'admin')[];
}

function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Redirect to onboarding if profile has no linked college
  if (user && !user.collegeId) {
    return <Navigate to="/onboarding" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Redirect to respective dashboard if they don't have access
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }

  return <>{children}</>;
}

function OnboardingRoute() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (user && user.collegeId) {
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }

  return <OnboardingPage />;
}

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login/student" element={<LoginPage role="student" />} />
      <Route path="/login/teacher" element={<LoginPage role="teacher" />} />
      <Route path="/login/admin" element={<LoginPage role="admin" />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/onboarding" element={<OnboardingRoute />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Student routes */}
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/assignments"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentAssignments />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/assignments/:id"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <AssignmentDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/submissions"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentSubmissions />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/notifications"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentNotifications />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/profile"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/community"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <CommunityPage />
          </ProtectedRoute>
        }
      />

      {/* Teacher routes */}
      <Route
        path="/teacher/dashboard"
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <TeacherDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/assignments"
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <TeacherAssignments />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/assignments/create"
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <CreateAssignment />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/assignments/:id"
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <ViewSubmissions />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/submissions/:id"
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <EvaluateSubmission />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/students"
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <TeacherStudents />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/profile"
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <TeacherProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/community"
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <CommunityPage />
          </ProtectedRoute>
        }
      />

      {/* Admin routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminUsers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/reports"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminReports />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
