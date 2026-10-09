/**
 * BottomNav.jsx — Navigasi Bawah 4 Menu GREENWORTH Surabaya
 * Bersih, modern, elegan (Hijau + Putih + Emas).
 */

import { Home, PlusCircle, Compass, User } from 'lucide-react';

export default function BottomNav({ activeTab, onTabChange }) {
  const navItems = [
    {
      id: 'beranda',
      label: 'Beranda',
      icon: Home,
    },
    {
      id: 'setor',
      label: 'Setor',
      icon: PlusCircle,
      isSpecial: true,
    },
    {
      id: 'lacak',
      label: 'Lacak',
      icon: Compass,
    },
    {
      id: 'akun',
      label: 'Akun',
      icon: User,
    },
  ];

  return (
    <nav
      aria-label="Navigasi Utama"
      className="fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-3 py-2"
    >
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          if (item.isSpecial) {
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onTabChange(item.id)}
                className="flex flex-col items-center -mt-7 transition-transform active:scale-95 group focus:outline-none"
                aria-label="Setor Sampah Sekarang"
              >
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all border-4 border-white ${
                    isActive
                      ? 'bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-300 text-slate-950 ring-4 ring-amber-400/20 scale-105 shadow-amber-500/30'
                      : 'bg-gradient-to-tr from-[#065F46] to-[#047857] text-white shadow-emerald-900/20 hover:scale-105'
                  }`}
                >
                  <Icon className="w-7 h-7 stroke-[2.4]" />
                </div>
                <span
                  className={`text-xs font-black mt-1 transition-colors ${
                    isActive ? 'text-amber-800' : 'text-emerald-900'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange(item.id)}
              className={`flex-1 py-1 flex flex-col items-center justify-center rounded-2xl transition-all active:scale-95 ${
                isActive
                  ? 'text-emerald-800 font-black'
                  : 'text-slate-500 hover:text-emerald-700'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-colors ${
                  isActive ? 'bg-emerald-50 text-emerald-800' : 'text-slate-500'
                }`}
              >
                <Icon className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-xs font-bold mt-0.5 tracking-tight">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
