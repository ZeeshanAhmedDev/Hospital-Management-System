import { app, auth, onAuthStateChanged, dbRef } from '../../src/firebase.js'
import { getFirestore, collection, addDoc, doc, getDocs, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";



async function bookAppointment(user_id, firstName, lastName, email, phone, dob, bookingDate) {
    try {
        // Reference to the user's document in the appointments collection
        const docRef = doc(dbRef, "appointments", user_id);

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

    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const dob = document.getElementById('dob').value;
    const bookingDate = document.getElementById('bk_date').value;

    //const user_id ="Hasan";

    // Get the authenticated user's ID
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const user_id = user.uid; // Firebase user ID
            bookAppointment(user_id, firstName, lastName, email, phone, dob, bookingDate);
        } else {
            console.error("User not logged in");
            alert("Please log in to book an appointment.");
        }
    });




    // book appointment function called
    //bookAppointment(user_id, firstName, lastName, email, phone, dob, bookingDate);
});