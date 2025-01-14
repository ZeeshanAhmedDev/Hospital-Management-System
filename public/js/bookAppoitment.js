import {app } from '../../src/firebase.js'
import { getFirestore, collection, addDoc, doc, getDocs, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

// Initialize Firestore
const db = getFirestore(app);

async function bookAppointment(user_id, firstName, lastName, email, phone, dob, bookingDate) {
    try {
        // Reference to the user's document in the appointments collection
        const docRef = doc(db, "appointments", user_id);

        // Set the appointment data (overwrites if exists)
        await setDoc(docRef, {
            firstName,
            lastName,
            email,
            phone,
            dob,
            bookingDate,
            timestamp: new Date().toISOString()
        });

        console.log("Appointment booked for user:", user_id);
    } catch (error) {
        console.error("Error booking appointment:", error);
    }
}


document.getElementById('appointmentForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const dob = document.getElementById('dob').value;
    const bookingDate = document.getElementById('bk_date').value;

    const user_id ="Hasan";

    // Log the values to the console (or handle them as needed)
    console.log('First Name:', firstName);
    console.log('Last Name:', lastName);
    console.log('Email:', email);
    console.log('Phone:', phone);
    console.log('Date of Birth:', dob);


    // book appointment function called
    bookAppointment(user_id, firstName, lastName, email, phone, dob, bookingDate);
});