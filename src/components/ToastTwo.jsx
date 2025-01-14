import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

export const ToastTwo = ({ show, message, onClose, type = 'info' }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!isVisible) return null;

  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-blue-500';

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.3 }}
          className={`fixed top-4 right-4 z-50 ${bgColor} text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-2`}
        >
          <span className="font-medium">{message}</span>
          <button onClick={onClose} className="ml-auto">
            <X size={18} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

