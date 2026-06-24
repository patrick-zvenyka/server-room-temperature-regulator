import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TemperatureLogs from './pages/TemperatureLogs';
import UserManagement from './pages/UserManagement';
import UserLogs from './pages/UserLogs';
import api from '../services/api';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useContext(AuthContext);
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

// Component to log navigation events
const NavigationLogger = () => {
    const location = useLocation();
    const { isAuthenticated } = useContext(AuthContext);

    useEffect(() => {
        if (isAuthenticated) {
            // Post navigation log
            api.post('/users/activity/', {
                action_type: 'NAVIGATION',
                description: `User navigated to ${location.pathname}`
            }).catch(() => {}); // silently fail if token is expired/invalid
        }
    }, [location.pathname, isAuthenticated]);

    return null;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <NavigationLogger />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/temperature-logs" element={
            <ProtectedRoute>
              <TemperatureLogs />
            </ProtectedRoute>
          } />
          <Route path="/users" element={
            <ProtectedRoute>
              <UserManagement />
            </ProtectedRoute>
          } />
          <Route path="/user-logs" element={
            <ProtectedRoute>
              <UserLogs />
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
