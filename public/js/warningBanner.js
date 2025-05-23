const STATUS_PAGE_URL = "http://127.0.0.1:3000/Hospital-Management-System-main/public/status.html";


// List of service health-checkable endpoints based on your Postman collection
const SERVICE_URLS = [
  "http://localhost:5000/api/auth/login",              // Auth Service
  "http://localhost:6000/api/appointments",            // Appointment Service
  "http://localhost:7000/api/patients/login",          // Patient Service
  "http://localhost:8000/api/staff/me"                 // Staff Service
];

async function checkServicesHealth() {
  try {
    const results = await Promise.allSettled(
      SERVICE_URLS.map(url =>
        fetch(url, {
          method: "GET",
          headers: { "Content-Type": "application/json" }
        })
      )
    );

    const hasFailures = results.some(
      res => res.status === "rejected" || !res.value.ok
    );

    if (hasFailures) showWarningBanner();
  } catch (error) {
    showWarningBanner(); // Catch total fetch failure
  }
}

function showWarningBanner() {
  const banner = document.createElement("div");
  banner.className = "text-center py-2";
  banner.style.cssText = `
    background-color: #fff3cd;
    color: #856404;
    font-weight: bold;
    border-bottom: 2px solid #856404;
    font-family: sans-serif;
  `;
  banner.innerHTML = `⚠️ One or more services can be unavailable. Please check status <a href="${STATUS_PAGE_URL}" style="text-decoration: underline; color: #856404;">here</a>.`;
  document.body.insertBefore(banner, document.body.firstChild);
}

checkServicesHealth();
