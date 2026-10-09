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
      className="fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto bg-[#031d10]/95 backdrop-blur-xl border-t border-emerald-500/20 shadow-[0_-8px_24px_rgba(0,0,0,0.4)] px-3 py-2"
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
                  className={`w-13 h-13 rounded-full flex items-center justify-center shadow-xl transition-all border-4 border-[#031d10] ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-400 to-amber-300 text-slate-950 scale-105 shadow-amber-400/30'
                      : 'bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-slate-950 hover:brightness-110 shadow-amber-500/30'
                  }`}
                >
                  <Icon className="w-6 h-6 stroke-[2.6]" />
                </div>
                <span
                  className={`text-[11px] font-black mt-0.5 transition-colors ${
                    isActive ? 'text-amber-300 drop-shadow-[0_0_8px_rgba(252,211,77,0.5)]' : 'text-emerald-200/90'
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
                  ? 'text-emerald-300 font-extrabold'
                  : 'text-emerald-500/60 hover:text-emerald-300'
              }`}
            >
              <div
                className={`p-1 rounded-lg transition-colors ${
                  isActive ? 'text-emerald-300 drop-shadow-[0_0_8px_rgba(52,211,153,0.4)]' : 'text-emerald-500/60'
                }`}
              >
                <Icon className="w-5 h-5 stroke-[2.1]" />
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
