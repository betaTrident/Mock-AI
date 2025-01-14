import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, XCircle, Info } from 'lucide-react';

const toastTypes = {
  success: {
    icon: <CheckCircle className="w-6 h-6" />,
    className: "bg-green-500 dark:bg-green-600",
  },
  error: {
    icon: <XCircle className="w-6 h-6" />,
    className: "bg-red-500 dark:bg-red-600",
  },
  info: {
    icon: <Info className="w-6 h-6" />,
    className: "bg-blue-500 dark:bg-blue-600",
  },
};

export const Toast = ({ show, message, type = "info" }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!isVisible) return null;

  const { icon, className } = toastTypes[type];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -50, x: 50 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: -50, x: 50 }}
          transition={{ type: "spring", stiffness: 500, damping: 40 }}
          className="fixed top-4 right-4 z-50 max-w-sm"
        >
          <div className={`px-4 py-3 rounded-lg shadow-lg flex items-center space-x-3 text-white ${className}`}>
            <div className="flex-shrink-0">
              {icon}
            </div>
            <p className="font-medium text-sm">{message}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

