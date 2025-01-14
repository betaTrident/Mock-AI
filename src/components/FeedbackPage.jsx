import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Navbar from './Navbar';
import { Loader2, CheckCircle, ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';
import { generateFeedback } from '../services/feedback';

export default function FeedbackPage() {
  const [feedback, setFeedback] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [openQuestions, setOpenQuestions] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const interviewId = localStorage.getItem('currentInterviewId');
        const interviewDoc = await getDoc(doc(db, 'interviews', interviewId));
        
        if (!interviewDoc.exists()) {
          throw new Error('Interview not found');
        }

        const interviewData = interviewDoc.data();
        const answersSnapshot = await getDocs(collection(db, 'interviews', interviewId, 'answers'));
        
        const answersData = answersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        const scoredAnswers = await Promise.all(answersData.map(async (answer) => {
          const score = calculateScore(answer.userAnswer, answer.keyPoints);
          let aiFeedback = answer.aiFeedback;
          if (!aiFeedback) {
            aiFeedback = await generateFeedback(
              interviewId,
              answer.id,
              answer.question,
              answer.userAnswer,
              answer.expectedAnswer
            );
          }
          return { ...answer, score, aiFeedback };
        }));

        const totalScore = scoredAnswers.reduce((sum, answer) => sum + answer.score, 0);
        const averageScore = scoredAnswers.length > 0 ? totalScore / scoredAnswers.length : 0;

        // Store the average score in the interview document
        await updateDoc(doc(db, 'interviews', interviewId), {
          averageScore: averageScore
        });

        setFeedback({
          interviewData,
          answers: scoredAnswers,
          averageScore
        });

        setIsLoading(false);

        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (error) {
        console.error('Error fetching feedback:', error);
        setIsLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  const calculateScore = (answer, keyPoints) => {
    if (!answer || !keyPoints || keyPoints.length === 0) return 0;
    
    let score = 0;
    const answerLower = answer.toLowerCase();
    
    keyPoints.forEach(point => {
      const pointLower = point.toLowerCase();
      if (answerLower.includes(pointLower)) {
        score++;
      } else {
        const words = pointLower.split(' ');
        const partialMatch = words.some(word => answerLower.includes(word));
        if (partialMatch) {
          score += 0.5;
        }
      }
    });

    return (score / keyPoints.length) * 10;
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const toggleQuestion = (id) => {
    setOpenQuestions(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-gray-900 mx-auto" />
          <p className="mt-4 text-gray-600">Preparing your interview feedback...</p>
        </div>
      </div>
    );
  }

  if (!feedback) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-600">Failed to load feedback. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <button
          onClick={handleBackToDashboard}
          className="mb-6 flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </button>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-center mb-4">Interview Feedback</h1>
          <div className="flex items-center justify-center mb-4">
            <CheckCircle className="h-12 w-12 text-green-500 mr-2" />
            <p className="text-2xl font-semibold">Congratulations on completing your interview!</p>
          </div>
          <div className="text-center">
            <p className="text-xl mb-2">Your overall score:</p>
            <div className="flex items-center justify-center">
              <div className="w-64 h-4 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 rounded-full" 
                  style={{ width: `${feedback.averageScore * 10}%` }}
                ></div>
              </div>
              <span className="ml-4 text-2xl font-bold">{feedback.averageScore.toFixed(2)} / 10</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {feedback.answers.map((answer, index) => (
            <div key={answer.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <button
                onClick={() => toggleQuestion(answer.id)}
                className="w-full px-4 py-3 text-left text-lg font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition-colors duration-200 flex justify-between items-center"
              >
                <span>Question {index + 1}</span>
                {openQuestions[answer.id] ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </button>
              {openQuestions[answer.id] && (
                <div className="px-4 py-3 text-sm text-gray-700">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">{answer.question}</h3>
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-700">Your Answer:</h4>
                    <p className="bg-gray-50 p-3 rounded mt-1">{answer.userAnswer}</p>
                  </div>
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-700">Expected Answer:</h4>
                    <p className="bg-gray-50 p-3 rounded mt-1">{answer.expectedAnswer}</p>
                  </div>
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-700">Score:</h4>
                    <div className="flex items-center mt-1">
                      <div className="w-48 h-3 bg-gray-200 rounded-full overflow-hidden mr-4">
                        <div 
                          className="h-full bg-blue-600 rounded-full" 
                          style={{ width: `${answer.score * 10}%` }}
                        ></div>
                      </div>
                      <p className="text-lg font-bold">{answer.score.toFixed(2)} / 10</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700">Feedback:</h4>
                    <div className="bg-blue-50 p-3 rounded mt-1 whitespace-pre-wrap">{answer.aiFeedback}</div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

