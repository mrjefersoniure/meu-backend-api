import React from 'react';
import { ArrowRightLeft, Package, Hash } from 'lucide-react';
import { Product } from '../types';

interface UsageFormProps {
  products: Product[];
  onUsage: (e: React.FormEvent) => void;
}

export const UsageForm: React.FC<UsageFormProps> = ({ products, onUsage }) => {
  return (
    <div className="max-w-xl mx-auto">
      <section className="bg-white rounded-3xl p-8 shadow-sm border border-black/5">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <ArrowRightLeft size={20} className="text-black/40" />
          Registrar Uso Imediato
        </h2>
        <form onSubmit={onUsage} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold text-black/40 uppercase mb-1">Produto</label>
            <div className="relative">
              <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20" size={18} />
              <select 
                name="product_id"
                required
                className="w-full bg-[#F5F5F4] border-none rounded-xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-black/5 transition-all outline-none appearance-none"
              >
                <option value="">Selecione um produto...</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.quantity} {p.unit} disponíveis)</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-black/40 uppercase mb-1">Quantidade Utilizada</label>
            <div className="relative">
              <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20" size={18} />
              <input 
                name="quantity"
                required
                type="number" 
                min="1"
                placeholder="0"
                className="w-full bg-[#F5F5F4] border-none rounded-xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-black/5 transition-all outline-none"
              />
            </div>
          </div>
          <button type="submit" className="w-full bg-black text-white py-4 rounded-xl font-semibold hover:bg-black/80 transition-all shadow-lg shadow-black/10">
            Confirmar Retirada
          </button>
        </form>
      </section>
    </div>
  );
};
