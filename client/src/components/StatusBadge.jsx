import React from 'react';

export default function StatusBadge({ status }) {
  const s = (status || 'pending').toLowerCase();

  const styles = {
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    confirmed: 'bg-sky-50 text-sky-700 border-sky-200',
    completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    cancelled: 'bg-rose-50 text-rose-700 border-rose-200',
    unread: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    read: 'bg-slate-50 text-slate-700 border-slate-200',
    replied: 'bg-teal-50 text-teal-700 border-teal-200',
    active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    inactive: 'bg-slate-100 text-slate-600 border-slate-200',
  };

  const labels = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    completed: 'Completed',
    cancelled: 'Cancelled',
    unread: 'Unread',
    read: 'Read',
    replied: 'Replied',
    active: 'Active',
    inactive: 'Inactive',
  };

  const style = styles[s] || 'bg-slate-50 text-slate-700 border-slate-200';
  const label = labels[s] || status;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${style}`}>
      <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-current opacity-75"></span>
      {label}
    </span>
  );
}
