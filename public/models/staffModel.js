const BASE_URL = "http://localhost:8000/api/staff";

export const fetchAllStaffs = async (token) => {
    const res = await fetch(`${BASE_URL}/all-stuffs`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    });
    if (!res.ok) throw new Error("Failed to fetch staff");
    return await res.json();
};

export const assignWard = async (staffId, ward, token) => {
    const res = await fetch(`${BASE_URL}/${staffId}/assign-wards`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ wards: [ward] }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to assign ward.");
    return data;
};

export const removeWardFromStaff = async (staffId, ward, token) => {
    const res = await fetch(`${BASE_URL}/${staffId}/remove-ward`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ ward }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to remove ward.");
    return data;
};

export const addShift = async (staffId, date, shift, token) => {
    const res = await fetch(`${BASE_URL}/${staffId}/manage-schedule`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ date, shift }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to add shift.");
    return data;
};

export const removeShiftFromStaff = async (staffId, date, shift, token) => {
    const res = await fetch(`${BASE_URL}/${staffId}/remove-shift`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ date, shift }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to remove shift.");
    return data;
};
