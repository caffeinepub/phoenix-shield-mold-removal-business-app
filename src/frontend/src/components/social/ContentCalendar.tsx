import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';
import { ReactElement } from 'react';

export default function ContentCalendar() {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const scheduledPosts = [
    { day: 5, title: 'Prevention Tips', platform: 'Facebook' },
    { day: 12, title: 'Before/After', platform: 'Instagram' },
    { day: 18, title: 'Customer Testimonial', platform: 'LinkedIn' },
    { day: 25, title: 'Seasonal Advice', platform: 'Twitter' },
  ];

  const days: ReactElement[] = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="p-2" />);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const postsForDay = scheduledPosts.filter((post) => post.day === day);
    const isToday = day === currentDate.getDate();

    days.push(
      <div
        key={day}
        className={`min-h-[80px] p-2 border rounded-lg ${
          isToday ? 'bg-primary/10 border-primary' : 'bg-card'
        }`}
      >
        <div className="font-semibold text-sm mb-1">{day}</div>
        {postsForDay.map((post, idx) => (
          <Badge key={idx} variant="secondary" className="text-xs mb-1 block">
            {post.title}
          </Badge>
        ))}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Content Calendar
        </CardTitle>
        <CardDescription>Plan and schedule your social media posts for {monthName}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center font-semibold text-sm text-muted-foreground p-2">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">{days}</div>
      </CardContent>
    </Card>
  );
}
