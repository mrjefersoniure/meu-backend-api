import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Package, ArrowLeft, Mail, Eye, EyeOff } from 'lucide-react';
import { API_URL } from '../config';

interface LoginFormProps {
  onLogin: (e: React.FormEvent) => void;
  loginForm: { username: string; password: string };
  setLoginForm: (form: { username: string; password: string }) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin, loginForm, setLoginForm }) => {
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [isRecovering, setIsRecovering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryEmail) return;
    
    setIsRecovering(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: recoveryEmail })
      });
      const data = await res.json();
      alert(data.message || 'Se o email existir, uma nova senha será enviada.');
      setIsForgotPassword(false);
      setRecoveryEmail('');
    } catch (err) {
      alert('Erro ao processar solicitação.');
    } finally {
      setIsRecovering(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F4] flex items-center justify-center p-6 font-sans">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-8 rounded-3xl shadow-xl border border-black/5 w-full max-w-md relative overflow-hidden"
      >
        <AnimatePresence mode="wait">
          {!isForgotPassword ? (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex flex-col items-center mb-8">
                <div className="bg-black text-white p-4 rounded-2xl mb-4">
                  <Package size={32} />
                </div>
                <h1 className="text-2xl font-bold tracking-tight">Almoxarifado Inteligente</h1>
                <p className="text-black/40 text-sm">Faça login para acessar o sistema</p>
              </div>

              <form onSubmit={onLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-black/40 uppercase mb-1">Usuário</label>
                  <input 
                    required
                    type="text" 
                    value={loginForm.username}
                    onChange={e => setLoginForm({...loginForm, username: e.target.value})}
                    className="w-full bg-[#F5F5F4] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-black/5 transition-all outline-none"
                    placeholder="admin ou user"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-semibold text-black/40 uppercase">Senha</label>
                    <button 
                      type="button" 
                      onClick={() => setIsForgotPassword(true)}
                      className="text-[10px] font-bold text-black/40 hover:text-black transition-colors uppercase"
                    >
                      Esqueceu a senha?
                    </button>
                  </div>
                  <div className="relative">
                    <input 
                      required
                      type={showPassword ? "text" : "password"} 
                      value={loginForm.password}
                      onChange={e => setLoginForm({...loginForm, password: e.target.value})}
                      className="w-full bg-[#F5F5F4] border-none rounded-xl px-4 py-3 pr-12 focus:ring-2 focus:ring-black/5 transition-all outline-none"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-black/40 hover:text-black transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <button type="submit" className="w-full bg-black text-white py-4 rounded-xl font-semibold hover:bg-black/80 transition-all mt-4">
                  Entrar no Sistema
                </button>
              </form>
              /*<div className="mt-8 pt-6 border-t border-black/5 text-center">
                <p className="text-[10px] text-black/30 uppercase tracking-widest font-bold">Dica: use admin/admin123 ou user/user123</p>
              </div> */
            </motion.div>
          ) : (
            <motion.div
              key="forgot-password"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <button 
                onClick={() => setIsForgotPassword(false)}
                className="absolute top-6 left-6 p-2 text-black/40 hover:text-black transition-colors rounded-full hover:bg-black/5"
              >
                <ArrowLeft size={20} />
              </button>
              
              <div className="flex flex-col items-center mb-8 mt-4">
                <div className="bg-black/5 text-black p-4 rounded-2xl mb-4">
                  <Mail size={32} />
                </div>
                <h1 className="text-2xl font-bold tracking-tight">Recuperar Senha</h1>
                <p className="text-black/40 text-sm text-center mt-2">
                  Digite seu email cadastrado para receber uma nova senha de acesso.
                </p>
              </div>

              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-black/40 uppercase mb-1">Email Cadastrado</label>
                  <input 
                    required
                    type="email" 
                    value={recoveryEmail}
                    onChange={e => setRecoveryEmail(e.target.value)}
                    className="w-full bg-[#F5F5F4] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-black/5 transition-all outline-none"
                    placeholder="seu@email.com"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={isRecovering}
                  className="w-full bg-black text-white py-4 rounded-xl font-semibold hover:bg-black/80 transition-all mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isRecovering ? 'Enviando...' : 'Enviar Nova Senha'}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
