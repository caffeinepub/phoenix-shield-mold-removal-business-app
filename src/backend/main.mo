import Array "mo:core/Array";
import Time "mo:core/Time";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";



actor {
  public type CustomerId = Nat;
  public type JobId = Nat;
  public type AppointmentId = Nat;
  public type EstimateId = Nat;

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

  public type Material = {
    name : Text;
    quantity : Nat;
    unitCost : Nat;
  };

  public type Estimate = {
    estimateId : EstimateId;
    creationDate : Time.Time;
    squareFootage : Nat;
    pricePerSquareFoot : Nat;
    materials : [Material];
    laborHours : Nat;
    laborHourlyRate : Nat;
    totalMaterialCost : Nat;
    totalLaborCost : Nat;
    totalEstimate : Nat;
  };

  // Initialize the access control state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let customers = Map.empty<CustomerId, Customer>();
  let jobs = Map.empty<JobId, Job>();
  let appointments = Map.empty<AppointmentId, Appointment>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let estimates = Map.empty<EstimateId, Estimate>();

  var nextCustomerId : CustomerId = 1;
  var nextJobId : JobId = 1;
  var nextAppointmentId : AppointmentId = 1;
  var nextEstimateId : EstimateId = 1;

  // User Profile Management Functions

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    checkUser(caller);
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    checkUser(caller);
    userProfiles.add(caller, profile);
  };

  // Customer Management Functions

  public shared ({ caller }) func createCustomer(name : Text, phoneNumber : Text, emailAddress : Text, physicalAddress : Text) : async CustomerId {
    checkUser(caller);

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
    checkUser(caller);

    switch (customers.get(customerId)) {
      case (null) { Runtime.trap("Customer not found") };
      case (?customer) { customer };
    };
  };

  public query ({ caller }) func getAllCustomers() : async [Customer] {
    checkUser(caller);

    customers.values().toArray().sort(
      func(a, b) { Nat.compare(a.customerId, b.customerId) }
    );
  };

  // Job Management Functions

  public shared ({ caller }) func createJob(customerId : CustomerId, serviceDate : Time.Time, serviceType : Text, issuesFound : Text) : async JobId {
    checkUser(caller);

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
    checkUser(caller);

    switch (jobs.get(jobId)) {
      case (null) { Runtime.trap("Job not found") };
      case (?job) {
        let updatedJob = { job with status };
        jobs.add(jobId, updatedJob);
      };
    };
  };

  public query ({ caller }) func getJob(jobId : JobId) : async Job {
    checkUser(caller);

    switch (jobs.get(jobId)) {
      case (null) { Runtime.trap("Job not found") };
      case (?job) { job };
    };
  };

  public query ({ caller }) func getAllJobs() : async [Job] {
    checkUser(caller);

    jobs.values().toArray().sort(
      func(a, b) { Nat.compare(a.jobId, b.jobId) }
    );
  };

  // Appointment Management Functions

  public shared ({ caller }) func createAppointment(customerId : CustomerId, scheduledDate : Time.Time, jobType : Text, durationMinutes : Nat) : async AppointmentId {
    checkUser(caller);

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
    checkUser(caller);

    switch (appointments.get(appointmentId)) {
      case (null) { Runtime.trap("Appointment not found") };
      case (?appointment) { appointment };
    };
  };

  public query ({ caller }) func getAllAppointments() : async [Appointment] {
    checkUser(caller);

    appointments.values().toArray().sort(
      func(a, b) { Nat.compare(a.appointmentId, b.appointmentId) }
    );
  };

  // Estimate Management Functions

  public shared ({ caller }) func saveEstimate(
    squareFootage : Nat,
    pricePerSquareFoot : Nat,
    materials : [Material],
    laborHours : Nat,
    laborHourlyRate : Nat,
  ) : async EstimateId {
    checkUser(caller);

    let estimateId = nextEstimateId;
    nextEstimateId += 1;

    let totalMaterialCost = materials.foldLeft(
      0,
      func(acc, material) {
        acc + (material.quantity * material.unitCost);
      },
    );

    let totalLaborCost = laborHours * laborHourlyRate;
    let totalEstimate = (squareFootage * pricePerSquareFoot) + totalMaterialCost + totalLaborCost;

    let newEstimate : Estimate = {
      estimateId;
      creationDate = Time.now();
      squareFootage;
      pricePerSquareFoot;
      materials;
      laborHours;
      laborHourlyRate;
      totalMaterialCost;
      totalLaborCost;
      totalEstimate;
    };

    estimates.add(estimateId, newEstimate);
    estimateId;
  };

  public query ({ caller }) func getEstimate(estimateId : EstimateId) : async Estimate {
    checkUser(caller);

    switch (estimates.get(estimateId)) {
      case (null) { Runtime.trap("Estimate not found") };
      case (?estimate) { estimate };
    };
  };

  public query ({ caller }) func getAllEstimates() : async [Estimate] {
    checkUser(caller);

    estimates.values().toArray().sort(
      func(a, b) { Nat.compare(a.estimateId, b.estimateId) }
    );
  };

  public shared ({ caller }) func updateEstimate(
    estimateId : EstimateId,
    squareFootage : Nat,
    pricePerSquareFoot : Nat,
    materials : [Material],
    laborHours : Nat,
    laborHourlyRate : Nat,
  ) : async () {
    checkUser(caller);

    switch (estimates.get(estimateId)) {
      case (null) { Runtime.trap("Estimate not found") };
      case (?_) {
        let totalMaterialCost = materials.foldLeft(
          0,
          func(acc, material) {
            acc + (material.quantity * material.unitCost);
          },
        );

        let totalLaborCost = laborHours * laborHourlyRate;
        let totalEstimate = (squareFootage * pricePerSquareFoot) + totalMaterialCost + totalLaborCost;

        let updatedEstimate : Estimate = {
          estimateId;
          creationDate = Time.now();
          squareFootage;
          pricePerSquareFoot;
          materials;
          laborHours;
          laborHourlyRate;
          totalMaterialCost;
          totalLaborCost;
          totalEstimate;
        };

        estimates.add(estimateId, updatedEstimate);
      };
    };
  };

  public shared ({ caller }) func deleteEstimate(estimateId : EstimateId) : async () {
    checkUser(caller);

    if (not estimates.containsKey(estimateId)) {
      Runtime.trap("Estimate not found");
    };

    estimates.remove(estimateId);
  };

  func checkUser(caller : Principal) {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can perform this operation");
    };
  };
};
