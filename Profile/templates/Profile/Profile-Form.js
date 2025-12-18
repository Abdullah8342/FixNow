function addService() {
    const services = document.getElementById("services");
    const div = document.createElement("div");
    div.className = "service-input";
    div.innerHTML = `<input type="text" placeholder="New Service">`;
    services.appendChild(div);
}

function submitProfile() {
    alert("Profile data saved successfully!");
    // Later: send data to backend (Django / API)
}