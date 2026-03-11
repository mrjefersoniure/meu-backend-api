/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { 
  Package, 
  ClipboardList, 
  Plus, 
  Check, 
  X, 
  User as UserIcon, 
  ShieldCheck,
  AlertCircle,
  ArrowRightLeft,
  LayoutDashboard,
  BarChart3,
  FileText,
  TrendingDown,
  TrendingUp,
  History,
  LogOut,
  Settings,
  Users,
  UserPlus,
  ShoppingCart,
  Trash2,
  Mail,
  Phone,
  Camera,
  Edit2,
  Receipt,
  Loader2,
  Building2,
  FileStack
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
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

import { 
  User, 
  Unit, 
  InventoryTemplate, 
  Product, 
  Request, 
  UsageLog, 
  Stats, 
  CartItem 
} from './types';

import { LoginForm } from './components/LoginForm';
import { Navbar } from './components/Navbar';
import { StatsSummary } from './components/StatsSummary';
import { ProductTable } from './components/ProductTable';
import { RequestList } from './components/RequestList';
import { UserList } from './components/UserList';
import { UnitList } from './components/UnitList';
import { TemplateList } from './components/TemplateList';
import { Cart } from './components/Cart';
import { ConfirmationModal } from './components/ConfirmationModal';
import { ProductModal } from './components/ProductModal';
import { UserModal } from './components/UserModal';
import { UnitModal } from './components/UnitModal';
import { TemplateModal } from './components/TemplateModal';
import { ReplenishmentList } from './components/ReplenishmentList';
import { MovementReport } from './components/MovementReport';
import { ReplenishmentReport } from './components/ReplenishmentReport';
import { ProfileSection } from './components/ProfileSection';
import { UsageForm } from './components/UsageForm';
import { UsageHistory } from './components/UsageHistory';
import { API_URL } from './config';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<'global_admin' | 'manager' | 'employee'>('employee');
  const [managerSubView, setManagerSubView] = useState<'overview' | 'dashboard' | 'reports' | 'users' | 'replenishment'>('overview');
  const [globalSubView, setGlobalSubView] = useState<'units' | 'templates' | 'all_users' | 'replenishment'>('units');
  const [employeeSubView, setEmployeeSubView] = useState<'request' | 'usage' | 'profile'>('request');
  const [products, setProducts] = useState<Product[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [usageLogs, setUsageLogs] = useState<UsageLog[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [templates, setTemplates] = useState<InventoryTemplate[]>([]);
  const [globalReplenishment, setGlobalReplenishment] = useState<{ unit_id: number; unit_name: string; low_stock_count: number }[]>([]);
  const [selectedUnitId, setSelectedUnitId] = useState<number | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Login state
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });

  // Form states
  const [newProduct, setNewProduct] = useState({ name: '', category: '', quantity: 0, min_quantity: 5, max_quantity: 50, unit: 'un', active: 1, image_url: '' });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'employee', name: '', email: '', phone: '' });
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [profileEdit, setProfileEdit] = useState<Partial<User>>({});

  // Modal states
  const [isRegisteringUser, setIsRegisteringUser] = useState(false);
  const [isRegisteringProduct, setIsRegisteringProduct] = useState(false);
  const [isRegisteringUnit, setIsRegisteringUnit] = useState(false);
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
  const [isRegisteringTemplate, setIsRegisteringTemplate] = useState(false);
  const [newTemplate, setNewTemplate] = useState({ name: '', description: '', items: [] as any[] });
  const [editingTemplate, setEditingTemplate] = useState<any>(null);
  const [confirmation, setConfirmation] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    type: 'danger' | 'warning';
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    type: 'warning'
  });

  // Receipt processing state
  const [isProcessingReceipt, setIsProcessingReceipt] = useState(false);
  const [receiptItems, setReceiptItems] = useState<{ name: string; quantity: number; category: string; unit: string }[]>([]);
  const [isSearchingImage, setIsSearchingImage] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (unitId?: number | null, userRole?: string) => {
    try {
      setLoading(true);
      const targetUnitId = unitId !== undefined ? unitId : selectedUnitId;
      const query = targetUnitId ? `?unit_id=${targetUnitId}` : '';
      const role = userRole || user?.role;
      
      const promises = [
        fetch(`${API_URL}/api/products${query}`).then(r => r.json()),
        fetch(`${API_URL}/api/requests${query}`).then(r => r.json()),
        fetch(`${API_URL}/api/usage${query}`).then(r => r.json()),
        fetch(`${API_URL}/api/stats${query}`).then(r => r.json()),
        fetch(`${API_URL}/api/users${query}`).then(r => r.json())
      ];

      if (role === `global_admin`) {
        promises.push(fetch(`${API_URL}/api/units`).then(r => r.json()));
        promises.push(fetch(`${API_URL}/api/templates`).then(r => r.json()));
        promises.push(fetch(`${API_URL}/api/stats/global`).then(r => r.json()));
      }

      const results = await Promise.all(promises);
      
      setProducts(results[0]);
      setRequests(results[1]);
      setUsageLogs(results[2]);
      setStats(results[3]);
      setAllUsers(results[4]);
      
      if (role === `global_admin`) {
        if (results[5]) setUnits(results[5]);
        if (results[6]) setTemplates(results[6]);
        if (results[7]) setGlobalReplenishment(results[7]);
      }
    } catch (err) {
      setError('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterUnit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const unitData = {
      name: formData.get('name'),
      address: formData.get('address')
    };
    const templateId = formData.get('template_id');
    
    const method = editingUnit ? 'PUT' : 'POST';
    const url = editingUnit ? `/api/units/${editingUnit.id}` : '/api/units';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(unitData)
      });
      if (res.ok) {
        const data = await res.json();
        
        // If it's a new unit and a template was selected, provision it
        if (!editingUnit && templateId) {
          await fetch(`${API_URL}/api/units/${data.id}/provision`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ template_id: parseInt(templateId as string) })
          });
        }

        setIsRegisteringUnit(false);
        setEditingUnit(null);
        fetchData();
        alert(editingUnit ? 'Unidade atualizada!' : 'Unidade criada!');
      }
    } catch (err) {
      alert('Erro ao salvar unidade');
    }
  };

  const handleDeleteUnit = async (id: number) => {
    setConfirmation({
      isOpen: true,
      title: 'Excluir Unidade',
      message: 'Tem certeza? Isso excluirá TODOS os dados vinculados a esta unidade (produtos, usuários, logs). Esta ação não pode ser desfeita.',
      type: 'danger',
      onConfirm: async () => {
        try {
          const res = await fetch(`${API_URL}/api/units/${id}`, { method: 'DELETE' });
          if (res.ok) {
            fetchData();
            setConfirmation(prev => ({ ...prev, isOpen: false }));
          }
        } catch (err) {
          alert('Erro ao excluir unidade');
        }
      }
    });
  };

  const handleRegisterTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const isEditing = !!editingTemplate;
      const url = isEditing ? `/api/templates/${editingTemplate.id}` : '/api/templates';
      const method = isEditing ? 'PUT' : 'POST';
      const payload = isEditing ? editingTemplate : newTemplate;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setIsRegisteringTemplate(false);
        setEditingTemplate(null);
        setNewTemplate({ name: '', description: '', items: [] });
        fetchData();
        alert(isEditing ? 'Template atualizado!' : 'Template criado!');
      }
    } catch (err) {
      alert('Erro ao salvar template');
    }
  };

  const handleDeleteTemplate = (id: number) => {
    setConfirmation({
      isOpen: true,
      title: 'Excluir Template',
      message: 'Tem certeza que deseja excluir este template? Esta ação não pode ser desfeita.',
      type: 'danger',
      onConfirm: async () => {
        try {
          const res = await fetch(`${API_URL}/api/templates/${id}`, { method: 'DELETE' });
          if (res.ok) {
            fetchData();
            setConfirmation(prev => ({ ...prev, isOpen: false }));
          }
        } catch (err) {
          alert('Erro ao excluir template');
        }
      }
    });
  };
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      });
      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
        setView(userData.role);
        setProfileEdit(userData);
        setSelectedUnitId(userData.unit_id);
        fetchData(userData.unit_id, userData.role);
      } else {
        alert('Usuário ou senha incorretos');
      }
    } catch (err) {
      alert('Erro ao fazer login');
    }
  };

  const handleRegisterUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newUser, unit_id: selectedUnitId })
      });
      if (res.ok) {
        setNewUser({ username: '', password: '', role: 'employee', name: '', email: '', phone: '' });
        setIsRegisteringUser(false);
        fetchData();
        alert('Usuário cadastrado com sucesso!');
      } else {
        const data = await res.json();
        alert(data.error || 'Erro ao cadastrar');
      }
    } catch (err) {
      alert('Erro ao cadastrar usuário');
    }
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    try {
      const res = await fetch(`${API_URL}/api/users/${editingUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingUser)
      });
      if (res.ok) {
        setEditingUser(null);
        fetchData();
        alert('Usuário atualizado com sucesso!');
      } else {
        const data = await res.json();
        alert(data.error || 'Erro ao atualizar usuário');
      }
    } catch (err) {
      alert('Erro ao atualizar usuário');
    }
  };

  const handleDeleteUser = async (id: number) => {
    setConfirmation({
      isOpen: true,
      title: 'Excluir Funcionário',
      message: 'Tem certeza que deseja excluir este funcionário? Esta ação removerá o acesso dele ao sistema.',
      type: 'danger',
      onConfirm: async () => {
        try {
          const res = await fetch(`${API_URL}/api/users/${id}`, {
            method: 'DELETE'
          });
          if (res.ok) {
            fetchData();
            setConfirmation(prev => ({ ...prev, isOpen: false }));
            alert('Funcionário excluído!');
          } else {
            const data = await res.json();
            alert(data.error || 'Erro ao excluir funcionário');
          }
        } catch (err) {
          alert('Erro de conexão ao excluir funcionário');
        }
      }
    });
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      const res = await fetch(`${API_URL}/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileEdit)
      });
      if (res.ok) {
        setUser({ ...user, ...profileEdit } as User);
        alert('Perfil atualizado!');
      }
    } catch (err) {
      alert('Erro ao atualizar perfil');
    }
  };

  const handleAddToCart = (product: Product) => {
    const existing = cart.find(item => item.product.id === product.id);
    if (existing) {
      setCart(cart.map(item => 
        item.product.id === product.id 
        ? { ...item, quantity: item.quantity + 1 } 
        : item
      ));
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
  };

  const handleRemoveFromCart = (productId: number) => {
    setCart(cart.filter(item => item.product.id !== productId));
  };

  const handleCheckout = async () => {
    if (!user || cart.length === 0) return;
    try {
      const res = await fetch(`${API_URL}/api/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          unit_id: selectedUnitId,
          items: cart.map(item => ({
            product_id: item.product.id,
            quantity: item.quantity
          }))
        })
      });
      if (res.ok) {
        setCart([]);
        fetchData();
        alert('Solicitação enviada para aprovação!');
      }
    } catch (err) {
      alert('Erro ao finalizar pedido');
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newProduct, unit_id: selectedUnitId })
      });
      if (res.ok) {
        const data = await res.json();
        setNewProduct({ name: '', category: '', quantity: 0, min_quantity: 5, max_quantity: 50, unit: 'un', active: 1 });
        setIsRegisteringProduct(false);
        fetchData();
        alert(data.updated ? 'Informações do produto atualizadas!' : 'Novo produto cadastrado!');
      }
    } catch (err) {
      setError('Erro ao adicionar produto');
    }
  };

  const handleToggleProduct = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/api/products/${id}/toggle`, {
        method: 'PATCH'
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      alert('Erro ao alterar status do produto');
    }
  };

  const handleUseProduct = async (product_id: number, quantity: number) => {
    if (!user) return;
    try {
      const res = await fetch(`${API_URL}/api/usage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id, user_id: user.id, quantity, unit_id: selectedUnitId })
      });
      if (res.ok) {
        fetchData();
        alert('Uso registrado com sucesso!');
      } else {
        const data = await res.json();
        alert(data.error || 'Erro ao registrar uso');
      }
    } catch (err) {
      setError('Erro ao registrar uso');
    }
  };

  const handleUpdateStatus = async (id: number, status: 'approved' | 'rejected') => {
    try {
      const res = await fetch(`${API_URL}/api/requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchData();
      } else {
        const data = await res.json();
        alert(data.error || 'Erro ao atualizar status');
      }
    } catch (err) {
      setError('Erro ao atualizar status');
    }
  };

  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    try {
      const res = await fetch(`${API_URL}/api/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProduct)
      });
      if (res.ok) {
        setEditingProduct(null);
        fetchData();
        alert('Produto atualizado com sucesso!');
      }
    } catch (err) {
      alert('Erro ao atualizar produto');
    }
  };

  const handleDeleteProduct = async (id: number) => {
    setConfirmation({
      isOpen: true,
      title: 'Excluir Produto',
      message: 'Tem certeza que deseja excluir este produto? Verifique se existem solicitações vinculadas a este produto.',
      type: 'danger',
      onConfirm: async () => {
        try {
          const res = await fetch(`${API_URL}/api/products/${id}`, {
            method: 'DELETE'
          });
          if (res.ok) {
            fetchData();
            setConfirmation(prev => ({ ...prev, isOpen: false }));
            alert('Produto excluído!');
          } else {
            const data = await res.json();
            alert(data.error || 'Erro ao excluir produto.');
          }
        } catch (err) {
          alert('Erro de conexão ao excluir produto');
        }
      }
    });
  };

  const handleProcessReceipt = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingReceipt(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = (reader.result as string).split(',')[1];
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: [
            {
              parts: [
                { inlineData: { data: base64Data, mimeType: file.type } },
                { text: "Extract products from this receipt. Return a JSON array of objects with 'name', 'quantity' (number), 'category' (best guess), and 'unit' (e.g., 'un', 'kg', 'cx')." }
              ]
            }
          ],
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  quantity: { type: Type.NUMBER },
                  category: { type: Type.STRING },
                  unit: { type: Type.STRING }
                },
                required: ["name", "quantity", "category", "unit"]
              }
            }
          }
        });

        const extracted = JSON.parse(response.text || "[]");
        setReceiptItems(extracted);
        setIsProcessingReceipt(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      alert('Erro ao processar cupom fiscal');
      setIsProcessingReceipt(false);
    }
  };

  const handleConfirmReceiptItems = async () => {
    try {
      for (const item of receiptItems) {
        // Check if product exists (simple name match for demo)
        const existing = products.find(p => p.name.toLowerCase() === item.name.toLowerCase());
        if (existing) {
          await fetch(`${API_URL}/api/products/${existing.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...existing, quantity: existing.quantity + item.quantity })
          });
        } else {
          await fetch(`${API_URL}/api/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...item, unit_id: selectedUnitId })
          });
        }
      }
      setReceiptItems([]);
      setIsRegisteringProduct(false);
      fetchData();
      alert('Produtos cadastrados/atualizados com sucesso via Cupom Fiscal!');
    } catch (err) {
      alert('Erro ao salvar itens do cupom');
    }
  };

  const handleProcessSpreadsheet = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const text = reader.result as string;
        const rows = text.split('\n').slice(1); // Skip header
        
        for (const row of rows) {
          if (!row.trim()) continue;
          const [name, category, quantity, unit, min_quantity, max_quantity] = row.split(',').map(s => s.trim());
          
          if (!name) continue;

          const productData = {
            name,
            category: category || 'Geral',
            quantity: parseInt(quantity) || 0,
            unit: unit || 'un',
            min_quantity: parseInt(min_quantity) || 5,
            max_quantity: parseInt(max_quantity) || 50,
            unit_id: selectedUnitId,
            active: 1
          };

          await fetch(`${API_URL}/api/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData)
          });
        }
        
        setIsRegisteringProduct(false);
        fetchData();
        alert('Produtos importados com sucesso via planilha!');
      };
      reader.readAsText(file);
    } catch (err) {
      alert('Erro ao processar planilha');
    }
  };

  const handleSearchImage = async (productName: string, isEditing: boolean) => {
    if (!productName) return;
    setIsSearchingImage(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Find a direct public image URL for the product: "${productName}". Return ONLY the URL string. No markdown, no quotes. If multiple are found, pick the most relevant one from a reliable source like a retailer or manufacturer.`,
        config: {
          tools: [{ googleSearch: {} }]
        }
      });
      
      const url = response.text?.trim().replace(/^`+|`+$/g, '');
      if (url && url.startsWith('http')) {
        if (isEditing && editingProduct) {
          setEditingProduct({ ...editingProduct, image_url: url });
        } else {
          setNewProduct({ ...newProduct, image_url: url });
        }
      } else {
        alert('Não foi possível encontrar uma imagem automaticamente. Tente inserir manualmente.');
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao buscar imagem com IA');
    } finally {
      setIsSearchingImage(false);
    }
  };

  const handlePrintReplenishment = () => {
    window.print();
  };

  const categories = Array.from(new Set(products.map(p => p.category))).filter(Boolean);

  if (!user) {
    return (
      <LoginForm 
        onLogin={handleLogin} 
        loginForm={loginForm} 
        setLoginForm={setLoginForm} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F4] text-[#1A1A1A] font-sans">
      <Navbar 
        user={user}
        units={units}
        selectedUnitId={selectedUnitId}
        setSelectedUnitId={setSelectedUnitId}
        view={view}
        setView={setView}
        onLogout={() => {
          setUser(null);
          setCart([]);
        }}
        onFetchData={fetchData}
      />

      <main className="max-w-7xl mx-auto p-6">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center gap-2">
            <AlertCircle size={18} />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <AnimatePresence mode="wait">
          {view === 'global_admin' ? (
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
                <UnitList 
                  units={units}
                  onEdit={(unit) => {
                    setEditingUnit(unit);
                    setIsRegisteringUnit(true);
                  }}
                  onDelete={handleDeleteUnit}
                  onAdd={() => {
                    setEditingUnit(null);
                    setIsRegisteringUnit(true);
                  }}
                  onManage={(unitId) => {
                    setSelectedUnitId(unitId);
                    setView('manager');
                    fetchData(unitId);
                  }}
                  onProvision={async (unitId) => {
                    const templateId = prompt('ID do Template para provisionar:');
                    if (templateId) {
                      const res = await fetch(`${API_URL}/api/units/${unitId}/provision`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ template_id: parseInt(templateId) })
                      });
                      if (res.ok) alert('Unidade provisionada com sucesso!');
                    }
                  }}
                />
              )}

              {globalSubView === 'templates' && (
                <TemplateList 
                  templates={templates}
                  onAdd={() => {
                    setEditingTemplate(null);
                    setNewTemplate({ name: '', description: '', items: [] });
                    setIsRegisteringTemplate(true);
                  }}
                  onEdit={(template) => {
                    setEditingTemplate(template);
                    setIsRegisteringTemplate(true);
                  }}
                  onDelete={handleDeleteTemplate}
                />
              )}

              {globalSubView === 'replenishment' && (
                <ReplenishmentList 
                  items={globalReplenishment}
                  onViewUnit={(unitId) => {
                    setSelectedUnitId(unitId);
                    setView('manager');
                    setManagerSubView('replenishment');
                    fetchData(unitId);
                  }}
                />
              )}

              {globalSubView === 'all_users' && (
                <UserList 
                  users={allUsers}
                  currentUser={user}
                  onEdit={setEditingUser}
                  onDelete={handleDeleteUser}
                  onAdd={() => setIsRegisteringUser(true)}
                  isGlobal={true}
                  units={units}
                />
              )}
            </motion.div>
          ) : view === 'manager' ? (
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
                    <UserList 
                      users={allUsers}
                      currentUser={user}
                      onEdit={setEditingUser}
                      onDelete={handleDeleteUser}
                      onAdd={() => setIsRegisteringUser(true)}
                    />
                  </div>
                </div>
              )}

              {managerSubView === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left: Inventory Management */}
                  <div className="lg:col-span-2 space-y-8">
                    <ProductTable 
                      products={products}
                      onEdit={setEditingProduct}
                      onDelete={handleDeleteProduct}
                      onToggle={handleToggleProduct}
                      onAdd={() => setIsRegisteringProduct(true)}
                    />
                  </div>

                  {/* Right: Pending Requests */}
                  <div className="space-y-8">
                    <RequestList 
                      requests={requests}
                      onUpdateStatus={handleUpdateStatus}
                    />

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
                  <StatsSummary stats={stats} />

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
                <ReplenishmentReport 
                  products={products}
                  onPrint={handlePrintReplenishment}
                />
              )}

              {managerSubView === 'reports' && (
                <MovementReport 
                  items={[
                    ...requests.map(r => ({ ...r, type: 'Solicitação', date: r.request_date })),
                    ...usageLogs.map(u => ({ ...u, type: 'Uso Direto', date: u.usage_date, status: 'approved' as const }))
                  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) as any}
                />
              )}
            </motion.div>
          ) : (
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
                  <UserIcon size={16} /> Meu Perfil
                </button>
              </div>

              {employeeSubView === 'profile' && (
                <ProfileSection 
                  user={user}
                  profileEdit={profileEdit}
                  setProfileEdit={setProfileEdit}
                  onSubmit={handleUpdateProfile}
                />
              )}

              {employeeSubView !== 'profile' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left: Product List */}
                  <div className="lg:col-span-2">
                    <ProductTable 
                      products={products.filter(p => p.active === 1)}
                      isEmployee={true}
                      employeeSubView={employeeSubView}
                      onAddToCart={handleAddToCart}
                      onUseProduct={handleUseProduct}
                    />
                  </div>

                  {/* Right: Cart/History */}
                  <div className="space-y-8">
                    {employeeSubView === 'request' ? (
                      <Cart 
                        cart={cart}
                        onUpdateQuantity={(productId, delta) => {
                          const item = cart.find(c => c.product.id === productId);
                          if (item) {
                            const newQty = item.quantity + delta;
                            if (newQty >= 1 && newQty <= item.product.quantity) {
                              setCart(cart.map(c => c.product.id === productId ? {...c, quantity: newQty} : c));
                            }
                          }
                        }}
                        onRemove={handleRemoveFromCart}
                        onCheckout={handleCheckout}
                      />
                    ) : employeeSubView === 'usage' ? (
                      <UsageForm 
                        products={products.filter(p => p.active === 1)}
                        onUsage={handleUseProduct}
                      />
                    ) : (
                      <UsageHistory 
                        logs={usageLogs}
                        userName={user.name}
                      />
                    )}

                    <section className="bg-white rounded-2xl p-6 shadow-sm border border-black/5">
                      <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                        <ClipboardList size={20} className="text-black/40" />
                        Minhas Solicitações
                      </h2>
                      <div className="space-y-4">
                        {requests.filter(r => r.user_id === user.id).slice(0, 5).map(req => (
                          <div key={req.id} className="p-3 rounded-xl bg-[#F5F5F4] border border-black/5">
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-[10px] text-black/40 font-mono">{new Date(req.request_date).toLocaleDateString()}</p>
                              <div className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                                req.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                                req.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                'bg-amber-100 text-amber-700'
                              }`}>
                                {req.status === 'approved' ? 'Aprovado' : req.status === 'rejected' ? 'Recusado' : 'Pendente'}
                              </div>
                            </div>
                            <div className="space-y-1">
                              {req.items?.map((item, idx) => (
                                <p key={idx} className="text-xs font-medium">• {item.product_name} ({item.quantity} {item.unit})</p>
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
          )}
        </AnimatePresence>

        <ProductModal 
          isOpen={!!editingProduct}
          onClose={() => setEditingProduct(null)}
          onSubmit={handleEditProduct}
          product={editingProduct || {} as any}
          setProduct={setEditingProduct}
          isEditing={true}
          categories={categories}
          onSearchImage={() => handleSearchImage(editingProduct?.name || '', true)}
          isSearchingImage={isSearchingImage}
        />

        <ConfirmationModal 
          isOpen={confirmation.isOpen}
          title={confirmation.title}
          message={confirmation.message}
          type={confirmation.type}
          onConfirm={confirmation.onConfirm}
          onCancel={() => setConfirmation(prev => ({ ...prev, isOpen: false }))}
        />

        <UnitModal 
          isOpen={isRegisteringUnit}
          onClose={() => { setIsRegisteringUnit(false); setEditingUnit(null); }}
          onSubmit={handleRegisterUnit}
          isEditing={!!editingUnit}
          editingUnit={editingUnit}
          templates={templates}
        />

        <TemplateModal 
          isOpen={isRegisteringTemplate}
          onClose={() => {
            setIsRegisteringTemplate(false);
            setEditingTemplate(null);
          }}
          onSubmit={handleRegisterTemplate}
          template={editingTemplate || newTemplate}
          setTemplate={editingTemplate ? setEditingTemplate : setNewTemplate}
        />

        <ProductModal 
          isOpen={isRegisteringProduct}
          onClose={() => setIsRegisteringProduct(false)}
          onSubmit={handleAddProduct}
          product={newProduct}
          setProduct={setNewProduct}
          isEditing={false}
          categories={categories}
          isProcessingReceipt={isProcessingReceipt}
          onProcessReceipt={handleProcessReceipt}
          receiptItems={receiptItems}
          setReceiptItems={setReceiptItems}
          onConfirmReceiptItems={handleConfirmReceiptItems}
          onProcessSpreadsheet={handleProcessSpreadsheet}
          onSearchImage={() => handleSearchImage(newProduct.name, false)}
          isSearchingImage={isSearchingImage}
        />

        <UserModal 
          isOpen={isRegisteringUser}
          onClose={() => setIsRegisteringUser(false)}
          onSubmit={handleRegisterUser}
          user={newUser}
          setUser={setNewUser}
          isEditing={false}
          currentUser={user!}
        />

        <UserModal 
          isOpen={!!editingUser}
          onClose={() => setEditingUser(null)}
          onSubmit={handleEditUser}
          user={editingUser || {} as any}
          setUser={setEditingUser}
          isEditing={true}
          currentUser={user!}
        />
      </main>
    </div>
  );
}
