"use client";

import { useState, useEffect } from "react";
import {
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const Toast = ({ toast, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation
    const timer = setTimeout(() => setIsVisible(true), 100);

    // Auto close after duration
    const autoCloseTimer = setTimeout(() => {
      handleClose();
    }, toast.duration || 4000);

    return () => {
      clearTimeout(timer);
      clearTimeout(autoCloseTimer);
    };
  }, [toast.duration]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(toast.id), 300); // Wait for animation to complete
  };

  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return <CheckCircleIcon className="w-6 h-6 text-green-500" />;
      case "error":
        return <XCircleIcon className="w-6 h-6 text-red-500" />;
      case "warning":
        return <ExclamationTriangleIcon className="w-6 h-6 text-yellow-500" />;
      case "info":
        return <InformationCircleIcon className="w-6 h-6 text-blue-500" />;
      default:
        return <CheckCircleIcon className="w-6 h-6 text-green-500" />;
    }
  };

  const getBackgroundColor = () => {
    switch (toast.type) {
      case "success":
        return "bg-green-50 border-green-200";
      case "error":
        return "bg-red-50 border-red-200";
      case "warning":
        return "bg-yellow-50 border-yellow-200";
      case "info":
        return "bg-blue-50 border-blue-200";
      default:
        return "bg-green-50 border-green-200";
    }
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 max-w-sm w-full transform transition-all duration-300 ease-in-out ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      <div
        className={`${getBackgroundColor()} border rounded-lg shadow-lg p-4 flex items-start space-x-3`}
      >
        <div className="flex-shrink-0">{getIcon()}</div>

        <div className="flex-1 min-w-0">
          {toast.title && (
            <p className="text-sm font-medium text-gray-900 mb-1">
              {toast.title}
            </p>
          )}
          <p className="text-sm text-gray-700">{toast.message}</p>
        </div>

        <button
          onClick={handleClose}
          className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

const ToastContainer = ({ toasts, onClose }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </div>
  );
};

export { Toast, ToastContainer };
