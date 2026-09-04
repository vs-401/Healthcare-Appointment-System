import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Sidebar from '../components/Sidebar';
import PrescriptionModal from '../components/PrescriptionModal';
import { ClipboardList, Calendar, User, Eye, Pill } from 'lucide-react';

export default function PatientPrescriptions() {
  const { user } = useAuth();
  const toast = useToast();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const res = await API.get(`/prescriptions/patient/${user?._id || user?.id}`);
        setPrescriptions(res.data.prescriptions || []);
      } catch (err) {
        toast.error('Failed to load prescriptions');
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchPrescriptions();
  }, [user]);

  return (
    <div className="flex min-h-[calc(100vh-5rem)] bg-slate-50">
      <Sidebar />
      <main className="flex-1 p-6 sm:p-8 space-y-6 max-w-7xl">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Digital Prescriptions</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            View, save, and print official electronic doctor prescriptions (Rx)
          </p>
        </div>

        {loading ? (
          <div className="py-20 text-center text-xs text-slate-400">Loading prescriptions...</div>
        ) : prescriptions.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-slate-200 p-8 space-y-2">
            <ClipboardList className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No prescriptions yet</h3>
            <p className="text-xs text-slate-400">Prescriptions issued by your attending doctors will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prescriptions.map((rx) => (
              <div
                key={rx._id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-soft hover:shadow-soft-lg transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-md border border-teal-200">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(rx.prescriptionDate || rx.createdAt).toLocaleDateString()}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">
                      {rx.medicines?.length || 0} Medicine(s)
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Diagnosis
                    </span>
                    <h4 className="text-base font-bold text-slate-900 mt-0.5">{rx.diagnosis}</h4>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-1">
                    <span className="text-slate-400 block font-medium">Prescribed By:</span>
                    <p className="font-bold text-slate-800">{rx.doctorId?.userId?.name || 'Doctor'}</p>
                    <p className="text-[11px] text-teal-700">{rx.doctorId?.qualification}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => setSelectedPrescription(rx)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-sm transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Open Prescription Slip
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <PrescriptionModal
        isOpen={Boolean(selectedPrescription)}
        onClose={() => setSelectedPrescription(null)}
        prescription={selectedPrescription}
      />
    </div>
  );
}
