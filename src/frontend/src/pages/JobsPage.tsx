import { useState } from 'react';
import { useGetAllJobs } from '../hooks/useQueries';
import JobCard from '../components/jobs/JobCard';
import JobForm from '../components/jobs/JobForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Briefcase, Plus } from 'lucide-react';
import { JobStatus } from '../backend';

export default function JobsPage() {
  const { data: jobs, isLoading } = useGetAllJobs();
  const [activeTab, setActiveTab] = useState<string>('all');
  const [isJobFormOpen, setIsJobFormOpen] = useState(false);

  const filterJobsByStatus = (status?: JobStatus) => {
    if (!jobs) return [];
    if (!status) return jobs;
    return jobs.filter((job) => job.status === status);
  };

  const scheduledJobs = filterJobsByStatus(JobStatus.scheduled);
  const inProgressJobs = filterJobsByStatus(JobStatus.inProgress);
  const completedJobs = filterJobsByStatus(JobStatus.completed);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-48 bg-muted animate-pulse rounded" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  const renderJobList = (jobList: typeof jobs) => {
    if (!jobList || jobList.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-6">
            <Briefcase className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">No jobs found</h2>
          <p className="text-muted-foreground max-w-md mb-6">
            {activeTab === 'all'
              ? 'No jobs have been created yet. Create your first job to get started.'
              : `No ${activeTab.replace('-', ' ')} jobs at the moment.`}
          </p>
          {activeTab === 'all' && (
            <Button onClick={() => setIsJobFormOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Job
            </Button>
          )}
        </div>
      );
    }

    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {jobList.map((job) => (
          <JobCard key={job.jobId.toString()} job={job} />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Jobs</h1>
          <p className="text-muted-foreground mt-1">
            Track and manage job status across all projects
          </p>
        </div>
        <Button onClick={() => setIsJobFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Job
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">
            All Jobs
            {jobs && <span className="ml-2 text-xs">({jobs.length})</span>}
          </TabsTrigger>
          <TabsTrigger value="scheduled">
            Scheduled
            {scheduledJobs && <span className="ml-2 text-xs">({scheduledJobs.length})</span>}
          </TabsTrigger>
          <TabsTrigger value="in-progress">
            In Progress
            {inProgressJobs && <span className="ml-2 text-xs">({inProgressJobs.length})</span>}
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed
            {completedJobs && <span className="ml-2 text-xs">({completedJobs.length})</span>}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {renderJobList(jobs)}
        </TabsContent>

        <TabsContent value="scheduled" className="mt-6">
          {renderJobList(scheduledJobs)}
        </TabsContent>

        <TabsContent value="in-progress" className="mt-6">
          {renderJobList(inProgressJobs)}
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          {renderJobList(completedJobs)}
        </TabsContent>
      </Tabs>

      <JobForm
        open={isJobFormOpen}
        onOpenChange={setIsJobFormOpen}
        onSuccess={() => setIsJobFormOpen(false)}
      />
    </div>
  );
}
