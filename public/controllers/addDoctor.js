import { addDoctor } from "../models/doctorModels.js";

const loadAddDoctor = (token) => {
    const doctorForm = document.getElementById("addDoctorForm");
    if (!doctorForm) {
        console.error("Doctor form not found!");
        return;
    }

    doctorForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const doctorName = document.getElementById("doctorName")?.value.trim();
        const doctorEmail = document.getElementById("doctorEmail")?.value.trim();
        const doctorPhone = document.getElementById("doctorPhone")?.value.trim();
        const doctorAddress = document.getElementById("doctorAddress")?.value.trim();

        if (!doctorName || !doctorEmail || !doctorPhone || !doctorAddress) {
            alert("Please fill out all fields.");
            return;
        }

        const doctorData = {
            name: doctorName,
            email: doctorEmail,
            phoneNumber: doctorPhone,
            address: doctorAddress,
            role: "doctor",
            schedule: [],
            wardsAssigned: []
        };

        try {
            const result = await addDoctor(doctorData, token);
            alert("Doctor added successfully!");
            doctorForm.reset();
        } catch (error) {
            console.error("Error adding doctor:", error);
            alert(error.message);
        }
    });
};

export default loadAddDoctor;