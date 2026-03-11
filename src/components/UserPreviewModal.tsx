import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Phone, Briefcase, ShieldCheck } from 'lucide-react';
import { User } from '../types';

interface UserPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export const UserPreviewModal: React.FC<UserPreviewModalProps> = ({ isOpen, onClose, user }) => {
  if (!user) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6 no-print">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-black/5 flex justify-between items-center bg-[#F5F5F4]">
              <h2 className="text-lg font-bold">Perfil do Funcionário</h2>
              <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-8 flex flex-col items-center">
              <div className="w-32 h-32 rounded-full overflow-hidden mb-6 border-4 border-white shadow-lg bg-black/5 flex items-center justify-center">
                {user.photo_url ? (
                  <img src={user.photo_url} alt={user.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <span className="text-4xl font-bold text-black/20">{user.name.charAt(0)}</span>
                )}
              </div>
              
              <h3 className="text-2xl font-bold text-center mb-1">{user.name}</h3>
              <p className="text-sm text-black/40 mb-6">@{user.username}</p>
              
              <div className="w-full space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F5F5F4] border border-black/5">
                  <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
                    <ShieldCheck size={18} className={user.role === 'manager' ? 'text-purple-500' : 'text-blue-500'} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-black/40 uppercase">Cargo</p>
                    <p className="text-sm font-semibold">{user.role === 'manager' ? 'Gestor' : 'Funcionário'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F5F5F4] border border-black/5">
                  <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
                    <Mail size={18} className="text-black/40" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-black/40 uppercase">Email</p>
                    <p className="text-sm font-semibold">{user.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F5F5F4] border border-black/5">
                  <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
                    <Phone size={18} className="text-black/40" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-black/40 uppercase">Telefone</p>
                    <p className="text-sm font-semibold">{user.phone}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
