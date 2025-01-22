
// Main app initialization placeholder
console.log("App initialized");
import { contentData } from "./contentData.js";
import { app, auth, onAuthStateChanged, dbRef } from '../../src/firebase.js'
import { getFirestore, collection, addDoc, doc, getDocs, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";


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

const fetchAndRenderPatients = async () => {
    const tableBody = document.querySelector("table.patient-table tbody");

    if (!tableBody) {
        console.error("Table body not found!");
        return;
    }

    fetchPatients(tableBody);
};


const fetchPatients = async(tableBody) => {
    const querySnapshot = await getDocs(collection(dbRef, "AdmittedPatients"));
    // Clear existing content
    tableBody.innerHTML = ""; 
    if (querySnapshot.empty) {
        tableBody.innerHTML = `<tr><td colspan="7" class="text-center">No patients found.</td></tr>`;
        return;
    }
    let counter = 1;
    querySnapshot.forEach((doc) => {
        const patient = doc.data();
        const row = `
            <tr>
                <td>${counter++}</td>
                <td>${patient.patientName || "N/A"}</td>
                <td>${patient.patientDob || "N/A"}</td>
                <td>${patient.patientPhone || "N/A"}</td>
                <td>${patient.typeOfPatient || "N/A"}</td>
                <td>${patient.wardSelection || "N/A"}</td>
                <td>${patient.bedSelection || "N/A"}</td>
                <td>
                    <button class="btn btn-sm btn-warning edit-patient" data-id="${doc.id}">Edit</button>
                    <button class="btn btn-sm btn-primary delete-patient" data-id="${doc.id}">Delete</button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;

        
    });
}




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