/**
 * BottomNav.jsx — Navigasi Bawah 4 Menu GREENWORTH Surabaya
 * 1. Beranda
 * 2. Setor (Tombol tengah melayang dan menonjol)
 * 3. Lacak
 * 4. Akun
 * Didesain ramah sentuhan jempol, kontras tinggi, tema hijau gelap.
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
      className="fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto bg-[#042614]/95 backdrop-blur-md border-t border-emerald-900/60 shadow-2xl px-3 py-2"
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
                className={`flex flex-col items-center -mt-6 transition-transform active:scale-95 group focus:outline-none`}
                aria-label="Setor Sampah Sekarang"
              >
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg border-2 transition-all ${
                    isActive
                      ? 'bg-gradient-to-tr from-emerald-500 via-emerald-400 to-amber-400 text-slate-950 border-amber-300 ring-4 ring-emerald-900/50 scale-105'
                      : 'bg-gradient-to-tr from-emerald-600 to-teal-500 text-white border-emerald-300 shadow-emerald-900/40 hover:scale-105'
                  }`}
                >
                  <Icon className="w-7 h-7 stroke-[2.4]" />
                </div>
                <span
                  className={`text-xs font-bold mt-1 transition-colors ${
                    isActive ? 'text-amber-300' : 'text-emerald-200'
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
                  ? 'text-amber-300 font-bold'
                  : 'text-emerald-300/80 hover:text-emerald-100'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-colors ${
                  isActive ? 'bg-emerald-900/80 text-amber-300' : 'text-emerald-300/80'
                }`}
              >
                <Icon className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-xs font-semibold mt-0.5 tracking-tight">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
