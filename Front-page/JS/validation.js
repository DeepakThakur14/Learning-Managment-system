// Signup Form
const signupForm = document.getElementById("signupForm");

if (signupForm) {
    signupForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        // Check empty fields
        if (!name || !email || !password || !confirmPassword) {
            alert("Please fill in all fields.");
            return;
        }

        // Name validation: Each name part starts with a capital letter
        const namePattern = /^[A-Z][a-z]*(?: [A-Z][a-z]*)*$/;

        if (!namePattern.test(name)) {
            alert(
                "Name must contain only letters and spaces, and each name must start with a capital letter.\nExample: Deepak Thakur"
            );
            return;
        }

        // Email validation
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            alert("Please enter a valid email address.");
            return;
        }

        // Password validation
        if (password.length < 8) {
            alert("Password must contain at least 8 characters.");
            return;
        }

        // Confirm password validation
        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        alert(
            "Signup form validated successfully. Backend registration is not connected yet."
        );
    });
}
