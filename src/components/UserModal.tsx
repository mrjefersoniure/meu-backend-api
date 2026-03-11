import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, UserPlus, Edit2, Camera, Upload } from 'lucide-react';
import { User } from '../types';
import { ImageCropperModal } from './ImageCropperModal';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  user: any;
  setUser: (user: any) => void;
  isEditing: boolean;
  currentUser: User;
}

export const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  user,
  setUser,
  isEditing,
  currentUser
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cropperImage, setCropperImage] = useState<string | null>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCropperImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
    // Reset input so the same file can be selected again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCropComplete = (croppedImageBase64: string) => {
    setUser({ ...user, photo_url: croppedImageBase64 });
    setCropperImage(null);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6 no-print">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-black/5 flex justify-between items-center">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  {isEditing ? <Edit2 size={20} className="text-black/40" /> : <UserPlus size={20} className="text-black/40" />}
                  {isEditing ? 'Editar Funcionário' : 'Cadastrar Funcionário'}
                </h2>
                <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={onSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto no-scrollbar">
                
                <div className="flex flex-col items-center justify-center mb-6">
                  <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    <div className="w-24 h-24 rounded-full bg-[#F5F5F4] border-2 border-dashed border-black/20 overflow-hidden flex items-center justify-center relative">
                      {user.photo_url ? (
                        <img src={user.photo_url} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <Camera size={32} className="text-black/20" />
                      )}
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Upload size={24} className="text-white" />
                      </div>
                    </div>
                  </div>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={handlePhotoChange}
                  />
                  <p className="text-[10px] text-black/40 uppercase font-bold mt-2">Adicionar Foto</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-black/40 uppercase mb-1">Nome Completo</label>
                  <input 
                    required
                    type="text" 
                    value={user.name || ''}
                    onChange={e => setUser({...user, name: e.target.value})}
                    className="w-full bg-[#F5F5F4] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-black/5 transition-all outline-none"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-black/40 uppercase mb-1">Usuário</label>
                    <input 
                      required
                      type="text" 
                      value={user.username || ''}
                      onChange={e => setUser({...user, username: e.target.value})}
                      className="w-full bg-[#F5F5F4] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-black/5 transition-all outline-none"
                    />
                  </div>
                  {!isEditing && (
                    <div>
                      <label className="block text-xs font-semibold text-black/40 uppercase mb-1">Senha</label>
                      <input 
                        required
                        type="password" 
                        value={user.password || ''}
                        onChange={e => setUser({...user, password: e.target.value})}
                        className="w-full bg-[#F5F5F4] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-black/5 transition-all outline-none"
                      />
                    </div>
                  )}
                  {isEditing && (
                    <div>
                      <label className="block text-xs font-semibold text-black/40 uppercase mb-1">Cargo</label>
                      <select 
                        value={user.role || 'employee'}
                        onChange={e => setUser({...user, role: e.target.value as any})}
                        className="w-full bg-[#F5F5F4] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-black/5 transition-all outline-none"
                      >
                        <option value="employee">Funcionário</option>
                        <option value="manager">Gestor</option>
                        {currentUser.role === 'global_admin' && (
                          <option value="global_admin">Administrador Global</option>
                        )}
                      </select>
                    </div>
                  )}
                </div>
                {!isEditing && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-black/40 uppercase mb-1">Telefone</label>
                      <input 
                        required
                        type="tel" 
                        value={user.phone || ''}
                        onChange={e => setUser({...user, phone: e.target.value})}
                        className="w-full bg-[#F5F5F4] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-black/5 transition-all outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-black/40 uppercase mb-1">Cargo</label>
                      <select 
                        value={user.role || 'employee'}
                        onChange={e => setUser({...user, role: e.target.value as any})}
                        className="w-full bg-[#F5F5F4] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-black/5 transition-all outline-none"
                      >
                        <option value="employee">Funcionário</option>
                        <option value="manager">Gestor</option>
                        {currentUser.role === 'global_admin' && (
                          <option value="global_admin">Administrador Global</option>
                        )}
                      </select>
                    </div>
                  </div>
                )}
                <div>
                  <label className="block text-xs font-semibold text-black/40 uppercase mb-1">Email</label>
                  <input 
                    required
                    type="email" 
                    value={user.email || ''}
                    onChange={e => setUser({...user, email: e.target.value})}
                    className="w-full bg-[#F5F5F4] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-black/5 transition-all outline-none"
                  />
                </div>
                {isEditing && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-black/40 uppercase mb-1">Telefone</label>
                      <input 
                        required
                        type="tel" 
                        value={user.phone || ''}
                        onChange={e => setUser({...user, phone: e.target.value})}
                        className="w-full bg-[#F5F5F4] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-black/5 transition-all outline-none"
                      />
                    </div>
                    {currentUser.role === 'global_admin' && (
                      <div>
                        <label className="block text-xs font-semibold text-black/40 uppercase mb-1">Nova Senha (Opcional)</label>
                        <input 
                          type="password" 
                          value={user.password || ''}
                          onChange={e => setUser({...user, password: e.target.value})}
                          className="w-full bg-[#F5F5F4] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-black/5 transition-all outline-none"
                          placeholder="Deixe em branco para manter"
                        />
                      </div>
                    )}
                  </div>
                )}
                <button type="submit" className="w-full bg-black text-white py-4 rounded-xl font-semibold hover:bg-black/80 transition-all shadow-lg shadow-black/10 mt-2">
                  {isEditing ? 'Salvar Alterações' : 'Finalizar Cadastro'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      <ImageCropperModal 
        isOpen={!!cropperImage}
        imageSrc={cropperImage}
        onClose={() => setCropperImage(null)}
        onCropComplete={handleCropComplete}
      />
    </>
  );
};
