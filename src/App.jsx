import React, { useEffect, useState } from "react";
import {NextUIProvider} from "@nextui-org/react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Registration from "./pages/Registration";
import Login from './pages/Login';
import InterviewSetup from "./pages/InterviewSetup";
import ProfileSetup from './pages/ProfileSetup';
import Dashboard from "./pages/Dashboard";
import FeedbackPage from './pages/FeedbackPage';
import InterviewPage from "./pages/InterviewPage";
import UserProfiles from "./pages/UserProfiles";
import "./firebase"; 
import { auth } from "./firebase";

const ProtectedRoute = ({ children }) => {
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setIsAuthChecked(true);
    });
    
    return () => unsubscribe();  // Cleanup the listener
  }, []);

  if (!isAuthChecked) {
    return <div>Loading...</div>;  // Optional loading state until auth is checked
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const App = () => {
  return (
    <NextUIProvider>
      <Router>
        <Routes>
          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Auth routes */}
          <Route path="/register" element={<Registration />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/profile-setup"
            element={
              <ProtectedRoute>
                <ProfileSetup />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/interview-setup"
            element={
              <ProtectedRoute>
                <InterviewSetup />
              </ProtectedRoute>
            }
          />
          <Route
            path="/interview-page"
            element={
              <ProtectedRoute>
                <InterviewPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/feedback"
            element={
              <ProtectedRoute>
                <FeedbackPage />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <UserProfiles />
              </ProtectedRoute>
            } 
          />
          {/* Move catch-all route to the end */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </NextUIProvider>
  );
};

export default App;