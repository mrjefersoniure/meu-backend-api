import React from 'react';
import { 
  Package, 
  Building2, 
  LogOut, 
  User, 
  ShieldCheck, 
  LayoutDashboard 
} from 'lucide-react';
import { User as UserType, Unit } from '../types';

interface HeaderProps {
  user: UserType;
  units: Unit[];
  selectedUnitId: number | null;
  setSelectedUnitId: (id: number | null) => void;
  fetchData: (unitId?: number | null, userRole?: string) => Promise<void>;
  view: 'global_admin' | 'manager' | 'employee';
  setView: (view: 'global_admin' | 'manager' | 'employee') => void;
  setUser: (user: UserType | null) => void;
  setCart: (cart: any[]) => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  units,
  selectedUnitId,
  setSelectedUnitId,
  fetchData,
  view,
  setView,
  setUser,
  setCart
}) => {
  return (
    <nav className="bg-white border-b border-black/5 px-4 sm:px-6 py-4 flex flex-col sm:flex-row justify-between items-center sticky top-0 z-20 no-print gap-4">
      <div className="flex items-center justify-between w-full sm:w-auto gap-2">
        <div className="flex items-center gap-2">
          <div className="bg-black text-white p-2 rounded-lg">
            <Package size={24} />
          </div>
          <h1 className="text-xl font-semibold tracking-tight hidden xs:block">Almoxarifado</h1>
        </div>
        
        {user.role === 'global_admin' && (
          <div className="flex items-center gap-2 bg-[#F5F5F4] px-2 py-1.5 rounded-xl border border-black/5 max-w-[150px] sm:max-w-none">
            <Building2 size={14} className="text-black/40 shrink-0" />
            <select 
              value={selectedUnitId || ''} 
              onChange={(e) => {
                const val = e.target.value ? parseInt(e.target.value) : null;
                setSelectedUnitId(val);
                fetchData(val);
              }}
              className="bg-transparent text-[10px] sm:text-xs font-bold outline-none cursor-pointer truncate w-full"
            >
              <option value="">Todas as Unidades</option>
              {units.map(u => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          </div>
        )}

        <button 
          onClick={() => {
            setUser(null);
            setCart([]);
          }}
          className="sm:hidden p-2 text-black/40 hover:text-red-500 transition-colors"
        >
          <LogOut size={20} />
        </button>
      </div>
      
      <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto justify-between sm:justify-end">
        <div className="flex bg-[#E4E3E0] p-1 rounded-xl overflow-x-auto no-scrollbar max-w-full">
          <button 
            onClick={() => setView('employee')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg transition-all whitespace-nowrap ${view === 'employee' ? 'bg-white shadow-sm text-black' : 'text-black/50 hover:text-black'}`}
          >
            <User size={18} />
            <span className="text-xs sm:text-sm font-medium">Funcionário</span>
          </button>
          {(user.role === 'manager' || user.role === 'global_admin') && (
            <button 
              onClick={() => setView('manager')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg transition-all whitespace-nowrap ${view === 'manager' ? 'bg-white shadow-sm text-black' : 'text-black/50 hover:text-black'}`}
            >
              <ShieldCheck size={18} />
              <span className="text-xs sm:text-sm font-medium">Gestor</span>
            </button>
          )}
          {user.role === 'global_admin' && (
            <button 
              onClick={() => setView('global_admin')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg transition-all whitespace-nowrap ${view === 'global_admin' ? 'bg-white shadow-sm text-black' : 'text-black/50 hover:text-black'}`}
            >
              <LayoutDashboard size={18} />
              <span className="text-xs sm:text-sm font-medium">Global</span>
            </button>
          )}
        </div>

        <div className="hidden sm:flex items-center gap-3 pl-6 border-l border-black/5">
          <div className="text-right">
            <p className="text-sm font-bold">{user.name}</p>
            <p className="text-[10px] text-black/40 uppercase tracking-widest font-bold">{user.role}</p>
          </div>
          <button 
            onClick={() => {
              setUser(null);
              setCart([]);
            }}
            className="p-2 text-black/40 hover:text-red-500 transition-colors"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
};
