/** LearnX authentication UI, role guards and navigation. */
"use strict";

document.addEventListener("DOMContentLoaded", async () => {
    if (window.LMSStorage) LMSStorage.init();
    if (window.LearnXCloud) {
        try { await LearnXCloud.restoreSession(); } catch (error) { console.warn("[LearnX] Session restore failed:", error); }
    }
    initGlobalMobileNav();
    initNavbarAuth();
    initPasswordToggles();
    initLoginForm();
    initSignupForm();
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
            sessionStorage.setItem("learnx_registration_notice", result.message || "Your account was created successfully. Please sign in.");
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
        : (page === "instructor-dashboard.html" || page === "instructor-courses.html") ? "instructor"
        : ["student-dashboard.html", "assignments.html", "certificate.html", "certificates.html", "learning.html", "my-courses.html", "profile.html", "progress.html"].includes(page) ? "student" : null;
    if (!requiredRole) return;
    const user = LMSStorage.getCurrentUser();
    if (!user) { location.replace("login.html"); return; }
    if (user.role !== requiredRole) location.replace(getRoleDashboard(user.role, true));
}
