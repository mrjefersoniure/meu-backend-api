import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Building2 } from 'lucide-react';

interface UnitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isEditing: boolean;
  editingUnit?: any;
  templates?: any[];
}

export const UnitModal: React.FC<UnitModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isEditing,
  editingUnit,
  templates = []
}) => {
  return (
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
                <Building2 size={20} className="text-black/40" />
                {isEditing ? 'Editar Unidade' : 'Nova Unidade'}
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={onSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-black/40 uppercase mb-1">Nome da Unidade</label>
                <input 
                  name="name"
                  required
                  type="text" 
                  defaultValue={editingUnit?.name || ''}
                  className="w-full bg-[#F5F5F4] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-black/5 transition-all outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-black/40 uppercase mb-1">Endereço</label>
                <input 
                  name="address"
                  required
                  type="text" 
                  defaultValue={editingUnit?.address || ''}
                  className="w-full bg-[#F5F5F4] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-black/5 transition-all outline-none"
                />
              </div>

              {!isEditing && (
                <div>
                  <label className="block text-xs font-semibold text-black/40 uppercase mb-1">Template de Inventário (Opcional)</label>
                  <select 
                    name="template_id"
                    className="w-full bg-[#F5F5F4] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-black/5 transition-all outline-none appearance-none"
                  >
                    <option value="">Nenhum template</option>
                    {templates.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                  <p className="text-[10px] text-black/40 mt-1 italic">Ao selecionar um template, a unidade já será criada com os produtos pré-cadastrados.</p>
                </div>
              )}

              <button type="submit" className="w-full bg-black text-white py-4 rounded-xl font-semibold hover:bg-black/80 transition-all shadow-lg shadow-black/10">
                {isEditing ? 'Salvar Alterações' : 'Criar Unidade'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
