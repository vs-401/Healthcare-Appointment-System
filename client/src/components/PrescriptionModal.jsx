import React from 'react';
import { X, Printer, HeartPulse } from 'lucide-react';

export default function PrescriptionModal({ isOpen, onClose, prescription }) {
  if (!isOpen || !prescription) return null;

  const handlePrint = () => {
    window.print();
  };

  const doctorName = prescription.doctorId?.userId?.name || 'Dr. Medical Specialist';
  const doctorQual = prescription.doctorId?.qualification || 'MBBS, MD';
  const doctorDept = prescription.doctorId?.department?.name || 'HUMAC Medical Service';
  const patientName = prescription.patientId?.name || prescription.patientDetails?.fullName || 'Patient';
  const dateStr = new Date(prescription.prescriptionDate || Date.now()).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-soft-xl border border-slate-100 relative my-8 print:m-0 print:p-4 print:shadow-none">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 print:hidden">
          <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
            Clinical Prescription Record
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Print
            </button>
            <button onClick={onClose} className="p-1 rounded-xl text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="mt-4 flex items-start justify-between border-b-2 border-teal-600 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                HUMAC MEDICAL SERVICE
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                No-141, Gopal Nagar, Najafgarh, South-west Delhi-110043
              </p>
              <p className="text-xs text-slate-500">Phone: 8383999066 | 9310813776</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-slate-900">{doctorName}</p>
            <p className="text-xs text-slate-500 font-medium">{doctorQual}</p>
            <p className="text-xs text-teal-700 font-semibold">{doctorDept}</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs">
          <div>
            <span className="text-slate-400 font-medium block">Patient Name:</span>
            <span className="font-bold text-slate-900 text-sm">{patientName}</span>
          </div>
          <div className="text-right">
            <span className="text-slate-400 font-medium block">Date of Consultation:</span>
            <span className="font-bold text-slate-900 text-sm">{dateStr}</span>
          </div>
        </div>

        <div className="mt-6">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
            Clinical Diagnosis
          </h4>
          <p className="text-base font-bold text-slate-900 bg-teal-50/50 p-3 rounded-xl border border-teal-100">
            {prescription.diagnosis}
          </p>
        </div>

        <div className="mt-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg font-serif font-black text-teal-700 italic">Rx</span>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Prescribed Medications
            </h4>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">Medicine Name</th>
                  <th className="p-3">Dosage</th>
                  <th className="p-3">Frequency</th>
                  <th className="p-3">Duration</th>
                  <th className="p-3">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {prescription.medicines?.map((med, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="p-3 font-bold text-slate-900">{med.name}</td>
                    <td className="p-3 text-slate-600">{med.dosage}</td>
                    <td className="p-3 font-semibold text-teal-700">{med.frequency}</td>
                    <td className="p-3 text-slate-600">{med.duration}</td>
                    <td className="p-3 text-slate-500 italic">{med.notes || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {prescription.instructions && (
          <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs">
            <h4 className="font-bold text-slate-700 mb-1">Advice & Instructions:</h4>
            <p className="text-slate-600 leading-relaxed">{prescription.instructions}</p>
          </div>
        )}

        <div className="mt-10 pt-6 border-t border-slate-200 flex justify-between items-end">
          <div className="text-[11px] text-slate-400">
            <p>Generated electronically via HUMAC Medical Management System</p>
            <p>Keep this prescription slip for subsequent follow-up visits.</p>
          </div>
          <div className="text-center">
            <div className="w-32 border-b border-slate-400 mb-1"></div>
            <p className="text-xs font-bold text-slate-900">{doctorName}</p>
            <p className="text-[10px] text-slate-500">Authorized Medical Officer</p>
          </div>
        </div>
      </div>
    </div>
  );
}
