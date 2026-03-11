import React from 'react';
import { Package, ClipboardList, TrendingUp } from 'lucide-react';
import { Stats } from '../types';

interface StatsSummaryProps {
  stats: Stats;
}

export const StatsSummary: React.FC<StatsSummaryProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-black/5 flex items-center gap-4">
        <div className="bg-blue-50 text-blue-600 p-3 rounded-xl">
          <Package size={24} />
        </div>
        <div>
          <p className="text-xs text-black/40 uppercase font-bold">Total de Produtos</p>
          <p className="text-2xl font-bold">{stats.summary.total_products}</p>
        </div>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-black/5 flex items-center gap-4">
        <div className="bg-amber-50 text-amber-600 p-3 rounded-xl">
          <ClipboardList size={24} />
        </div>
        <div>
          <p className="text-xs text-black/40 uppercase font-bold">Pedidos Pendentes</p>
          <p className="text-2xl font-bold">{stats.summary.pending_requests}</p>
        </div>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-black/5 flex items-center gap-4">
        <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl">
          <TrendingUp size={24} />
        </div>
        <div>
          <p className="text-xs text-black/40 uppercase font-bold">Itens em Estoque</p>
          <p className="text-2xl font-bold">{stats.summary.total_items_in_stock}</p>
        </div>
      </div>
    </div>
  );
};
