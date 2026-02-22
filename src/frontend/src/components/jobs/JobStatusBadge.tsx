import { Badge } from '@/components/ui/badge';
import { JobStatus } from '../../backend';

interface JobStatusBadgeProps {
  status: JobStatus;
}

export default function JobStatusBadge({ status }: JobStatusBadgeProps) {
  const getStatusConfig = () => {
    switch (status) {
      case JobStatus.completed:
        return { label: 'Completed', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' };
      case JobStatus.inProgress:
        return { label: 'In Progress', className: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200' };
      case JobStatus.scheduled:
        return { label: 'Scheduled', className: 'bg-stone-100 text-stone-800 dark:bg-stone-800 dark:text-stone-200' };
      default:
        return { label: 'Unknown', className: '' };
    }
  };

  const config = getStatusConfig();

  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
}
