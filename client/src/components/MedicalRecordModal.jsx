import React from 'react';
import { X, FileText } from 'lucide-react';

export default function MedicalRecordModal({ isOpen, onClose, record }) {
  if (!isOpen || !record) return null;

  const dateStr = new Date(record.appointmentDate || record.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-soft-xl border border-slate-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5 text-teal-700">
            <FileText className="w-5 h-5" />
            <h3 className="font-bold text-slate-900">Medical Case Record</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4 text-xs">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-slate-400 block font-medium">Consultation Date</span>
              <span className="font-bold text-slate-900">{dateStr}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block font-medium">Attending Doctor</span>
              <span className="font-bold text-teal-700">
                {record.doctorId?.userId?.name || 'Dr. Specialist'}
              </span>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-400 uppercase tracking-wider mb-1">Symptoms Presented</h4>
            <p className="text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
              {record.symptoms || 'None specified'}
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-400 uppercase tracking-wider mb-1">Clinical Diagnosis</h4>
            <p className="text-sm font-bold text-slate-900 bg-teal-50 p-3 rounded-xl border border-teal-100">
              {record.diagnosis}
            </p>
          </div>

          {record.treatment && (
            <div>
              <h4 className="font-bold text-slate-400 uppercase tracking-wider mb-1">Treatment Plan</h4>
              <p className="text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                {record.treatment}
              </p>
            </div>
          )}

          {record.notes && (
            <div>
              <h4 className="font-bold text-slate-400 uppercase tracking-wider mb-1">Doctor's Clinical Notes</h4>
              <p className="text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed italic">
                {record.notes}
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
