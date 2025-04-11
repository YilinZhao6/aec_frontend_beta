import React from 'react';
import { AlertCircle } from 'lucide-react';

interface DeleteConfirmationDialogProps {
  type: 'file' | 'folder';
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  type,
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="delete-confirmation-overlay">
      <div className="delete-confirmation">
        <AlertCircle className="text-red-500" size={24} />
        <p className="confirmation-message">
          {type === 'folder' 
            ? 'Delete this folder and all its contents?' 
            : 'Delete this file?'}
        </p>
        <div className="confirmation-actions">
          <button 
            className="cancel-button"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button 
            className="delete-button"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationDialog;