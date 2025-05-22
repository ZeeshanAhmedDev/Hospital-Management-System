// Authentication BaseUrl API
export const AUTHENTICATION_API = {
  BASE_URL: "http://localhost:5000/api",
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  FORGOT_PASSWORD: "/auth/forgot-password",
  ALL_PATIENTS: "/auth/patients"
};

// Patient Services BaseUrl API
export const PATIENT_API = {
  BASE_URL: "http://localhost:7000/api/patients",
  REGISTER: "/register",
  LOGIN: "/login",
  GET_PROFILE: "/:id",
  UPDATE_PROFILE: "/:id",
  CREATE_MEDICAL_RECORDS: "/medicalRecords",
  VIEW_MEDICAL_RECORDS: "/6799532fac22c94e30abbf03/medical-records",
};

// Staff Services BaseUrl API
export const STAFF_API = {
  BASE_URL: "http://localhost:8000/api/staff",
  REGISTER: "/register",
  LOGIN: "/login",
  ALL_STAFF: "/all-stuffs",
  GET_PROFILE: "/:id",
  UPDATE_PROFILE: "/:id",
  ASSIGN_WARDS: "/:id/assign-wards",
  MANAGE_SCHEDULE: "/:id/manage-schedule",
};

// Appointments BaseUrl API
export const APPOINTMENTS_API = {
  BASE_URL: "http://localhost:9000/api",
  BOOK_APPOINTMENT: "/appointments",
  EDIT_APPOINTMENT: "/appointments/:id",
  CANCEL_APPOINTMENT: "/appointments/:id",
  GET_APPOINTMENTS: "/appointments",
};


//TODO backend appointments .env