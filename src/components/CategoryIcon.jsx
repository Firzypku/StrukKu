import {
  Utensils,
  Coffee,
  Home,
  Car,
  ShoppingBag,
  Film,
  HeartPulse,
  GraduationCap,
  Shirt,
  CreditCard,
} from 'lucide-react';

export const CATEGORY_ICON_MAP = {
  Makanan: Utensils,
  Minuman: Coffee,
  'Kebutuhan Kos': Home,
  Transport: Car,
  Belanja: ShoppingBag,
  Hiburan: Film,
  Kesehatan: HeartPulse,
  Pendidikan: GraduationCap,
  Fashion: Shirt,
  Lainnya: CreditCard,
};

export const CATEGORY_COLOR_MAP = {
  Makanan: 'text-amber-600 bg-amber-50 border-amber-200',
  Minuman: 'text-orange-600 bg-orange-50 border-orange-200',
  'Kebutuhan Kos': 'text-emerald-600 bg-emerald-50 border-emerald-200',
  Transport: 'text-blue-600 bg-blue-50 border-blue-200',
  Belanja: 'text-purple-600 bg-purple-50 border-purple-200',
  Hiburan: 'text-pink-600 bg-pink-50 border-pink-200',
  Kesehatan: 'text-rose-600 bg-rose-50 border-rose-200',
  Pendidikan: 'text-indigo-600 bg-indigo-50 border-indigo-200',
  Fashion: 'text-teal-600 bg-teal-50 border-teal-200',
  Lainnya: 'text-slate-600 bg-slate-50 border-slate-200',
};

/**
 * Reusable professional Category Icon with consistent stroke and size
 */
export default function CategoryIcon({
  category = 'Lainnya',
  className = 'w-4 h-4',
  withBackground = false,
  badgeClassName = 'w-8 h-8 rounded-xl',
}) {
  const IconComponent = CATEGORY_ICON_MAP[category] || CreditCard;
  const colorStyles = CATEGORY_COLOR_MAP[category] || CATEGORY_COLOR_MAP.Lainnya;

  if (withBackground) {
    return (
      <div
        className={`${badgeClassName} flex items-center justify-center flex-shrink-0 border ${colorStyles}`}
      >
        <IconComponent className={className} strokeWidth={2} />
      </div>
    );
  }

  return <IconComponent className={className} strokeWidth={2} />;
}
