import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase';
import { Loader2, AlertCircle, CheckCircle, User, Calendar, Phone, MapPin, Edit2, Save } from 'lucide-react';
import { Toast } from './Toast';
import Navbar from './Navbar';

const UserProfiles = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          navigate('/login');
          return;
        }

        const profileRef = doc(db, 'userProfiles', user.uid);
        const profileSnap = await getDoc(profileRef);

        if (profileSnap.exists()) {
          setProfile(profileSnap.data());
        } else {
          setError('Profile not found. Please set up your profile.');
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate, auth]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError('');

    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');

      const profileRef = doc(db, 'userProfiles', user.uid);
      await updateDoc(profileRef, {
        ...profile,
        lastUpdated: new Date().toISOString()
      });

      setToastMessage('Profile updated successfully!');
      setToastType('success');
      setShowToast(true);
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
      setToastMessage('Failed to update profile');
      setToastType('error');
      setShowToast(true);
    } finally {
      setUpdating(false);
    }
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
        <Loader2 className="animate-spin text-blue-600 dark:text-blue-400" size={48} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg text-center">
          <AlertCircle className="mx-auto text-red-500" size={48} />
          <p className="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100">{error}</p>
          <button
            onClick={() => navigate('/profile-setup')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Set Up Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b dark:border-gray-600 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Your Profile</h1>
            <button
              onClick={toggleEdit}
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors flex items-center"
            >
              {isEditing ? (
                <>
                  <Save className="mr-2" size={20} />
                  Save
                </>
              ) : (
                <>
                  <Edit2 className="mr-2" size={20} />
                  Edit
                </>
              )}
            </button>
          </div>
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ProfileField
                icon={<User className="text-gray-400" />}
                label="Name"
                name="name"
                value={profile.name}
                onChange={handleChange}
                isEditing={isEditing}
              />
              <ProfileField
                icon={<User className="text-gray-400" />}
                label="Username"
                name="username"
                value={profile.username}
                onChange={handleChange}
                isEditing={isEditing}
              />
              <ProfileField
                icon={<Calendar className="text-gray-400" />}
                label="Date of Birth"
                name="dateOfBirth"
                value={profile.dateOfBirth}
                onChange={handleChange}
                isEditing={isEditing}
                type="date"
              />
              <ProfileField
                icon={<Phone className="text-gray-400" />}
                label="Phone Number"
                name="phoneNumber"
                value={profile.phoneNumber}
                onChange={handleChange}
                isEditing={isEditing}
              />
              <ProfileField
                icon={<MapPin className="text-gray-400" />}
                label="Address"
                name="address"
                value={profile.address}
                onChange={handleChange}
                isEditing={isEditing}
                fullWidth
              />
            </div>
            {isEditing && (
              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  disabled={updating}
                  className="px-4 py-2 bg-black text-white rounded-md hover:bg-black-800 transition-colors flex items-center"
                >
                  {updating ? (
                    <Loader2 className="animate-spin mr-2" size={20} />
                  ) : (
                    <CheckCircle className="mr-2" size={20} />
                  )}
                  {updating ? 'Updating...' : 'Update Profile'}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
      <Toast
        show={showToast}
        message={toastMessage}
        type={toastType}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
};

const ProfileField = ({ icon, label, name, value, onChange, isEditing, type = "text", fullWidth = false }) => (
  <div className={`${fullWidth ? 'md:col-span-2' : ''}`}>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      {label}
    </label>
    <div className="mt-1 relative rounded-md shadow-sm">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        {icon}
      </div>
      {isEditing ? (
        <input
          type={type}
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      ) : (
        <div className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-50 dark:bg-gray-600 sm:text-sm">
          {value}
        </div>
      )}
    </div>
  </div>
);

export default UserProfiles;

