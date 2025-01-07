document.addEventListener('DOMContentLoaded', () => {
    const formElements = document.querySelectorAll('#profileForm input, #profileForm textarea');
    const editButton = document.getElementById('editButton');
    const saveButton = document.getElementById('saveButton');

    // Initially disable form fields
    formElements.forEach(element => element.disabled = true);

    editButton.addEventListener('click', () => {
        formElements.forEach(element => element.disabled = false);
        editButton.disabled = true;
        saveButton.disabled = false;
    });

    document.getElementById('profileForm').addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Profile successfully updated!');
        formElements.forEach(element => element.disabled = true);
        editButton.disabled = false;
        saveButton.disabled = true;
    });
});
