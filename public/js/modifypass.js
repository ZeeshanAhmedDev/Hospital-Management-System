// modifying password

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
    apiKey: "AIzaSyDmY1e82vl3RUfj5EtPhC8Zl5RnXm9NrZg"
import { getAuth, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDmY1e82vl3RUfj5EtPhC8Zl5RnXm9NrZg",
    authDomain: "hospital-management-syst-5db87.firebaseapp.com",
    projectId: "hospital-management-syst-5db87",
    storageBucket: "hospital-management-syst-5db87.firebasestorage.app",
    messagingSenderId: "879885060770",
    appId: "1:879885060770:web:e6c172dfb74d6c15ada5fb"
  };


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Handle Modify Password Form Submission
document.getElementById("theModifyPasswordForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const currentPassword = document.getElementById("currentPassword").value;
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    // Validate Passwords
    if (newPassword !== confirmPassword) {
        alert("New password and confirm password do not match!");
        return;
    }

    if (newPassword.length < 8) {
        alert("Password must be at least 8 characters long.");
        return;
    }

    try {
        const user = auth.currentUser;

        if (!user) {
            alert("No user is signed in.");
            return;
        }

        // Reauthenticate the user
        const email = user.email; // Assuming user signed in with email/password
        const credential = EmailAuthProvider.credential(email, currentPassword);

        await reauthenticateWithCredential(user, credential);

        // Update password
        await updatePassword(user, newPassword);

        alert("Password successfully updated!");
        document.getElementById("theModifyPasswordForm").reset();
    } catch (error) {
        console.error("Error updating password:", error);
        alert(error.message);
    }
});

