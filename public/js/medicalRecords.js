import { PATIENT_API } from '../APIsServices.js';

const GET_RECORDS_URL = `${PATIENT_API.BASE_URL}${PATIENT_API.VIEW_MEDICAL_RECORDS}`;
let allRecords = []; // for search filtering

// Fetch  medical records
async function fetchMedicalRecords() {
  try {
    const response = await fetch(GET_RECORDS_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Failed to fetch records.");
      return;
    }

    allRecords = data; // Save search filtering
    renderRecords(allRecords);
  } catch (error) {
    console.error("Error fetching medical records:", error);
    const tbody = document.getElementById("recordsBody");
    if (tbody) {
      tbody.innerHTML = `<tr><td colspan="4" class="text-danger text-center">Failed to load records.</td></tr>`;
    }
  }
}

// Render records in table
function renderRecords(records) {
  const tbody = document.getElementById("recordsBody");
  tbody.innerHTML = "";

  if (!records.length) {
    tbody.innerHTML = `<tr><td colspan="4" class="text-center">No records found.</td></tr>`;
    return;
  }

  records.forEach(record => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${record.diagnosis}</td>
      <td>${record.treatment}</td>
      <td>${record.doctor}</td>
      <td>${new Date(record.date).toLocaleDateString()}</td>
    `;
    tbody.appendChild(tr);
  });
}

// Filter records based on search
function handleSearch(event) {
  const query = event.target.value.toLowerCase();

  const filtered = allRecords.filter(record =>
    record.diagnosis.toLowerCase().includes(query) ||
    record.treatment.toLowerCase().includes(query) ||
    record.doctor.toLowerCase().includes(query)
  );

  renderRecords(filtered);
}

// Eventx
document.addEventListener("DOMContentLoaded", () => {
  fetchMedicalRecords();

  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", handleSearch);
  }
});
