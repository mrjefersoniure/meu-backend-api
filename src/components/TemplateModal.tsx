import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, FileStack, Plus, Trash2 } from 'lucide-react';

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  template: any;
  setTemplate: (template: any) => void;
}

export const TemplateModal: React.FC<TemplateModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  template,
  setTemplate
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6 no-print">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-black/5 flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <FileStack size={20} className="text-black/40" />
                Novo Template de Inventário
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={onSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-black/40 uppercase mb-1">Nome do Template</label>
                  <input 
                    required
                    type="text" 
                    value={template.name}
                    onChange={e => setTemplate({...template, name: e.target.value})}
                    className="w-full bg-[#F5F5F4] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-black/5 transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-black/40 uppercase mb-1">Descrição</label>
                  <input 
                    required
                    type="text" 
                    value={template.description}
                    onChange={e => setTemplate({...template, description: e.target.value})}
                    className="w-full bg-[#F5F5F4] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-black/5 transition-all outline-none"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-black/40">Itens do Template</h3>
                  <button 
                    type="button"
                    onClick={() => setTemplate({
                      ...template, 
                      items: [...template.items, { name: '', category: '', unit: 'un', min_quantity: 5, max_quantity: 50 }]
                    })}
                    className="text-xs font-bold text-blue-600 flex items-center gap-1"
                  >
                    <Plus size={14} /> Adicionar Item
                  </button>
                </div>
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                  {template.items.map((item: any, idx: number) => (
                    <div key={idx} className="grid grid-cols-12 gap-2 bg-[#F5F5F4] p-3 rounded-xl items-end">
                      <div className="col-span-4">
                        <label className="block text-[8px] font-bold text-black/30 uppercase mb-1">Nome</label>
                        <input 
                          required
                          className="w-full bg-white rounded-lg px-2 py-1.5 text-xs outline-none"
                          value={item.name}
                          onChange={e => {
                            const newItems = [...template.items];
                            newItems[idx].name = e.target.value;
                            setTemplate({...template, items: newItems});
                          }}
                        />
                      </div>
                      <div className="col-span-3">
                        <label className="block text-[8px] font-bold text-black/30 uppercase mb-1">Categoria</label>
                        <input 
                          required
                          className="w-full bg-white rounded-lg px-2 py-1.5 text-xs outline-none"
                          value={item.category}
                          onChange={e => {
                            const newItems = [...template.items];
                            newItems[idx].category = e.target.value;
                            setTemplate({...template, items: newItems});
                          }}
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-[8px] font-bold text-black/30 uppercase mb-1">Unidade</label>
                        <input 
                          required
                          className="w-full bg-white rounded-lg px-2 py-1.5 text-xs outline-none"
                          value={item.unit}
                          onChange={e => {
                            const newItems = [...template.items];
                            newItems[idx].unit = e.target.value;
                            setTemplate({...template, items: newItems});
                          }}
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-[8px] font-bold text-black/30 uppercase mb-1">Mín/Máx</label>
                        <div className="flex gap-1">
                          <input 
                            type="number"
                            className="w-full bg-white rounded-lg px-1 py-1.5 text-[10px] outline-none"
                            value={item.min_quantity}
                            onChange={e => {
                              const newItems = [...template.items];
                              newItems[idx].min_quantity = parseInt(e.target.value);
                              setTemplate({...template, items: newItems});
                            }}
                          />
                        </div>
                      </div>
                      <div className="col-span-1 flex justify-center pb-1.5">
                        <button 
                          type="button"
                          onClick={() => setTemplate({
                            ...template,
                            items: template.items.filter((_: any, i: number) => i !== idx)
                          })}
                          className="text-red-400 hover:text-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button type="submit" className="w-full bg-black text-white py-4 rounded-xl font-semibold hover:bg-black/80 transition-all shadow-lg shadow-black/10">
                Criar Template
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
