import React from 'react';

export default function StatCard({ title, value, icon: Icon, color = 'teal', subtitle, trend }) {
  const colorMap = {
    teal: { bg: 'bg-teal-50 text-teal-600', border: 'border-teal-100' },
    sky: { bg: 'bg-sky-50 text-sky-600', border: 'border-sky-100' },
    emerald: { bg: 'bg-emerald-50 text-emerald-600', border: 'border-emerald-100' },
    amber: { bg: 'bg-amber-50 text-amber-600', border: 'border-amber-100' },
    rose: { bg: 'bg-rose-50 text-rose-600', border: 'border-rose-100' },
    indigo: { bg: 'bg-indigo-50 text-indigo-600', border: 'border-indigo-100' },
  };

  const scheme = colorMap[color] || colorMap.teal;

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-soft hover:shadow-soft-lg transition-all duration-200 flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500">{title}</span>
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${scheme.bg} ${scheme.border} border`}>
          {Icon && <Icon className="w-5 h-5" />}
        </div>
      </div>
      <div className="mt-4 flex items-baseline justify-between">
        <div className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">{value}</div>
        {trend && (
          <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
            {trend}
          </span>
        )}
      </div>
      {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
    </div>
  );
}
