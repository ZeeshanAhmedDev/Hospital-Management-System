import { APPOINTMENTS_API } from "../APIsServices.js";
import getDoctors from "../utils/doctorList.js";

const loggedInUser = sessionStorage.getItem("loggedInUser");
let userData;
let token;
if (loggedInUser) {
    userData = JSON.parse(loggedInUser);
    token = userData.token?.trim();
}
const getHeaders = (token) => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
});


const bookedAppointmentTable = document.querySelector("table.appointment-table tbody");
const patientId = userData?.user?._id;
const FETCH_PATIENT_BOOKING_URL = `${APPOINTMENTS_API.BASE_URL}${APPOINTMENTS_API.GET_SINGLE_PATIENT}`;
const CANCELLING_PATIENT_BOOKING_URL = `${APPOINTMENTS_API.BASE_URL}${APPOINTMENTS_API.GET_APPOINTMENTS}`;



// get current patient booked appointment
const fetchCurrentPatientBooking = async (patientId, token) => {
    try {
        const res = await fetch(`${FETCH_PATIENT_BOOKING_URL}/${patientId}`, {
            method: 'GET',
            headers: getHeaders(token)
        });

        return await res.json();
    } catch (error) {
        console.error("Failed to fetch appointments:", err);
        return [];
    }

}

// populate data to the table
const renderAppointmentTable = async (appointments, tableElement, token) => {
    tableElement.innerHTML = ""; // Clear previous data

    for (let [index, appointment] of appointments.entries()) {
        const tr = document.createElement("tr");

        const doctorName = await getDoctors(appointment.doctorId, "booked", token); 
        const statusText = appointment.status || "Pending";
        const isCanceled = statusText.toLowerCase() === "canceled";
        const statusClass = isCanceled ? "text-danger fw-bold" : "";

        tr.innerHTML = `
        <td>${index + 1}</td>
        <td>${doctorName || "Unknown"}</td>
        <td class="${statusClass}">${statusText}</td>
        <td>${appointment.phone || ""}</td>
        <td>${appointment.email || ""}</td>
        <td>
            <button 
            class="btn btn-sm ${isCanceled ? "btn-secondary" : "btn-danger"} cancel-btn" 
            data-id="${appointment._id}" 
            ${isCanceled ? "disabled" : ""}
            >
            X
            </button>
        </td>
    `;
        tableElement.appendChild(tr);
    }
}

// cancel click handler
const setupCancelHandler = (token, tableElement) => {
    tableElement.addEventListener("click", async (event) => {
        if (!event.target.classList.contains("cancel-btn")) return;

        const appointmentId = event.target.getAttribute("data-id");
        if (!appointmentId || !confirm("Are you sure you want to cancel this appointment?")) return;

        try {
            const res = await fetch(`${CANCELLING_PATIENT_BOOKING_URL}/${appointmentId}`, {
                method: "PATCH",
                headers: getHeaders(token)
            });

            if (res.ok) {
                const row = event.target.closest("tr");
                const statusCell = row?.querySelector("td:nth-child(3)");
                if (statusCell) {
                    statusCell.textContent = "canceled";
                    statusCell.classList.add("text-danger", "fw-bold");
                }

                event.target.disabled = true;
                event.target.classList.remove("btn-danger");
                event.target.classList.add("btn-secondary");
            } else {
                const errorData = await res.json();
                console.error("Failed to cancel appointment:", errorData.message);
            }
        } catch (error) {
            console.error("Error while cancelling appointment:", error);
        }
    });
};

(async () => {
    const appointments = await fetchCurrentPatientBooking(patientId, token);
    await renderAppointmentTable(appointments, bookedAppointmentTable, token);
    setupCancelHandler(token, bookedAppointmentTable);
})();