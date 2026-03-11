import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Receipt, Trash2, FileSpreadsheet, Download, Sparkles, Loader2 } from 'lucide-react';
import { Product } from '../types';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  product: any;
  setProduct: (product: any) => void;
  isEditing: boolean;
  categories: string[];
  isProcessingReceipt?: boolean;
  onProcessReceipt?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  receiptItems?: any[];
  setReceiptItems?: (items: any[]) => void;
  onConfirmReceiptItems?: () => void;
  onProcessSpreadsheet?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchImage?: () => Promise<void>;
  isSearchingImage?: boolean;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  product,
  setProduct,
  isEditing,
  categories,
  isProcessingReceipt,
  onProcessReceipt,
  receiptItems = [],
  setReceiptItems,
  onConfirmReceiptItems,
  onProcessSpreadsheet,
  onSearchImage,
  isSearchingImage = false
}) => {
  const downloadTemplate = () => {
    const headers = "nome,categoria,quantidade,unidade,minimo,maximo\n";
    const example = "Papel A4,Escritório,50,resma,10,100\nCaneta Azul,Escritório,100,un,20,200";
    const blob = new Blob([headers + example], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'modelo_importacao_produtos.csv';
    a.click();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6 no-print">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-black/5 flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center gap-2">
                {isEditing ? <Plus size={20} className="text-black/40" /> : <Plus size={20} className="text-black/40" />}
                {isEditing ? 'Editar Produto' : 'Cadastrar Novo Produto'}
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto no-scrollbar">
              {!isEditing && onProcessReceipt && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex flex-col items-center justify-center gap-2 w-full py-4 bg-amber-50 text-amber-700 border border-amber-200 border-dashed rounded-2xl text-[10px] font-bold cursor-pointer hover:bg-amber-100 transition-all text-center px-2">
                    <Receipt size={18} />
                    {isProcessingReceipt ? 'Processando...' : 'Via Cupom Fiscal'}
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={onProcessReceipt}
                      disabled={isProcessingReceipt}
                    />
                  </label>
                  <div className="flex flex-col gap-2">
                    <label className="flex flex-col items-center justify-center gap-2 w-full py-4 bg-emerald-50 text-emerald-700 border border-emerald-200 border-dashed rounded-2xl text-[10px] font-bold cursor-pointer hover:bg-emerald-100 transition-all text-center px-2">
                      <FileSpreadsheet size={18} />
                      Via Planilha (CSV)
                      <input 
                        type="file" 
                        accept=".csv" 
                        className="hidden" 
                        onChange={onProcessSpreadsheet}
                      />
                    </label>
                    <button 
                      onClick={downloadTemplate}
                      className="flex items-center justify-center gap-1 text-[9px] text-emerald-600 font-bold hover:underline"
                    >
                      <Download size={10} /> Baixar Modelo
                    </button>
                  </div>
                </div>
              )}

              {receiptItems.length > 0 && setReceiptItems && onConfirmReceiptItems && (
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200">
                  <h3 className="text-xs font-bold text-amber-800 mb-4 uppercase tracking-wider">Conferir Itens Extraídos</h3>
                  <div className="space-y-2 mb-4 max-h-48 overflow-y-auto pr-2">
                    {receiptItems.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 bg-white p-3 rounded-xl border border-amber-100">
                        <input 
                          type="text" 
                          value={item.name}
                          onChange={e => {
                            const newItems = [...receiptItems];
                            newItems[idx].name = e.target.value;
                            setReceiptItems(newItems);
                          }}
                          className="flex-1 text-xs font-medium border-none focus:ring-0 p-0"
                        />
                        <input 
                          type="number" 
                          value={item.quantity}
                          onChange={e => {
                            const newItems = [...receiptItems];
                            newItems[idx].quantity = parseInt(e.target.value);
                            setReceiptItems(newItems);
                          }}
                          className="w-12 text-xs font-mono font-bold text-right border-none focus:ring-0 p-0"
                        />
                        <button onClick={() => setReceiptItems(receiptItems.filter((_, i) => i !== idx))} className="text-red-400">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={onConfirmReceiptItems} className="flex-1 bg-amber-600 text-white py-2 rounded-lg text-xs font-bold">Confirmar Todos</button>
                    <button onClick={() => setReceiptItems([])} className="px-3 bg-white text-amber-600 border border-amber-200 py-2 rounded-lg text-xs font-bold">Limpar</button>
                  </div>
                </div>
              )}

              <form onSubmit={onSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-black/40 uppercase mb-1">Nome do Produto</label>
                  <input 
                    required
                    type="text" 
                    value={product.name}
                    onChange={e => setProduct({...product, name: e.target.value})}
                    className="w-full bg-[#F5F5F4] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-black/5 transition-all outline-none"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-semibold text-black/40 uppercase">URL da Imagem (Opcional)</label>
                    {onSearchImage && product.name && (
                      <button 
                        type="button"
                        onClick={onSearchImage}
                        disabled={isSearchingImage}
                        className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 hover:text-indigo-700 transition-colors disabled:opacity-50"
                      >
                        {isSearchingImage ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                        {isSearchingImage ? 'Buscando...' : 'Sugerir com IA'}
                      </button>
                    )}
                  </div>
                  <input 
                    type="url" 
                    value={product.image_url || ''}
                    onChange={e => setProduct({...product, image_url: e.target.value})}
                    placeholder="https://exemplo.com/imagem.jpg"
                    className="w-full bg-[#F5F5F4] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-black/5 transition-all outline-none"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-black/40 uppercase mb-1">Categoria</label>
                    <input 
                      required
                      type="text" 
                      list="categories-list"
                      value={product.category}
                      onChange={e => setProduct({...product, category: e.target.value})}
                      className="w-full bg-[#F5F5F4] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-black/5 transition-all outline-none"
                      placeholder="Digite ou selecione..."
                    />
                    <datalist id="categories-list">
                      {categories.map(cat => (
                        <option key={cat} value={cat} />
                      ))}
                    </datalist>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-black/40 uppercase mb-1">Unidade</label>
                    <input 
                      required
                      type="text" 
                      value={product.unit}
                      onChange={e => setProduct({...product, unit: e.target.value})}
                      className="w-full bg-[#F5F5F4] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-black/5 transition-all outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-black/40 uppercase mb-1">{isEditing ? 'Quantidade' : 'Qtd Inicial'}</label>
                    <input 
                      required
                      type="number" 
                      value={product.quantity}
                      onChange={e => setProduct({...product, quantity: parseInt(e.target.value)})}
                      className="w-full bg-[#F5F5F4] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-black/5 transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-black/40 uppercase mb-1">Mínimo</label>
                    <input 
                      required
                      type="number" 
                      value={product.min_quantity}
                      onChange={e => setProduct({...product, min_quantity: parseInt(e.target.value)})}
                      className="w-full bg-[#F5F5F4] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-black/5 transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-black/40 uppercase mb-1">Máximo</label>
                    <input 
                      required
                      type="number" 
                      value={product.max_quantity}
                      onChange={e => setProduct({...product, max_quantity: parseInt(e.target.value)})}
                      className="w-full bg-[#F5F5F4] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-black/5 transition-all outline-none"
                    />
                  </div>
                </div>
                {!isEditing && (
                  <div className="flex items-center justify-between p-4 bg-[#F5F5F4] rounded-xl">
                    <span className="text-xs font-semibold text-black/40 uppercase">Status Inicial</span>
                    <button
                      type="button"
                      onClick={() => setProduct({...product, active: product.active === 1 ? 0 : 1})}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                        product.active === 1 
                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                        : 'bg-gray-400 text-white'
                      }`}
                    >
                      {product.active === 1 ? 'Ativo' : 'Desabilitado'}
                    </button>
                  </div>
                )}
                <button type="submit" className="w-full bg-black text-white py-4 rounded-xl font-semibold hover:bg-black/80 transition-all shadow-lg shadow-black/10">
                  {isEditing ? 'Salvar Alterações' : 'Cadastrar Produto'}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
