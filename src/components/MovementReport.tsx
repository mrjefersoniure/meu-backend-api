import React from 'react';
import { History } from 'lucide-react';

interface MovementItem {
  id: number;
  type: string;
  date: string;
  product_name?: string;
  employee_name: string;
  quantity: number;
  status: 'pending' | 'approved' | 'rejected';
}

interface MovementReportProps {
  items: MovementItem[];
}

export const MovementReport: React.FC<MovementReportProps> = ({ items }) => {
  return (
    <section className="bg-white rounded-2xl p-6 shadow-sm border border-black/5">
      <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
        <History size={20} className="text-black/40" />
        Relatório Geral de Movimentações
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-black/5 text-xs uppercase tracking-wider text-black/40 font-semibold">
              <th className="pb-4">Data</th>
              <th className="pb-4">Tipo</th>
              <th className="pb-4">Produto</th>
              <th className="pb-4">Responsável</th>
              <th className="pb-4 text-right">Qtd</th>
              <th className="pb-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {items.map((item, idx) => (
              <tr key={idx} className="text-sm">
                <td className="py-4 font-mono text-xs text-black/40">{new Date(item.date).toLocaleString()}</td>
                <td className="py-4">
                  <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${item.type === 'Solicitação' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                    {item.type}
                  </span>
                </td>
                <td className="py-4 font-medium">
                  {item.type === 'Solicitação' ? `Pedido #${item.id}` : item.product_name}
                </td>
                <td className="py-4 text-black/60">{item.employee_name}</td>
                <td className="py-4 text-right font-mono">{item.quantity}</td>
                <td className="py-4 text-center">
                  <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                    item.status === 'approved' ? 'text-emerald-600' :
                    item.status === 'rejected' ? 'text-red-600' :
                    'text-amber-600'
                  }`}>
                    {item.status === 'approved' ? 'Aprovado' : item.status === 'rejected' ? 'Recusado' : 'Pendente'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
