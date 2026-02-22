import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useGetAllCustomers } from '../../hooks/useQueries';
import { Calendar, Clock, User, Wrench } from 'lucide-react';
import type { Appointment } from '../../backend';

interface AppointmentDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment: Appointment | null;
}

export default function AppointmentDetailsModal({
  open,
  onOpenChange,
  appointment,
}: AppointmentDetailsModalProps) {
  const { data: customers } = useGetAllCustomers();

  if (!appointment) return null;

  const customer = customers?.find(
    (c) => c.customerId.toString() === appointment.customerId.toString()
  );

  const appointmentDate = new Date(Number(appointment.scheduledDate) / 1000000);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Appointment Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <User className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium">Customer</p>
              <p className="text-sm text-muted-foreground">{customer?.name || 'Unknown'}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium">Date</p>
              <p className="text-sm text-muted-foreground">{appointmentDate.toLocaleDateString()}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium">Time</p>
              <p className="text-sm text-muted-foreground">
                {appointmentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} (
                {appointment.durationMinutes.toString()} min)
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Wrench className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium">Job Type</p>
              <p className="text-sm text-muted-foreground">{appointment.jobType}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
