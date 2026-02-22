import { useState, ReactElement } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import type { Appointment } from '../../backend';

interface MonthlyCalendarProps {
  appointments: Appointment[];
  onDateClick: (date: Date) => void;
  onAppointmentClick: (appointment: Appointment) => void;
}

export default function MonthlyCalendar({
  appointments,
  onDateClick,
  onAppointmentClick,
}: MonthlyCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const startingDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getAppointmentsForDate = (day: number) => {
    const dateToCheck = new Date(year, month, day);
    return appointments.filter((apt) => {
      const aptDate = new Date(Number(apt.scheduledDate) / 1000000);
      return (
        aptDate.getDate() === dateToCheck.getDate() &&
        aptDate.getMonth() === dateToCheck.getMonth() &&
        aptDate.getFullYear() === dateToCheck.getFullYear()
      );
    });
  };

  const days: ReactElement[] = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(<div key={`empty-${i}`} className="min-h-24 p-2" />);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dayAppointments = getAppointmentsForDate(day);
    const isToday =
      day === new Date().getDate() &&
      month === new Date().getMonth() &&
      year === new Date().getFullYear();

    days.push(
      <Card
        key={day}
        className={`min-h-24 cursor-pointer hover:shadow-md transition-shadow ${
          isToday ? 'ring-2 ring-primary' : ''
        }`}
      >
        <CardContent className="p-2">
          <div className="flex items-start justify-between mb-2">
            <span className={`text-sm font-medium ${isToday ? 'text-primary' : ''}`}>{day}</span>
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6"
              onClick={(e) => {
                e.stopPropagation();
                onDateClick(new Date(year, month, day));
              }}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-1">
            {dayAppointments.slice(0, 2).map((apt) => (
              <div
                key={apt.appointmentId.toString()}
                onClick={(e) => {
                  e.stopPropagation();
                  onAppointmentClick(apt);
                }}
                className="text-xs p-1 bg-primary/10 text-primary rounded truncate hover:bg-primary/20"
              >
                {apt.jobType}
              </div>
            ))}
            {dayAppointments.length > 2 && (
              <div className="text-xs text-muted-foreground">+{dayAppointments.length - 2} more</div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          {monthNames[month]} {year}
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={previousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {dayNames.map((day) => (
          <div key={day} className="text-center font-semibold text-sm p-2">
            {day}
          </div>
        ))}
        {days}
      </div>
    </div>
  );
}
