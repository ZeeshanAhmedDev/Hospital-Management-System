import { STAFF_API } from "../APIsServices.js";

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
