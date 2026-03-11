import React from 'react';
import { Building2, Plus, Edit2, Trash2, ArrowRightLeft } from 'lucide-react';
import { Unit } from '../types';

interface UnitListProps {
  units: Unit[];
  onEdit: (unit: Unit) => void;
  onDelete: (id: number) => void;
  onAdd: () => void;
  onManage: (unitId: number) => void;
  onProvision: (unitId: number) => void;
}

export const UnitList: React.FC<UnitListProps> = ({ 
  units, 
  onEdit, 
  onDelete, 
  onAdd, 
  onManage, 
  onProvision 
}) => {
  return (
    <section className="bg-white rounded-2xl p-6 shadow-sm border border-black/5">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Building2 size={20} className="text-black/40" />
          Unidades de Negócio
        </h2>
        <button 
          onClick={onAdd}
          className="bg-black text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-black/80 transition-all"
        >
          <Plus size={14} /> Nova Unidade
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {units.map(unit => (
          <div key={unit.id} className="p-4 rounded-2xl border border-black/5 hover:border-black/20 transition-all bg-white group">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-bold text-lg">{unit.name}</h3>
                <p className="text-xs text-black/40">{unit.address}</p>
              </div>
              <div className="flex gap-1">
                <button 
                  onClick={() => onEdit(unit)}
                  className="p-2 text-black/20 hover:text-blue-500 transition-colors"
                >
                  <Edit2 size={14} />
                </button>
                <button 
                  onClick={() => onDelete(unit.id)}
                  className="p-2 text-black/20 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button 
                onClick={() => onManage(unit.id)}
                className="flex-1 text-[10px] font-bold uppercase tracking-wider bg-black text-white px-3 py-2 rounded-lg hover:bg-black/80 transition-all flex items-center justify-center gap-2"
              >
                <ArrowRightLeft size={12} /> Gerenciar
              </button>
              <button 
                onClick={() => onProvision(unit.id)}
                className="flex-1 text-[10px] font-bold uppercase tracking-wider bg-black/5 px-3 py-2 rounded-lg hover:bg-black hover:text-white transition-all"
              >
                Provisionar
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
