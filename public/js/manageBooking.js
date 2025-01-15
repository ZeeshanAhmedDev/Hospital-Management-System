import { db } from "../../src/firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

const bookingTableBody = document.getElementById("bookingTableBody");

const testConnection = async () => {
    try {
        await getDocs(collection(db, "appointments"));
        console.log("Connection successful");
    } catch (e) {
        console.error("Error connecting to Firestore: ", e);
    }
}
testConnection();

async function fetchBookings() {
    const querySnapshot = await getDocs(collection(db, "appointments"));
    bookingTableBody.innerHTML = ""; // Clear existing content
    let counter = 1;
    querySnapshot.forEach((doc) => {
        const booking = doc.data();
        const row = `
            <tr>
                <td>${counter++}</td>
                <td>${booking.firstName}</td>
                <td>${booking.lastName}</td>
                <td>${booking.email}</td>
                <td>${booking.phone}</td>
                <td>${booking.dob}</td>
                <td>${booking.bookingDate}</td>
            </tr>
        `;
        bookingTableBody.innerHTML += row;
    });
}

fetchBookings();
