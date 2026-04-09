/**
 * Card.jsx — Reusable stat card component
 */

export default function Card({ icon, label, value, sub, color = 'blue', className = '', onClick }) {
  const colorMap = {
    blue: 'from-primary to-primary-light',
    green: 'from-success to-success-light',
    red: 'from-danger to-danger-light',
    yellow: 'from-warn to-amber-400',
    purple: 'from-purple-500 to-purple-400',
    teal: 'from-teal-500 to-teal-400',
  };

  const gradient = colorMap[color] || colorMap.blue;

  return (
    <div
      id={`card-${label?.toLowerCase().replace(/\s+/g, '-')}`}
      onClick={onClick}
      className={`bg-white rounded-2xl p-4 shadow-card border border-white/60 
        ${onClick ? 'cursor-pointer hover:shadow-md active:scale-95 transition-all duration-200' : ''}
        animate-fade-in ${className}`}
    >
      {/* Icon */}
      {icon && (
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-xl mb-3 shadow-sm`}>
          {icon}
        </div>
      )}

      {/* Label */}
      {label && (
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">{label}</p>
      )}

      {/* Value */}
      {value !== undefined && (
        <p className="text-xl font-bold text-gray-800 leading-tight">{value}</p>
      )}

      {/* Sub */}
      {sub && (
        <p className="text-xs text-gray-400 mt-1">{sub}</p>
      )}
    </div>
  );
}

/**
 * GradientCard — Full gradient card
 */
export function GradientCard({ icon, label, value, sub, gradient = 'from-primary to-primary-light', className = '' }) {
  return (
    <div className={`bg-gradient-to-br ${gradient} rounded-2xl p-5 shadow-lg text-white animate-slide-up ${className}`}>
      <div className="flex items-start justify-between">
        {icon && (
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-2xl">
            {icon}
          </div>
        )}
      </div>
      {label && <p className="text-sm text-white/70 mt-3 font-medium">{label}</p>}
      {value !== undefined && <p className="text-3xl font-extrabold mt-1">{value}</p>}
      {sub && <p className="text-sm text-white/60 mt-1">{sub}</p>}
    </div>
  );
}
