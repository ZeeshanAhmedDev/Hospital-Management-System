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
        // Fetch user details from Firestore
        const userDoc = await getDoc(doc(db, "users", email));

        if (!userDoc.exists()) {
            alert("No user found with this email!");
            return;
        }

        const userData = userDoc.data();

        // Validate password
        if (userData.password !== password) {
            alert("Invalid password!");
            return;
        }

        // Save user information to sessionStorage
        sessionStorage.setItem("loggedInUser", JSON.stringify(userData));

        // Redirect to the home page (or dashboard)
        alert(`Welcome, ${userData.firstName} ${userData.lastName}!`);
        window.location.href = "index.html";
    } catch (error) {
        console.error("Error during login:", error);
        alert(`Error: ${error.message}`);
    }
});
