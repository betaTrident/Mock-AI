import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase';
import SuccessPopup from './SuccessPopup';

const ProfileSetup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
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

    if (!auth.currentUser) {
      setError('You must be logged in to create a profile');
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
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Profile Setup</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              minLength={11}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              required
              rows="3"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full text-white bg-black  hover:bg-gray-800 py-2 px-4 rounded-md focus:outline-none"
          >
            Complete Profile
          </button>
        </form>
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

