import React, { useState, useEffect } from 'react';
import { Plus, Loader2, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from "./Navbar";
import InterviewModal from './InterviewModal';
import { ToastTwo } from './ToastTwo';
import { auth, db } from '../firebase';
import { collection, query, where, getDocs, orderBy, doc, getDoc, addDoc, deleteDoc, writeBatch } from 'firebase/firestore';

// Confirmation Modal Component
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, isDeleting }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
        <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete this interview? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-md hover:bg-gray-50"
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-2"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [interviews, setInterviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showGreetingToast, setShowGreetingToast] = useState(false);
  const [userName, setUserName] = useState('');
  const [formData, setFormData] = useState({
    role: '',
    difficulty: '',
    description: '',
    experience: ''
  });
  const [errors, setErrors] = useState({});
  const [deleteConfirmation, setDeleteConfirmation] = useState({ open: false, interviewId: null });
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const userProfileRef = doc(db, 'userProfiles', user.uid);
          const userProfileSnap = await getDoc(userProfileRef);
          
          if (userProfileSnap.exists()) {
            const userProfileData = userProfileSnap.data();
            setUserName(userProfileData.name || 'User');
          } else {
            setUserName('User');
          }
          setShowGreetingToast(true);
          
          await fetchInterviews(user.uid);
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUserName('User');
        } finally {
          setIsLoading(false);
        }
      } else {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const fetchInterviews = async (userId) => {
    try {
      const interviewsRef = collection(db, 'interviews');
      const q = query(
        interviewsRef,
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const fetchedInterviews = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setInterviews(fetchedInterviews);
    } catch (error) {
      console.error('Error fetching interviews:', error);
    }
  };

  const handleViewFeedback = (interviewId) => {
    localStorage.setItem('currentInterviewId', interviewId);
    navigate(`/feedback`);
  };

  const handleStartInterview = (interviewId) => {
    localStorage.setItem('currentInterviewId', interviewId);
    navigate(`/interview-setup`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No authenticated user');

      const newInterview = {
        ...formData,
        userId: user.uid,
        createdAt: new Date()
      };
      
      const docRef = await addDoc(collection(db, 'interviews'), newInterview);
      
      setInterviews(prev => [{id: docRef.id, ...newInterview}, ...prev]);
      setIsModalOpen(false);
      setFormData({
        role: '',
        difficulty: '',
        description: '',
        experience: ''
      });

      localStorage.setItem('currentInterviewId', docRef.id);
      navigate(`/interview-setup`);
    } catch (error) {
      console.error('Error creating interview:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.role.trim()) newErrors.role = 'Job role is required';
    if (!formData.difficulty) newErrors.difficulty = 'Please select difficulty';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.experience) newErrors.experience = 'Experience is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDeleteInterview = async () => {
    if (!deleteConfirmation.interviewId) return;
    
    setIsDeleting(true);
    try {
      const interviewId = deleteConfirmation.interviewId;
      const interviewRef = doc(db, 'interviews', interviewId);
      
      // First, verify the interview exists and belongs to the user
      const interviewDoc = await getDoc(interviewRef);
      if (!interviewDoc.exists()) {
        throw new Error('Interview not found');
      }
      
      const interviewData = interviewDoc.data();
      if (interviewData.userId !== auth.currentUser?.uid) {
        throw new Error('You do not have permission to delete this interview');
      }
  
      // Delete the interview document first
      await deleteDoc(interviewRef);
      
      // Update local state
      setInterviews(prev => prev.filter(interview => interview.id !== interviewId));
      
      // Show success message
      setShowGreetingToast(false);
      setTimeout(() => {
        setShowGreetingToast(true);
      }, 100);
  
    } catch (error) {
      console.error('Error deleting interview:', error);
      alert(error.message || 'Failed to delete interview');
    } finally {
      setIsDeleting(false);
      setDeleteConfirmation({ open: false, interviewId: null });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="container mx-auto p-6 space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-black">Dashboard</h1>
          <p className="text-gray-500 mt-2">Create and Start your AI Mockup Interview</p>
        </div>

        <div 
          onClick={() => setIsModalOpen(true)}
          className="bg-white border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
        >
          <div className="flex items-center justify-center p-6">
            <button 
              className="text-lg flex items-center gap-2 font-bold text-black hover:text-gray-900"
              disabled={isLoading}
            >
              <Plus className="h-5 w-5" />
              Add New
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Previous Mock Interviews</h2>
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {interviews.map((interview) => (
                <div key={interview.id} className="border rounded-lg bg-white relative">
                  <button
                    onClick={() => setDeleteConfirmation({ open: true, interviewId: interview.id })}
                    className="absolute top-2 right-2 p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-gray-100 transition-colors"
                    aria-label="Delete interview"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                  <div className="p-6">
                    <h2 className="text-[#4338ca] font-semibold text-2xl">{interview.role}</h2>
                    <p className="text-sm text-gray-500">
                      {interview.experience} Years of Experience
                    </p>
                    <p className="text-xs text-gray-500">
                      Created At: {interview.createdAt.toDate().toLocaleDateString()}
                    </p>
                  </div>
                  <div className="px-6 pb-6 flex gap-2">
                    <button 
                      className="flex-1 px-4 py-2 border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => handleViewFeedback(interview.id)}
                    >
                      Feedback
                    </button>
                    <button 
                      className="flex-1 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed" 
                      onClick={() => handleStartInterview(interview.id)}
                    >
                      Retake
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <InterviewModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        setErrors={setErrors}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />

      <DeleteConfirmationModal
        isOpen={deleteConfirmation.open}
        onClose={() => setDeleteConfirmation({ open: false, interviewId: null })}
        onConfirm={handleDeleteInterview}
        isDeleting={isDeleting}
      />

      <ToastTwo
        show={showGreetingToast}
        message={userName === 'User' ? 'Welcome!' : `Welcome back, ${userName}!`}
        onClose={() => setShowGreetingToast(false)}
        type="success"
      />
    </div>
  );
}