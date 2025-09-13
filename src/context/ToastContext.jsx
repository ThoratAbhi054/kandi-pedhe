"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { ToastContainer } from "../components/toast";

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const id = Date.now() + Math.random();
    const newToast = {
      id,
      type: "success",
      duration: 4000,
      ...toast,
    };

    setToasts((prev) => [...prev, newToast]);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showSuccess = useCallback(
    (message, title = "Success", duration = 4000) => {
      return addToast({ type: "success", message, title, duration });
    },
    [addToast]
  );

  const showError = useCallback(
    (message, title = "Error", duration = 5000) => {
      return addToast({ type: "error", message, title, duration });
    },
    [addToast]
  );

  const showWarning = useCallback(
    (message, title = "Warning", duration = 4000) => {
      return addToast({ type: "warning", message, title, duration });
    },
    [addToast]
  );

  const showInfo = useCallback(
    (message, title = "Info", duration = 4000) => {
      return addToast({ type: "info", message, title, duration });
    },
    [addToast]
  );

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider
      value={{
        addToast,
        removeToast,
        showSuccess,
        showError,
        showWarning,
        showInfo,
        clearAllToasts,
      }}
    >
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
