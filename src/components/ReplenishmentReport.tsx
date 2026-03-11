import React from 'react';
import { TrendingDown, FileText } from 'lucide-react';
import { Product } from '../types';

interface ReplenishmentReportProps {
  products: Product[];
  onPrint: () => void;
}

export const ReplenishmentReport: React.FC<ReplenishmentReportProps> = ({ products, onPrint }) => {
  const lowStockProducts = products.filter(p => p.quantity <= p.min_quantity);

  return (
    <section className="bg-white rounded-2xl p-4 sm:p-8 shadow-sm border border-black/5 print-card">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 no-print gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            <TrendingDown size={24} className="text-red-500" />
            Lista de Reposição
          </h2>
          <p className="text-black/40 text-xs sm:text-sm mt-1">Produtos que atingiram o nível mínimo.</p>
        </div>
        <button 
          onClick={onPrint}
          className="w-full sm:w-auto bg-black text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-black/80 transition-all shadow-lg shadow-black/10"
        >
          <FileText size={18} />
          Exportar / Imprimir
        </button>
      </div>

      {/* Print Header */}
      <div className="hidden print-only mb-8 text-center border-b pb-6">
        <h1 className="text-2xl font-bold uppercase tracking-widest">Relatório de Reposição de Estoque</h1>
        <p className="text-sm text-black/60 mt-2">Gerado em: {new Date().toLocaleString()}</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-black/10 text-xs uppercase tracking-wider text-black/40 font-bold">
              <th className="pb-4">Produto</th>
              <th className="pb-4">Categoria</th>
              <th className="pb-4 text-right">Estoque Atual</th>
              <th className="pb-4 text-right">Mínimo</th>
              <th className="pb-4 text-right">Máximo</th>
              <th className="pb-4 text-right text-red-600">Necessidade</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {lowStockProducts.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-black/40 italic">
                  Nenhum produto necessita de reposição no momento.
                </td>
              </tr>
            ) : (
              lowStockProducts.map(product => (
                <tr key={product.id} className="text-sm">
                  <td className="py-4 font-bold">{product.name}</td>
                  <td className="py-4 text-black/60">{product.category}</td>
                  <td className="py-4 text-right font-mono font-bold text-red-500">{product.quantity} {product.unit}</td>
                  <td className="py-4 text-right font-mono text-black/40">{product.min_quantity} {product.unit}</td>
                  <td className="py-4 text-right font-mono text-black/40">{product.max_quantity} {product.unit}</td>
                  <td className="py-4 text-right font-mono font-bold text-emerald-600">
                    + {Math.max(0, product.max_quantity - product.quantity)} {product.unit}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="hidden print-only mt-12 pt-8 border-t text-center text-[10px] text-black/40 uppercase tracking-widest font-bold">
        Documento Interno - Almoxarifado Inteligente
      </div>
    </section>
  );
};
