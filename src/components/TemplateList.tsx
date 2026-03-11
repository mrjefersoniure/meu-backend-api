import React from 'react';
import { FileStack, Plus, Edit2, Trash2 } from 'lucide-react';
import { InventoryTemplate } from '../types';

interface TemplateListProps {
  templates: InventoryTemplate[];
  onAdd: () => void;
  onEdit: (template: InventoryTemplate) => void;
  onDelete: (id: number) => void;
}

export const TemplateList: React.FC<TemplateListProps> = ({ templates, onAdd, onEdit, onDelete }) => {
  return (
    <section className="bg-white rounded-2xl p-6 shadow-sm border border-black/5">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <FileStack size={20} className="text-black/40" />
          Templates de Inventário
        </h2>
        <button 
          onClick={onAdd}
          className="bg-black text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-black/80 transition-all"
        >
          <Plus size={14} /> Novo Template
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map(template => (
          <div key={template.id} className="p-6 rounded-2xl border border-black/5 bg-white relative group">
            <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => onEdit(template)}
                className="p-2 text-black/40 hover:text-black hover:bg-black/5 rounded-lg transition-all"
              >
                <Edit2 size={16} />
              </button>
              <button 
                onClick={() => onDelete(template.id)}
                className="p-2 text-black/40 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <h3 className="font-bold mb-2 pr-16">{template.name}</h3>
            <p className="text-xs text-black/40 mb-4">{template.description}</p>
            <div className="space-y-1">
              {template.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-[10px] text-black/60">
                  <span>• {item.name}</span>
                  <span className="text-black/30 italic">{item.category}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
