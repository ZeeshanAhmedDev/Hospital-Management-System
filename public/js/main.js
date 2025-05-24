
import { PATIENT_API } from "../APIsServices.js";
import loadAddDoctor from "../controllers/addDoctor.js";
import initializeFormSubmission from "../controllers/admitPatient.js";
import { loadPatientAppointment } from "../controllers/patientAppointments.js";
import { deletePatientById, getPatientById, updatePatient } from "../models/patientModel.js";
import { addShift, assignWard, fetchAllStaffs, removeShiftFromStaff, removeWardFromStaff } from "../models/staffModel.js";
import { calculateAge } from "../utils/calculateAge.js";
import getDoctors from "../utils/doctorList.js";
import { contentData } from "./contentData.js";
import { renderStaffRows } from "./staffUI.js";

// Initialize the carousel
const myCarousel = document.querySelector('#carouselExampleIndicators');
const carousel = new bootstrap.Carousel(myCarousel, {
    interval: 2500,
    ride: 'carousel'
});

// Logout Functionality
const logOut = () => {
    const logoutBtn = document.getElementById("logoutButton");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            // Clear session storage
            sessionStorage.clear();
            // Redirect to login page
            window.location.href = "login.html";
        });
    }
}



const loggedInUser = sessionStorage.getItem("loggedInUser");
let userData;
let token;
if (loggedInUser) {
    userData = JSON.parse(loggedInUser);
    token = userData.token?.trim();
}

const loadPatientSideBars = () => {
    fetch('dashboard/patientIndex.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('innerController').innerHTML = data;
            // Initialize sidebar
            //initializeSidebarNavigation();
        }).catch(err => console.log("Error loading sidebar bar: " + err));
}

const loadPatientNavigation = () => {
    fetch('nav/navPatient.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('nav-wrapper').innerHTML = data;
            logOut();
        }).catch(err => console.log("Error loading sidebar bar: " + err));
}

const loadStaffNavigation = () => {
    fetch('nav/navStaff.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('nav-wrapper').innerHTML = data;
            logOut();
        }).catch(err => console.log("Error loading sidebar bar: " + err));
}

const loadStaffSideBars = () => {
    fetch('dashboard/staffSideBar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('sidebars').innerHTML = data;
            // Initialize sidebar
            initializeSidebarNavigation();
        }).catch(err => console.log("Error loading sidebar bar: " + err));
}

const loadPatientModal = () => {
    fetch('./patientModal.html')
        .then(response => response.text())
        .then(data => {
            document.body.insertAdjacentHTML('beforeend', data);
        }).catch(err => console.log("Error loading sidebar bar: " + err));
}
const loadEditBedModal = () => {
    fetch('./editBedModal.html')
        .then(response => response.text())
        .then(data => {
            document.body.insertAdjacentHTML('beforeend', data);
        }).catch(err => console.log("Error loading sidebar bar: " + err));
}

if (loggedInUser) {
    if (userData?.user?.role === "Patient") {
        loadPatientSideBars();
        loadPatientNavigation();
    }
    else {
        loadStaffSideBars();
        loadStaffNavigation();
    }
    
} else {
   // alert("Please log in to access this page.");
    // Redirect to login page
    window.location.href = "login.html";
}


// controlling sidebars
const initializeSidebarNavigation = () => {
    const sidebarItems = document.querySelectorAll("#sidebars .list-group-item");
    const contentWrapper = document.getElementById("content");

    if (!sidebarItems.length || !contentWrapper) {
        console.error("Sidebar or content wrapper not found!");
        return;
    }

    sidebarItems.forEach((item) => {
        item.addEventListener("click", function (e) {
            e.preventDefault();

            sidebarItems.forEach((link) => link.classList.remove("active"));
            this.classList.add("active");

            const section = this.textContent.trim().toLowerCase().replace(/\s+/g, "");
            console.log(section)
            updateContentAndInitialize(section);
        });
    });

    const defaultSection = sidebarItems[0]?.textContent.trim().toLowerCase().replace(/\s+/g, "");
    if (defaultSection) {
        updateContentAndInitialize(defaultSection);
        sidebarItems[0]?.classList.add("active");
    }
};

// updating sidebars after content curd
const updateContentAndInitialize = (section) => {
    const contentWrapper = document.getElementById("content");
    contentWrapper.innerHTML = contentData[section] || "<h1>Content Not Found</h1>";

    if (section === "admitpatient") {
        initializeFormSubmission(token);
    } else if (section === "viewpatients") {
        fetchAndRenderPatients("ViewPatients");
        loadPatientModal();
    } else if (section === "managewardandbeds") {
        fetchAndRenderPatients();
        loadEditBedModal();
    } else if (section === "staffwardmanagement") {
        loadStaffWardManagement();
    }
    else if (section === "addadoctor") {
        loadAddDoctor(token);
    }
    else if (section === "patientappointments") {
        loadPatientAppointment(token);
    }
};

// conditionally  showing patient list on view-patients and manage bed views
const fetchAndRenderPatients = async (viewType) => {
    let tableBody;
    if (viewType === "ViewPatients") {
        tableBody = document.querySelector("table.patient-table tbody");
    } else {
        tableBody = document.querySelector("table.manage-ward-table tbody");
    }

    if (!tableBody) {
        console.error("Table body not found!");
        return;
    }

    fetchPatients(tableBody, viewType);
};

// fetching data from from firebase and populating it
const fetchPatients = async (tableBody, viewType) => {

    try {
        const response = await fetch("http://localhost:8000/api/staff/admissions", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch patients.");
        }

        const patients = await response.json(); // Assuming the API returns an array of patient objects

        tableBody.innerHTML = "";

        if (!patients || patients.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="7" class="text-center">No patients found.</td></tr>`;
            return;
        }

        let counter = 1;
        let rows = "";

        patients.forEach((patient) => {
            let removeORAddColumn;
            let buttonViewer;

            if (viewType === "ViewPatients") {
                removeORAddColumn = `<td>${patient.phone || "N/A"}</td>`;
                buttonViewer = `
          <button class="btn btn-sm btn-warning edit-patient" data-id="${patient._id}">Edit</button>
          <button class="btn btn-sm btn-primary delete-patient" data-id="${patient._id}">Delete</button>
        `;
            } else {
                removeORAddColumn = ``;
                buttonViewer = `
          <button class="btn btn-sm btn-warning edit-ward-beds" data-id="${patient._id}">Edit</button>
        `;
            }

            rows += `
        <tr>
          <td>${counter++}</td>
          <td>${patient.name || "N/A"}</td>
         <td>${patient.dob ? calculateAge(patient.dob) + " years" : "N/A"}</td>
          ${removeORAddColumn}
          <td>${patient.condition || "N/A"}</td>
          <td>${patient.ward || "N/A"}</td>
          <td>${patient.bed || "N/A"}</td>
          <td>${buttonViewer}</td>
        </tr>
      `;
        });

        tableBody.innerHTML = rows;

        // Event Listeners
        document.querySelectorAll(".edit-patient").forEach((button) => {
            button.addEventListener("click", (e) => {
                const patientId = e.target.getAttribute("data-id");
                editPatient(patientId);
            });
        });

        document.querySelectorAll(".edit-ward-beds").forEach((button) => {
            button.addEventListener("click", (e) => {
                const patientId = e.target.getAttribute("data-id");
                editWardAndBeds(patientId);
            });
        });

        document.querySelectorAll(".delete-patient").forEach((button) => {
            button.addEventListener("click", (e) => {
                const patientId = e.target.getAttribute("data-id");
                deletePatient(patientId);
            });
        });

    } catch (error) {
        console.error("Error fetching patients:", error);
        tableBody.innerHTML = `<tr><td colspan="7" class="text-center text-danger">Failed to load patients.</td></tr>`;
    }
};



// Staff management booked or cancellation things
const loadStaffWardManagement = async () => {
    let stuffTableBody = document.querySelector("table.staff-table tbody");
    if (!stuffTableBody) {
        console.error("Table body not found!");
        return;
    }
    try {
        const staffs = await fetchAllStaffs(token);
        stuffTableBody.innerHTML = renderStaffRows(staffs)

        document.querySelectorAll(".ward-options").forEach((menu) => {
            menu.addEventListener("click", (e) => {
                if (e.target.classList.contains("ward-item")) {
                    e.preventDefault();
                    const staffId = menu.getAttribute("data-id");
                    const selectedWard = e.target.getAttribute("data-ward");
                    updateWard(staffId, selectedWard);
                }
            });
        });

        document.querySelectorAll(".btn-remove-ward").forEach(button => {
            button.addEventListener("click", async (e) => {
                e.preventDefault();
                const staffId = button.getAttribute("data-id");
                const ward = button.getAttribute("data-ward");
                await removeWard(staffId, ward);

            });
        });

        document.querySelectorAll(".btn-remove-shift").forEach((button) => {
            button.addEventListener("click", async (e) => {
                e.preventDefault();
                const staffId = button.getAttribute("data-staff");
                const shiftDate = button.getAttribute("data-date");
                const shiftType = button.getAttribute("data-shift");

                if (!confirm(`Remove ${shiftType} shift on ${new Date(shiftDate).toLocaleDateString()}?`)) return;

                removeShift(staffId, shiftDate, shiftType);
            });
        });


        document.querySelectorAll(".schedule-form").forEach((form) => {
            form.addEventListener("submit", async (e) => {
                e.preventDefault();
                const staffId = form.getAttribute("data-id");
                const dateInput = form.querySelector(".schedule-date");
                const shiftSelect = form.querySelector(".schedule-shift");

                const date = dateInput.value;
                const shift = shiftSelect.value;

                if (!date || !shift) {
                    alert("Please select both date and shift.");
                    return;
                }
                updateShift(staffId, date, shift, dateInput, shiftSelect)
            });
        });


    } catch (err) {
        console.error("Error loading staff data:", err);
        alert("Could not load staff info.");
    }

};

// Wards adding functionality
const updateWard = async (staffId, ward) => {
    try {
        await assignWard(staffId, ward, token);
        alert("Ward assigned successfully.");
        location.reload();
    } catch (err) {
        console.error("Error assigning ward:", err);
        alert("Failed to assign ward.");
    }
};

// remove ward 
const removeWard = async (staffId, ward) => {
    try {
        await removeWardFromStaff(staffId, ward, token);
        alert("Ward removed successfully.");
        location.reload();
    } catch (err) {
        console.error("Error removing ward:", err);
        alert("Failed to remove ward.");
    }
};

// add new shift
const updateShift = async (staffId, date, shift, dateInput, shiftSelect) => {
    try {
        await addShift(staffId, date, shift, token);
        alert("Shift added. Reloading...");
        location.reload();
    } catch (err) {
        console.error("Error adding shift:", err);
        alert("Failed to add shift.");
    }
};

// clear assigned shift per row
const removeShift = async (staffId, date, shiftType) => {
    try {
        await removeShiftFromStaff(staffId, date, shiftType, token);
        alert("Shift removed.");
        location.reload();
    } catch (err) {
        console.error("Error removing shift:", err);
        alert("Failed to remove shift.");
    }
}
// Edit Patient implementation
const editPatient = async (patientId) => {
    const editModalElement = document.getElementById("editPatientModal");
    if (!editModalElement) {
        alert("Patient modal not loaded. Please reload the page.");
        return;
    }
    const editModal = new bootstrap.Modal(editModalElement);

    try {
        const patientData = await getPatientById(patientId, token);

        // Populate modal fields 
        document.getElementById("editPatientName").value = patientData.name || "";
        document.getElementById("editPatientDob").value = patientData.dob ? patientData.dob.split("T")[0] : "";
        document.getElementById("editPatientPhone").value = patientData.phone || "";
        document.getElementById("editTypeOfPatient").value = patientData.condition || "";

        editModal.show();

        // Handle form submission
        const editForm = document.getElementById("editPatientForm");
        editForm.onsubmit = async (e) => {
            e.preventDefault();

            const updatedData = {
                name: document.getElementById("editPatientName").value.trim(),
                dob: document.getElementById("editPatientDob").value.trim(),
                phone: document.getElementById("editPatientPhone").value.trim(),
                condition: document.getElementById("editTypeOfPatient").value.trim(),
            };

            try {
                await updatePatient(patientId, updatedData, token)
                alert("Patient details updated successfully!");
                editModal.hide();

                // Refresh the table
                fetchPatients(document.querySelector("table.patient-table tbody"), "ViewPatients");
            } catch (updateError) {
                console.error("Error updating patient:", updateError);
                alert("Failed to update patient details.");
            }
        };
    } catch (error) {
        console.error("Error fetching patient data:", error);
        alert("Failed to fetch patient details.");
    }
};

// Delete Patient implementation
const deletePatient = async (patientId) => {
    try {
        const patient = await getPatientById(patientId, token);

        // Confirm deletion
        const confirmDelete = confirm(
            `Are you sure you want to delete the patient record for ${patient.name || "this patient"}?`
        );
        if (!confirmDelete) return;

        await deletePatientById(patientId, token)

        alert("Patient record deleted successfully!");
        const tableBody = document.querySelector("table.patient-table tbody");
        if (tableBody) fetchPatients(tableBody, "ViewPatients");

    } catch (error) {
        console.error("Error deleting patient record:", error);
        alert("An error occurred while trying to delete the patient record. Please try again.");
    }
};


const editWardAndBeds = async (patientId) => {
    const editBedElement = document.getElementById("editBedModal");
    if (!editBedElement) {
        alert("Manage ward and bed modal not loaded. Please reload the page.");
        return;
    }

    const editModal = new bootstrap.Modal(editBedElement);

    try {
        const patientData = await getPatientById(patientId, token);

        // Populate the modal with existing values
        document.getElementById("wardSelectionEdit").value = patientData.ward || "";
        document.getElementById("bedSelectionEdit").value = patientData.bed || "";

        editModal.show();

        const saveButton = document.getElementById("saveWardAndBed");

        saveButton.onclick = async () => {
            const updatedWard = document.getElementById("wardSelectionEdit").value;
            const updatedBed = document.getElementById("bedSelectionEdit").value;
            if (!updatedWard || !updatedBed) {
                alert("Please select both a ward and a bed.");
                return;
            }

            const updatedData = {
                ward: updatedWard,
                bed: updatedBed,
            }

            try {
                await updatePatient(patientId, updatedData, token)
                alert("Ward and Bed updated successfully!");
                editModal.hide();
                fetchPatients(document.querySelector("table.manage-ward-table tbody"), "");
            } catch (err) {
                console.error("Error updating ward and bed:", err);
                alert("Failed to update ward and bed. Please try again.");
            }
        };

    } catch (err) {
        console.error("Error fetching patient data:", err);
        alert("An error occurred while fetching patient data.");
    }
};







