
// Main app initialization placeholder
console.log("App initialized");

const loggedInUser = sessionStorage.getItem("loggedInUser");
if (loggedInUser) {

    const userData = JSON.parse(loggedInUser);
    console.log(userData.role)
} else {
    console.log("No logged-in user found in session storage.");
    alert("Please log in to access this page.");
    // Redirect to login page
    window.location.href = "login.html";
}

const loadPatientSideBars = () => {
    fetch('dashboard/patientSideBar.html')
    .then(response => response.text())
    .then(data => {
        console.log(data)
        document.getElementById('sidebars').innerHTML = data;
    }).catch(err => console.log("Error loading sidebar bar: " + err))
}

loadPatientSideBars()
const loadStaffSideBars = () => {
    fetch('dashboard/staffSideBar.html')
    .then(response => response.text())
    .then(data => {
        console.log(data)
        document.getElementById('sidebars').innerHTML = data;
    }).catch(err => console.log("Error loading sidebar bar: " + err))
}

//loadStaffSideBars()