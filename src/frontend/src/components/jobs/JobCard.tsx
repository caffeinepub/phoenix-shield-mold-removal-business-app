import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUpdateJobStatus, useGetAllCustomers } from '../../hooks/useQueries';
import JobStatusBadge from './JobStatusBadge';
import { Calendar, User, Wrench, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import type { Job, JobStatus } from '../../backend';

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  const { data: customers } = useGetAllCustomers();
  const updateStatus = useUpdateJobStatus();
  const [isUpdating, setIsUpdating] = useState(false);

  const customer = customers?.find((c) => c.customerId.toString() === job.customerId.toString());

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      await updateStatus.mutateAsync({
        jobId: job.jobId,
        status: newStatus as JobStatus,
      });
      toast.success('Job status updated successfully');
    } catch (error) {
      console.error('Error updating job status:', error);
      toast.error('Failed to update job status');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{job.serviceType}</h3>
              <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{new Date(Number(job.serviceDate) / 1000000).toLocaleDateString()}</span>
              </div>
            </div>
            <JobStatusBadge status={job.status} />
          </div>

          {customer && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>{customer.name}</span>
            </div>
          )}

          {job.issuesFound && (
            <div className="flex items-start gap-2 text-sm">
              <AlertCircle className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
              <p className="text-muted-foreground">{job.issuesFound}</p>
            </div>
          )}

          <div className="pt-2 border-t">
            <label className="text-sm font-medium mb-2 block">Update Status</label>
            <Select
              value={job.status}
              onValueChange={handleStatusChange}
              disabled={isUpdating}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="inProgress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
