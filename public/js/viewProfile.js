
// Fetch user data from sessionStorage
const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
console.log(loggedInUser)

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

    // Split full name into first and last name
    //const nameParts = loggedInUser.name?.split(" ") || [];
    //const firstName = nameParts[0] || "";
    //const lastName = nameParts.slice(1).join(" ") || "";

    // Populate user data in the form
    firstNameField.value = loggedInUser?.user?.firstName;
    lastNameField.value = loggedInUser?.user?.lastName;
    emailField.value = loggedInUser?.user?.email || "";
    roleField.value = loggedInUser?.user?.role || "";

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

        // Updating sessionStorage
        sessionStorage.setItem("loggedInUser", JSON.stringify(updatedProfile));

        // Disable fields and reset buttons
        profileForm.querySelectorAll("input, textarea, select").forEach((field) => (field.disabled = true));
        editButton.disabled = false;
        saveButton.disabled = true;
    });
}
