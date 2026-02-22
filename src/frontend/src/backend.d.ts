import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Job {
    status: JobStatus;
    serviceDate: Time;
    serviceType: string;
    issuesFound: string;
    jobId: JobId;
    customerId: CustomerId;
}
export type Time = bigint;
export type CustomerId = bigint;
export type JobId = bigint;
export type AppointmentId = bigint;
export interface Appointment {
    scheduledDate: Time;
    jobType: string;
    durationMinutes: bigint;
    customerId: CustomerId;
    appointmentId: AppointmentId;
}
export interface Customer {
    jobHistory: Array<JobId>;
    name: string;
    physicalAddress: string;
    customerId: CustomerId;
    emailAddress: string;
    phoneNumber: string;
}
export interface UserProfile {
    name: string;
}
export enum JobStatus {
    scheduled = "scheduled",
    completed = "completed",
    inProgress = "inProgress"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createAppointment(customerId: CustomerId, scheduledDate: Time, jobType: string, durationMinutes: bigint): Promise<AppointmentId>;
    createCustomer(name: string, phoneNumber: string, emailAddress: string, physicalAddress: string): Promise<CustomerId>;
    createJob(customerId: CustomerId, serviceDate: Time, serviceType: string, issuesFound: string): Promise<JobId>;
    getAllAppointments(): Promise<Array<Appointment>>;
    getAllCustomers(): Promise<Array<Customer>>;
    getAllJobs(): Promise<Array<Job>>;
    getAppointment(appointmentId: AppointmentId): Promise<Appointment>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCustomer(customerId: CustomerId): Promise<Customer>;
    getJob(jobId: JobId): Promise<Job>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateJobStatus(jobId: JobId, status: JobStatus): Promise<void>;
}
