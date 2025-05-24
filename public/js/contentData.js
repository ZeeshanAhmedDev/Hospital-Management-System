const wardTypes = [
    "General",
    "ICU",
    "HDU",
    "Private",
    "Maternity",
    "Surgical",
    "Orthopedic"
];


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
                    <div class="col-md-4">
                        <div class="card text-white bg-info mb-3">
                            <div class="card-header">Wards</div>
                            <div class="card-body">
                                <h5 class="card-title">7 Types of</h5>
                                <p class="card-text">Special ward facilities</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="card text-white bg-primary mb-3">
                            <div class="card-header">Customer Satisfaction</div>
                            <div class="card-body">
                                <h5 class="card-title">500</h5>
                                <p class="card-text">Happy Patients</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="card text-white bg-dark mb-3">
                            <div class="card-header">Year of Experience</div>
                            <div class="card-body">
                                <h5 class="card-title">5 years</h5>
                                <p class="card-text">Supporting Experiences</p>
                            </div>
                        </div>
                    </div>
                </div>
                
            `,
    admitpatient: `
    <h2 class="text-center">Admit Patient</h2>
    <form id="admitForm">
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
                    <label for="wardSelection" class="form-label">Ward Type</label>
                    <select class="form-select" id="wardSelection" required>
                        <option value="" disabled selected>Select a ward</option>
                        ${wardTypes.map(type => `<option value="${type}">${type}</option>`).join("")}
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
                <table class="table table-hover patient-table">
                    <thead class="table-dark">
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Age</th>
                            <th>Phone</th>
                            <th>Condition</th>
                            <th>Ward</th>
                            <th>Bed</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
            `,
    managewardandbeds: `
                <h2>Manage Ward and Beds</h2>
                <table class="table table-hover manage-ward-table">
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
                        
                    </tbody>
                </table>
            `,
    addadoctor: `
            <div class="container mt-4">
                <h2 class="mb-2">Add a Doctor</h2>
                <form id="addDoctorForm" class="p-1 text-center">
                <div class="mb-1">
                    <label for="doctorName" class="form-label">Doctor's Name</label>
                    <input type="text" class="form-control" id="doctorName" name="name" required />
                </div>

                <div class="row mb-1">
                    <div class="col-md-6 mb-1">
                        <label for="doctorEmail" class="form-label">Email</label>
                        <input type="email" class="form-control" id="doctorEmail" name="email" required />
                    </div>

                    <div class="col-md-6 mb-1">
                        <label for="doctorPhone" class="form-label">Phone Number</label>
                        <input type="text" class="form-control" id="doctorPhone" name="phoneNumber" required />
                    </div>
                </div>

                <div class="mb-1">
                    <label for="doctorAddress" class="form-label">Address</label>
                    <input type="text" class="form-control" id="doctorAddress" name="address" required />
                </div>

                <button type="submit" class="btn btn-primary">Add Doctor</button>
            </form>
            </div>
            `,
    staffwardmanagement: `
                <h2>Manage Staff </h2>
                <div class="container my-4">
                    <div class="table-responsive">
                        <table class="table table-bordered text-center align-middle staff-table">
                            <thead class="table-light">
                                <tr>
                                <th style="width: 25%;">Staff</th>
                                <th style="width: 35%;">Wards</th>
                                <th style="width: 25%;">Start Time</th>
                                </tr>
                            </thead>
                            <tbody>
                            
                            </tbody>
                        </table>
                    </div>
                    </div>
            `,
    patientappointments: `
            <h2>Manage Patient booked appointments</h2>
                <table class="table table-hover patient-appointment-table">
                    <thead class="table-dark">
                        <tr>
                            <th>Patient Name</th>
                            <th>Doctor Name</th>
                            <th>Status</th>
                            <th>Phone</th>
                            <th>Email</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
    `
};
export { contentData }