/**
 * BottomNav.jsx — Navigasi Bawah 4 Menu GREENWORTH Surabaya
 * Vibe Design Framework: navigasi jempol yang bersih, responsif,
 * dengan tombol Setor tengah yang taktis dan elegan.
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
      className="fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-[0_-4px_16px_rgba(0,0,0,0.04)] px-3 py-2"
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
                className="flex flex-col items-center -mt-6 transition-transform active:scale-95 group focus:outline-none"
                aria-label="Setor Sampah"
              >
                <div
                  className={`w-13 h-13 rounded-full flex items-center justify-center shadow-lg transition-all border-4 border-[#F8FAFC] ${
                    isActive
                      ? 'bg-amber-400 text-slate-950 scale-105 shadow-amber-400/20'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/30'
                  }`}
                >
                  <Icon className="w-6 h-6 stroke-[2.4]" />
                </div>
                <span
                  className={`text-[11px] font-black mt-0.5 transition-colors ${
                    isActive ? 'text-amber-800' : 'text-slate-700'
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
              className={`flex-1 py-1 flex flex-col items-center justify-center rounded-xl transition-all active:scale-95 ${
                isActive
                  ? 'text-emerald-700 font-black'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <div
                className={`p-1 rounded-lg transition-colors ${
                  isActive ? 'text-emerald-700' : 'text-slate-400'
                }`}
              >
                <Icon className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-[11px] font-semibold tracking-tight">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
