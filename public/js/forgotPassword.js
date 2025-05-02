
import { AUTHENTICATION_API } from '../APIsServices.js';

const FORGOT_PASSWORD_URL = `${AUTHENTICATION_API.BASE_URL}${AUTHENTICATION_API.FORGOT_PASSWORD}`;
const submitBtn = document.querySelector("#forgotPasswordForm button[type='submit']");
const originalBtnText = submitBtn.innerHTML;

document.getElementById("forgotPasswordForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();

    // loading spinner
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Sending...`;

    try {
        const response = await fetch(FORGOT_PASSWORD_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email })
        });

        const result = await response.json();

        if (!response.ok) {
            alert(result.message || "Failed to send reset link.");
            return;
        }

        alert("Reset link has been sent to your email!");
        document.getElementById("forgotPasswordForm").reset();
    } catch (error) {
        console.error("Error sending reset link:", error);
        alert(`Error: ${error.message}`);
    } finally {
        // Restore button after response
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
    }
});
