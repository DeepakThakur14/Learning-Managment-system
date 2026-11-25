# LearnX LMS — Repair and Audit Summary

## Active application
The active app is `Front-page/`. The root `index.html` redirects into `Front-page/Index.html`. The folders `LearnX/`, `leaning project/`, and `LMSPROJECT(student-module).html/` are retained from the uploaded archive as older/parallel work areas; they were not merged into the active app.

## What changed
- Authentication no longer creates an account just because an unknown email is entered at login.
- Login verifies the existing account password and selected role.
- Registration supports Student and Instructor only. Admin remains a pre-provisioned demo account.
- First launch no longer automatically logs in the first seeded student.
- Password visibility controls have explicit positioning, click handling, accessible labels, and focus restoration.
- Protected pages check the current session and expected role.
- Removed hardcoded demo-student fallbacks from the main student pages.
- Removed automatic enrollment when a student opens a lesson URL. The student must enroll first.
- A student cannot complete a lesson without an enrollment.
- Removed the artificial 25-minute default for completed lessons. Time is measured as elapsed time in the open lesson page session when the student marks it complete.
- Dashboard seed activity, enrollments, completions, assignments and quizzes are empty so first-time metrics do not pretend to be actual learner actions.
- The catalog is seeded with one `Frontend Web Development` course containing the exact 21 modules and 135 topic entries from the supplied syllabus image.
- The syllabus course is protected from deletion and unrelated additional courses are blocked in the current single-course configuration.
- Added a one-time migration that preserves user accounts but clears old demo course activity and removes the old active session.
- Corrected `Signup.html` link casing and added run instructions/checklists.

## Demo credentials
- Student: `ayush@learnx.edu` / `password123`
- Instructor: `priya.sharma@learnx.edu` / `password123`
- Admin: `admin@learnx.edu` / `password123`

## Data behavior
- Student course count, lesson completion, progress and activity are derived from LocalStorage records and user actions.
- Weekly learning time is recorded from the elapsed time between opening/selecting a lesson and marking it complete. It is a browser-session estimate, not verified video playback analytics.
- LocalStorage is local to one browser profile/device. It cannot synchronize independent users across devices or provide secure production authentication.

## Run
Open `Front-page/Index.html` using VS Code Live Server. See `Front-page/README-RUN.md` for demo credentials and setup details.
