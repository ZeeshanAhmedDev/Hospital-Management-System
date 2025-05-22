import getDoctors from "../utils/doctorList.js";

const loggedInUser = sessionStorage.getItem("loggedInUser");
let userData;
let token;
if (loggedInUser) {
    userData = JSON.parse(loggedInUser);
    token = userData.token?.trim();
}

const appointmentForm = document.getElementById("appointmentForm");
const firstNameInput = document.getElementById("firstName");
if (firstNameInput && userData?.user?.firstName) {
    firstNameInput.value = userData.user.firstName;
    firstNameInput.disabled = true;
}

const lastNameInput = document.getElementById("lastName");
if (lastNameInput && userData?.user?.lastName) {
    lastNameInput.value = userData.user.lastName;
    lastNameInput.disabled = true;
}

const emailInput = document.getElementById("email");
if (emailInput && userData?.user?.email) {
    emailInput.value = userData.user.email;
    emailInput.disabled = true;
}



const doctorSelect = document.getElementById("doctorSelect");
getDoctors(doctorSelect, "booking", token);

appointmentForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const patientId = userData?.user?._id;
    const doctorId = doctorSelect?.value;
    const date = document.getElementById("bookingDate")?.value.trim();
    const firstName = firstNameInput?.value;
    const lastName = lastNameInput?.value;
    const email = emailInput?.value;
    const phone = document.getElementById("phone")?.value.trim();
    const status = "booked";

    const appointmentData = {
        patientId,
        doctorId,
        date,
        firstName,
        lastName,
        email,
        phone,
        status
    };
    bookAnAppointment(appointmentData);
});

// book appointment api call
const bookAnAppointment = async (appointmentData) => {
    try {
        const res = await fetch("http://localhost:9000/api/appointments", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // if required
            },
            body: JSON.stringify(appointmentData)
        });

        const result = await res.json();

        if (res.ok) {
            alert("Appointment booked successfully!");
            appointmentForm.reset(); // Optional: clear form
        } else {
            alert("Failed to book appointment: " + result.message);
        }
    } catch (error) {
        console.error("Error booking appointment:", error);
        alert("Something went wrong!");
    }
}

