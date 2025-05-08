
// Main app initialization placeholder
console.log("App initialized");
import { contentData } from "./contentData.js";
//import { app, auth, onAuthStateChanged, dbRef } from '../../src/firebase.js'
import { getFirestore, collection, addDoc, doc, getDocs, getDoc, updateDoc, setDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";


// Initialize the carousel
const myCarousel = document.querySelector('#carouselExampleIndicators');
const carousel = new bootstrap.Carousel(myCarousel, {
    interval: 2500,
    ride: 'carousel'
});

// Logout Functionality
const logoutBtn = document.getElementById("logoutButton");
if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
        // Clear session storage
        sessionStorage.clear();
        // Redirect to login page
        window.location.href = "login.html";
    });
}



const loggedInUser = sessionStorage.getItem("loggedInUser");
let userData;
let token;
if (loggedInUser) {
    userData = JSON.parse(loggedInUser);
    token = userData.token?.trim();
}

const loadPatientSideBars = () => {
    fetch('dashboard/patientSideBar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('sidebars').innerHTML = data;
            // Initialize sidebar
            initializeSidebarNavigation();
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
    }
    else {
        loadStaffSideBars();
    }
} else {
    console.log("No logged-in user found in session storage.");
    alert("Please log in to access this page.");
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
        initializeFormSubmission(); // Initialize form submission handling
    } else if (section === "viewpatients") {
        fetchAndRenderPatients("ViewPatients");
        loadPatientModal();
    } else if (section === "managewardandbeds") {
        fetchAndRenderPatients();
        loadEditBedModal();
    } else if (section === "staffwardmanagement") {
        loadStaffWardManagement()
    }
};



// Admit patient form submission
const initializeFormSubmission = () => {
    const admitForm = document.querySelector("form");
    if (!admitForm) {
        console.error("Admit form not found!");
        return;
    }

    admitForm.addEventListener("submit", (event) => {
        event.preventDefault(); // Prevent the default form submission

        // Get form values
        const patientName = document.getElementById("patientName")?.value.trim();
        const patientDob = document.getElementById("patientDob")?.value.trim();
        const patientPhone = document.getElementById("patientPhone")?.value.trim();
        const wardSelection = document.getElementById("wardSelection")?.value.trim();
        const bedSelection = document.getElementById("bedSelection")?.value.trim();
        // Validate form values (optional)
        if (!patientName || !patientDob || !patientPhone || !wardSelection || !bedSelection) {
            alert("Please fill out all fields.");
            return;
        }

        admitPatientFunc(patientName, patientDob, patientPhone, wardSelection, bedSelection, admitForm);
    });
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

// TODO: have to work later
const loadStaffWardManagement = async (staffId) => {   
    try {
        const res = await fetch('http://localhost:8000/api/staff/me', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const staff = await res.json();
        console.log(staff);
        const name = `${staff.firstName} ${staff.lastName}`;

        // Display staff details
        document.getElementById("staffName").textContent = name|| "N/A";
        document.getElementById("staffRole").textContent = staff.role || "N/A";
        document.getElementById("assignedWards").textContent = [...new Set(staff.wardsAssigned)].join(", ") || "None";

        // Populate ward select dropdown
        const wardOptions = ["Cardiology", "Pediatrics", "Orthopedics", "ICU", "Emergency"];
        const select = document.getElementById("wardSelect");

        wardOptions.forEach(ward => {
            const option = document.createElement("option");
            option.value = ward;
            option.text = ward;
            if (staff.wardsAssigned.includes(ward)) option.selected = true;
            select.appendChild(option);
        });

        // Handle update
        document.getElementById("updateWardsBtn").onclick = async () => {
            const selectedWards = Array.from(select.selectedOptions).map(o => o.value);

            const updateRes = await fetch(`http://localhost:8000/api/staff/${staffId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ wardsAssigned: selectedWards })
            });

            if (updateRes.ok) {
                alert("Wards updated!");
                document.getElementById("assignedWards").textContent = selectedWards.join(", ");
            } else {
                alert("Failed to update wards.");
            }
        };

    } catch (err) {
        console.error("Error loading staff data:", err);
        alert("Could not load staff info.");
    }
    
};


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
                        "Authorization": `Bearer ${token}` // ✅ Add token here
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


const admitPatientFunc = async (patientName, patientDob, patientPhone, wardSelection, bedSelection, admitForm) => {
    const apiUrl = "http://localhost:8000/api/staff/admit";

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // ✅ Add Authorization header
            },
            body: JSON.stringify({
                name: patientName,
                dob: patientDob,
                phone: patientPhone,
                ward: wardSelection,
                bed: bedSelection,
                condition: "Admitted"
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to admit patient");
        }

        const result = await response.json();

        admitForm.reset();
        alert(result.message || "Patient Admitted Successfully");
        console.log("Admitted patient:", result.patient);

    } catch (error) {
        console.error("Error admitting patient:", error);
        alert("Error admitting patient: " + error.message);
    }
};










