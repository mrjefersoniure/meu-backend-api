import React from 'react';
import { ShoppingCart, Trash2, Check, Plus, Minus } from 'lucide-react';
import { CartItem } from '../types';

interface CartProps {
  cart: CartItem[];
  onUpdateQuantity: (productId: number, delta: number) => void;
  onRemove: (productId: number) => void;
  onCheckout: () => void;
}

export const Cart: React.FC<CartProps> = ({ cart, onUpdateQuantity, onRemove, onCheckout }) => {
  return (
    <section className="bg-white rounded-3xl p-6 shadow-sm border border-black/5 sticky top-24">
      <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
        <ShoppingCart size={20} className="text-black/40" />
        Carrinho de Solicitação
      </h2>
      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
        {cart.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart size={48} className="mx-auto text-black/5 mb-4" />
            <p className="text-sm text-black/40 italic">Seu carrinho está vazio.</p>
          </div>
        ) : (
          cart.map(item => (
            <div key={item.product.id} className="p-4 rounded-2xl bg-[#F5F5F4] border border-black/5 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-bold text-sm leading-tight">{item.product.name}</p>
                  <p className="text-[10px] text-black/40 uppercase font-bold mt-1">Disponível: {item.product.quantity} {item.product.unit}</p>
                </div>
                <button 
                  onClick={() => onRemove(item.product.id)}
                  className="p-1.5 text-black/20 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              
              <div className="flex items-center justify-between bg-white rounded-xl p-1 border border-black/5">
                <button 
                  onClick={() => onUpdateQuantity(item.product.id, -1)}
                  disabled={item.quantity <= 1}
                  className="p-2 text-black/40 hover:text-black disabled:opacity-20 transition-colors"
                >
                  <Minus size={14} />
                </button>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-mono font-bold">{item.quantity}</span>
                  <span className="text-[10px] text-black/40 uppercase font-bold">{item.product.unit}</span>
                </div>
                <button 
                  onClick={() => onUpdateQuantity(item.product.id, 1)}
                  disabled={item.quantity >= item.product.quantity}
                  className="p-2 text-black/40 hover:text-black disabled:opacity-20 transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      {cart.length > 0 && (
        <button 
          onClick={onCheckout}
          className="w-full bg-black text-white py-4 rounded-xl font-bold text-sm mt-6 hover:bg-black/80 transition-all flex items-center justify-center gap-2 shadow-lg shadow-black/10"
        >
          <Check size={18} /> Finalizar Solicitação
        </button>
      )}
    </section>
  );
};
