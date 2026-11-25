/** LearnX authentication UI, role guards and navigation. */
"use strict";

document.addEventListener("DOMContentLoaded", () => {
    if (window.LMSStorage) LMSStorage.init();
    initGlobalMobileNav();
    initNavbarAuth();
    initPasswordToggles();
    initLoginForm();
    initSignupForm();
    initAdminBootstrapForm();
    bindLogoutButtons();
    enforcePageAccess();
    showRegistrationNotice();
});

function initGlobalMobileNav() {
    const toggle = document.getElementById("mobileNavToggle");
    const menu = document.getElementById("mainNavLinks") || document.querySelector(".lms-nav-menu, .nav-links");
    if (!toggle || !menu) return;
    toggle.addEventListener("click", e => { e.stopPropagation(); menu.classList.toggle("show"); });
    document.addEventListener("click", e => { if (!menu.contains(e.target) && e.target !== toggle) menu.classList.remove("show"); });
}
function getRoleDashboard(role, inPages = true) {
    const file = role === "admin" ? "admin-dashboard.html" : role === "instructor" ? "instructor-dashboard.html" : "student-dashboard.html";
    return inPages ? file : `pages/${file}`;
}
function initNavbarAuth() {
    if (!window.LMSStorage) return;
    const activeUser = LMSStorage.getCurrentUser();
    document.querySelectorAll("a[href]").forEach(link => {
        const href = (link.getAttribute("href") || "").toLowerCase();
        const isAdmin = href.includes("admin-dashboard");
        const isInstructor = href.includes("instructor-dashboard") || href.includes("instructor-courses") || href.includes("instructor-content");
        const isStudent = href.includes("student-dashboard");
        if ((isAdmin && (!activeUser || activeUser.role !== "admin")) ||
            (isInstructor && (!activeUser || activeUser.role !== "instructor")) ||
            (isStudent && (!activeUser || activeUser.role !== "student"))) {
            const item = link.closest("li");
            if (item) item.remove(); else link.remove();
        }
    });
    const user = LMSStorage.getCurrentUser();
    const nav = document.querySelector(".nav-buttons, .lms-nav-actions, .navbar .user-actions");
    if (!nav || !user || nav.querySelector(".learnx-nav-user, .lms-logout-action-btn, #logoutBtn")) return;
    const inPages = location.pathname.toLowerCase().includes("/pages/");
    const dashboard = getRoleDashboard(user.role, inPages);
    nav.querySelectorAll(".login-btn, a[href*='login'], .signup-btn, a[href*='Signup'], a[href*='signup']").forEach(el => el.remove());
    const controls = document.createElement("div");
    controls.className = "learnx-nav-user d-flex align-items-center gap-2";
    const name = document.createElement("span"); name.textContent = user.name || "User";
    const role = document.createElement("span"); role.className = "badge bg-primary"; role.textContent = user.role;
    const link = document.createElement("a"); link.href = dashboard; link.className = "text-decoration-none d-flex align-items-center gap-2"; link.append(name, role);
    const logout = document.createElement("button"); logout.type = "button"; logout.className = "lms-logout-action-btn btn btn-sm btn-outline-secondary"; logout.textContent = "Logout";
    controls.append(link, logout); nav.appendChild(controls);
    bindLogoutButtons();
}
function bindLogoutButtons() {
    document.querySelectorAll(".lms-logout-action-btn, #logoutBtn, [data-action='logout']").forEach(btn => {
        if (btn.dataset.logoutBound) return;
        btn.dataset.logoutBound = "true";
        btn.addEventListener("click", () => {
            LMSStorage.logout();
            location.href = location.pathname.toLowerCase().includes("/pages/") ? "login.html" : "pages/login.html";
        });
    });
}
function initPasswordToggles() {
    document.querySelectorAll(".toggle-password-btn, [data-toggle='password']").forEach(btn => {
        if (btn.dataset.passwordBound) return;
        btn.dataset.passwordBound = "true";
        btn.addEventListener("click", e => {
            e.preventDefault();
            const input = document.getElementById(btn.dataset.target || "password");
            if (!input || input.disabled || input.readOnly) return;
            const reveal = input.type === "password";
            input.type = reveal ? "text" : "password";
            btn.setAttribute("aria-label", reveal ? "Hide password" : "Show password");
            btn.textContent = reveal ? "🙈" : "👁️";
            input.focus({ preventScroll: true });
        });
    });
}
function showAuthMessage(message, type = "danger") {
    if (window.LMSStorage && typeof LMSStorage.showToast === "function") LMSStorage.showToast(message, type);
    else window.alert(message);
}
function setFormBusy(form, busy, buttonText) {
    const button = form.querySelector("button[type='submit']");
    if (!button) return;
    if (busy) { button.dataset.originalText = button.textContent; button.disabled = true; button.textContent = buttonText || "Please wait…"; }
    else { button.disabled = false; button.textContent = button.dataset.originalText || button.textContent; }
}
function initLoginForm() {
    const form = document.getElementById("loginForm");
    if (!form) return;
    form.addEventListener("submit", async e => {
        e.preventDefault();
        if (!form.reportValidity()) return;
        const email = (document.getElementById("email")?.value || "").trim();
        const password = document.getElementById("password")?.value || "";
        const role = document.getElementById("authRole")?.value || "student";
        setFormBusy(form, true, "Verifying…");
        try {
            const result = await AuthService.login(email, password, role);
            if (!result.success) { showAuthMessage(result.message || "Unable to sign in."); return; }
            const remember = document.getElementById("rememberMe");
            if (remember?.checked) localStorage.setItem("learnx_remember_email", email);
            else localStorage.removeItem("learnx_remember_email");
            showAuthMessage(`Welcome back, ${result.user.name}!`, "success");
            setTimeout(() => { location.href = getRoleDashboard(result.user.role, true); }, 250);
        } catch (error) { showAuthMessage(error.message || "Sign-in failed."); }
        finally { setFormBusy(form, false); }
    });
    const remembered = localStorage.getItem("learnx_remember_email");
    if (remembered && document.getElementById("email")) {
        document.getElementById("email").value = remembered;
        const check = document.getElementById("rememberMe"); if (check) check.checked = true;
    }
}
function initSignupForm() {
    const form = document.getElementById("signupForm");
    if (!form) return;
    // Explicitly start with empty fields; browser autofill can otherwise make a new registration look pre-populated.
    ["name", "email", "password", "confirmPassword"].forEach(id => { const field = document.getElementById(id); if (field) field.value = ""; });
    form.addEventListener("submit", async e => {
        e.preventDefault();
        if (!form.reportValidity()) return;
        const name = (document.getElementById("name")?.value || "").trim();
        const email = (document.getElementById("email")?.value || "").trim();
        const password = document.getElementById("password")?.value || "";
        const confirm = document.getElementById("confirmPassword")?.value || "";
        const role = document.getElementById("authRole")?.value || "student";
        if (password !== confirm) return showAuthMessage("Passwords do not match.");
        if (document.getElementById("termsCheck") && !document.getElementById("termsCheck").checked) return showAuthMessage("Please accept the terms to continue.");
        setFormBusy(form, true, "Creating account…");
        try {
            const result = await AuthService.register({ name, email, password, role });
            if (!result.success) { showAuthMessage(result.message || "Unable to create account."); return; }
            // Registration does NOT create a session. The user must sign in explicitly.
            sessionStorage.setItem("learnx_registration_notice", "Your account was created successfully. Please sign in.");
            location.href = `login.html?registered=1&email=${encodeURIComponent(email)}`;
        } catch (error) { showAuthMessage(error.message || "Registration failed."); }
        finally { setFormBusy(form, false); }
    });
}
function showRegistrationNotice() {
    if (!location.pathname.toLowerCase().endsWith("login.html")) return;
    const notice = sessionStorage.getItem("learnx_registration_notice");
    if (notice) { sessionStorage.removeItem("learnx_registration_notice"); showAuthMessage(notice, "success"); }
    const email = new URLSearchParams(location.search).get("email");
    const emailField = document.getElementById("email");
    if (email && emailField) emailField.value = email;
}
function enforcePageAccess() {
    if (!window.LMSStorage) return;
    const path = location.pathname.toLowerCase();
    const page = path.split("/").pop();
    const requiredRole = page === "admin-dashboard.html" ? "admin"
        : (page === "instructor-dashboard.html" || page === "instructor-courses.html" || page === "instructor-content.html" || page === "instructor-submissions.html") ? "instructor"
        : ["student-dashboard.html", "assignments.html", "certificate.html", "certificates.html", "learning.html", "my-courses.html", "profile.html", "progress.html"].includes(page) ? "student" : null;
    if (!requiredRole) return;
    const user = LMSStorage.getCurrentUser();
    if (!user) { location.replace("login.html"); return; }
    if (user.role !== requiredRole) {
        const target = getRoleDashboard(user.role, true);
        location.replace(target);
    }
}

function initAdminBootstrapForm() {
    const form = document.getElementById("adminBootstrapForm");
    if (!form) return;
    const hasAdmin = () => LMSStorage.getAllUsers().some(user => user.role === "admin");
    const modeInput = document.getElementById("adminSetupMode");
    const heading = document.getElementById("adminSetupHeading");
    const description = document.getElementById("adminSetupDescription");
    const submit = form.querySelector("[type='submit']");
    const nameWrap = document.getElementById("adminNameWrap");
    const toggle = document.getElementById("adminModeToggle");
    const replaceBtn = document.getElementById("replaceAdminBtn");

    function setMode(mode) {
        modeInput.value = mode;
        const reset = mode === "reset";
        heading.textContent = reset ? "Reset Admin Password" : "Create First Admin";
        description.textContent = reset
            ? "Enter the email already registered to the administrator and choose a new password."
            : "Create the first administrator account for this browser.";
        nameWrap.hidden = reset;
        form.elements.name.required = !reset;
        submit.textContent = reset ? "Reset Admin Password" : "Create Admin Account";
        toggle.textContent = reset ? "Create first admin instead" : "I already have an admin account";
    }
    setMode(hasAdmin() ? "reset" : "create");
    toggle.addEventListener("click", () => setMode(modeInput.value === "create" ? "reset" : "create"));

    if (hasAdmin()) {
        replaceBtn.hidden = false;
        replaceBtn.addEventListener("click", async () => {
            if (!window.confirm("This will remove the existing administrator login on THIS browser and create a new one. Student/instructor accounts and course content will be kept. Continue?")) return;
            const payload = {
                name: form.elements.name.value.trim(),
                email: form.elements.email.value.trim(),
                password: form.elements.password.value
            };
            if (!payload.name || payload.name.length < 2) return showAuthMessage("Enter your full name before replacing the admin.");
            if (payload.password !== form.elements.confirmPassword.value) return showAuthMessage("Passwords do not match.");
            const result = await AuthService.replaceLocalAdmin(payload);
            if (!result.success) return showAuthMessage(result.message);
            sessionStorage.setItem("learnx_registration_notice", "New administrator account created. Please sign in.");
            location.href = "login.html";
        });
    }

    form.addEventListener("submit", async event => {
        event.preventDefault();
        const name = form.elements.name.value.trim();
        const email = form.elements.email.value.trim();
        const password = form.elements.password.value;
        const confirm = form.elements.confirmPassword.value;
        if (password !== confirm) return showAuthMessage("Passwords do not match.");
        let result;
        if (modeInput.value === "reset") {
            result = await AuthService.resetAdminPassword({ email, password });
        } else {
            if (hasAdmin()) return showAuthMessage("An admin already exists. Switch to password reset or use Replace Admin for this local demo.");
            result = await AuthService.bootstrapAdmin({ name, email, password });
        }
        if (!result.success) return showAuthMessage(result.message);
        sessionStorage.setItem("learnx_registration_notice", modeInput.value === "reset"
            ? "Administrator password updated. Please sign in."
            : "Administrator account created. Please sign in.");
        location.href = "login.html";
    });
}
