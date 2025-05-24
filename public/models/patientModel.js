import { STAFF_API } from "../APIsServices.js";

const BASE_URL = `${STAFF_API.BASE_URL}`;
const ADMIT_PATIENT_URL = `${STAFF_API.BASE_URL}${STAFF_API.ADMIT_PATIENT}`;

export const admitPatient = async (patientData, token) => {
    const response = await fetch(ADMIT_PATIENT_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(patientData)
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Failed to admit patient");
    }

    return result;
};

// Get a single patient by ID
export const getPatientById = async (patientId, token) => {
    const response = await fetch(`${BASE_URL}/admissions/${patientId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });

    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.message || "Failed to fetch patient");
    }
    return result;
};

// Update a patient's information
export const updatePatient = async (patientId, updatedData, token) => {
    const response = await fetch(`${BASE_URL}/admissions/${patientId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(updatedData)
    });

    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.message || "Failed to update patient");
    }
    return result;
};

// Delete a patient by ID
export const deletePatientById = async (patientId, token) => {
    const response = await fetch(`${BASE_URL}/admissions/${patientId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });

    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.message || "Failed to delete patient");
    }
    return result;
};