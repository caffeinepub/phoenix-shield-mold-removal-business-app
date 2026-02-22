import Array "mo:core/Array";
import List "mo:core/List";
import Time "mo:core/Time";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  public type CustomerId = Nat;
  public type JobId = Nat;
  public type AppointmentId = Nat;

  public type Customer = {
    customerId : CustomerId;
    name : Text;
    phoneNumber : Text;
    emailAddress : Text;
    physicalAddress : Text;
    jobHistory : [JobId];
  };

  public type JobStatus = {
    #scheduled;
    #inProgress;
    #completed;
  };

  public type Job = {
    jobId : JobId;
    customerId : CustomerId;
    serviceDate : Time.Time;
    serviceType : Text;
    issuesFound : Text;
    status : JobStatus;
  };

  public type Appointment = {
    appointmentId : AppointmentId;
    customerId : CustomerId;
    scheduledDate : Time.Time;
    jobType : Text;
    durationMinutes : Nat;
  };

  public type UserProfile = {
    name : Text;
  };

  // Initialize the access control state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let customers = Map.empty<CustomerId, Customer>();
  let jobs = Map.empty<JobId, Job>();
  let appointments = Map.empty<AppointmentId, Appointment>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  var nextCustomerId : CustomerId = 1;
  var nextJobId : JobId = 1;
  var nextAppointmentId : AppointmentId = 1;

  // User Profile Management Functions

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Customer Management Functions

  public shared ({ caller }) func createCustomer(name : Text, phoneNumber : Text, emailAddress : Text, physicalAddress : Text) : async CustomerId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create customers");
    };

    let customerId = nextCustomerId;
    nextCustomerId += 1;

    let newCustomer : Customer = {
      customerId;
      name;
      phoneNumber;
      emailAddress;
      physicalAddress;
      jobHistory = [];
    };

    customers.add(customerId, newCustomer);
    customerId;
  };

  public query ({ caller }) func getCustomer(customerId : CustomerId) : async Customer {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can access customer data");
    };

    switch (customers.get(customerId)) {
      case (null) { Runtime.trap("Customer not found") };
      case (?customer) { customer };
    };
  };

  public query ({ caller }) func getAllCustomers() : async [Customer] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can access customer data");
    };
    
    let customerArray = customers.values().toArray();
    customerArray.sort(func(c1 : Customer, c2 : Customer) : Order.Order {
      Nat.compare(c1.customerId, c2.customerId)
    });
  };

  // Job Management Functions

  public shared ({ caller }) func createJob(customerId : CustomerId, serviceDate : Time.Time, serviceType : Text, issuesFound : Text) : async JobId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create jobs");
    };

    let jobId = nextJobId;
    nextJobId += 1;

    let newJob : Job = {
      jobId;
      customerId;
      serviceDate;
      serviceType;
      issuesFound;
      status = #scheduled;
    };

    switch (customers.get(customerId)) {
      case (null) { Runtime.trap("Customer not found") };
      case (?customer) {
        let updatedJobHistory = customer.jobHistory.concat([jobId]);
        let updatedCustomer = { customer with jobHistory = updatedJobHistory };
        customers.add(customerId, updatedCustomer);
      };
    };

    jobs.add(jobId, newJob);
    jobId;
  };

  public shared ({ caller }) func updateJobStatus(jobId : JobId, status : JobStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can update job status");
    };

    switch (jobs.get(jobId)) {
      case (null) { Runtime.trap("Job not found") };
      case (?job) {
        let updatedJob = { job with status };
        jobs.add(jobId, updatedJob);
      };
    };
  };

  public query ({ caller }) func getJob(jobId : JobId) : async Job {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can access job data");
    };

    switch (jobs.get(jobId)) {
      case (null) { Runtime.trap("Job not found") };
      case (?job) { job };
    };
  };

  public query ({ caller }) func getAllJobs() : async [Job] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can access job data");
    };
    
    let jobArray = jobs.values().toArray();
    jobArray.sort(func(j1 : Job, j2 : Job) : Order.Order {
      Nat.compare(j1.jobId, j2.jobId)
    });
  };

  // Appointment Management Functions

  public shared ({ caller }) func createAppointment(customerId : CustomerId, scheduledDate : Time.Time, jobType : Text, durationMinutes : Nat) : async AppointmentId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create appointments");
    };

    let appointmentId = nextAppointmentId;
    nextAppointmentId += 1;

    let newAppointment : Appointment = {
      appointmentId;
      customerId;
      scheduledDate;
      jobType;
      durationMinutes;
    };

    appointments.add(appointmentId, newAppointment);
    appointmentId;
  };

  public query ({ caller }) func getAppointment(appointmentId : AppointmentId) : async Appointment {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can access appointment data");
    };

    switch (appointments.get(appointmentId)) {
      case (null) { Runtime.trap("Appointment not found") };
      case (?appointment) { appointment };
    };
  };

  public query ({ caller }) func getAllAppointments() : async [Appointment] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can access appointment data");
    };
    
    let appointmentArray = appointments.values().toArray();
    appointmentArray.sort(func(a1 : Appointment, a2 : Appointment) : Order.Order {
      Nat.compare(a1.appointmentId, a2.appointmentId)
    });
  };
};
