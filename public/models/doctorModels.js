const API_URL = "http://localhost:8000/api/staff";

export const addDoctor = async (doctorData, token) => {
    const response = await fetch(`${API_URL}/add-doctor`, {
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
