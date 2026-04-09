/**
 * ProgressBar.jsx — Animated budget progress bar
 */

export default function ProgressBar({
  percent = 0,
  label,
  showPercent = true,
  height = 'h-3',
  className = '',
}) {
  // Clamp percent 0–100
  const clampedPercent = Math.min(Math.max(percent, 0), 100);

  // Warna berdasarkan level
  const barColor =
    clampedPercent >= 100
      ? 'bg-gradient-to-r from-danger to-danger-light'
      : clampedPercent >= 80
      ? 'bg-gradient-to-r from-warn to-amber-400'
      : 'bg-gradient-to-r from-success to-success-light';

  const textColor =
    clampedPercent >= 100
      ? 'text-danger'
      : clampedPercent >= 80
      ? 'text-warn'
      : 'text-success';

  return (
    <div className={`w-full ${className}`}>
      {/* Header row */}
      {(label || showPercent) && (
        <div className="flex justify-between items-center mb-2">
          {label && <span className="text-xs font-medium text-gray-500">{label}</span>}
          {showPercent && (
            <span className={`text-xs font-bold ${textColor}`}>
              {Math.round(clampedPercent)}%
            </span>
          )}
        </div>
      )}

      {/* Track */}
      <div className={`w-full ${height} bg-gray-100 rounded-full overflow-hidden`}>
        <div
          className={`${height} ${barColor} rounded-full transition-all duration-700 ease-out relative overflow-hidden`}
          style={{ width: `${clampedPercent}%` }}
        >
          {/* Shimmer */}
          <div className="absolute inset-0 bg-white/20 animate-pulse-soft" />
        </div>
      </div>
    </div>
  );
}

/**
 * ChallengeProgressBar — Versi lebih besar untuk tantangan
 */
export function ChallengeProgressBar({ current, target, unit, label, badge }) {
  const percent = target > 0 ? Math.min((current / target) * 100, 100) : 0;
  const done = percent >= 100;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          {badge && <span className="text-xl">{badge}</span>}
          {label && <span className="text-sm font-semibold text-gray-700">{label}</span>}
        </div>
        <span className={`text-sm font-bold ${done ? 'text-success' : 'text-primary'}`}>
          {current}/{target} {unit}
        </span>
      </div>

      <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-4 rounded-full transition-all duration-700 ease-out ${
            done ? 'bg-gradient-to-r from-success to-success-light' : 'bg-gradient-to-r from-primary to-primary-light'
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>

      {done && (
        <p className="text-xs text-success font-semibold mt-1 flex items-center gap-1">
          ✅ Tantangan selesai! Keren!
        </p>
      )}
    </div>
  );
}
