import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  type: 'danger' | 'warning';
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  type
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-black/5">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${type === 'danger' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
          <AlertCircle size={24} />
        </div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-black/40 text-sm mb-8 leading-relaxed">{message}</p>
        <div className="flex gap-3">
          <button 
            onClick={onCancel}
            className="flex-1 bg-[#F5F5F4] text-black py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#E4E3E0] transition-all"
          >
            Cancelar
          </button>
          <button 
            onClick={onConfirm}
            className={`flex-1 text-white py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${type === 'danger' ? 'bg-red-600 hover:bg-red-700' : 'bg-amber-600 hover:bg-amber-700'}`}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};
