export const renderStaffRows = (staffs) => {
    return staffs.map(staff => {
        const { _id, name, phoneNumber, wardsAssigned = [], schedule = [] } = staff;

        const wardsHTML = wardsAssigned.length
            ? wardsAssigned.map(w => `
                <div class="ward-item d-flex justify-content-between align-items-center mb-1">
                    <span>${w}</span>
                    <button class="btn btn-outline-danger btn-remove-ward ms-2 p-0" style="font-size: 0.75rem; line-height: 1; width: 20px; height: 20px;" data-id="${_id}" data-ward="${w}">×</button>
                </div>
            `).join("")
            : "<div>No wards assigned</div>";

        const shiftsHTML = schedule.length
            ? schedule.map(s => {
                const d = new Date(s.date);
                const shiftId = `${_id}-${s.date}-${s.shift}`.replace(/\W+/g, "");
                return `<div id="shift-${shiftId}" class="mb-2">
                    ${d.toLocaleDateString("en-GB")}: <strong>${s.shift}</strong>
                    <button
                        class="btn btn-outline-danger btn-remove-shift ms-2 p-0"
                        style="font-size: 0.75rem; line-height: 1; width: 20px; height: 20px;"
                        data-staff="${_id}" 
                        data-date="${s.date}" 
                        data-shift="${s.shift}">
                        ×
                    </button>
                </div>`;
            }).join("")
            : "<div>No shifts assigned</div>";

        return `
            <tr>
                <td>
                    <div class="fw-bold">${name}</div>
                    <div class="text-muted small">${phoneNumber}</div>
                </td>
                <td>
                    <div id="wards-${_id}">
                        ${wardsHTML}
                    </div>
                    <div class="dropdown d-inline">
                        <button class="btn btn-sm btn-outline-primary mt-2 dropdown-toggle" type="button" data-bs-toggle="dropdown">
                            Update
                        </button>
                        <ul class="dropdown-menu ward-options" data-id="${_id}">
                            ${['General', 'ICU', 'HDU', 'Private', 'Maternity', 'Surgical', 'Orthopedic']
                .map(ward => `<li><a class="dropdown-item ward-item" href="#" data-ward="${ward}">${ward}</a></li>`)
                .join("")}
                        </ul>
                    </div>
                </td>
                <td class="shift-container">
                    ${shiftsHTML}
                    <form class="schedule-form mt-2" data-id="${_id}">
                        <input type="date" class="form-control form-control-sm d-inline-block w-auto me-2 schedule-date" required />
                        <select class="form-select form-select-sm d-inline-block w-auto schedule-shift" required>
                            <option value="" disabled selected>Shift</option>
                            <option value="morning">Morning</option>
                            <option value="afternoon">Afternoon</option>
                            <option value="night">Night</option>
                        </select>
                        <button type="submit" class="btn btn-sm btn-primary ms-1">Add</button>
                    </form>
                </td>
            </tr>
        `;
    }).join("");
};
