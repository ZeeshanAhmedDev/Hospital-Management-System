
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

    const userData = JSON.parse(loggedInUser);
    if (userData.role === "Patient") {
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
        const response = await fetch("http://localhost:8000/api/staff/admissions");

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
          <td>Admitted</td>
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

//TODO: need apis 
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
        const response = await fetch(`http://localhost:8000/api/staff/admissions/${patientId}`);
        console.log(response)
        if (!response.ok) {
            throw new Error("Patient not found!");
        }
        const patientData = await response.json();

        // Populate modal fields 
        document.getElementById("editPatientName").value = patientData.name || "";
        document.getElementById("editPatientDob").value = patientData.dob ? patientData.dob.split("T")[0] : "";
        document.getElementById("editPatientPhone").value = patientData.phone || "";
        document.getElementById("editTypeOfPatient").value = "Admitted"; // Hardcoded if fixed

        editModal.show();

        // Handle form submission
        const editForm = document.getElementById("editPatientForm");
        editForm.onsubmit = async (e) => {
            e.preventDefault();

            const updatedData = {
                name: document.getElementById("editPatientName").value.trim(),
                dob: document.getElementById("editPatientDob").value.trim(),
                phone: document.getElementById("editPatientPhone").value.trim(),
                // Optionally: ward, bed, etc. if you have those in the form
            };

            try {
                const updateRes = await fetch(`http://localhost:8000/api/staff/admissions/${patientId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
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


//TODO: Need apis
// Delete Patient implementation
const deletePatient = async (patientId) => {
    try {
        const patientDocRef = doc(dbRef, "AdmittedPatients", patientId);
        const patientDoc = await getDoc(patientDocRef);

        // Confirm the deletion with the user
        const confirmDelete = confirm(
            `Are you sure you want to delete the patient record for ${patientDoc.data().patientName || "this patient"}?`
        );

        if (!confirmDelete) return;

        // Delete the document
        await deleteDoc(patientDocRef);
        alert("Patient record deleted successfully!");
        const tableBody = document.querySelector("table.patient-table tbody");
        if (tableBody) fetchPatients(tableBody, "ViewPatients");

    } catch (error) {
        console.error("Error deleting patient record:", error);
        alert("An error occurred while trying to delete the patient record. Please try again.");
    }
};

const editWardAndBeds = async(patientId) => {
    const editBedElement = document.getElementById("editBedModal");
    if (!editBedElement) {
        alert("Manage ward and bed modal not loaded. Please reload the page.");
        return;
    }
    const editModal = new bootstrap.Modal(editBedElement);
    try {
        const patientDoc = await getDoc(doc(dbRef, "AdmittedPatients", patientId));
        if (!patientDoc.exists()) {
            alert("Patient not found!");
            return;
        }
        const patientData = patientDoc.data();
        // Populate the modal with existing ward and bed values
        document.getElementById("wardSelectionEdit").value = patientData.wardSelection || "";
        document.getElementById("bedSelectionEdit").value = patientData.bedSelection || "";

        // Show the modal
        editModal.show();

        // Save changes when the "Save Changes" button is clicked
        const saveButton = document.getElementById("saveWardAndBed");
        saveButton.onclick = async () => {
            const updatedWard = wardSelectionEdit.value;
            const updatedBed = bedSelectionEdit.value;

            if (!updatedWard || !updatedBed) {
                alert("Please select both a ward and a bed.");
                return;
            }
            // Update the patient data in Firebase
            try {
                await updateDoc(doc(dbRef, "AdmittedPatients", patientId), {
                    wardSelection: updatedWard,
                    bedSelection: updatedBed,
                });
                alert("Ward and Bed updated successfully!");
                editModal.hide();
                fetchPatients(document.querySelector("table.manage-ward-table tbody"), ""); // Refresh the view
            } catch (err) {
                console.error("Error updating ward and bed:", err);
                alert("Failed to update ward and bed. Please try again.");
            }
        };
    } catch (err) {
        console.error("Error fetching patient data:", err);
        alert("An error occurred while fetching patient data.");
    }
}

const admitPatientFunc = async (patientName, patientDob, patientPhone, wardSelection, bedSelection, admitForm) => {
    const apiUrl = "http://localhost:8000/api/staff/admit";

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
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










