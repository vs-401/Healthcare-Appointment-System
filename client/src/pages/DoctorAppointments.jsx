import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useToast } from '../context/ToastContext';
import Sidebar from '../components/Sidebar';
import AppointmentCard from '../components/AppointmentCard';
import PrescriptionModal from '../components/PrescriptionModal';
import { Calendar, Filter, Plus, Trash2, X, CheckCircle2 } from 'lucide-react';

export default function DoctorAppointments() {
  const toast = useToast();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  // Prescription Writing Modal
  const [prescribingApt, setPrescribingApt] = useState(null);
  const [diagnosis, setDiagnosis] = useState('');
  const [instructions, setInstructions] = useState('Take medicines as directed. Drink adequate water and get sufficient rest.');
  const [medicines, setMedicines] = useState([
    { name: '', dosage: '500 mg', frequency: '1-0-1 (After Food)', duration: '5 Days', notes: '' },
  ]);
  const [savingRx, setSavingRx] = useState(false);

  // View Prescription Modal
  const [viewingRx, setViewingRx] = useState(null);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await API.get('/appointments/doctor/my-appointments');
      setAppointments(res.data.appointments || []);
    } catch (err) {
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleStatusChange = async (appointmentId, status, reason) => {
    try {
      const res = await API.put(`/appointments/${appointmentId}/status`, {
        status,
        cancellationReason: reason || '',
      });
      if (res.data.success) {
        toast.success(`Appointment marked as ${status}`);
        fetchAppointments();
      }
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleAddMedicineRow = () => {
    setMedicines((prev) => [
      ...prev,
      { name: '', dosage: '', frequency: '1-0-1 (After Food)', duration: '3 Days', notes: '' },
    ]);
  };

  const handleRemoveMedicineRow = (idx) => {
    setMedicines((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleMedChange = (idx, field, value) => {
    setMedicines((prev) => {
      const updated = [...prev];
      updated[idx][field] = value;
      return updated;
    });
  };

  const handlePrescriptionSubmit = async (e) => {
    e.preventDefault();
    if (!diagnosis.trim()) {
      toast.warning('Please enter a clinical diagnosis');
      return;
    }
    const validMeds = medicines.filter((m) => m.name.trim());
    if (validMeds.length === 0) {
      toast.warning('Please add at least one medication');
      return;
    }

    setSavingRx(true);
    try {
      const payload = {
        appointmentId: prescribingApt._id,
        diagnosis,
        medicines: validMeds,
        instructions,
      };

      const res = await API.post('/prescriptions', payload);
      if (res.data.success) {
        toast.success('Prescription created and appointment completed!');
        setPrescribingApt(null);
        setDiagnosis('');
        setMedicines([{ name: '', dosage: '500 mg', frequency: '1-0-1 (After Food)', duration: '5 Days', notes: '' }]);
        fetchAppointments();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create prescription');
    } finally {
      setSavingRx(false);
    }
  };

  const handleViewPrescription = async (apt) => {
    try {
      const res = await API.get(`/prescriptions/appointment/${apt._id}`);
      setViewingRx(res.data.prescription);
    } catch (err) {
      toast.info('No electronic prescription found for this appointment.');
    }
  };

  const filtered = appointments.filter((a) => {
    if (filterStatus === 'all') return true;
    return a.status === filterStatus;
  });

  return (
    <div className="flex min-h-[calc(100vh-5rem)] bg-slate-50">
      <Sidebar />
      <main className="flex-1 p-6 sm:p-8 space-y-6 max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Doctor's Appointments</h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Review consultations, accept patient requests, and issue electronic prescriptions
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-slate-200 shadow-sm text-xs font-semibold overflow-x-auto">
            {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3.5 py-1.5 rounded-xl capitalize transition-colors ${
                  filterStatus === st
                    ? 'bg-teal-600 text-white shadow-sm font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center text-xs text-slate-400">Loading doctor appointments...</div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-slate-200 p-8 space-y-2">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No appointments found</h3>
            <p className="text-xs text-slate-400">No appointments matching "{filterStatus}" state.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((apt) => (
              <AppointmentCard
                key={apt._id}
                appointment={apt}
                role="doctor"
                onStatusChange={handleStatusChange}
                onWritePrescription={(a) => {
                  setPrescribingApt(a);
                  setDiagnosis(a.doctorNotes || '');
                }}
                onViewPrescription={handleViewPrescription}
              />
            ))}
          </div>
        )}
      </main>

      {/* Write Prescription Modal */}
      {prescribingApt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-soft-xl border border-slate-100 my-8 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Write Electronic Prescription</h3>
                <p className="text-xs text-slate-500">
                  Patient: <strong className="text-teal-700">{prescribingApt.patientDetails?.fullName || prescribingApt.patientId?.name}</strong> • Slot: {prescribingApt.timeSlot}
                </p>
              </div>
              <button onClick={() => setPrescribingApt(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePrescriptionSubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Clinical Diagnosis *</label>
                <input
                  type="text"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  required
                  placeholder="e.g. Acute Bronchitis / Stage 1 Hypertension"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
                />
              </div>

              {/* Medicine rows */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-semibold text-slate-700">Prescribed Medications (Rx) *</label>
                  <button
                    type="button"
                    onClick={handleAddMedicineRow}
                    className="flex items-center gap-1 text-xs font-bold text-teal-600 hover:text-teal-700"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Another Medicine
                  </button>
                </div>

                <div className="space-y-3">
                  {medicines.map((med, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-teal-800 uppercase">Medicine #{idx + 1}</span>
                        {medicines.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveMedicineRow(idx)}
                            className="text-rose-500 hover:text-rose-700 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
                        <input
                          type="text"
                          placeholder="Medicine name (e.g. Paracetamol)"
                          value={med.name}
                          onChange={(e) => handleMedChange(idx, 'name', e.target.value)}
                          required
                          className="sm:col-span-2 px-3 py-2 rounded-lg border border-slate-200 bg-white"
                        />
                        <input
                          type="text"
                          placeholder="Dosage (500mg)"
                          value={med.dosage}
                          onChange={(e) => handleMedChange(idx, 'dosage', e.target.value)}
                          required
                          className="px-3 py-2 rounded-lg border border-slate-200 bg-white"
                        />
                        <input
                          type="text"
                          placeholder="Duration (5 Days)"
                          value={med.duration}
                          onChange={(e) => handleMedChange(idx, 'duration', e.target.value)}
                          required
                          className="px-3 py-2 rounded-lg border border-slate-200 bg-white"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <select
                          value={med.frequency}
                          onChange={(e) => handleMedChange(idx, 'frequency', e.target.value)}
                          className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-700"
                        >
                          <option value="1-0-1 (After Food)">1-0-1 (Morning & Night After Food)</option>
                          <option value="1-0-0 (Morning)">1-0-0 (Morning Only)</option>
                          <option value="0-0-1 (Night)">0-0-1 (Night Only)</option>
                          <option value="1-1-1 (Thrice Daily)">1-1-1 (Thrice Daily)</option>
                          <option value="As Needed (SOS)">As Needed (SOS)</option>
                        </select>
                        <input
                          type="text"
                          placeholder="Notes (e.g. Drink plenty of water)"
                          value={med.notes}
                          onChange={(e) => handleMedChange(idx, 'notes', e.target.value)}
                          className="px-3 py-2 rounded-lg border border-slate-200 bg-white"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">General Patient Advice & Instructions</label>
                <textarea
                  rows={2}
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setPrescribingApt(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingRx}
                  className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {savingRx ? 'Submitting...' : 'Complete & Issue Prescription'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Prescription View Modal */}
      <PrescriptionModal
        isOpen={Boolean(viewingRx)}
        onClose={() => setViewingRx(null)}
        prescription={viewingRx}
      />
    </div>
  );
}
