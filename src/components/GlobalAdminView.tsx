import React from 'react';
import { motion } from 'motion/react';
import { 
  Building2, 
  FileStack, 
  Users, 
  TrendingDown, 
  Plus, 
  Edit2, 
  Trash2, 
  ArrowRightLeft, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import { Unit, InventoryTemplate, User, Product } from '../types';
import { API_URL } from '../config';

interface GlobalAdminViewProps {
  globalSubView: 'units' | 'templates' | 'all_users' | 'replenishment';
  setGlobalSubView: (view: 'units' | 'templates' | 'all_users' | 'replenishment') => void;
  units: Unit[];
  setEditingUnit: (unit: Unit | null) => void;
  setIsRegisteringUnit: (is: boolean) => void;
  handleDeleteUnit: (id: number) => Promise<void>;
  setSelectedUnitId: (id: number | null) => void;
  setView: (view: 'global_admin' | 'manager' | 'employee') => void;
  fetchData: (unitId?: number | null, userRole?: string) => Promise<void>;
  templates: InventoryTemplate[];
  setIsRegisteringTemplate: (is: boolean) => void;
  globalReplenishment: { unit_id: number; unit_name: string; low_stock_count: number }[];
  setManagerSubView: (view: any) => void;
  allUsers: User[];
}

export const GlobalAdminView: React.FC<GlobalAdminViewProps> = ({
  globalSubView,
  setGlobalSubView,
  units,
  setEditingUnit,
  setIsRegisteringUnit,
  handleDeleteUnit,
  setSelectedUnitId,
  setView,
  fetchData,
  templates,
  setIsRegisteringTemplate,
  globalReplenishment,
  setManagerSubView,
  allUsers
}) => {
  return (
    <motion.div 
      key="global"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-8"
    >
      <div className="flex gap-4 border-b border-black/5 pb-4 no-print overflow-x-auto no-scrollbar">
        <button 
          onClick={() => setGlobalSubView('units')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${globalSubView === 'units' ? 'bg-black text-white' : 'bg-white text-black/50 hover:text-black'}`}
        >
          <Building2 size={16} /> Unidades
        </button>
        <button 
          onClick={() => setGlobalSubView('templates')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${globalSubView === 'templates' ? 'bg-black text-white' : 'bg-white text-black/50 hover:text-black'}`}
        >
          <FileStack size={16} /> Templates
        </button>
        <button 
          onClick={() => setGlobalSubView('all_users')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${globalSubView === 'all_users' ? 'bg-black text-white' : 'bg-white text-black/50 hover:text-black'}`}
        >
          <Users size={16} /> Todos Usuários
        </button>
        <button 
          onClick={() => setGlobalSubView('replenishment')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${globalSubView === 'replenishment' ? 'bg-black text-white' : 'bg-white text-black/50 hover:text-black'}`}
        >
          <TrendingDown size={16} /> Reposição Global
        </button>
      </div>

      {globalSubView === 'units' && (
        <div className="space-y-6">
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-black/5">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Building2 size={20} className="text-black/40" />
                Unidades de Negócio
              </h2>
              <button 
                onClick={() => {
                  setEditingUnit(null);
                  setIsRegisteringUnit(true);
                }}
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
                        onClick={() => {
                          setEditingUnit(unit);
                          setIsRegisteringUnit(true);
                        }}
                        className="p-2 text-black/20 hover:text-blue-500 transition-colors"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button 
                        onClick={() => handleDeleteUnit(unit.id)}
                        className="p-2 text-black/20 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button 
                      onClick={() => {
                        setSelectedUnitId(unit.id);
                        setView('manager');
                        fetchData(unit.id);
                      }}
                      className="flex-1 text-[10px] font-bold uppercase tracking-wider bg-black text-white px-3 py-2 rounded-lg hover:bg-black/80 transition-all flex items-center justify-center gap-2"
                    >
                      <ArrowRightLeft size={12} /> Gerenciar
                    </button>
                    <button 
                      onClick={async () => {
                        const templateId = prompt('ID do Template para provisionar:');
                        if (templateId) {
                          const res = await fetch(`${API_URL}/api/units/${unit.id}/provision`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ template_id: parseInt(templateId) })
                          });
                          if (res.ok) alert('Unidade provisionada com sucesso!');
                        }
                      }}
                      className="flex-1 text-[10px] font-bold uppercase tracking-wider bg-black/5 px-3 py-2 rounded-lg hover:bg-black hover:text-white transition-all"
                    >
                      Provisionar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {globalSubView === 'templates' && (
        <div className="space-y-6">
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-black/5">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <FileStack size={20} className="text-black/40" />
                Templates de Inventário
              </h2>
              <button 
                onClick={() => setIsRegisteringTemplate(true)}
                className="bg-black text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-black/80 transition-all"
              >
                <Plus size={14} /> Novo Template
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map(template => (
                <div key={template.id} className="p-6 rounded-2xl border border-black/5 bg-white">
                  <h3 className="font-bold mb-2">{template.name}</h3>
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
        </div>
      )}

      {globalSubView === 'replenishment' && (
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-black/5">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <TrendingDown size={20} className="text-black/40" />
            Unidades com Necessidade de Reposição
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {globalReplenishment.length === 0 ? (
              <div className="col-span-full py-12 text-center">
                <div className="bg-green-50 text-green-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check size={24} />
                </div>
                <p className="text-black/40 font-medium">Todas as unidades estão com estoque em dia!</p>
              </div>
            ) : (
              globalReplenishment.map(item => (
                <div key={item.unit_id} className="p-6 rounded-2xl border border-red-100 bg-red-50/30 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-lg mb-1">{item.unit_name}</h3>
                    <div className="flex items-center gap-2 text-red-600 mb-4">
                      <AlertCircle size={14} />
                      <span className="text-xs font-bold uppercase tracking-wider">{item.low_stock_count} itens abaixo do mínimo</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setSelectedUnitId(item.unit_id);
                      setView('manager');
                      setManagerSubView('replenishment');
                      fetchData(item.unit_id);
                    }}
                    className="w-full bg-red-600 text-white py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-red-700 transition-all flex items-center justify-center gap-2"
                  >
                    Ver Lista de Reposição <ArrowRightLeft size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      )}

      {globalSubView === 'all_users' && (
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-black/5">
          <h2 className="text-lg font-semibold mb-6">Todos os Usuários do Sistema</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-black/5 text-xs uppercase tracking-wider text-black/40 font-semibold">
                  <th className="pb-4">Nome</th>
                  <th className="pb-4">Unidade</th>
                  <th className="pb-4">Cargo</th>
                  <th className="pb-4">Email</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {allUsers.map(u => (
                  <tr key={u.id} className="text-sm">
                    <td className="py-4 font-bold">{u.name}</td>
                    <td className="py-4 text-black/60">{units.find(un => un.id === u.unit_id)?.name || 'Global'}</td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                        u.role === 'global_admin' ? 'bg-purple-100 text-purple-700' :
                        u.role === 'manager' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-4 text-black/40">{u.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </motion.div>
  );
};
