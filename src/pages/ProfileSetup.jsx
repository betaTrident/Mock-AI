import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase';
import { User, AtSign, Calendar, Phone, MapPin, Loader2, AlertCircle, Brain, CheckCircle } from 'lucide-react';
import SuccessPopup from './SuccessPopup';

const ProfileSetup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    dateOfBirth: '',
    phoneNumber: '',
    address: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        const profileRef = doc(db, 'userProfiles', user.uid);
        const profileSnap = await getDoc(profileRef);

        if (profileSnap.exists()) {
          navigate('/dashboard');
        }
      } catch (err) {
        console.error('Error checking profile:', err);
        setError('Error checking profile. Please try again.');
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    if (!auth.currentUser) {
      setError('You must be logged in to create a profile');
      setSubmitting(false);
      return;
    }

    try {
      const userId = auth.currentUser.uid;
      const profileData = {
        ...formData,
        email: auth.currentUser.email,
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      };

      // Save profile to Firestore
      await setDoc(doc(db, 'userProfiles', userId), profileData);
      
      // Show success popup instead of immediately navigating
      setShowSuccessPopup(true);
    } catch (err) {
      console.error('Profile creation error:', err);
      setError('Failed to create profile. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePopupClose = () => {
    setShowSuccessPopup(false);
    navigate('/dashboard');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #16213e 100%)' }}>
        <div className="flex flex-col items-center">
          <Loader2 className="animate-spin text-indigo-400 mb-4" size={48} />
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #16213e 100%)' }}>
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute w-96 h-96 bg-indigo-500 rounded-full filter blur-3xl opacity-20 -top-48 -right-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-purple-500 rounded-full filter blur-3xl opacity-20 -bottom-48 -left-48 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute w-64 h-64 bg-blue-500 rounded-full filter blur-3xl opacity-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-12">
        <div className="w-full max-w-2xl">
          {/* Logo Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-lg">
                <Brain className="h-7 w-7 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                MockAI
              </h1>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Complete Your Profile</h2>
            <p className="text-gray-400">We need a few more details to personalize your experience</p>
          </div>

          {/* Form Card */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl">
            {error && (
              <div className="flex items-center gap-3 p-4 mb-6 text-sm text-red-300 rounded-lg bg-red-500/10 border border-red-500/20">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name and Username in Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-200">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="username" className="block text-sm font-medium text-gray-200">
                    Username
                  </label>
                  <div className="relative">
                    <AtSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      placeholder="johndoe"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Date of Birth and Phone in Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-200">
                    Date of Birth
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="date"
                      id="dateOfBirth"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-200">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      placeholder="+1 (555) 000-0000"
                      minLength={11}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Address Full Width */}
              <div className="space-y-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-200">
                  Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-4 text-gray-400" size={20} />
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                    placeholder="123 Main St, City, State, ZIP"
                    required
                    rows="3"
                  ></textarea>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span>Creating Profile...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle size={20} />
                    <span>Complete Profile</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      <SuccessPopup
        message="Your profile has been created successfully!"
        isVisible={showSuccessPopup}
        onClose={handlePopupClose}
      />
    </div>
  );
};

export default ProfileSetup;

