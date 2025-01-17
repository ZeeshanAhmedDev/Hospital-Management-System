import { app, auth, onAuthStateChanged, dbRef } from '../../src/firebase.js'
import { getFirestore, collection, addDoc, doc, getDocs, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";


const loggedInUser = sessionStorage.getItem("loggedInUser");

// Function to write data to Firestore
async function bookAppointment(firstName, lastName, email, phone, dob, bookingDate) {
    try {
        const docRef = await addDoc(collection(dbRef, "appointments"), {
            firstName,
            lastName,
            email,
            phone,
            dob,
            bookingDate,
            timestamp: new Date().toISOString()
        });
        console.log("Appointment booked with Successfully");
    } catch (error) {
        console.error("Error adding appointments:", error);
    }
}


document.getElementById('appointmentForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const dob = document.getElementById('dob').value;
    const bookingDate = document.getElementById('bk_date').value;

    if (loggedInUser) {

        const userData = JSON.parse(loggedInUser);
        bookAppointment(firstName, lastName, email, phone, dob, bookingDate);
    } else {
        console.log("No logged-in user found in session storage.");
        alert("Please log in to access this page.");
        // Redirect to login page if needed
        window.location.href = "login.html";
    }
});