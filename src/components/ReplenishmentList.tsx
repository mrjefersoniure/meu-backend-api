import React from 'react';
import { TrendingDown, Check, AlertCircle, ArrowRightLeft } from 'lucide-react';

interface ReplenishmentItem {
  unit_id: number;
  unit_name: string;
  low_stock_count: number;
}

interface ReplenishmentListProps {
  items: ReplenishmentItem[];
  onViewUnit: (unitId: number) => void;
}

export const ReplenishmentList: React.FC<ReplenishmentListProps> = ({ items, onViewUnit }) => {
  return (
    <section className="bg-white rounded-2xl p-6 shadow-sm border border-black/5">
      <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
        <TrendingDown size={20} className="text-black/40" />
        Unidades com Necessidade de Reposição
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.length === 0 ? (
          <div className="col-span-full py-12 text-center">
            <div className="bg-green-50 text-green-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={24} />
            </div>
            <p className="text-black/40 font-medium">Todas as unidades estão com estoque em dia!</p>
          </div>
        ) : (
          items.map(item => (
            <div key={item.unit_id} className="p-6 rounded-2xl border border-red-100 bg-red-50/30 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-lg mb-1">{item.unit_name}</h3>
                <div className="flex items-center gap-2 text-red-600 mb-4">
                  <AlertCircle size={14} />
                  <span className="text-xs font-bold uppercase tracking-wider">{item.low_stock_count} itens abaixo do mínimo</span>
                </div>
              </div>
              <button 
                onClick={() => onViewUnit(item.unit_id)}
                className="w-full bg-red-600 text-white py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-red-700 transition-all flex items-center justify-center gap-2"
              >
                Ver Lista de Reposição <ArrowRightLeft size={14} />
              </button>
            </div>
          ))
        )}
      </div>
    </section>
  );
};
