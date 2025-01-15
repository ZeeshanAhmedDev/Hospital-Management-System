import { dbRef as db } from "../../src/firebase.js"; // Firebase initialization

import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  loadEmergencyContacts();
});

async function loadEmergencyContacts() {
  const hospitalContactsContainer = document.querySelector("#hospitalCollapse .accordion-body");
  const patientContactsContainer = document.querySelector("#patientCollapse .accordion-body");

  try {
    // Query for hospital contacts
    const hospitalQuery = query(collection(db, "emergencyContacts"), where("category", "==", "hospital"));
    const querySnapshot = await getDocs(hospitalQuery);

    if (!querySnapshot.empty) {
      hospitalContactsContainer.innerHTML = ""; // Clear loading message
      querySnapshot.forEach(doc => {
        const data = doc.data();
        const contactHTML = `
          <ul>
            <li><i class="bi ${data.icon}"></i><strong>${data.type}:</strong> ${data.contact}</li>
          </ul>
        `;
        hospitalContactsContainer.innerHTML += contactHTML;
      });
    } else {
      hospitalContactsContainer.innerHTML = "<p>No hospital contacts available.</p>";
    }

    // Query for patient-specific contacts (you can customize as needed)
    const patientQuery = query(collection(db, "emergencyContacts"), where("category", "==", "patient"));
    const patientSnapshot = await getDocs(patientQuery);

    if (!patientSnapshot.empty) {
      patientContactsContainer.innerHTML = ""; // Clear loading message
      patientSnapshot.forEach(doc => {
        const data = doc.data();
        const contactHTML = `
          <ul>
            <li><i class="bi ${data.icon}"></i><strong>${data.type}:</strong> ${data.contact}</li>
          </ul>
        `;
        patientContactsContainer.innerHTML += contactHTML;
      });
    } else {
      patientContactsContainer.innerHTML = "<p>No patient-specific contacts available.</p>";
    }

  } catch (error) {
    console.error("Error fetching emergency contacts: ", error);
  }
}
