import React, { useEffect, useState } from "react";
import {NextUIProvider} from "@nextui-org/react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Registration from "./components/Registration";
import Login from './components/Login';
import InterviewSetup from "./components/InterviewSetup";
import ProfileSetup from './components/ProfileSetup';
import Dashboard from "./components/Dashboard";
import FeedbackPage from './components/FeedbackPage';
import InterviewPage from "./components/InterviewPage";
import UserProfiles from "./components/UserProfiles";
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