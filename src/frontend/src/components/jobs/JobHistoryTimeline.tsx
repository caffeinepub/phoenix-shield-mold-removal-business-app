import { useGetCustomerJobs, useGetAllCustomers } from '../../hooks/useQueries';
import JobStatusBadge from './JobStatusBadge';
import { Calendar, Wrench, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface JobHistoryTimelineProps {
  customerId: bigint;
}

export default function JobHistoryTimeline({ customerId }: JobHistoryTimelineProps) {
  const { data: jobs, isLoading } = useGetCustomerJobs(customerId);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (!jobs || jobs.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
              <Wrench className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">No Job History</h3>
              <p className="text-sm text-muted-foreground">
                This customer doesn't have any completed jobs yet.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const sortedJobs = [...jobs].sort((a, b) => Number(b.serviceDate - a.serviceDate));

  return (
    <div className="space-y-4">
      {sortedJobs.map((job, index) => (
        <Card key={job.jobId.toString()}>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Wrench className="h-6 w-6 text-primary" />
              </div>

              <div className="flex-1 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="font-semibold">{job.serviceType}</h4>
                    <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(Number(job.serviceDate) / 1000000).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <JobStatusBadge status={job.status} />
                </div>

                {job.issuesFound && (
                  <div className="flex items-start gap-2 text-sm">
                    <AlertCircle className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <p className="text-muted-foreground">{job.issuesFound}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
