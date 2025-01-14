import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDmY1e82vl3RUfj5EtPhC8Zl5RnXm9NrZg",
    authDomain: "hospital-management-syst-5db87.firebaseapp.com",
    projectId: "hospital-management-syst-5db87",
    storageBucket: "hospital-management-syst-5db87.firebaseapp.com",
    messagingSenderId: "879885060770",
    appId: "1:879885060770:web:e6c172dfb74d6c15ada5fb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Handle Modify Password Form Submission
document.getElementById("theModifyPasswordForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const currentPassword = document.getElementById("currentPassword").value.trim();
    const newPassword = document.getElementById("newPassword").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();

    // Validate Passwords
    if (newPassword !== confirmPassword) {
        alert("New password and confirm password do not match!");
        return;
    }

    if (newPassword.length < 8) {
        alert("Password must be at least 8 characters long.");
        return;
    }

    // Get logged-in user from sessionStorage
    const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));

    if (!loggedInUser) {
        alert("No user is currently logged in.");
        return;
    }

    const { email } = loggedInUser;

    try {
        // Fetch user document from Firestore
        const userDocRef = doc(db, "users", email);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
            alert("User not found in the database.");
            return;
        }

        const userData = userDoc.data();

        // Validate current password
        if (userData.password !== currentPassword) {
            alert("Current password is incorrect!");
            return;
        }

        // Update the user's password in Firestore
        await updateDoc(userDocRef, {
            password: newPassword
        });

        alert("Password successfully updated!");
        document.getElementById("theModifyPasswordForm").reset();
    } catch (error) {
        console.error("Error updating password:", error);
        alert(error.message);
    }
});
