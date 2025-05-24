import { STAFF_API } from "../APIsServices.js";

const API_URL = `${STAFF_API.BASE_URL}${STAFF_API.ADD_DOCTOR}`;

export const addDoctor = async (doctorData, token) => {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(doctorData)
    });

    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.message || "Failed to add doctor.");
    }

    return result;
};
