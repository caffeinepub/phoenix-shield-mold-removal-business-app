import { useGetAllJobs } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, CheckCircle, TrendingUp } from 'lucide-react';
import { JobStatus } from '../backend';

export default function DashboardPage() {
  const { data: jobs, isLoading } = useGetAllJobs();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const monthlyJobs = jobs?.filter((job) => {
    const jobDate = new Date(Number(job.serviceDate) / 1000000);
    return jobDate.getMonth() === currentMonth && jobDate.getFullYear() === currentYear;
  }) || [];

  const completedJobs = monthlyJobs.filter((job) => job.status === JobStatus.completed);
  const completedJobsCount = completedJobs.length;

  const estimatedRevenuePerJob = 2500;
  const totalRevenue = completedJobsCount * estimatedRevenuePerJob;
  const averageJobValue = completedJobsCount > 0 ? totalRevenue / completedJobsCount : 0;

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div className="container py-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Business Dashboard</h1>
          <p className="text-muted-foreground">Revenue insights for {monthName}</p>
        </div>
        
        <div className="flex justify-center md:justify-end">
          <img
            src="/assets/character.png"
            alt="Phoenix Shield Mascot"
            className="h-40 w-40 object-contain"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              From {completedJobsCount} completed {completedJobsCount === 1 ? 'job' : 'jobs'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jobs Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedJobsCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Out of {monthlyJobs.length} total {monthlyJobs.length === 1 ? 'job' : 'jobs'} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Job Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${averageJobValue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Per completed job
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>About Revenue Calculations</CardTitle>
          <CardDescription>
            Revenue estimates are based on completed jobs this month
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            The dashboard calculates revenue using an estimated average of ${estimatedRevenuePerJob.toLocaleString()} per completed mold remediation job. 
            These figures provide a snapshot of your monthly business performance based on job completion status.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
