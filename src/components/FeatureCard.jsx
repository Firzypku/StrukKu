/**
 * FeatureCard.jsx — Card untuk fitur tantangan, tip, leaderboard
 */

export default function FeatureCard({ icon, title, description, badge, action, actionLabel = 'Mulai', highlight = false, className = '' }) {
  return (
    <div
      className={`bg-white rounded-2xl p-4 shadow-card border animate-slide-up transition-all duration-200
        ${highlight ? 'border-primary/20 bg-gradient-to-br from-blue-50 to-white' : 'border-white/60'}
        ${className}`}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0
          ${highlight ? 'bg-primary/10' : 'bg-gray-50'}`}>
          {icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="text-sm font-bold text-gray-800 truncate">{title}</h3>
            {badge && (
              <span className="text-xs bg-success/10 text-success font-semibold px-2 py-0.5 rounded-full flex-shrink-0">
                {badge}
              </span>
            )}
          </div>
          {description && (
            <p className="text-xs text-gray-400 leading-relaxed">{description}</p>
          )}
        </div>
      </div>

      {/* Action button */}
      {action && (
        <button
          onClick={action}
          className={`mt-3 w-full py-2 rounded-xl text-sm font-semibold transition-all duration-150
            ${highlight
              ? 'bg-primary text-white hover:bg-primary-dark active:scale-95 shadow-sm'
              : 'bg-gray-50 text-gray-600 hover:bg-gray-100 active:scale-95'
            }`}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

/**
 * TipCard — Tip hemat dengan styling khusus
 */
export function TipCard({ tip, icon, category, index = 0 }) {
  const gradients = [
    'from-blue-500 to-primary',
    'from-success to-teal-400',
    'from-purple-500 to-pink-400',
    'from-warn to-orange-400',
  ];

  return (
    <div className={`bg-gradient-to-br ${gradients[index % gradients.length]} rounded-2xl p-4 text-white shadow-md animate-slide-up`}>
      <div className="flex items-start gap-3">
        <span className="text-3xl">{icon || '💡'}</span>
        <div>
          <p className="text-xs text-white/60 font-medium uppercase tracking-wide mb-1">{category}</p>
          <p className="text-sm font-semibold leading-relaxed">{tip}</p>
        </div>
      </div>
    </div>
  );
}

/**
 * LeaderboardCard — Row for leaderboard
 */
export function LeaderboardRow({ rank, name, avatar, amount, isUser = false }) {
  const rankColors = {
    1: 'text-yellow-500',
    2: 'text-gray-400',
    3: 'text-amber-600',
  };

  const rankIcons = { 1: '🥇', 2: '🥈', 3: '🥉' };

  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200
      ${isUser ? 'bg-primary/10 border border-primary/20' : 'bg-gray-50 hover:bg-gray-100'}`}>
      {/* Rank */}
      <div className={`w-8 text-center font-bold text-lg ${rankColors[rank] || 'text-gray-400'}`}>
        {rankIcons[rank] || `#${rank}`}
      </div>

      {/* Avatar */}
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-lg">
        {avatar}
      </div>

      {/* Name */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold truncate ${isUser ? 'text-primary' : 'text-gray-700'}`}>
          {name} {isUser && '(Kamu)'}
        </p>
        <p className="text-xs text-gray-400">Hemat bulan ini</p>
      </div>

      {/* Amount */}
      <p className="text-sm font-bold text-success">
        Rp {amount?.toLocaleString('id-ID')}
      </p>
    </div>
  );
}
