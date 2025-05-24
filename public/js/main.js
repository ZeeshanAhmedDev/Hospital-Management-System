
import { PATIENT_API } from "../APIsServices.js";
import loadAddDoctor from "../controllers/addDoctor.js";
import initializeFormSubmission from "../controllers/admitPatient.js";
import { loadPatientAppointment } from "../controllers/patientAppointments.js";
import getDoctors from "../utils/doctorList.js";
import { contentData } from "./contentData.js";

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
    console.log("No logged-in user found in session storage.");
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

    const calculateAge = (dob) => {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

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
        const res = await fetch('http://localhost:8000/api/staff/all-stuffs', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const staffs = await res.json();
        stuffTableBody.innerHTML = "";
        let rows = "";

        staffs.forEach(stuff => {
            const { name, phoneNumber, wardsAssigned, schedule } = stuff;

            // Format wards
            const wards = wardsAssigned && wardsAssigned.length
                ? wardsAssigned.map(w => `
                <div class="ward-item d-flex justify-content-between align-items-center mb-1">
                    <span>${w}</span>
                    <button class="btn btn-outline-danger btn-remove-ward ms-2 p-0" style="font-size: 0.75rem; line-height: 1; width: 20px; height: 20px;" data-id="${stuff._id}" data-ward="${w}">×</button>

                </div>
            `).join("")
                : "<div>No wards assigned</div>";

            const scheduleHtml = schedule.length
                ? schedule.map(s => {
                    const d = new Date(s.date);
                    const shiftId = `${stuff._id}-${s.date}-${s.shift}`.replace(/\W+/g, "");
                    return `<div id="shift-${shiftId}" class="mb-2">
                        ${d.toLocaleDateString("en-GB")}: <strong>${s.shift}</strong>
                        <button
                            class="btn btn-outline-danger btn-remove-shift ms-2 p-0"
                            style="font-size: 0.75rem; line-height: 1; width: 20px; height: 20px;"
                            data-staff="${stuff._id}" 
                            data-date="${s.date}" 
                            data-shift="${s.shift}"
                            >
                            ×
                        </button>

                    </div>`;
                }).join("")
                : "<div>No shifts assigned</div>";

            rows += `
        <tr>
          <td>
            <div class="fw-bold">${name}</div>
            <div class="text-muted small">${phoneNumber}</div>
          </td>
          <td>
            <div id="wards-${stuff._id}">
                ${wards}
            </div>
            <div class="dropdown d-inline">
                <button class="btn btn-sm btn-outline-primary mt-2 dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                Update
                </button>
                <ul class="dropdown-menu ward-options" data-id="${stuff._id}">
                    ${['General', 'ICU', 'HDU', 'Private', 'Maternity', 'Surgical', 'Orthopedic']
                    .map(ward => `<li><a class="dropdown-item ward-item" href="#" data-ward="${ward}">${ward}</a></li>`)
                    .join("")}
                </ul>

            </div>
            </td>

            <td class="shift-container">
                ${scheduleHtml}
                <form class="schedule-form mt-2" data-id="${stuff._id}">
                    <input type="date" class="form-control form-control-sm d-inline-block w-auto me-2 schedule-date" required />
                    <select class="form-select form-select-sm d-inline-block w-auto schedule-shift" required>
                    <option value="" disabled>Shift</option>
                    <option value="morning">Morning</option>
                    <option value="afternoon">Afternoon</option>
                    <option value="night">Night</option>
                    </select>
                    <button type="submit" class="btn btn-sm btn-primary ms-1">Add</button>
                </form>
                </td>
        </tr>
        `;
        });


        stuffTableBody.innerHTML = rows;
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
        const container = document.getElementById(`wards-${staffId}`);
        const currentWards = Array.from(container.querySelectorAll("div")).map(div => div.textContent.trim());

        // Avoid duplicate assignment
        if (currentWards.includes(ward)) {
            alert("Ward already assigned.");
            return;
        }
        if (currentWards.length > 2) {
            alert("Maximum 3 wards can possible to assign.");
            return;
        }

        // Call the backend API
        const response = await fetch(`http://localhost:8000/api/staff/${staffId}/assign-wards`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ wards: [ward] })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to assign ward.");
        }

        if (currentWards.includes("No wards assigned")) {
            currentWards.length = 0;
        }
        currentWards.push(ward);
        container.innerHTML = currentWards.map(w => `<div>${w}</div>`).join("");

        alert("Ward assigned successfully.");
    } catch (error) {
        console.error("Error assigning ward:", error);
        alert("Failed to assign ward. See console for details.");
    }
}


// remove ward 
const removeWard = async (staffId, ward) => {
    try {
        const res = await fetch(`http://localhost:8000/api/staff/${staffId}/remove-ward`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ ward })
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Failed to remove ward");
        }

        // Remove from DOM
        const wardElement = document.querySelector(`button[data-id="${staffId}"][data-ward="${ward}"]`).parentElement;
        wardElement.remove();

        // If container becomes empty, show fallback
        const container = document.getElementById(`wards-${staffId}`);
        if (!container.querySelector(".ward-item")) {
            container.innerHTML = "<div>No wards assigned</div>";
        }

        alert("Ward removed successfully.");
    } catch (err) {
        console.error("Error removing ward:", err);
        alert("Failed to remove ward.");
    }
}

// add new shift
const updateShift = async (staffId, date, shift, dateInput, shiftSelect) => {
    try {
        const response = await fetch(`http://localhost:8000/api/staff/${staffId}/manage-schedule`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ date, shift })
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.message || "Schedule update failed");

        alert("Schedule added successfully. Reload to view changes.");
        dateInput.value = "";
        shiftSelect.value = "";
        location.reload();

    } catch (err) {
        console.error("Error:", err);
        alert("Failed to add schedule.");
    }
}
// clear assigned shift per row
const removeShift = async (staffId, shiftDate, shiftType) => {
    try {
        const response = await fetch(`http://localhost:8000/api/staff/${staffId}/remove-shift`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // only if you use auth
            },
            body: JSON.stringify({ date: shiftDate, shift: shiftType })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to remove shift.");
        }

        const shiftId = `${staffId}-${shiftDate}-${shiftType}`.replace(/\W+/g, "");
        const shiftElem = document.getElementById(`shift-${shiftId}`);
        if (shiftElem) shiftElem.remove();
        alert("Shift removed successfully.");
    } catch (error) {
        console.error("Error removing shift:", error);
        alert("Failed to remove shift.");
    }
}
// Edit Patient implementation
const editPatient = async (patientId) => {
    console.log(patientId)
    const editModalElement = document.getElementById("editPatientModal");
    if (!editModalElement) {
        alert("Patient modal not loaded. Please reload the page.");
        return;
    }
    const editModal = new bootstrap.Modal(editModalElement);

    try {
        // Fetch patient data from API
        const response = await fetch(`http://localhost:8000/api/staff/admissions/${patientId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error("Patient not found!");
        }
        const patientData = await response.json();

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
                // Optionally: ward, bed, etc. if you have those in the form
            };

            try {
                const updateRes = await fetch(`http://localhost:8000/api/staff/admissions/${patientId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(updatedData)
                });

                if (!updateRes.ok) {
                    const errData = await updateRes.json();
                    throw new Error(errData.message || "Update failed");
                }

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
        const res = await fetch(`http://localhost:8000/api/staff/admissions/${patientId}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (!res.ok) {
            throw new Error("Patient not found.");
        }

        const patient = await res.json();

        // Confirm deletion
        const confirmDelete = confirm(
            `Are you sure you want to delete the patient record for ${patient.name || "this patient"}?`
        );
        if (!confirmDelete) return;

        const deleteRes = await fetch(`http://localhost:8000/api/staff/admissions/${patientId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (!deleteRes.ok) {
            const errData = await deleteRes.json();
            throw new Error(errData.message || "Failed to delete patient.");
        }
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
        // Fetch patient data from API
        const res = await fetch(`http://localhost:8000/api/staff/admissions/${patientId}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        if (!res.ok) {
            alert("Patient not found!");
            return;
        }

        const patientData = await res.json();

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

            try {
                const updateRes = await fetch(`http://localhost:8000/api/staff/admissions/${patientId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}` 
                    },
                    body: JSON.stringify({
                        ward: updatedWard,
                        bed: updatedBed,
                    }),
                });

                if (!updateRes.ok) {
                    const errData = await updateRes.json();
                    throw new Error(errData.message || "Failed to update ward/bed");
                }

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







