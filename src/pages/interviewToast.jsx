import React, { useState, useEffect } from 'react';

export function InterviewToast({ message, type = 'info', duration = 3000 }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  if (!isVisible) return null;

  const bgColor = type === 'error' ? 'bg-red-500' : 'bg-blue-500';

  return (
    <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg text-white ${bgColor} transition-opacity duration-300`}>
      {message}
    </div>
  );
}

export function useInterviewToast() {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'info', duration = 3000) => {
    const id = Date.now();
    setToasts(prevToasts => [...prevToasts, { id, message, type, duration }]);

    setTimeout(() => {
      setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
    }, duration);
  };

  return {
    ToastContainer: () => (
      <div className="fixed top-4 right-4 z-50">
        {toasts.map(toast => (
          <InterviewToast key={toast.id} {...toast} />
        ))}
      </div>
    ),
    showToast
  };
}
