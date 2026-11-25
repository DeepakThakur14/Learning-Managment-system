# LearnX Admin Login Fix

1. Start VS Code Live Server from `LMS/Front-page` (open `Index.html` or `pages/login.html`).
2. On the login page choose **Admin**. The account action below the form changes to **Admin Setup / Reset**.
3. Open it. If an admin account exists, use the registered admin email and create a new password.
4. If you do not know the old admin email, use **Replace local admin**. Confirm carefully: it removes existing admin login records in this browser, while preserving student/instructor accounts and course content.
5. Return to login and sign in with the new admin email/password.

Password requirements: at least 12 characters, including uppercase, lowercase, a number and a special character.

Important: this project uses browser LocalStorage and is a demo, not production authentication. Reset/replacement affects only the current browser profile and origin. Do not use a real or reused password.
