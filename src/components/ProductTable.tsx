import React from 'react';
import { Package, Plus, Edit2, Trash2, ShoppingCart, ArrowRightLeft, Image as ImageIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { Product } from '../types';

interface ProductTableProps {
  products: Product[];
  onEdit?: (product: Product) => void;
  onDelete?: (id: number) => void;
  onToggle?: (id: number) => void;
  onAdd?: () => void;
  isEmployee?: boolean;
  employeeSubView?: 'request' | 'usage' | 'profile';
  onAddToCart?: (product: Product) => void;
  onUseProduct?: (productId: number, quantity: number) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({ 
  products, 
  onEdit, 
  onDelete, 
  onToggle, 
  onAdd,
  isEmployee = false,
  employeeSubView,
  onAddToCart,
  onUseProduct
}) => {
  if (isEmployee) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => {
          const level = product.max_quantity > 0 ? Math.min(Math.round((product.quantity / product.max_quantity) * 100), 100) : 0;
          
          return (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl overflow-hidden shadow-sm border border-black/5 flex flex-col group hover:shadow-xl hover:shadow-black/5 transition-all"
            >
              <div className="aspect-square bg-[#F5F5F4] relative overflow-hidden">
                {product.image_url ? (
                  <img 
                    src={product.image_url} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-black/10">
                    <ImageIcon size={48} />
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">
                    {product.category}
                  </span>
                </div>
                {product.quantity <= product.min_quantity && (
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-red-500 text-white rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg shadow-red-500/20">
                      Baixo Estoque
                    </span>
                  </div>
                )}
              </div>
              
              <div className="p-5 flex-1 flex flex-col">
                <div className="mb-4">
                  <h3 className="font-bold text-lg leading-tight mb-1">{product.name}</h3>
                  <div className="flex items-end gap-1">
                    <span className="text-2xl font-mono font-bold">{product.quantity}</span>
                    <span className="text-xs text-black/40 font-bold uppercase mb-1">{product.unit} disponíveis</span>
                  </div>
                </div>

                <div className="mt-auto space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-black/40">
                      <span>Nível de Estoque</span>
                      <span>{level}%</span>
                    </div>
                    <div className="h-1.5 bg-black/5 rounded-full overflow-hidden">
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

                  {employeeSubView === 'request' ? (
                    <button 
                      onClick={() => onAddToCart?.(product)}
                      disabled={product.quantity <= 0}
                      className="w-full bg-black text-white py-3 rounded-2xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-black/80 transition-all disabled:bg-black/10 disabled:text-black/20 shadow-lg shadow-black/5"
                    >
                      <ShoppingCart size={14} /> Adicionar ao Pedido
                    </button>
                  ) : employeeSubView === 'usage' ? (
                    <button 
                      onClick={() => {
                        const qty = prompt(`Quantidade de ${product.name} a utilizar:`, "1");
                        if (qty && parseInt(qty) > 0) {
                          onUseProduct?.(product.id, parseInt(qty));
                        }
                      }}
                      disabled={product.quantity <= 0}
                      className="w-full bg-emerald-600 text-white py-3 rounded-2xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all disabled:bg-emerald-600/10 disabled:text-emerald-600/20 shadow-lg shadow-emerald-600/10"
                    >
                      <ArrowRightLeft size={14} /> Registrar Uso
                    </button>
                  ) : null}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  }

  return (
    <section className="bg-white rounded-2xl p-6 shadow-sm border border-black/5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Package size={20} className="text-black/40" />
          Estoque Atual
        </h2>
        {!isEmployee && (
          <button 
            onClick={onAdd}
            className="w-full sm:w-auto bg-black text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-black/80 transition-all"
          >
            <Plus size={14} /> Cadastrar Produto
          </button>
        )}
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-black/5 text-xs uppercase tracking-wider text-black/40 font-semibold">
              <th className="pb-4">Produto</th>
              <th className="pb-4">Categoria</th>
              <th className="pb-4 text-right">Estoque</th>
              {!isEmployee && <th className="pb-4 text-right">Mínimo</th>}
              <th className="pb-4 px-6">Nível</th>
              {!isEmployee && <th className="pb-4">Status</th>}
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
                    <div className="flex items-center gap-3">
                      {product.image_url ? (
                        <img src={product.image_url} className="w-10 h-10 rounded-lg object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-black/5 flex items-center justify-center text-black/20">
                          <ImageIcon size={16} />
                        </div>
                      )}
                      <div className="font-medium text-sm">{product.name}</div>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className="text-xs px-2 py-1 bg-black/5 rounded-md text-black/60">{product.category}</span>
                  </td>
                  <td className="py-4 text-right font-mono text-sm">
                    <span className="font-bold">{product.quantity}</span>
                    <span className="text-[10px] ml-1 text-black/40 uppercase">{product.unit}</span>
                  </td>
                  {!isEmployee && (
                    <td className="py-4 text-right font-mono text-sm text-black/40">
                      {product.min_quantity}
                      <span className="text-[10px] ml-1 uppercase">{product.unit}</span>
                    </td>
                  )}
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
                  {!isEmployee && (
                    <td className="py-4">
                      <button 
                        onClick={() => onToggle?.(product.id)}
                        className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all hover:scale-105 ${status.color}`}
                      >
                        {status.label}
                      </button>
                    </td>
                  )}
                  <td className="py-4 text-right">
                    <div className="flex justify-end gap-1">
                      <div className="flex justify-end gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => onEdit?.(product)}
                          className="p-2 text-black/40 hover:text-black hover:bg-black/5 rounded-lg transition-all"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => onDelete?.(product.id)}
                          className="p-2 text-black/40 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};
