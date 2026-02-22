import { useState } from 'react';
import { useGetAllAppointments, useCreateAppointment } from '../hooks/useQueries';
import MonthlyCalendar from '../components/calendar/MonthlyCalendar';
import AppointmentForm from '../components/calendar/AppointmentForm';
import AppointmentDetailsModal from '../components/calendar/AppointmentDetailsModal';
import { toast } from 'sonner';
import type { Appointment } from '../backend';

export default function CalendarPage() {
  const { data: appointments, isLoading } = useGetAllAppointments();
  const createAppointment = useCreateAppointment();
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setShowForm(true);
  };

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
  };

  const handleCreateAppointment = async (data: {
    customerId: bigint;
    scheduledDate: bigint;
    jobType: string;
    durationMinutes: bigint;
  }) => {
    try {
      await createAppointment.mutateAsync(data);
      toast.success('Appointment scheduled successfully!');
      setShowForm(false);
      setSelectedDate(undefined);
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast.error('Failed to schedule appointment. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-48 bg-muted animate-pulse rounded" />
        <div className="h-96 bg-muted animate-pulse rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
        <p className="text-muted-foreground mt-1">
          Schedule and manage your appointments
        </p>
      </div>

      <MonthlyCalendar
        appointments={appointments || []}
        onDateClick={handleDateClick}
        onAppointmentClick={handleAppointmentClick}
      />

      <AppointmentForm
        open={showForm}
        onOpenChange={setShowForm}
        onSubmit={handleCreateAppointment}
        selectedDate={selectedDate}
        isLoading={createAppointment.isPending}
      />

      <AppointmentDetailsModal
        open={!!selectedAppointment}
        onOpenChange={(open) => !open && setSelectedAppointment(null)}
        appointment={selectedAppointment}
      />
    </div>
  );
}
