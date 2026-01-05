import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase';
import { Loader2, AlertCircle, CheckCircle, User, Calendar, Phone, MapPin, Edit2, Save, ArrowLeft } from 'lucide-react';
import { Toast } from './Toast';
import Navbar from '../components/ui/Navbar';

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
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <Loader2 className="animate-spin text-indigo-600 dark:text-indigo-400 mx-auto mb-4" size={48} />
          <p className="text-gray-600 dark:text-gray-400 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800">
        <div className="bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-xl text-center max-w-md mx-4 border border-gray-200 dark:border-gray-700">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="text-red-600 dark:text-red-400" size={32} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Profile Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => navigate('/profile-setup')}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Set Up Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Back to Dashboard Button */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mb-6 group"
        >
          <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Dashboard</span>
        </button>

        {/* Profile Header Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 h-32 relative">
            <div className="absolute -bottom-12 left-8">
              <div className="w-24 h-24 bg-white dark:bg-gray-800 rounded-full border-4 border-white dark:border-gray-800 shadow-lg flex items-center justify-center">
                <User className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
          </div>
          <div className="pt-16 px-8 pb-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{profile?.name}</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">@{profile?.username}</p>
              </div>
              <button
                onClick={toggleEdit}
                className={`px-5 py-2.5 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ${
                  isEditing
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700'
                    : 'bg-gray-900 dark:bg-gray-700 text-white hover:bg-gray-800 dark:hover:bg-gray-600'
                }`}
              >
                {isEditing ? (
                  <>
                    <Save size={18} />
                    <span>Cancel</span>
                  </>
                ) : (
                  <>
                    <Edit2 size={18} />
                    <span>Edit Profile</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Profile Details Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Profile Information</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              {isEditing ? 'Update your personal details below' : 'View your personal information'}
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ProfileField
                icon={<User className="text-indigo-500" size={20} />}
                label="Full Name"
                name="name"
                value={profile.name}
                onChange={handleChange}
                isEditing={isEditing}
              />
              <ProfileField
                icon={<User className="text-indigo-500" size={20} />}
                label="Username"
                name="username"
                value={profile.username}
                onChange={handleChange}
                isEditing={isEditing}
              />
              <ProfileField
                icon={<Calendar className="text-indigo-500" size={20} />}
                label="Date of Birth"
                name="dateOfBirth"
                value={profile.dateOfBirth}
                onChange={handleChange}
                isEditing={isEditing}
                type="date"
              />
              <ProfileField
                icon={<Phone className="text-indigo-500" size={20} />}
                label="Phone Number"
                name="phoneNumber"
                value={profile.phoneNumber}
                onChange={handleChange}
                isEditing={isEditing}
              />
              <ProfileField
                icon={<MapPin className="text-indigo-500" size={20} />}
                label="Address"
                name="address"
                value={profile.address}
                onChange={handleChange}
                isEditing={isEditing}
                fullWidth
                type="textarea"
              />
            </div>
            
            {isEditing && (
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={toggleEdit}
                  className="px-6 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {updating ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      <span>Updating...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle size={18} />
                      <span>Save Changes</span>
                    </>
                  )}
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
    <label htmlFor={name} className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
      {label}
    </label>
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-start pt-3 pointer-events-none">
        {icon}
      </div>
      {isEditing ? (
        type === "textarea" ? (
          <textarea
            name={name}
            id={name}
            value={value}
            onChange={onChange}
            rows="3"
            className="block w-full pl-12 pr-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none"
          />
        ) : (
          <input
            type={type}
            name={name}
            id={name}
            value={value}
            onChange={onChange}
            className="block w-full pl-12 pr-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
          />
        )
      ) : (
        <div className="block w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100">
          {value || <span className="text-gray-400">Not set</span>}
        </div>
      )}
    </div>
  </div>
);

export default UserProfiles;

