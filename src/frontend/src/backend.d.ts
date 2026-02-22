import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Material {
    name: string;
    quantity: bigint;
    unitCost: bigint;
}
export interface Customer {
    jobHistory: Array<JobId>;
    name: string;
    physicalAddress: string;
    customerId: CustomerId;
    emailAddress: string;
    phoneNumber: string;
}
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
export interface Estimate {
    totalMaterialCost: bigint;
    laborHours: bigint;
    estimateId: EstimateId;
    creationDate: Time;
    laborHourlyRate: bigint;
    totalEstimate: bigint;
    squareFootage: bigint;
    totalLaborCost: bigint;
    materials: Array<Material>;
    pricePerSquareFoot: bigint;
}
export type AppointmentId = bigint;
export interface Appointment {
    scheduledDate: Time;
    jobType: string;
    durationMinutes: bigint;
    customerId: CustomerId;
    appointmentId: AppointmentId;
}
export type EstimateId = bigint;
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
    deleteEstimate(estimateId: EstimateId): Promise<void>;
    getAllAppointments(): Promise<Array<Appointment>>;
    getAllCustomers(): Promise<Array<Customer>>;
    getAllEstimates(): Promise<Array<Estimate>>;
    getAllJobs(): Promise<Array<Job>>;
    getAppointment(appointmentId: AppointmentId): Promise<Appointment>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCustomer(customerId: CustomerId): Promise<Customer>;
    getEstimate(estimateId: EstimateId): Promise<Estimate>;
    getJob(jobId: JobId): Promise<Job>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveEstimate(squareFootage: bigint, pricePerSquareFoot: bigint, materials: Array<Material>, laborHours: bigint, laborHourlyRate: bigint): Promise<EstimateId>;
    updateEstimate(estimateId: EstimateId, squareFootage: bigint, pricePerSquareFoot: bigint, materials: Array<Material>, laborHours: bigint, laborHourlyRate: bigint): Promise<void>;
    updateJobStatus(jobId: JobId, status: JobStatus): Promise<void>;
}
