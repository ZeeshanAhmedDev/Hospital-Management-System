import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

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

// Handle Registration Form Submission
document.getElementById("registrationForm").addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent form from refreshing the page

    // Collect form data
    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const phoneNumber = document.getElementById("phoneNumber").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const address = document.getElementById("address").value.trim();
    const role = document.getElementById("role").value;

    // Validate passwords
    if (password.length < 8) {
        alert("Password must be at least 8 characters long.");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    // Validate other fields
    if (!firstName || !lastName || !phoneNumber || !email || !address || !role) {
        alert("Please fill in all the required fields.");
        return;
    }

    try {
        // Save user details to Firestore
        const userId = email; // Using email as the unique identifier
        await setDoc(doc(db, "users", userId), {
            firstName,
            lastName,
            phoneNumber,
            email,
            password, // WARNING: In production, hash the password before storing it!
            address,
            role,
            createdAt: new Date()
        });

        // Show success message and reset the form
        alert("Registration successful!");
        document.getElementById("registrationForm").reset();
    } catch (error) {
        console.error("Error during registration:", error);
        alert(`Error: ${error.message}`);
    }
});
