import React, { useState } from "react";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from "../firebase";
import { Loader2, Mail, Lock, AlertCircle } from 'lucide-react';
import { Toast } from "./Toast";
import DarkModeToggle from "./DarkModeToggle";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);
  const [hideForm, setHideForm] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setShowToast(true);
      
      setTimeout(() => {
        setShowToast(false);
        setHideForm(true);
        setShowLoadingScreen(true);
      }, 3000);

      setTimeout(async () => {
        const profileRef = doc(db, 'userProfiles', userCredential.user.uid);
        const profileSnap = await getDoc(profileRef);
        
        setShowLoadingScreen(false);
        
        if (profileSnap.exists()) {
          navigate("/dashboard");
        } else {
          navigate("/profile-setup");
        }
      }, 6000);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      setShowToast(true);
      
      setTimeout(() => {
        setShowToast(false);
        setHideForm(true);
        setShowLoadingScreen(true);
      }, 3000);

      setTimeout(async () => {
        const profileRef = doc(db, 'userProfiles', userCredential.user.uid);
        const profileSnap = await getDoc(profileRef);
        
        setShowLoadingScreen(false);
        
        if (profileSnap.exists()) {
          navigate("/dashboard");
        } else {
          navigate("/profile-setup");
        }
      }, 6000);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="absolute top-4 right-4">
        <DarkModeToggle />
      </div>
      {!hideForm && (
        <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100">Login</h1>
          {error && (
            <div className="flex items-center p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
              <AlertCircle className="flex-shrink-0 inline w-4 h-4 mr-3" />
              <span className="sr-only">Error</span>
              <div>{error}</div>
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>
          <div className="space-y-1">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="animate-spin mx-auto" size={24} />
            ) : (
              "Login"
            )}
          </button>
        </form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-300 dark:border-gray-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">Or continue with</span>
          </div>
        </div>
        <button
          onClick={handleGoogleLogin}
          className="w-full py-2 px-4 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 focus:ring-gray-500 focus:ring-offset-gray-200 text-gray-900 dark:text-gray-100 transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg border border-gray-300 dark:border-gray-600"
        >
          <div className="flex items-center justify-center">
            <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path fill="#EA4335" d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z"/>
              <path fill="#34A853" d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2970244 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z"/>
              <path fill="#4A90E2" d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5818182 23.1818182,9.90909091 L12,9.90909091 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z"/>
              <path fill="#FBBC05" d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z"/>
            </svg>
            Sign in with Google
          </div>
        </button>
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{" "}
          <Link to="/register" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
            Register
          </Link>
        </p>
      </div>
      )}
      <Toast 
        show={showToast} 
        message="Login successful! Redirecting..." 
        type="success"
      />
      {showLoadingScreen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg flex flex-col items-center">
            <Loader2 className="animate-spin text-blue-600 dark:text-blue-400" size={48} />
            <p className="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100">Loading...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;

