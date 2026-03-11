import React, { useState } from 'react';
import { Users, Plus, Edit2, Trash2, Eye } from 'lucide-react';
import { User } from '../types';
import { UserPreviewModal } from './UserPreviewModal';

interface UserListProps {
  users: User[];
  currentUser: User;
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
  onAdd: () => void;
}

export const UserList: React.FC<UserListProps> = ({ 
  users, 
  currentUser, 
  onEdit, 
  onDelete, 
  onAdd 
}) => {
  const [previewUser, setPreviewUser] = useState<User | null>(null);

  return (
    <section className="bg-white rounded-2xl p-6 shadow-sm border border-black/5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Users size={20} className="text-black/40" />
          Funcionários Cadastrados
        </h2>
        <button 
          onClick={onAdd}
          className="w-full sm:w-auto bg-black text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-black/80 transition-all"
        >
          <Plus size={14} /> Cadastrar Funcionário
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-black/5 text-xs uppercase tracking-wider text-black/40 font-semibold">
              <th className="pb-4">Nome</th>
              <th className="pb-4">Usuário</th>
              <th className="pb-4">Cargo</th>
              <th className="pb-4">Email</th>
              <th className="pb-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {users.map(u => (
              <tr key={u.id} className="text-sm group hover:bg-black/5 transition-colors cursor-pointer" onClick={() => setPreviewUser(u)}>
                <td className="py-4 font-medium flex items-center gap-3">
                  {u.photo_url ? (
                    <img src={u.photo_url} className="w-8 h-8 rounded-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center text-[10px] font-bold">
                      {u.name.charAt(0)}
                    </div>
                  )}
                  {u.name}
                </td>
                <td className="py-4 text-black/60">{u.username}</td>
                <td className="py-4">
                  <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${u.role === 'manager' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
                    {u.role === 'manager' ? 'Gestor' : 'Funcionário'}
                  </span>
                </td>
                <td className="py-4 text-black/40">{u.email}</td>
                <td className="py-4 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setPreviewUser(u); }}
                      className="p-2 text-black/40 hover:text-indigo-500 transition-colors"
                    >
                      <Eye size={16} />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); onEdit(u); }}
                      className="p-2 text-black/40 hover:text-black transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); onDelete(u.id); }}
                      className="p-2 text-black/40 hover:text-red-500 transition-colors"
                      disabled={u.id === currentUser.id}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <UserPreviewModal 
        isOpen={!!previewUser} 
        onClose={() => setPreviewUser(null)} 
        user={previewUser} 
      />
    </section>
  );
};
