import React from 'react';
import { ClipboardList, Check, X } from 'lucide-react';
import { Request } from '../types';

interface RequestListProps {
  requests: Request[];
  onUpdateStatus: (id: number, status: 'approved' | 'rejected') => void;
}

export const RequestList: React.FC<RequestListProps> = ({ requests, onUpdateStatus }) => {
  const pendingRequests = requests.filter(r => r.status === 'pending');

  return (
    <section className="bg-white rounded-2xl p-6 shadow-sm border border-black/5">
      <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
        <ClipboardList size={20} className="text-black/40" />
        Solicitações Pendentes
      </h2>
      <div className="space-y-4">
        {pendingRequests.length === 0 ? (
          <p className="text-sm text-black/40 italic text-center py-8">Nenhuma solicitação pendente.</p>
        ) : (
          pendingRequests.map(req => (
            <div key={req.id} className="p-4 rounded-xl bg-[#F5F5F4] border border-black/5">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold text-sm">Pedido #{req.id}</p>
                  <p className="text-xs text-black/40">{req.employee_name}</p>
                </div>
                <p className="text-[10px] text-black/30 font-mono">
                  {new Date(req.request_date).toLocaleDateString()}
                </p>
              </div>
              <div className="space-y-1 mb-4">
                {req.items?.map((item, idx) => (
                  <p key={idx} className="text-xs font-medium">• {item.product_name} ({item.quantity} {item.unit})</p>
                ))}
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => onUpdateStatus(req.id, 'approved')}
                  className="flex-1 bg-emerald-500 text-white py-2 rounded-lg text-xs font-bold hover:bg-emerald-600 transition-all flex items-center justify-center gap-1"
                >
                  <Check size={14} /> Aprovar
                </button>
                <button 
                  onClick={() => onUpdateStatus(req.id, 'rejected')}
                  className="flex-1 bg-red-500 text-white py-2 rounded-lg text-xs font-bold hover:bg-red-600 transition-all flex items-center justify-center gap-1"
                >
                  <X size={14} /> Recusar
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};
