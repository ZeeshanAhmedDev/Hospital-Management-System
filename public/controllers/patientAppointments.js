import { cancelAppointment, getAllAppointments } from "../models/appointmentModel.js";
import getDoctors from "../utils/doctorList.js";

export const loadPatientAppointment = async (token) => {
    const tableBody = document.querySelector("table.patient-appointment-table tbody");
    if (!tableBody) {
        console.error("Table body not found!");
        return;
    }

    const appointments = await getAllAppointments(token);

    if (!appointments.length) {
        tableBody.innerHTML = `<tr><td colspan="6" class="text-center">No appointments found.</td></tr>`;
        return;
    }

    tableBody.innerHTML = '';

    appointments.forEach(async (appointment, index) => {
        const tr = document.createElement("tr");
        const patientName = `${appointment.firstName} ${appointment.lastName}`;
        const doctorName = await getDoctors(appointment.doctorId, "booked", token);
        const statusText = appointment.status || "Pending";
        const isCanceled = statusText.toLowerCase() === "canceled";

        tr.innerHTML = `
            <td>${patientName || "Unknown"}</td>
            <td>${doctorName || "Unknown"}</td>
            <td class="${isCanceled ? 'text-danger fw-bold' : ''}">${statusText}</td>
            <td>${appointment.phone || ""}</td>
            <td>${appointment.email || ""}</td>
            <td>
                <button 
                    class="btn btn-sm ${isCanceled ? 'btn-secondary' : 'btn-danger'} cancel-btn"
                    data-id="${appointment._id}"
                    ${isCanceled ? 'disabled' : ''}
                >
                    X
                </button>
            </td>
        `;

        tableBody.appendChild(tr);
    });

    document.addEventListener("click", async (event) => {
        if (event.target.classList.contains("cancel-btn")) {
            const appointmentId = event.target.getAttribute("data-id");
            if (!appointmentId) return;

            const confirmed = confirm("Are you sure you want to cancel this appointment?");
            if (!confirmed) return;

            try {
                const result = await cancelAppointment(appointmentId, token);
                console.log("Appointment canceled:", result);

                const row = event.target.closest("tr");
                const statusCell = row?.querySelector("td:nth-child(3)");
                if (statusCell) {
                    statusCell.textContent = "canceled";
                    statusCell.classList.add("text-danger", "fw-bold");
                }

                event.target.disabled = true;
                event.target.classList.remove("btn-danger");
                event.target.classList.add("btn-secondary");
            } catch (error) {
                alert("Failed to cancel appointment: " + error.message);
            }
        }
    });
};
