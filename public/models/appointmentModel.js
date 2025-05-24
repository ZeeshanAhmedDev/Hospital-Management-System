const BASE_URL = "http://localhost:9000/api/appointments";

export const getAllAppointments = async (token) => {
    try {
        const res = await fetch(BASE_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        return await res.json();
    } catch (error) {
        console.error("Failed to load appointments:", error);
        return [];
    }
};

export const cancelAppointment = async (appointmentId, token) => {
    try {
        const res = await fetch(`${BASE_URL}/${appointmentId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Failed to cancel appointment");
        }

        return await res.json();
    } catch (error) {
        console.error("Cancel error:", error);
        throw error;
    }
};
