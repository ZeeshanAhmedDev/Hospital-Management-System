
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
if(logoutBtn) {
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
        }).catch(err => console.log("Error loading sidebar bar: " + err));
}

const loadStaffSideBars = () => {
    fetch('dashboard/staffSideBar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('sidebars').innerHTML = data;
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




setTimeout(() => {
    // Sidebar navigation
    document.querySelectorAll("#sidebars .list-group-item").forEach(item => {
        console.log(item)
        item.addEventListener("click", function (e) {
            e.preventDefault();

            // Remove active class from all links
            document.querySelectorAll("#sidebars .list-group-item").forEach(link => link.classList.remove("active"));

            // Add active class to the clicked link
            this.classList.add("active");

            // Update main content
            const section = this.textContent.trim().toLowerCase().replace(/\s+/g, '');
            console.log(section)
            const contentWrapper = document.getElementById("content");
            console.log(contentWrapper)
            contentWrapper.innerHTML = contentData[section] || "<h1>Content Not Found</h1>";
        });
    });
}, "1000");

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
                <h1>Admit Patient</h1>
                <form>
                    <div class="mb-3">
                        <label for="patientName" class="form-label">Patient Name</label>
                        <input type="text" class="form-control" id="patientName" placeholder="Enter patient name">
                    </div>
                    <div class="mb-3">
                        <label for="patientAge" class="form-label">Patient Age</label>
                        <input type="number" class="form-control" id="patientAge" placeholder="Enter patient age">
                    </div>
                    <button type="submit" class="btn btn-primary">Admit</button>
                </form>
            `,
    viewpatients: `
                <h1>Patient List</h1>
                <table class="table table-hover">
                    <thead class="table-dark">
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Age</th>
                            <th>Condition</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>John Doe</td>
                            <td>45</td>
                            <td>Orthopaedics</td>
                            <td>
                                <button class="btn btn-sm btn-primary">View</button>
                                <button class="btn btn-sm btn-warning">Edit</button>
                            </td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>Jane Smith</td>
                            <td>30</td>
                            <td>Dermatology</td>
                            <td>
                                <button class="btn btn-sm btn-primary">View</button>
                                <button class="btn btn-sm btn-warning">Edit</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            `,
    managewardandbeds: `
                <h1>Manage Ward and Beds</h1>
                <p>Ward and Bed management functionality goes here.</p>
            `,
    appointments: `
                <h1>Appointments</h1>
                <p>View and manage appointments here.</p>
            `,
    medicalrecords: `
                <h1>Patients Medical Records</h1>
                <p>Medical Records.</p>
            `,
    bookedappointments: `
                <h1>Patients Booked Appointments</h1>
                <p>Ward and Bed management functionality goes here.</p>
            `,
};