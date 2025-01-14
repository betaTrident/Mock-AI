import React, { useState } from 'react';
import { setDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';  // Make sure you have firebase setup correctly
import InterviewSetup from "./InterviewSetup";

const InterviewModal = ({ 
  isOpen, 
  onClose, 
  formData, 
  setFormData, 
  errors, 
  isLoading 
}) => {
  const navigate = useNavigate();

  // Prevent rendering the modal if it's not open
  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // If already loading, don't submit again
    if (isLoading) return;

    // Ensure the user is logged in
    const user = auth.currentUser;
    if (!user) {
      alert("You need to be logged in to create an interview.");
      return;
    }

    // Prepare interview data to store in Firestore
    const interviewData = {
      role: formData.role,
      difficulty: formData.difficulty,
      description: formData.description,
      experience: formData.experience,
      createdAt: new Date(),
      userId: user.uid,  // Associate interview with logged-in user
    };

    try {
      // Generate a unique document ID for the interview (based on user UID and timestamp)
      const interviewRef = doc(db, 'interviews', `${user.uid}-${Date.now()}`);
      await setDoc(interviewRef, interviewData);

      // After saving data, store the interview ID in localStorage for later use
      localStorage.setItem('currentInterviewId', interviewRef.id);

      console.log('Redirecting to Interview Setup');
      navigate('/interview-setup');

    } catch (error) {
      console.error("Error creating interview:", error);
      alert('Failed to create interview. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-lg max-w-[425px] w-full p-6 m-4 z-50">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Create New Interview</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Job Role or Industry
            </label>
            <input
              type="text"
              placeholder="e.g. Software Engineer, Data Analyst"
              className={`w-full px-3 py-2 border rounded-md ${errors.role ? 'border-red-500' : ''}`}
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              required
            />
            {errors.role && <p className="text-red-500 text-xs">{errors.role}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Interview Difficulty
            </label>
            <select 
              className={`w-full px-3 py-2 border rounded-md ${errors.difficulty ? 'border-red-500' : ''}`}
              value={formData.difficulty}
              onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
              required
            >
              <option value="">Select difficulty</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Expert">Expert</option>
            </select>
            {errors.difficulty && <p className="text-red-500 text-xs">{errors.difficulty}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Job Description/Tech Stack
            </label>
            <textarea
              placeholder="Brief description of the role and required technologies"
              className={`w-full px-3 py-2 border rounded-md ${errors.description ? 'border-red-500' : ''}`}
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
            />
            {errors.description && <p className="text-red-500 text-xs">{errors.description}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Years of Experience
            </label>
            <input
              type="number"
              min="0"
              placeholder="Years of experience"
              className={`w-full px-3 py-2 border rounded-md ${errors.experience ? 'border-red-500' : ''}`}
              value={formData.experience}
              onChange={(e) => setFormData({...formData, experience: e.target.value})}
              required
            />
            {errors.experience && <p className="text-red-500 text-xs">{errors.experience}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white py-2 px-4 rounded-md  hover:bg-gray-800  transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Generating...' : 'Generate Interview'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default InterviewModal;
