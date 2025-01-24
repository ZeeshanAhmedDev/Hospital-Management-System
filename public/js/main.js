
// Main app initialization placeholder
console.log("App initialized");
import { contentData } from "./contentData.js";
import { app, auth, onAuthStateChanged, dbRef } from '../../src/firebase.js'
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
            // document.getElementById('sidebars').innerHTML = data;
            //console.log(data)
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


const fetchPatients = async (tableBody, viewType) => {
    const querySnapshot = await getDocs(collection(dbRef, "AdmittedPatients"));
    // Clear existing content
    tableBody.innerHTML = "";
    if (querySnapshot.empty) {
        tableBody.innerHTML = `<tr><td colspan="7" class="text-center">No patients found.</td></tr>`;
        return;
    }

    let counter = 1;
    let rows = "";
    let removeORAddColumn;
    let buttonViewer;
    querySnapshot.forEach((doc) => {
        const patient = doc.data();
        if (viewType === "ViewPatients") {
            removeORAddColumn = `<td>${patient.patientPhone || "N/A"}</td>`;

            buttonViewer = `
            <button class="btn btn-sm btn-warning edit-patient" data-id="${doc.id}">Edit</button>
            <button class="btn btn-sm btn-primary delete-patient" data-id="${doc.id}">Delete</button>
            `
        } else {
            removeORAddColumn = ``
            buttonViewer = `
                <button class="btn btn-sm btn-warning edit-ward-beds" data-id="${doc.id}">Edit</button>
            `
        }

        rows = `
            <tr>
                <td>${counter++}</td>
                <td>${patient.patientName || "N/A"}</td>
                <td>${patient.patientDob || "N/A"}</td>
                ${removeORAddColumn}
                <td>${patient.typeOfPatient || "N/A"}</td>
                <td>${patient.wardSelection || "N/A"}</td>
                <td>${patient.bedSelection || "N/A"}</td>
                <td>
                    ${buttonViewer}
                </td>
            </tr>
        `;
        tableBody.innerHTML += rows;
    });

    // Edit buttons actions
    document.querySelectorAll(".edit-patient").forEach((button) => {
        button.addEventListener("click", (e) => {
            const patientId = e.target.getAttribute("data-id");
            editPatient(patientId);
        });
    });
    // Edit Ward and beds actions
    document.querySelectorAll(".edit-ward-beds").forEach((button) => {
        button.addEventListener("click", (e) => {
            const patientId = e.target.getAttribute("data-id");
            //editPatient(patientId);
        });
    });
    // delete buttons actions
    document.querySelectorAll(".delete-patient").forEach((button) => {
        button.addEventListener("click", (e) => {
            const patientId = e.target.getAttribute("data-id");
            console.log(patientId)
            deletePatient(patientId);
        });
    });
}

// Edit Patient implementation
const editPatient = async (patientId) => {
    const editModalElement = document.getElementById("editPatientModal");
    if (!editModalElement) {
        alert("Patient modal not loaded. Please reload the page.");
        return;
    }
    // Use Bootstrap's modal API to show the modal
    const editModal = new bootstrap.Modal(editModalElement);
    try {
        const patientDoc = await getDoc(doc(dbRef, "AdmittedPatients", patientId));
        if (!patientDoc.exists()) {
            alert("Patient not found!");
            return;
        }
        const patientData = patientDoc.data();
        // Populate modal fields 
        document.getElementById("editPatientName").value = patientData.patientName || "";
        document.getElementById("editPatientDob").value = patientData.patientDob || "";
        document.getElementById("editPatientPhone").value = patientData.patientPhone || "";
        document.getElementById("editTypeOfPatient").value = patientData.typeOfPatient || "";

        editModal.show();
        // Handle form submission
        const editForm = document.getElementById("editPatientForm");
        editForm.onsubmit = async (e) => {
            e.preventDefault();

            // Get updated values from the form
            const updatedData = {
                patientName: document.getElementById("editPatientName").value.trim(),
                patientDob: document.getElementById("editPatientDob").value.trim(),
                patientPhone: document.getElementById("editPatientPhone").value.trim(),
                typeOfPatient: document.getElementById("editTypeOfPatient").value.trim(),
            };
            // Update Firebase
            try {
                await updateDoc(doc(dbRef, "AdmittedPatients", patientId), updatedData);
                alert("Patient details updated successfully!");
                editModal.hide();

                // Refresh the patient list
                fetchPatients((document.querySelector("table.patient-table tbody"), "ViewPatients"));
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
        // Reference the document in the "AdmittedPatients" collection
        const patientDocRef = doc(dbRef, "AdmittedPatients", patientId);

        // Fetch the document to ensure it exists
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


const admitPatientFunc = async (patientName, patientDob, patientPhone, wardSelection, bedSelection, admitForm) => {
    const typeOfPatient = "Admitted";
    try {
        const docRef = await addDoc(collection(dbRef, "AdmittedPatients"), {
            patientName,
            patientDob,
            patientPhone,
            wardSelection,
            bedSelection,
            typeOfPatient,
            timestamp: new Date().toISOString()
        });
        admitForm.reset();
        alert("Patient Admitted Successfully");

    } catch (error) {
        console.error("Error adding appointments:", error);
    }
}