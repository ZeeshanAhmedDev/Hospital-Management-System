// // Fetch user data from sessionStorage
// const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));

// if (!loggedInUser) {
//     // Redirect to login page if no user is logged in
//     alert("You are not logged in. Redirecting to login page...");
//     window.location.href = "login.html";
// } else {
//     // DOM Elements
//     const profileForm = document.getElementById("profileForm");
//     const firstNameField = document.getElementById("firstName");
//     const lastNameField = document.getElementById("lastName");
//     const emailField = document.getElementById("email");
//     const phoneField = document.getElementById("phone");
//     const roleField = document.getElementById("role");
//     const addressField = document.getElementById("address");
//     const editButton = document.getElementById("editButton");
//     const saveButton = document.getElementById("saveButton");

//     // Disable form fields initially
//     profileForm.querySelectorAll("input, textarea, select").forEach((field) => (field.disabled = true));

//     // Populate user data in the form
//     firstNameField.value = loggedInUser.firstName || "";
//     lastNameField.value = loggedInUser.lastName || "";
//     emailField.value = loggedInUser.email || "";
//     phoneField.value = loggedInUser.phoneNumber || "";
//     roleField.value = loggedInUser.role || "Patient"; // Default role is Patient
//     addressField.value = loggedInUser.address || "";

//     // Enable editing of profile fields
//     editButton.addEventListener("click", () => {
//         profileForm.querySelectorAll("input, textarea, select").forEach((field) => (field.disabled = false));
//         editButton.disabled = true;
//         saveButton.disabled = false;
//     });

//     // Save updated profile data
//     profileForm.addEventListener("submit", async (e) => {
//         e.preventDefault();

//         const updatedProfile = {
//             firstName: firstNameField.value,
//             lastName: lastNameField.value,
//             phoneNumber: phoneField.value,
//             role: roleField.value,
//             address: addressField.value,
//         };

//         // Update sessionStorage
//         sessionStorage.setItem("loggedInUser", JSON.stringify({ ...loggedInUser, ...updatedProfile }));

    
//         // Disable fields and reset buttons
//         profileForm.querySelectorAll("input, textarea, select").forEach((field) => (field.disabled = true));
//         editButton.disabled = false;
//         saveButton.disabled = true;
//     });
// }


// Fetch user data from sessionStorage
const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));

if (!loggedInUser) {
    alert("You are not logged in. Redirecting to login page...");
    window.location.href = "login.html";
} else {
    const profileForm = document.getElementById("profileForm");
    const firstNameField = document.getElementById("firstName");
    const lastNameField = document.getElementById("lastName");
    const emailField = document.getElementById("email");
    const roleField = document.getElementById("role");
    const editButton = document.getElementById("editButton");
    const saveButton = document.getElementById("saveButton");

    // Disable form fields initially
    profileForm.querySelectorAll("input, textarea, select").forEach((field) => (field.disabled = true));

    // Split full name into first and last name (basic approach)
    const nameParts = loggedInUser.name?.split(" ") || [];
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    // Populate user data in the form
    firstNameField.value = firstName;
    lastNameField.value = lastName;
    emailField.value = loggedInUser.email || "";
    roleField.value = loggedInUser.role || "";

    // Enable editing of profile fields
    editButton.addEventListener("click", () => {
        profileForm.querySelectorAll("input, textarea, select").forEach((field) => (field.disabled = false));
        editButton.disabled = true;
        saveButton.disabled = false;
    });

    // Save updated profile data
    profileForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Combine name again
        const updatedName = `${firstNameField.value} ${lastNameField.value}`.trim();

        const updatedProfile = {
            ...loggedInUser,
            name: updatedName,
            role: roleField.value
        };

        // Update sessionStorage
        sessionStorage.setItem("loggedInUser", JSON.stringify(updatedProfile));

        // Disable fields and reset buttons
        profileForm.querySelectorAll("input, textarea, select").forEach((field) => (field.disabled = true));
        editButton.disabled = false;
        saveButton.disabled = true;
    });
}
