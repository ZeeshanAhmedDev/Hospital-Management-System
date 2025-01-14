import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, onAuthStateChanged, updateEmail } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDmY1e82vl3RUfj5EtPhC8Zl5RnXm9NrZg",
    authDomain: "hospital-management-syst-5db87.firebaseapp.com",
    projectId: "hospital-management-syst-5db87",
    storageBucket: "hospital-management-syst-5db87.firebasestorage.app",
    messagingSenderId: "879885060770",
    appId: "1:879885060770:web:e6c172dfb74d6c15ada5fb",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// DOM Elements
const profileForm = document.getElementById("profileForm");
const firstNameField = document.getElementById("firstName");
const lastNameField = document.getElementById("lastName");
const emailField = document.getElementById("email");
const phoneField = document.getElementById("phone");
const roleField = document.getElementById("role");
const addressField = document.getElementById("address");
const editButton = document.getElementById("editButton");
const saveButton = document.getElementById("saveButton");

// Disable form fields initially
profileForm.querySelectorAll("input, textarea, select").forEach((field) => (field.disabled = true));

// Handle user authentication state
onAuthStateChanged(auth, async (user) => {
    if (user) {
        try {
            const userDocRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const userData = userDoc.data();
                firstNameField.value = userData.firstName || "";
                lastNameField.value = userData.lastName || "";
                emailField.value = user.email || "";
                phoneField.value = userData.phone || "";
                roleField.value = userData.role || "Patient"; // Default role is Patient
                addressField.value = userData.address || "";
            } else {
                console.log("No user data found.");
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    } else {
        alert("Please log in to view your profile.");
        window.location.href = "index.html";
    }
});

// Enable editing of profile fields
editButton.addEventListener("click", () => {
    profileForm.querySelectorAll("input, textarea, select").forEach((field) => (field.disabled = false));
    editButton.disabled = true;
    saveButton.disabled = false;
});

// Save updated profile data
profileForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const updatedProfile = {
        firstName: firstNameField.value,
        lastName: lastNameField.value,
        phone: phoneField.value,
        role: roleField.value,
        address: addressField.value,
    };

    try {
        const user = auth.currentUser;

        if (!user) {
            alert("No user is signed in.");
            return;
        }

        // Update email if changed
        if (emailField.value !== user.email) {
            await updateEmail(user, emailField.value);
        }

        // Update Firestore profile data
        const userDocRef = doc(db, "users", user.uid);
        await setDoc(userDocRef, updatedProfile, { merge: true });

        alert("Profile updated successfully!");

        // Disable fields and reset buttons
        profileForm.querySelectorAll("input, textarea, select").forEach((field) => (field.disabled = true));
        editButton.disabled = false;
        saveButton.disabled = true;
    } catch (error) {
        console.error("Error updating profile:", error);
        alert(error.message);
    }
});
