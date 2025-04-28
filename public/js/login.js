import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDmY1e82vl3RUfj5EtPhC8Zl5RnXm9NrZg",
    authDomain: "hospital-management-syst-5db87.firebaseapp.com",
    projectId: "hospital-management-syst-5db87",
    storageBucket: "hospital-management-syst-5db87.appspot.com",
    messagingSenderId: "879885060770",
    appId: "1:879885060770:web:e6c172dfb74d6c15ada5fb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Handle Login Form Submission
document.getElementById("loginForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    // Collect login credentials
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("http://localhost:5000/api/auth/login", {
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
        sessionStorage.setItem("loggedInUser", JSON.stringify(result.user));
        alert(`Welcome, ${result.user.firstName} ${result.user.lastName}!`);
        
        window.location.href = "index.html";
    } catch (error) {
        console.error("Login error:", error);
       
        alert(`Failed to login,  ${error.message}!`);
    }
});
});
