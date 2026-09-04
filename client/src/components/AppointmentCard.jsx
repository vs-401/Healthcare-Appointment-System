import React from 'react';
import StatusBadge from './StatusBadge';
import { Calendar, Clock, ClipboardList } from 'lucide-react';

export default function AppointmentCard({
  appointment,
  role = 'patient',
  onCancel,
  onReschedule,
  onStatusChange,
  onWritePrescription,
  onViewPrescription,
  onViewRecord,
}) {
  if (!appointment) return null;

  const doc = appointment.doctorId?.userId?.name || 'Dr. Specialist';
  const dept = appointment.departmentId?.name || 'General OPD';
  const patient = appointment.patientDetails?.fullName || appointment.patientId?.name || 'Patient';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-soft hover:shadow-soft-lg transition-all duration-200 space-y-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="text-[11px] font-mono font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-md border border-teal-200">
            {appointment.appointmentId}
          </span>
          <h4 className="text-base font-bold text-slate-900 mt-1">
            {role === 'patient' ? doc : patient}
          </h4>
          <p className="text-xs text-slate-500 font-medium">
            {role === 'patient' ? dept : `Age: ${appointment.patientDetails?.age || '-'}, ${appointment.patientDetails?.gender || '-'}`}
          </p>
        </div>
        <StatusBadge status={appointment.status} />
      </div>

      <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-700">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-teal-600 shrink-0" />
          <span className="font-semibold">{appointment.appointmentDate}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-teal-600 shrink-0" />
          <span className="font-semibold">{appointment.timeSlot}</span>
        </div>
      </div>

      <div className="text-xs">
        <span className="text-slate-400 font-medium block">Reason / Symptoms:</span>
        <p className="text-slate-700 mt-0.5 line-clamp-2 italic">"{appointment.symptoms}"</p>
      </div>

      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-end gap-2">
        {role === 'patient' && (
          <>
            {['pending', 'confirmed'].includes(appointment.status) && (
              <>
                {onReschedule && (
                  <button
                    onClick={() => onReschedule(appointment)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    Reschedule
                  </button>
                )}
                {onCancel && (
                  <button
                    onClick={() => onCancel(appointment)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </>
            )}

            {appointment.status === 'completed' && onViewPrescription && (
              <button
                onClick={() => onViewPrescription(appointment)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 transition-colors"
              >
                <ClipboardList className="w-3.5 h-3.5" />
                View Prescription
              </button>
            )}
          </>
        )}

        {role === 'doctor' && (
          <>
            {appointment.status === 'pending' && onStatusChange && (
              <>
                <button
                  onClick={() => onStatusChange(appointment._id, 'confirmed')}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 transition-colors"
                >
                  Accept
                </button>
                <button
                  onClick={() => onStatusChange(appointment._id, 'cancelled', 'Doctor unavailable')}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  Reject
                </button>
              </>
            )}

            {appointment.status === 'confirmed' && onWritePrescription && (
              <button
                onClick={() => onWritePrescription(appointment)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 shadow-sm transition-colors"
              >
                <ClipboardList className="w-3.5 h-3.5" />
                Prescribe
              </button>
            )}

            {appointment.status === 'completed' && onViewPrescription && (
              <button
                onClick={() => onViewPrescription(appointment)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                <ClipboardList className="w-3.5 h-3.5" />
                Prescription
              </button>
            )}
          </>
        )}

        {role === 'admin' && (
          <div className="flex items-center gap-1.5">
            {appointment.status === 'pending' && onStatusChange && (
              <button
                onClick={() => onStatusChange(appointment._id, 'confirmed')}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700"
              >
                Confirm
              </button>
            )}
            {onViewPrescription && (
              <button
                onClick={() => onViewPrescription(appointment)}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200"
              >
                Prescription
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
