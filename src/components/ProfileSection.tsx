import React from 'react';
import { Camera, Save } from 'lucide-react';
import { User } from '../types';

interface ProfileSectionProps {
  user: User;
  profileEdit: {
    name: string;
    email: string;
    phone: string;
    photo_url: string;
  };
  setProfileEdit: React.Dispatch<React.SetStateAction<any>>;
  onSubmit: (e: React.FormEvent) => void;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({ user, profileEdit, setProfileEdit, onSubmit }) => {
  return (
    <div className="max-w-2xl mx-auto">
      <section className="bg-white rounded-3xl p-8 shadow-sm border border-black/5">
        <div className="flex flex-col items-center mb-8">
          <div className="relative group">
            {profileEdit.photo_url ? (
              <img src={profileEdit.photo_url} className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-32 h-32 rounded-full bg-black/5 flex items-center justify-center text-4xl font-bold text-black/20 border-4 border-white shadow-lg">
                {user.name.charAt(0)}
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
              <Camera className="text-white" size={24} />
            </div>
          </div>
          <h2 className="text-2xl font-bold mt-4">{user.name}</h2>
          <p className="text-black/40 uppercase tracking-widest text-[10px] font-bold">{user.role === 'manager' ? 'Gestor' : 'Funcionário'}</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-black/40 uppercase mb-1">Nome Completo</label>
              <input 
                type="text" 
                value={profileEdit.name}
                onChange={e => setProfileEdit({...profileEdit, name: e.target.value})}
                className="w-full bg-[#F5F5F4] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-black/5 transition-all outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-black/40 uppercase mb-1">Email</label>
              <input 
                type="email" 
                value={profileEdit.email}
                onChange={e => setProfileEdit({...profileEdit, email: e.target.value})}
                className="w-full bg-[#F5F5F4] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-black/5 transition-all outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-black/40 uppercase mb-1">Telefone</label>
              <input 
                type="tel" 
                value={profileEdit.phone}
                onChange={e => setProfileEdit({...profileEdit, phone: e.target.value})}
                className="w-full bg-[#F5F5F4] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-black/5 transition-all outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-black/40 uppercase mb-1">URL da Foto</label>
              <input 
                type="url" 
                value={profileEdit.photo_url}
                onChange={e => setProfileEdit({...profileEdit, photo_url: e.target.value})}
                className="w-full bg-[#F5F5F4] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-black/5 transition-all outline-none"
                placeholder="https://..."
              />
            </div>
          </div>
          <button type="submit" className="w-full bg-black text-white py-4 rounded-xl font-semibold hover:bg-black/80 transition-all shadow-lg shadow-black/10 flex items-center justify-center gap-2">
            <Save size={18} /> Salvar Alterações
          </button>
        </form>
      </section>
    </div>
  );
};
