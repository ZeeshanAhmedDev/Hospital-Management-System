import { admitPatient } from "../models/patientModel.js";

const initializeFormSubmission = (token) => {
    const admitForm = document.getElementById("admitForm");
    if (!admitForm) {
        console.error("Admit form not found!");
        return;
    }

    admitForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const patientName = document.getElementById("patientName")?.value.trim();
        const patientDob = document.getElementById("patientDob")?.value.trim();
        const patientPhone = document.getElementById("patientPhone")?.value.trim();
        const wardSelection = document.getElementById("wardSelection")?.value.trim();
        const bedSelection = document.getElementById("bedSelection")?.value.trim();

        if (!patientName || !patientDob || !patientPhone || !wardSelection || !bedSelection) {
            alert("Please fill out all fields.");
            return;
        }

        const patientData = {
            name: patientName,
            dob: patientDob,
            phone: patientPhone,
            ward: wardSelection,
            bed: bedSelection,
            condition: "Admitted"
        };

        try {
            const result = await admitPatient(patientData, token);
            admitForm.reset();
            alert(result.message || "Patient Admitted Successfully");
            console.log("Admitted patient:", result.patient);
        } catch (error) {
            console.error("Error admitting patient:", error);
            alert("Error admitting patient: " + error.message);
        }
    });
};

export default initializeFormSubmission;