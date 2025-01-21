
// Main app initialization placeholder
console.log("App initialized");

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


const initializeSidebarNavigation = () => {
    const sidebarItems = document.querySelectorAll("#sidebars .list-group-item");
    const contentWrapper = document.getElementById("content");

    if (!sidebarItems.length) {
        console.error("No sidebar items found. Check your selector!");
        return;
    }

    if (!contentWrapper) {
        console.error("Content wrapper not found!");
        return;
    }

    sidebarItems.forEach(item => {
        item.addEventListener("click", function (e) {
            e.preventDefault();
            sidebarItems.forEach(link => link.classList.remove("active"));
            this.classList.add("active");

            // Update main content dynamically
            const section = this.textContent.trim().toLowerCase().replace(/\s+/g, '');
            console.log("Mapped section:", section);
            contentWrapper.innerHTML = contentData[section] || "<h1>Content Not Found</h1>";
        });
    });

    // default Dashboard)
    const defaultSection = sidebarItems[0]?.textContent.trim().toLowerCase().replace(/\s+/g, '');
    console.log("Default section:", defaultSection);
    if (defaultSection) {
        contentWrapper.innerHTML = contentData[defaultSection] || "<h1>Welcome to the Dashboard</h1>";
        sidebarItems[0]?.classList.add("active");
    }
};


const contentData = {
    dashboard: `
                <div class="row">
                    <div class="col-md-4">
                        <div class="card text-white bg-success mb-3">
                            <div class="card-header">Total Patients</div>
                            <div class="card-body">
                                <h5 class="card-title">214</h5>
                                <p class="card-text">Admitted and Outpatients</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="card text-white bg-warning mb-3">
                            <div class="card-header">Doctors</div>
                            <div class="card-body">
                                <h5 class="card-title">20</h5>
                                <p class="card-text">Available Specialists</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="card text-white bg-danger mb-3">
                            <div class="card-header">Readmission Rate</div>
                            <div class="card-body">
                                <h5 class="card-title">7.01%</h5>
                                <p class="card-text">Last Month's Data</p>
                            </div>
                        </div>
                    </div>
                </div>
            `,
    admitpatient: `
    <h2 class="text-center">Admit Patient</h2>
    <form>
        <!-- Patient Name -->
        <div class="mb-3">
            <label for="patientName" class="form-label">Patient Name</label>
            <input type="text" class="form-control" id="patientName" placeholder="Enter patient name" required>
        </div>

        <div class="row">
            <!-- Patient Date of Birth -->
            <div class="col-md-6">
                <div class="mb-3">
                    <label for="patientDob" class="form-label">Date of Birth</label>
                    <input type="date" class="form-control" id="patientDob" required>
                </div>
            </div>

            <!-- Patient Phone Number -->
            <div class="col-md-6">
                <div class="mb-3">
                    <label for="patientPhone" class="form-label">Phone Number</label>
                    <input type="tel" class="form-control" id="patientPhone" placeholder="Enter phone number" pattern="[0-9]{10}" required>
                </div>
            </div>
        </div>


        <div class="row">
            <!-- Ward Selection -->
            <div class="col-md-6">
                <div class="mb-3">
                    <label for="wardSelection" class="form-label">Ward</label>
                    <select class="form-select" id="wardSelection" required>
                        <option value="" disabled selected>Select a ward</option>
                        <!-- Dropdown options for wards 1-10 -->
                        ${Array.from({ length: 10 }, (_, i) => `<option value="${i + 1}">Ward ${i + 1}</option>`).join("")}
                    </select>
                </div>
            </div>

            <!-- Bed Selection -->
            <div class="col-md-6">
                <div class="mb-3">
                    <label for="bedSelection" class="form-label">Bed</label>
                    <select class="form-select" id="bedSelection" required>
                        <option value="" disabled selected>Select a bed</option>
                        <!-- Dropdown options for beds 1-20 -->
                        ${Array.from({ length: 10 }, (_, i) => `<option value="${i + 1}">Bed ${i + 1}</option>`).join("")}
                    </select>
                </div>
            </div>
        </div>


        <!-- Submit Button -->
        <div class="row">
            <div class="col text-center">
                <button type="submit" class="btn btn-primary">Admit</button>
            </div>
        </div>
    </form>
            `,
    viewpatients: `
                <h2>Patient List</h2>
                <table class="table table-hover">
                    <thead class="table-dark">
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Age</th>
                            <th>Condition</th>
                            <th>Ward</th>
                            <th>Bed</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>John Doe</td>
                            <td>45</td>
                            <td>Admitted</td>
                            <td>01</td>
                            <td>01</td>
                            <td>
                            <button class="btn btn-sm btn-warning">Edit</button>
                            <button class="btn btn-sm btn-primary">Delete</button>
                            </td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>Jane Smith</td>
                            <td>30</td>
                            <td>Discharged</td>
                            <td>01</td>
                            <td>02</td>
                            <td>
                            <button class="btn btn-sm btn-warning">Edit</button>
                            <button class="btn btn-sm btn-primary">Delete</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            `,
    managewardandbeds: `
                <h2>Manage Ward and Beds</h2>
                <table class="table table-hover">
                    <thead class="table-dark">
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Age</th>
                            <th>Condition</th>
                            <th>Ward</th>
                            <th>Bed</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>John Doe</td>
                            <td>45</td>
                            <td>Admitted</td>
                            <td>01</td>
                            <td>01</td>
                            <td>
                            <button class="btn btn-sm btn-warning">Edit</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            `,
    medicalrecords: `
                <h1>Patients Medical Records</h1>
                <p>Medical Records.</p>
            `,
    manageshifts: `
                <h2>Manage Shifts</h2>
                     <table class="table table-hover">
                                <thead class="table-dark">
                                    <tr>
                                        <th scope="col">Day</th>
                                        <th scope="col">Start Time</th>
                                        <th scope="col">Finish Time</th>
                                        <th scope="col">Shift Type</th>
                                        <th scope="col">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Tuesday</td>
                                        <td>15:00</td>
                                        <td>20:00</td>
                                        <td>Normal</td>
                                        <td>
                                            <button class="btn btn-sm btn-warning">Edit</button>
                                        </td>
                                    </tr>
                                    <!-- Additional rows can be added dynamically here -->
                                </tbody>
                            </table>
            `,
    bookedappointments: `
                <h2>Patients Booked Appointments</h2>
                <p>Ward and Bed management functionality goes here.</p>
            `,
};
