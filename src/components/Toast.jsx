import { useToast } from '../context/ToastContext';

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (!toasts || toasts.length === 0) return null;

  const getStyle = (type) => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-emerald-900/90 text-emerald-50 border-emerald-500/30',
          iconBg: 'bg-emerald-500/20 text-emerald-300',
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
            </svg>
          ),
        };
      case 'error':
        return {
          bg: 'bg-rose-950/90 text-rose-50 border-rose-500/30',
          iconBg: 'bg-rose-500/20 text-rose-300',
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ),
        };
      case 'warning':
        return {
          bg: 'bg-amber-950/90 text-amber-50 border-amber-500/30',
          iconBg: 'bg-amber-500/20 text-amber-300',
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          ),
        };
      case 'info':
      default:
        return {
          bg: 'bg-slate-900/90 text-slate-100 border-slate-700/50',
          iconBg: 'bg-sky-500/20 text-sky-300',
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
        };
    }
  };

  return (
    <div
      aria-live="polite"
      className="fixed top-4 inset-x-0 z-[9999] flex flex-col items-center gap-2 pointer-events-none px-4 max-w-md mx-auto"
    >
      {toasts.map((toast) => {
        const style = getStyle(toast.type);
        return (
          <div
            key={toast.id}
            role="status"
            className={`pointer-events-auto flex items-center justify-between w-full max-w-sm px-4 py-3 rounded-2xl shadow-xl border backdrop-blur-md transition-all duration-300 transform translate-y-0 opacity-100 animate-slideDown ${style.bg}`}
          >
            <div className="flex items-center gap-3 min-w-0 pr-2">
              <span className={`p-1.5 rounded-xl shrink-0 ${style.iconBg}`}>
                {style.icon}
              </span>
              <p className="text-xs sm:text-sm font-semibold leading-snug break-words">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded-lg text-white/50 hover:text-white hover:bg-white/10 active:scale-95 transition-all shrink-0 ml-1"
              aria-label="Tutup notifikasi"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        );
      })}
    </div>
  );
}
