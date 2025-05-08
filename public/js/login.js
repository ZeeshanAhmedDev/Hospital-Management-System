import { AUTHENTICATION_API } from "../APIsServices.js";

const login =`${AUTHENTICATION_API.BASE_URL}${AUTHENTICATION_API.LOGIN}`;


document.getElementById("loginForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    // Collect login credentials
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {
        const response = await fetch(login, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        if (!response.ok) {
            alert(result.message || "Login failed");
            return;
        }

        // Save user data (if you send token or info)
        sessionStorage.setItem("loggedInUser", JSON.stringify(result));
        alert(`Welcome, ${result.user.firstName} ${result.user.lastName}!`);
        
        window.location.href = "index.html";
    } catch (error) {
        console.error("Login error:", error);
       
        alert(`Failed to login,  ${error.message}!`);
    }
});