import { STAFF_API } from "../APIsServices.js";

const GET_ALL_STAFF_URL = `${STAFF_API.BASE_URL}${STAFF_API.ALL_STAFF}`
const getDoctors = async (doctorSelect, type, token) => {
    try {
        const res = await fetch(GET_ALL_STAFF_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const staffs = await res.json();
        if (type === 'booked') {
            const doctor = staffs.find(staff =>
                staff?.role?.toLowerCase() === "doctor" && staff._id === doctorSelect
            );
            return doctor ? (doctor.name) : "Unknown Doctor";
        } else {
            doctorSelect.innerHTML = '<option value="">Select a Doctor</option>';
            staffs.forEach((staff) => {
                if (staff?.role?.toLowerCase() === "doctor") {
                    const option = document.createElement("option");
                    option.value = staff._id;
                    option.textContent = staff.name || `${staff.firstName} ${staff.lastName}`;
                    doctorSelect.appendChild(option);
                }
            });
        }
    } catch (error) {
        console.error("Failed to load doctors:", error);
    }
};

export default getDoctors;
