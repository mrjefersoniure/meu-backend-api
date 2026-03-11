import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Edit2, 
  AlertCircle, 
  Building2, 
  FileStack, 
  Plus, 
  Trash2, 
  Receipt, 
  UserPlus 
} from 'lucide-react';
import { 
  Product, 
  ConfirmationState, 
  Unit, 
  InventoryTemplate, 
  User 
} from '../types';

interface ModalsProps {
  editingProduct: Product | null;
  setEditingProduct: (product: Product | null) => void;
  handleEditProduct: (e: React.FormEvent) => Promise<void>;
  confirmation: ConfirmationState;
  setConfirmation: (state: ConfirmationState | ((prev: ConfirmationState) => ConfirmationState)) => void;
  isRegisteringUnit: boolean;
  setIsRegisteringUnit: (is: boolean) => void;
  editingUnit: Unit | null;
  setEditingUnit: (unit: Unit | null) => void;
  handleRegisterUnit: (e: React.FormEvent) => Promise<void>;
  isRegisteringTemplate: boolean;
  setIsRegisteringTemplate: (is: boolean) => void;
  handleRegisterTemplate: (e: React.FormEvent) => Promise<void>;
  newTemplate: Partial<InventoryTemplate>;
  setNewTemplate: (template: any) => void;
  isRegisteringProduct: boolean;
  setIsRegisteringProduct: (is: boolean) => void;
  isProcessingReceipt: boolean;
  handleProcessReceipt: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  receiptItems: any[];
  setReceiptItems: (items: any[]) => void;
  handleConfirmReceiptItems: () => Promise<void>;
  handleAddProduct: (e: React.FormEvent) => Promise<void>;
  newProduct: Partial<Product>;
  setNewProduct: (product: any) => void;
  categories: string[];
  isRegisteringUser: boolean;
  setIsRegisteringUser: (is: boolean) => void;
  handleRegisterUser: (e: React.FormEvent) => Promise<void>;
  newUser: any;
  setNewUser: (user: any) => void;
  editingUser: User | null;
  setEditingUser: (user: User | null) => void;
  handleEditUser: (e: React.FormEvent) => Promise<void>;
}

export const Modals: React.FC<ModalsProps> = ({
  editingProduct,
  setEditingProduct,
  handleEditProduct,
  confirmation,
  setConfirmation,
  isRegisteringUnit,
  setIsRegisteringUnit,
  editingUnit,
  setEditingUnit,
  handleRegisterUnit,
  isRegisteringTemplate,
  setIsRegisteringTemplate,
  handleRegisterTemplate,
  newTemplate,
  setNewTemplate,
  isRegisteringProduct,
  setIsRegisteringProduct,
  isProcessingReceipt,
  handleProcessReceipt,
  receiptItems,
  setReceiptItems,
  handleConfirmReceiptItems,
  handleAddProduct,
  newProduct,
  setNewProduct,
  categories,
  isRegisteringUser,
  setIsRegisteringUser,
  handleRegisterUser,
  newUser,
  setNewUser,
  editingUser,
  setEditingUser,
  handleEditUser
}) => {
  return (
    <>
      {/* Edit Product Modal */}
      <AnimatePresence>
        {editingProduct && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-black/5 flex justify-between items-center">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Edit2 size={20} className="text-black/40" />
                  Editar Produto
                </h2>
                <button onClick={() => setEditingProduct(null)} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleEditProduct} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-black/40 uppercase mb-1">Nome do Produto</label>
                  <input 
                    required
                    type="text" 
                    value={editingProduct.name}
                    onChange={e => setEditingProduct({...editingProduct, name: e.target.value})}
                    className="w-full bg-[#F5F5F4] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-black/5 transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-black/40 uppercase mb-1">Categoria</label>
                  <input 
                    required
                    type="text" 
                    list="categories-list"
                    value={editingProduct.category}
                    onChange={e => setEditingProduct({...editingProduct, category: e.target.value})}
                    className="w-full bg-[#F5F5F4] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-black/5 transition-all outline-none"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-black/40 uppercase mb-1">Quantidade</label>
                    <input 
                      required
                      type="number" 
                      value={editingProduct.quantity}
                      onChange={e => setEditingProduct({...editingProduct, quantity: parseInt(e.target.value)})}
                      className="w-full bg-[#F5F5F4] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-black/5 transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-black/40 uppercase mb-1">Unidade</label>
                    <input 
                      required
                      type="text" 
                      value={editingProduct.unit}
                      onChange={e => setEditingProduct({...editingProduct, unit: e.target.value})}
                      className="w-full bg-[#F5F5F4] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-black/5 transition-all outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-black/40 uppercase mb-1">Qtd Mínima</label>
                    <input 
                      required
                      type="number" 
                      value={editingProduct.min_quantity}
                      onChange={e => setEditingProduct({...editingProduct, min_quantity: parseInt(e.target.value)})}
                      className="w-full bg-[#F5F5F4] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-black/5 transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-black/40 uppercase mb-1">Qtd Máxima</label>
                    <input 
                      required
                      type="number" 
                      value={editingProduct.max_quantity}
                      onChange={e => setEditingProduct({...editingProduct, max_quantity: parseInt(e.target.value)})}
                      className="w-full bg-[#F5F5F4] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-black/5 transition-all outline-none"
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button 
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="flex-1 bg-[#F5F5F4] text-black py-4 rounded-xl font-semibold hover:bg-[#E4E3E0] transition-all"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 bg-black text-white py-4 rounded-xl font-semibold hover:bg-black/80 transition-all shadow-lg shadow-black/10"
                  >
                    Salvar Alterações
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {confirmation.isOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-6 no-print">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 text-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  confirmation.type === 'danger' ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-500'
                }`}>
                  <AlertCircle size={32} />
                </div>
                <h2 className="text-xl font-bold mb-2">{confirmation.title}</h2>
                <p className="text-sm text-black/40 mb-8">{confirmation.message}</p>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setConfirmation(prev => ({ ...prev, isOpen: false }))}
                    className="flex-1 px-4 py-3 rounded-xl font-bold text-sm bg-[#F5F5F4] text-black hover:bg-black/5 transition-all"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={confirmation.onConfirm}
                    className={`flex-1 px-4 py-3 rounded-xl font-bold text-sm text-white transition-all ${
                      confirmation.type === 'danger' ? 'bg-red-500 hover:bg-red-600' : 'bg-amber-500 hover:bg-amber-600'
                    }`}
                  >
                    Confirmar
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Register Unit Modal */}
      <AnimatePresence>
        {isRegisteringUnit && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6 no-print">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-black/5 flex justify-between items-center">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Building2 size={20} className="text-black/40" />
                  {editingUnit ? 'Editar Unidade' : 'Nova Unidade'}
                </h2>
                <button onClick={() => { setIsRegisteringUnit(false); setEditingUnit(null); }} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleRegisterUnit} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-black/40 uppercase mb-1">Nome da Unidade</label>
                  <input 
                    name="name"
                    required
                    type="text" 
                    defaultValue={editingUnit?.name || ''}
                    className="w-full bg-[#F5F5F4] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-black/5 transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-black/40 uppercase mb-1">Endereço</label>
                  <input 
                    name="address"
                    required
                    type="text" 
                    defaultValue={editingUnit?.address || ''}
                    className="w-full bg-[#F5F5F4] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-black/5 transition-all outline-none"
                  />
                </div>
                <button type="submit" className="w-full bg-black text-white py-4 rounded-xl font-semibold hover:bg-black/80 transition-all shadow-lg shadow-black/10">
                  {editingUnit ? 'Salvar Alterações' : 'Criar Unidade'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Register Template Modal */}
      <AnimatePresence>
        {isRegisteringTemplate && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6 no-print">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-black/5 flex justify-between items-center">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <FileStack size={20} className="text-black/40" />
                  Novo Template de Inventário
                </h2>
                <button onClick={() => setIsRegisteringTemplate(false)} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleRegisterTemplate} className="p-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-black/40 uppercase mb-1">Nome do Template</label>
                    <input 
                      required
                      type="text" 
                      value={newTemplate.name}
                      onChange={e => setNewTemplate({...newTemplate, name: e.target.value})}
                      className="w-full bg-[#F5F5F4] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-black/5 transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-black/40 uppercase mb-1">Descrição</label>
                    <input 
                      required
                      type="text" 
                      value={newTemplate.description}
                      onChange={e => setNewTemplate({...newTemplate, description: e.target.value})}
                      className="w-full bg-[#F5F5F4] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-black/5 transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-black/40">Itens do Template</h3>
                    <button 
                      type="button"
                      onClick={() => setNewTemplate({
                        ...newTemplate, 
                        items: [...(newTemplate.items || []), { name: '', category: '', unit: 'un', min_quantity: 5, max_quantity: 50 }]
                      })}
                      className="text-xs font-bold text-blue-600 flex items-center gap-1"
                    >
                      <Plus size={14} /> Adicionar Item
                    </button>
                  </div>
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                    {(newTemplate.items || []).map((item: any, idx: number) => (
                      <div key={idx} className="grid grid-cols-12 gap-2 bg-[#F5F5F4] p-3 rounded-xl items-end">
                        <div className="col-span-4">
                          <label className="block text-[8px] font-bold text-black/30 uppercase mb-1">Nome</label>
                          <input 
                            required
                            className="w-full bg-white rounded-lg px-2 py-1.5 text-xs outline-none"
                            value={item.name}
                            onChange={e => {
                              const newItems = [...(newTemplate.items || [])];
                              newItems[idx].name = e.target.value;
                              setNewTemplate({...newTemplate, items: newItems});
                            }}
                          />
                        </div>
                        <div className="col-span-3">
                          <label className="block text-[8px] font-bold text-black/30 uppercase mb-1">Categoria</label>
                          <input 
                            required
                            className="w-full bg-white rounded-lg px-2 py-1.5 text-xs outline-none"
                            value={item.category}
                            onChange={e => {
                              const newItems = [...(newTemplate.items || [])];
                              newItems[idx].category = e.target.value;
                              setNewTemplate({...newTemplate, items: newItems});
                            }}
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-[8px] font-bold text-black/30 uppercase mb-1">Unidade</label>
                          <input 
                            required
                            className="w-full bg-white rounded-lg px-2 py-1.5 text-xs outline-none"
                            value={item.unit}
                            onChange={e => {
                              const newItems = [...(newTemplate.items || [])];
                              newItems[idx].unit = e.target.value;
                              setNewTemplate({...newTemplate, items: newItems});
                            }}
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-[8px] font-bold text-black/30 uppercase mb-1">Mín/Máx</label>
                          <div className="flex gap-1">
                            <input 
                              type="number"
                              className="w-full bg-white rounded-lg px-1 py-1.5 text-[10px] outline-none"
                              value={item.min_quantity}
                              onChange={e => {
                                const newItems = [...(newTemplate.items || [])];
                                newItems[idx].min_quantity = parseInt(e.target.value);
                                setNewTemplate({...newTemplate, items: newItems});
                              }}
                            />
                          </div>
                        </div>
                        <div className="col-span-1 flex justify-center pb-1.5">
                          <button 
                            type="button"
                            onClick={() => setNewTemplate({
                              ...newTemplate,
                              items: (newTemplate.items || []).filter((_: any, i: number) => i !== idx)
                            })}
                            className="text-red-400 hover:text-red-600"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button type="submit" className="w-full bg-black text-white py-4 rounded-xl font-semibold hover:bg-black/80 transition-all shadow-lg shadow-black/10">
                  Criar Template
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Register Product Modal */}
      <AnimatePresence>
        {isRegisteringProduct && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6 no-print">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-black/5 flex justify-between items-center">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Plus size={20} className="text-black/40" />
                  Cadastrar Novo Produto
                </h2>
                <button onClick={() => setIsRegisteringProduct(false)} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <label className="flex items-center justify-center gap-2 w-full py-4 bg-amber-50 text-amber-700 border border-amber-200 border-dashed rounded-2xl text-sm font-bold cursor-pointer hover:bg-amber-100 transition-all">
                  <Receipt size={18} />
                  {isProcessingReceipt ? 'Processando...' : 'Cadastrar via Cupom Fiscal'}
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleProcessReceipt}
                    disabled={isProcessingReceipt}
                  />
                </label>

                {receiptItems.length > 0 && (
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
                      <button onClick={handleConfirmReceiptItems} className="flex-1 bg-amber-600 text-white py-2 rounded-lg text-xs font-bold">Confirmar Todos</button>
                      <button onClick={() => setReceiptItems([])} className="px-3 bg-white text-amber-600 border border-amber-200 py-2 rounded-lg text-xs font-bold">Limpar</button>
                    </div>
                  </div>
                )}

                <form onSubmit={handleAddProduct} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-black/40 uppercase mb-1">Nome do Produto</label>
                    <input 
                      required
                      type="text" 
                      value={newProduct.name}
                      onChange={e => setNewProduct({...newProduct, name: e.target.value})}
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
                      value={newProduct.category}
                      onChange={e => setNewProduct({...newProduct, category: e.target.value})}
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
                      value={newProduct.unit}
                      onChange={e => setNewProduct({...newProduct, unit: e.target.value})}
                      className="w-full bg-[#F5F5F4] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-black/5 transition-all outline-none"
                    />
                  </div>
                </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-black/40 uppercase mb-1">Qtd Inicial</label>
                      <input 
                        required
                        type="number" 
                        value={newProduct.quantity}
                        onChange={e => setNewProduct({...newProduct, quantity: parseInt(e.target.value)})}
                        className="w-full bg-[#F5F5F4] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-black/5 transition-all outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-black/40 uppercase mb-1">Mínimo</label>
                      <input 
                        required
                        type="number" 
                        value={newProduct.min_quantity}
                        onChange={e => setNewProduct({...newProduct, min_quantity: parseInt(e.target.value)})}
                        className="w-full bg-[#F5F5F4] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-black/5 transition-all outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-black/40 uppercase mb-1">Máximo</label>
                      <input 
                        required
                        type="number" 
                        value={newProduct.max_quantity}
                        onChange={e => setNewProduct({...newProduct, max_quantity: parseInt(e.target.value)})}
                        className="w-full bg-[#F5F5F4] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-black/5 transition-all outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-[#F5F5F4] rounded-xl">
                    <span className="text-xs font-semibold text-black/40 uppercase">Status Inicial</span>
                    <button
                      type="button"
                      onClick={() => setNewProduct({...newProduct, active: newProduct.active === 1 ? 0 : 1})}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                        newProduct.active === 1 
                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                        : 'bg-gray-400 text-white'
                      }`}
                    >
                      {newProduct.active === 1 ? 'Ativo' : 'Desabilitado'}
                    </button>
                  </div>
                  <button type="submit" className="w-full bg-black text-white py-4 rounded-xl font-semibold hover:bg-black/80 transition-all shadow-lg shadow-black/10">
                    Cadastrar Produto
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Register User Modal */}
      <AnimatePresence>
        {isRegisteringUser && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6 no-print">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-black/5 flex justify-between items-center">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <UserPlus size={20} className="text-black/40" />
                  Cadastrar Funcionário
                </h2>
                <button onClick={() => setIsRegisteringUser(false)} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleRegisterUser} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-black/40 uppercase mb-1">Nome Completo</label>
                  <input 
                    required
                    type="text" 
                    value={newUser.name}
                    onChange={e => setNewUser({...newUser, name: e.target.value})}
                    className="w-full bg-[#F5F5F4] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-black/5 transition-all outline-none"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-black/40 uppercase mb-1">Usuário</label>
                    <input 
                      required
                      type="text" 
                      value={newUser.username}
                      onChange={e => setNewUser({...newUser, username: e.target.value})}
                      className="w-full bg-[#F5F5F4] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-black/5 transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-black/40 uppercase mb-1">Senha</label>
                    <input 
                      required
                      type="password" 
                      value={newUser.password}
                      onChange={e => setNewUser({...newUser, password: e.target.value})}
                      className="w-full bg-[#F5F5F4] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-black/5 transition-all outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-black/40 uppercase mb-1">Email</label>
                  <input 
                    required
                    type="email" 
                    value={newUser.email}
                    onChange={e => setNewUser({...newUser, email: e.target.value})}
                    className="w-full bg-[#F5F5F4] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-black/5 transition-all outline-none"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-black/40 uppercase mb-1">Telefone</label>
                    <input 
                      required
                      type="tel" 
                      value={newUser.phone}
                      onChange={e => setNewUser({...newUser, phone: e.target.value})}
                      className="w-full bg-[#F5F5F4] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-black/5 transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-black/40 uppercase mb-1">Cargo</label>
                    <select 
                      value={newUser.role}
                      onChange={e => setNewUser({...newUser, role: e.target.value as any})}
                      className="w-full bg-[#F5F5F4] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-black/5 transition-all outline-none"
                    >
                      <option value="employee">Funcionário</option>
                      <option value="manager">Gestor</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="w-full bg-black text-white py-4 rounded-xl font-semibold hover:bg-black/80 transition-all shadow-lg shadow-black/10 mt-2">
                  Finalizar Cadastro
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit User Modal */}
      <AnimatePresence>
        {editingUser && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6 no-print">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-black/5 flex justify-between items-center">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Edit2 size={20} className="text-black/40" />
                  Editar Funcionário
                </h2>
                <button onClick={() => setEditingUser(null)} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleEditUser} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-black/40 uppercase mb-1">Nome Completo</label>
                  <input 
                    required
                    type="text" 
                    value={editingUser.name}
                    onChange={e => setEditingUser({...editingUser, name: e.target.value})}
                    className="w-full bg-[#F5F5F4] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-black/5 transition-all outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-black/40 uppercase mb-1">Usuário</label>
                    <input 
                      required
                      type="text" 
                      value={editingUser.username}
                      onChange={e => setEditingUser({...editingUser, username: e.target.value})}
                      className="w-full bg-[#F5F5F4] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-black/5 transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-black/40 uppercase mb-1">Cargo</label>
                    <select 
                      value={editingUser.role}
                      onChange={e => setEditingUser({...editingUser, role: e.target.value as any})}
                      className="w-full bg-[#F5F5F4] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-black/5 transition-all outline-none"
                    >
                      <option value="employee">Funcionário</option>
                      <option value="manager">Gestor</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-black/40 uppercase mb-1">Email</label>
                  <input 
                    required
                    type="email" 
                    value={editingUser.email}
                    onChange={e => setEditingUser({...editingUser, email: e.target.value})}
                    className="w-full bg-[#F5F5F4] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-black/5 transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-black/40 uppercase mb-1">Telefone</label>
                  <input 
                    required
                    type="tel" 
                    value={editingUser.phone}
                    onChange={e => setEditingUser({...editingUser, phone: e.target.value})}
                    className="w-full bg-[#F5F5F4] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-black/5 transition-all outline-none"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button 
                    type="button"
                    onClick={() => setEditingUser(null)}
                    className="flex-1 bg-[#F5F5F4] text-black py-4 rounded-xl font-semibold hover:bg-[#E4E3E0] transition-all"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 bg-black text-white py-4 rounded-xl font-semibold hover:bg-black/80 transition-all shadow-lg shadow-black/10"
                  >
                    Salvar Alterações
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
