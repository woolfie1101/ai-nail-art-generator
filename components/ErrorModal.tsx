import React from 'react';
import { CloseIcon } from './icons/CloseIcon';

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

const ErrorModal: React.FC<ErrorModalProps> = ({ isOpen, onClose, message }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="relative bg-white rounded-lg shadow-xl p-8 max-w-sm w-full text-center"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 rounded-full"
          aria-label="Close modal"
        >
          <CloseIcon />
        </button>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Alert</h3>
        <p className="text-gray-600">{message}</p>
        <button
          onClick={onClose}
          className="mt-6 px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 transition"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default ErrorModal;
