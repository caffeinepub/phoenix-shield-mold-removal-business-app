import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Customer, Job, Appointment, JobStatus, UserProfile } from '../backend';

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// Customer Queries
export function useGetAllCustomers() {
  const { actor, isFetching } = useActor();

  return useQuery<Customer[]>({
    queryKey: ['customers'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCustomers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCustomer(customerId: bigint | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<Customer | null>({
    queryKey: ['customer', customerId?.toString()],
    queryFn: async () => {
      if (!actor || !customerId) return null;
      try {
        return await actor.getCustomer(customerId);
      } catch (error) {
        console.error('Error fetching customer:', error);
        return null;
      }
    },
    enabled: !!actor && !isFetching && !!customerId,
  });
}

export function useCreateCustomer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      phoneNumber: string;
      emailAddress: string;
      physicalAddress: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createCustomer(
        data.name,
        data.phoneNumber,
        data.emailAddress,
        data.physicalAddress
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
}

// Job Queries
export function useGetAllJobs() {
  const { actor, isFetching } = useActor();

  return useQuery<Job[]>({
    queryKey: ['jobs'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllJobs();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCustomerJobs(customerId: bigint | undefined) {
  const { data: allJobs, ...rest } = useGetAllJobs();

  const customerJobs = allJobs?.filter(
    (job) => job.customerId.toString() === customerId?.toString()
  ) || [];

  return {
    data: customerJobs,
    ...rest,
  };
}

export function useCreateJob() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      customerId: bigint;
      serviceDate: bigint;
      serviceType: string;
      issuesFound: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createJob(
        data.customerId,
        data.serviceDate,
        data.serviceType,
        data.issuesFound
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
}

export function useUpdateJobStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { jobId: bigint; status: JobStatus }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateJobStatus(data.jobId, data.status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });
}

// Appointment Queries
export function useGetAllAppointments() {
  const { actor, isFetching } = useActor();

  return useQuery<Appointment[]>({
    queryKey: ['appointments'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllAppointments();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateAppointment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      customerId: bigint;
      scheduledDate: bigint;
      jobType: string;
      durationMinutes: bigint;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createAppointment(
        data.customerId,
        data.scheduledDate,
        data.jobType,
        data.durationMinutes
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
}
