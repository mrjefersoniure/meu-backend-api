import React from 'react';
import { History } from 'lucide-react';

interface UsageLog {
  id: number;
  product_name: string;
  quantity: number;
  usage_date: string;
  employee_name: string;
}

interface UsageHistoryProps {
  logs: UsageLog[];
  userName: string;
}

export const UsageHistory: React.FC<UsageHistoryProps> = ({ logs, userName }) => {
  const userLogs = logs.filter(l => l.employee_name === userName).slice(0, 10);

  return (
    <section className="bg-white rounded-2xl p-6 shadow-sm border border-black/5">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <History size={20} className="text-black/40" />
        Histórico de Uso
      </h2>
      <div className="space-y-3">
        {userLogs.length === 0 ? (
          <p className="text-sm text-black/40 italic text-center py-4">Nenhum registro encontrado.</p>
        ) : (
          userLogs.map(log => (
            <div key={log.id} className="flex items-center justify-between p-3 rounded-xl bg-[#F5F5F4] border border-black/5">
              <div>
                <p className="text-sm font-semibold">{log.product_name}</p>
                <p className="text-[10px] text-black/40">{log.quantity} un • {new Date(log.usage_date).toLocaleDateString()}</p>
              </div>
              <div className="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-black text-white">
                Utilizado
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};
