// Signup form
const signupForm = document.getElementById("signupForm");
if (signupForm) {
    signupForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const name = document.getElementById("signupName").value;
        const email = document.getElementById("signupEmail").value;
        const password = document.getElementById("signupPassword").value;
        const confirmPassword = document.getElementById("signupConfirmPassword").value;

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        localStorage.setItem("userEmail", email);
        localStorage.setItem("userPassword", password);
        localStorage.setItem("userName", name);
        alert("Signup Successful!");
        window.location.href = "index.html";
    });
}

// Login form
const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;

        const storedEmail = localStorage.getItem("userEmail");
        const storedPassword = localStorage.getItem("userPassword");

        if (email === storedEmail && password === storedPassword) {
            alert("Login Successful!");
            window.location.href = "home.html";
        } else {
            alert("Invalid credentials!");
        }
    });
}

// Reset form
const resetForm = document.getElementById("resetForm");
if (resetForm) {
    resetForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const email = document.getElementById("resetEmail").value;
        const storedEmail = localStorage.getItem("userEmail");
        if (email === storedEmail) {
            alert("Reset link sent to your email!");
        } else {
            alert("Email not found!");
        }
    });
}
