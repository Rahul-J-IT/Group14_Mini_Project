import { AlertTriangle, X } from "lucide-react";

interface DeleteModalProps {
  isOpen: boolean;
  courseTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ isOpen, courseTitle, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 flex flex-col gap-5 animate-fade-in">
        {/* Close */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
        >
          <X size={18} />
        </button>

        {/* Icon */}
        <div className="w-14 h-14 rounded-2xl bg-rose-100 flex items-center justify-center">
          <AlertTriangle size={26} className="text-rose-600" />
        </div>

        {/* Text */}
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 mb-1">Delete Course?</h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-slate-700">"{courseTitle}"</span>? This action
            cannot be undone.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-2">
          <button
            onClick={onCancel}
            className="flex-1 py-3 border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-semibold rounded-2xl transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-rose-200"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
