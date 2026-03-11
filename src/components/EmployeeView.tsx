import React from 'react';
import { motion } from 'motion/react';
import { 
  ShoppingCart, 
  ArrowRightLeft, 
  User, 
  Camera, 
  Package, 
  Plus, 
  Trash2, 
  TrendingDown, 
  TrendingUp, 
  History, 
  ClipboardList,
  Check,
  X,
  AlertCircle
} from 'lucide-react';
import { User as UserType, Product, Request, UsageLog, CartItem } from '../types';

interface EmployeeViewProps {
  employeeSubView: 'request' | 'usage' | 'profile';
  setEmployeeSubView: (view: 'request' | 'usage' | 'profile') => void;
  user: UserType;
  profileEdit: Partial<UserType>;
  setProfileEdit: (profile: Partial<UserType>) => void;
  handleUpdateProfile: (e: React.FormEvent) => Promise<void>;
  products: Product[];
  handleAddToCart: (product: Product) => void;
  handleUseProduct: (id: number, quantity: number) => Promise<void>;
  cart: CartItem[];
  setCart: (cart: CartItem[]) => void;
  handleRemoveFromCart: (id: number) => void;
  handleCheckout: () => Promise<void>;
  usageLogs: UsageLog[];
  requests: Request[];
}

export const EmployeeView: React.FC<EmployeeViewProps> = ({
  employeeSubView,
  setEmployeeSubView,
  user,
  profileEdit,
  setProfileEdit,
  handleUpdateProfile,
  products,
  handleAddToCart,
  handleUseProduct,
  cart,
  setCart,
  handleRemoveFromCart,
  handleCheckout,
  usageLogs,
  requests
}) => {
  return (
    <motion.div 
      key="employee"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-8"
    >
      {/* Employee Sub-Nav */}
      <div className="flex gap-4 border-b border-black/5 pb-4 overflow-x-auto no-scrollbar">
        <button 
          onClick={() => setEmployeeSubView('request')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${employeeSubView === 'request' ? 'bg-black text-white' : 'bg-white text-black/50 hover:text-black'}`}
        >
          <ShoppingCart size={16} /> Solicitar Produtos
        </button>
        <button 
          onClick={() => setEmployeeSubView('usage')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${employeeSubView === 'usage' ? 'bg-black text-white' : 'bg-white text-black/50 hover:text-black'}`}
        >
          <ArrowRightLeft size={16} /> Registrar Uso Imediato
        </button>
        <button 
          onClick={() => setEmployeeSubView('profile')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${employeeSubView === 'profile' ? 'bg-black text-white' : 'bg-white text-black/50 hover:text-black'}`}
        >
          <User size={16} /> Meu Perfil
        </button>
      </div>

      {employeeSubView === 'profile' && (
        <div className="max-w-2xl mx-auto">
          <section className="bg-white rounded-3xl p-8 shadow-sm border border-black/5">
            <div className="flex flex-col items-center mb-8">
              <div className="relative group">
                {profileEdit.photo_url ? (
                  <img src={profileEdit.photo_url} className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-black/5 flex items-center justify-center text-4xl font-bold text-black/20 border-4 border-white shadow-lg">
                    {user.name.charAt(0)}
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                  <Camera className="text-white" size={24} />
                </div>
              </div>
              <h2 className="text-2xl font-bold mt-4">{user.name}</h2>
              <p className="text-black/40 uppercase tracking-widest text-[10px] font-bold">{user.role === 'manager' ? 'Gestor' : 'Funcionário'}</p>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-black/40 uppercase mb-1">Nome</label>
                  <input 
                    type="text" 
                    value={profileEdit.name || ''}
                    onChange={e => setProfileEdit({...profileEdit, name: e.target.value})}
                    className="w-full bg-[#F5F5F4] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-black/5 transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-black/40 uppercase mb-1">Email</label>
                  <input 
                    type="email" 
                    value={profileEdit.email || ''}
                    onChange={e => setProfileEdit({...profileEdit, email: e.target.value})}
                    className="w-full bg-[#F5F5F4] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-black/5 transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-black/40 uppercase mb-1">Telefone</label>
                  <input 
                    type="tel" 
                    value={profileEdit.phone || ''}
                    onChange={e => setProfileEdit({...profileEdit, phone: e.target.value})}
                    className="w-full bg-[#F5F5F4] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-black/5 transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-black/40 uppercase mb-1">URL da Foto</label>
                  <input 
                    type="text" 
                    value={profileEdit.photo_url || ''}
                    onChange={e => setProfileEdit({...profileEdit, photo_url: e.target.value})}
                    className="w-full bg-[#F5F5F4] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-black/5 transition-all outline-none"
                    placeholder="https://..."
                  />
                </div>
              </div>
              <button type="submit" className="w-full bg-black text-white py-4 rounded-xl font-semibold hover:bg-black/80 transition-all">
                Salvar Alterações
              </button>
            </form>
          </section>
        </div>
      )}

      {employeeSubView !== 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Product List */}
          <div className="lg:col-span-2">
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-black/5">
              <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <Package size={20} className="text-black/40" />
                Produtos Disponíveis
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {products.filter(p => p.active === 1).map(product => {
                  const level = product.max_quantity > 0 ? Math.min(Math.round((product.quantity / product.max_quantity) * 100), 100) : 0;
                  let status = { label: 'Normal', color: 'bg-blue-50 text-blue-600' };
                  
                  if (product.quantity <= 0) {
                    status = { label: 'Esgotado', color: 'bg-red-50 text-red-600' };
                  } else if (product.quantity <= product.min_quantity) {
                    status = { label: 'Crítico', color: 'bg-orange-50 text-orange-600' };
                  } else if (product.quantity <= product.min_quantity * 1.2) {
                    status = { label: 'Baixo', color: 'bg-yellow-50 text-yellow-600' };
                  } else if (product.quantity >= product.max_quantity) {
                    status = { label: 'Cheio', color: 'bg-emerald-50 text-emerald-600' };
                  }

                  return (
                    <div key={product.id} className="p-4 rounded-2xl border border-black/5 hover:border-black/20 transition-all group bg-white">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold">{product.name}</p>
                            <span className={`px-2 py-0.5 rounded-md text-[8px] font-bold uppercase tracking-wider ${status.color}`}>
                              {status.label}
                            </span>
                          </div>
                          <p className="text-[10px] text-black/40 uppercase tracking-wider">{product.category}</p>
                        </div>
                        <div className="text-right">
                          <p className={`text-lg font-mono font-bold ${product.quantity <= product.min_quantity ? 'text-red-500' : 'text-black'}`}>
                            {product.quantity}
                          </p>
                          <p className="text-[10px] text-black/40 uppercase">{product.unit}</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[9px] text-black/40 uppercase font-bold">Nível de Estoque</span>
                          <span className="text-[9px] font-mono text-black/40">{level}%</span>
                        </div>
                        <div className="h-1 bg-black/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${level}%` }}
                            className={`h-full rounded-full ${
                              level < 20 ? 'bg-red-500' : 
                              level < 50 ? 'bg-orange-500' : 
                              'bg-emerald-500'
                            }`}
                          />
                        </div>
                      </div>

                      <button 
                        disabled={product.quantity === 0}
                        onClick={() => {
                          if (employeeSubView === 'request') {
                            handleAddToCart(product);
                          } else {
                            handleUseProduct(product.id, 1);
                          }
                        }}
                        className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                          product.quantity === 0 
                          ? 'bg-black/5 text-black/20 cursor-not-allowed' 
                          : 'bg-black text-white hover:bg-black/80 shadow-sm'
                        }`}
                      >
                        <Plus size={14} /> {employeeSubView === 'request' ? 'Adicionar ao Carrinho' : 'Registrar Uso (1 un)'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          {/* Right: Cart/History */}
          <div className="space-y-8">
            {employeeSubView === 'request' ? (
              <section className="bg-white rounded-2xl p-6 shadow-sm border border-black/5 sticky top-24">
                <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                  <ShoppingCart size={20} className="text-black/40" />
                  Carrinho de Solicitação
                </h2>
                <div className="space-y-4 max-h-[400px] overflow-y-auto mb-6 pr-2">
                  {cart.length === 0 ? (
                    <p className="text-sm text-black/40 italic text-center py-8">Seu carrinho está vazio.</p>
                  ) : (
                    cart.map(item => (
                      <div key={item.product.id} className="flex items-center justify-between p-3 rounded-xl bg-[#F5F5F4] border border-black/5">
                        <div className="flex-1">
                          <p className="text-sm font-semibold">{item.product.name}</p>
                          <p className="text-[10px] text-black/40 uppercase">{item.product.unit}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center bg-white rounded-lg border border-black/5 px-2">
                            <button 
                              onClick={() => {
                                if (item.quantity > 1) {
                                  setCart(cart.map(c => c.product.id === item.product.id ? {...c, quantity: c.quantity - 1} : c));
                                }
                              }}
                              className="p-1 text-black/40 hover:text-black"
                            >
                              <TrendingDown size={14} />
                            </button>
                            <span className="w-8 text-center text-sm font-mono font-bold">{item.quantity}</span>
                            <button 
                              onClick={() => {
                                if (item.quantity < item.product.quantity) {
                                  setCart(cart.map(c => c.product.id === item.product.id ? {...c, quantity: c.quantity + 1} : c));
                                }
                              }}
                              className="p-1 text-black/40 hover:text-black"
                            >
                              <TrendingUp size={14} />
                            </button>
                          </div>
                          <button 
                            onClick={() => handleRemoveFromCart(item.product.id)}
                            className="p-2 text-red-500/40 hover:text-red-500"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <button 
                  disabled={cart.length === 0}
                  onClick={handleCheckout}
                  className={`w-full py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                    cart.length === 0 
                    ? 'bg-black/5 text-black/20 cursor-not-allowed' 
                    : 'bg-black text-white hover:bg-black/80 shadow-lg shadow-black/10'
                  }`}
                >
                  Finalizar Solicitação
                </button>
              </section>
            ) : (
              <section className="bg-white rounded-2xl p-6 shadow-sm border border-black/5">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <History size={20} className="text-black/40" />
                  Histórico de Uso
                </h2>
                <div className="space-y-3">
                  {usageLogs.filter(l => l.employee_name === user.name).slice(0, 10).map(log => (
                    <div key={log.id} className="flex items-center justify-between p-3 rounded-xl bg-[#F5F5F4] border border-black/5">
                      <div>
                        <p className="text-sm font-semibold">{log.product_name}</p>
                        <p className="text-[10px] text-black/40">{log.quantity} un • {new Date(log.usage_date).toLocaleDateString()}</p>
                      </div>
                      <div className="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-black text-white">
                        Utilizado
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section className="bg-white rounded-2xl p-6 shadow-sm border border-black/5">
              <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <ClipboardList size={20} className="text-black/40" />
                Minhas Solicitações
              </h2>
              <div className="space-y-4">
                {requests.filter(r => r.user_id === user.id).slice(0, 5).map(req => (
                  <div key={req.id} className="p-4 rounded-xl bg-[#F5F5F4] border border-black/5">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-semibold text-sm">Pedido #{req.id}</p>
                      <span className={`px-2 py-1 rounded-md text-[8px] font-bold uppercase tracking-wider ${
                        req.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                        req.status === 'rejected' ? 'bg-red-100 text-red-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {req.status === 'approved' ? 'Aprovado' : req.status === 'rejected' ? 'Recusado' : 'Pendente'}
                      </span>
                    </div>
                    <div className="space-y-1">
                      {req.items?.map((item, idx) => (
                        <p key={idx} className="text-[10px] text-black/60">• {item.product_name} ({item.quantity} {item.unit})</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      )}
    </motion.div>
  );
};
