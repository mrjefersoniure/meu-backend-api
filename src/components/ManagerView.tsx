import React from 'react';
import { motion } from 'motion/react';
import { 
  Package, 
  BarChart3, 
  FileText, 
  Users, 
  TrendingDown, 
  Plus, 
  Edit2, 
  Trash2, 
  ClipboardList, 
  Check, 
  X, 
  AlertCircle,
  TrendingUp,
  History,
  ArrowRightLeft
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { User, Product, Request, UsageLog, Stats } from '../types';

interface ManagerViewProps {
  managerSubView: 'overview' | 'dashboard' | 'reports' | 'users' | 'replenishment';
  setManagerSubView: (view: 'overview' | 'dashboard' | 'reports' | 'users' | 'replenishment') => void;
  allUsers: User[];
  setIsRegisteringUser: (is: boolean) => void;
  setEditingUser: (user: User | null) => void;
  handleDeleteUser: (id: number) => Promise<void>;
  user: User;
  products: Product[];
  setIsRegisteringProduct: (is: boolean) => void;
  handleToggleProduct: (id: number) => Promise<void>;
  setEditingProduct: (product: Product | null) => void;
  handleDeleteProduct: (id: number) => Promise<void>;
  requests: Request[];
  handleUpdateStatus: (id: number, status: 'approved' | 'rejected') => Promise<void>;
  stats: Stats | null;
  handlePrintReplenishment: () => void;
  usageLogs: UsageLog[];
}

export const ManagerView: React.FC<ManagerViewProps> = ({
  managerSubView,
  setManagerSubView,
  allUsers,
  setIsRegisteringUser,
  setEditingUser,
  handleDeleteUser,
  user,
  products,
  setIsRegisteringProduct,
  handleToggleProduct,
  setEditingProduct,
  handleDeleteProduct,
  requests,
  handleUpdateStatus,
  stats,
  handlePrintReplenishment,
  usageLogs
}) => {
  return (
    <motion.div 
      key="manager"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-8"
    >
      {/* Manager Sub-Nav */}
      <div className="flex gap-4 border-b border-black/5 pb-4 no-print overflow-x-auto no-scrollbar">
        <button 
          onClick={() => setManagerSubView('overview')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${managerSubView === 'overview' ? 'bg-black text-white' : 'bg-white text-black/50 hover:text-black'}`}
        >
          <Package size={16} /> Produtos
        </button>
        <button 
          onClick={() => setManagerSubView('dashboard')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${managerSubView === 'dashboard' ? 'bg-black text-white' : 'bg-white text-black/50 hover:text-black'}`}
        >
          <BarChart3 size={16} /> Dashboards
        </button>
        <button 
          onClick={() => setManagerSubView('reports')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${managerSubView === 'reports' ? 'bg-black text-white' : 'bg-white text-black/50 hover:text-black'}`}
        >
          <FileText size={16} /> Relatórios
        </button>
        <button 
          onClick={() => setManagerSubView('users')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${managerSubView === 'users' ? 'bg-black text-white' : 'bg-white text-black/50 hover:text-black'}`}
        >
          <Users size={16} /> Funcionários
        </button>
        <button 
          onClick={() => setManagerSubView('replenishment')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${managerSubView === 'replenishment' ? 'bg-black text-white' : 'bg-white text-black/50 hover:text-black'}`}
        >
          <TrendingDown size={16} /> Reposição
        </button>
      </div>

      {managerSubView === 'users' && (
        <div className="grid grid-cols-1 gap-8">
          <div className="space-y-8">
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-black/5">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Users size={20} className="text-black/40" />
                  Funcionários Cadastrados
                </h2>
                <button 
                  onClick={() => setIsRegisteringUser(true)}
                  className="w-full sm:w-auto bg-black text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-black/80 transition-all"
                >
                  <Plus size={14} /> Cadastrar Funcionário
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-black/5 text-xs uppercase tracking-wider text-black/40 font-semibold">
                      <th className="pb-4">Nome</th>
                      <th className="pb-4">Usuário</th>
                      <th className="pb-4">Cargo</th>
                      <th className="pb-4">Email</th>
                      <th className="pb-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5">
                    {allUsers.map(u => (
                      <tr key={u.id} className="text-sm group hover:bg-black/5 transition-colors">
                        <td className="py-4 font-medium flex items-center gap-3">
                          {u.photo_url ? (
                            <img src={u.photo_url} className="w-8 h-8 rounded-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center text-[10px] font-bold">
                              {u.name.charAt(0)}
                            </div>
                          )}
                          {u.name}
                        </td>
                        <td className="py-4 text-black/60">{u.username}</td>
                        <td className="py-4">
                          <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${u.role === 'manager' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
                            {u.role === 'manager' ? 'Gestor' : 'Funcionário'}
                          </span>
                        </td>
                        <td className="py-4 text-black/40">{u.email}</td>
                        <td className="py-4 text-right">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => setEditingUser(u)}
                              className="p-2 text-black/40 hover:text-black transition-colors"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button 
                              onClick={() => handleDeleteUser(u.id)}
                              className="p-2 text-black/40 hover:text-red-500 transition-colors"
                              disabled={u.id === user.id}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </div>
      )}

      {managerSubView === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Inventory Management */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-black/5">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Package size={20} className="text-black/40" />
                  Estoque Atual
                </h2>
                <button 
                  onClick={() => setIsRegisteringProduct(true)}
                  className="w-full sm:w-auto bg-black text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-black/80 transition-all"
                >
                  <Plus size={14} /> Cadastrar Produto
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-black/5 text-xs uppercase tracking-wider text-black/40 font-semibold">
                      <th className="pb-4">Produto</th>
                      <th className="pb-4">Categoria</th>
                      <th className="pb-4 text-right">Estoque</th>
                      <th className="pb-4 text-right">Mínimo</th>
                      <th className="pb-4 px-6">Nível</th>
                      <th className="pb-4">Status</th>
                      <th className="pb-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5">
                    {products.map(product => {
                      const level = product.max_quantity > 0 ? Math.min(Math.round((product.quantity / product.max_quantity) * 100), 100) : 0;
                      let status = { label: 'Normal', color: 'bg-blue-50 text-blue-600' };
                      
                      if (product.active === 0) {
                        status = { label: 'Desabilitado', color: 'bg-gray-100 text-gray-500' };
                      } else if (product.quantity <= 0) {
                        status = { label: 'Esgotado', color: 'bg-red-50 text-red-600' };
                      } else if (product.quantity <= product.min_quantity) {
                        status = { label: 'Crítico', color: 'bg-orange-50 text-orange-600' };
                      } else if (product.quantity <= product.min_quantity * 1.2) {
                        status = { label: 'Baixo', color: 'bg-yellow-50 text-yellow-600' };
                      } else if (product.quantity >= product.max_quantity) {
                        status = { label: 'Cheio', color: 'bg-emerald-50 text-emerald-600' };
                      }

                      return (
                        <tr key={product.id} className={`group hover:bg-black/5 transition-colors ${product.active === 0 ? 'opacity-60' : ''}`}>
                          <td className="py-4">
                            <div className="font-medium text-sm">{product.name}</div>
                          </td>
                          <td className="py-4">
                            <span className="text-xs px-2 py-1 bg-black/5 rounded-md text-black/60">{product.category}</span>
                          </td>
                          <td className="py-4 text-right font-mono text-sm">
                            <span className="font-bold">{product.quantity}</span>
                            <span className="text-[10px] ml-1 text-black/40 uppercase">{product.unit}</span>
                          </td>
                          <td className="py-4 text-right font-mono text-sm text-black/40">
                            {product.min_quantity}
                            <span className="text-[10px] ml-1 uppercase">{product.unit}</span>
                          </td>
                          <td className="py-4 px-6 min-w-[120px]">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-1.5 bg-black/5 rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${level}%` }}
                                  className={`h-full rounded-full ${
                                    product.active === 0 ? 'bg-gray-300' :
                                    level < 20 ? 'bg-red-500' : 
                                    level < 50 ? 'bg-orange-500' : 
                                    'bg-emerald-500'
                                  }`}
                                />
                              </div>
                              <span className="text-[10px] font-mono text-black/40 w-8 text-right">{level}%</span>
                            </div>
                          </td>
                          <td className="py-4">
                            <button 
                              onClick={() => handleToggleProduct(product.id)}
                              className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all hover:scale-105 ${status.color}`}
                            >
                              {status.label}
                            </button>
                          </td>
                          <td className="py-4 text-right">
                            <div className="flex justify-end gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => setEditingProduct(product)}
                                className="p-2 text-black/40 hover:text-black hover:bg-black/5 rounded-lg transition-all"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button 
                                onClick={() => handleDeleteProduct(product.id)}
                                className="p-2 text-black/40 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* Right: Pending Requests */}
          <div className="space-y-8">
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-black/5">
              <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <ClipboardList size={20} className="text-black/40" />
                Solicitações Pendentes
              </h2>
              <div className="space-y-4">
                {requests.filter(r => r.status === 'pending').length === 0 ? (
                  <p className="text-sm text-black/40 italic text-center py-8">Nenhuma solicitação pendente.</p>
                ) : (
                    requests.filter(r => r.status === 'pending').map(req => (
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
                            onClick={() => handleUpdateStatus(req.id, 'approved')}
                            className="flex-1 bg-emerald-500 text-white py-2 rounded-lg text-xs font-bold hover:bg-emerald-600 transition-all flex items-center justify-center gap-1"
                          >
                            <Check size={14} /> Aprovar
                          </button>
                          <button 
                            onClick={() => handleUpdateStatus(req.id, 'rejected')}
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

            <section className="bg-white rounded-2xl p-6 shadow-sm border border-black/5">
              <h2 className="text-lg font-semibold mb-4 text-xs uppercase tracking-widest text-black/40">Histórico Recente</h2>
              <div className="space-y-3">
                {requests.filter(r => r.status !== 'pending').slice(0, 5).map(req => (
                  <div key={req.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${req.status === 'approved' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                      <span className="text-black/60">Pedido #{req.id}</span>
                    </div>
                    <span className="text-xs font-mono text-black/30">{req.employee_name}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      )}

      {managerSubView === 'dashboard' && stats && (
        <div className="space-y-8">
          {/* Summary Cards */}
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top 10 Usage Chart */}
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-black/5">
              <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <TrendingUp size={20} className="text-emerald-500" />
                Top 10 Produtos Mais Utilizados
              </h2>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.topUsage} layout="vertical" margin={{ left: 40, right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                    <XAxis type="number" hide />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      axisLine={false} 
                      tickLine={false} 
                      fontSize={12} 
                      width={100}
                    />
                    <Tooltip 
                      cursor={{ fill: '#f5f5f4' }}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                    <Bar dataKey="total" radius={[0, 4, 4, 0]}>
                      {stats.topUsage.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#000' : '#444'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>

            {/* Restock Dashboard (Reposição) */}
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-black/5">
              <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <TrendingDown size={20} className="text-red-500" />
                Reposição de Estoque (Nível Crítico)
              </h2>
              <div className="space-y-4">
                {stats.lowStock.length === 0 ? (
                  <div className="text-center py-12">
                    <Check size={48} className="mx-auto text-emerald-500 mb-2 opacity-20" />
                    <p className="text-sm text-black/40">Todos os níveis de estoque estão saudáveis.</p>
                  </div>
                ) : (
                  stats.lowStock.map(product => (
                    <div key={product.id} className="flex items-center justify-between p-4 rounded-xl bg-red-50 border border-red-100">
                      <div className="flex items-center gap-3">
                        <AlertCircle size={20} className="text-red-500" />
                        <div>
                          <p className="font-semibold text-sm">{product.name}</p>
                          <p className="text-xs text-red-600/60">{product.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-mono font-bold text-red-600">{product.quantity}</p>
                        <p className="text-[10px] text-red-600/40 uppercase">Mín: {product.min_quantity} {product.unit}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        </div>
      )}

      {managerSubView === 'replenishment' && (
        <div className="space-y-8">
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
                onClick={handlePrintReplenishment}
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
                  {products.filter(p => p.quantity <= p.min_quantity).length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-black/40 italic">
                        Nenhum produto necessita de reposição no momento.
                      </td>
                    </tr>
                  ) : (
                    products.filter(p => p.quantity <= p.min_quantity).map(product => (
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
        </div>
      )}

      {managerSubView === 'reports' && (
        <div className="space-y-8">
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
                  {/* Combine requests and usage logs for a full report */}
                  {[
                    ...requests.map(r => ({ ...r, type: 'Solicitação', date: r.request_date })),
                    ...usageLogs.map(u => ({ ...u, type: 'Uso Direto', date: u.usage_date, status: 'approved' as const }))
                  ]
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((item, idx) => (
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
        </div>
      )}
    </motion.div>
  );
};
