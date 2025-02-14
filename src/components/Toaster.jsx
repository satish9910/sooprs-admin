// src/components/ToastComponent.js

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Toaster = () => {
  return <ToastContainer />;
};

// Helper functions to trigger different types of toasts
export const showSuccessToast = (message) => {
  toast.success(message);
};

export const showErrorToast = (message) => {
  toast.error(message);
};

export default Toaster;
