 // demo data
 const bookings = [
    { id: 1, firstName: "Zisan", lastName: "Ahmed", email: "jis.ah@boombox.com", phone: "354553363636", dob: "1990-01-01", date: "2025-01-10" },
    { id: 2, firstName: "Federico", lastName: "Carraro", email: "federico@wequi.xyz", phone: "35387984543", dob: "1985-05-15", date: "2025-01-12" },
   
];

const rowsPerPage = 5;
let currentPage = 1;

function renderTable() {
    const tableBody = document.getElementById("bookingTableBody");
    const searchInput = document.getElementById("searchInput").value.toLowerCase();
    tableBody.innerHTML = "";

    const filteredBookings = bookings.filter(booking => 
        booking.firstName.toLowerCase().includes(searchInput) ||
        booking.lastName.toLowerCase().includes(searchInput) ||
        booking.email.toLowerCase().includes(searchInput)
    );

    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    filteredBookings.slice(startIndex, endIndex).forEach((booking, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${startIndex + index + 1}</td>
            <td>${booking.firstName}</td>
            <td>${booking.lastName}</td>
            <td>${booking.email}</td>
            <td>${booking.phone}</td>
            <td>${booking.dob}</td>
            <td>${booking.date}</td>
        `;
        tableBody.appendChild(row);
    });

    renderPagination(filteredBookings.length);
}

function renderPagination(totalRows) {
    const pagination = document.querySelector(".pagination");
    pagination.innerHTML = "";

    const totalPages = Math.ceil(totalRows / rowsPerPage);
    for (let i = 1; i <= totalPages; i++) {
        const li = document.createElement("li");
        li.classList.add("page-item");
        li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
        if (i === currentPage) {
            li.classList.add("active");
        }
        li.addEventListener("click", () => {
            currentPage = i;
            renderTable();
        });
        pagination.appendChild(li);
    }
}

document.getElementById("searchInput").addEventListener("input", renderTable);

renderTable();