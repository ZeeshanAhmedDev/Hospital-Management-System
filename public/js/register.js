import { AUTHENTICATION_API } from "../APIsServices.js";

const registerUrl = `${AUTHENTICATION_API.BASE_URL}${AUTHENTICATION_API.REGISTER}`;

document.getElementById("registrationForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    // Collect registration form values
    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const phoneNumber = document.getElementById("phoneNumber").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const address = document.getElementById("address").value.trim();
    const role = document.getElementById("role").value;

    // Basic password match validation
    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    try {
        const response = await fetch(registerUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                firstName,
                lastName,
                phoneNumber,
                email,
                password,
                address,
                role
            })
        });

        const result = await response.json();

        if (response.ok) {
            alert("Registration successful! Please login.");
            window.location.href = "login.html"; 
        } else {
            alert(result.message || "Registration failed!");
        }

    } catch (error) {
        console.error("Registration error:", error);
        alert(`Failed to register: ${error.message}`);
    }
});