# LearnX LMS – Updated Project Guide

## Run the project
1. Extract the ZIP.
2. Open the `LMS` folder in VS Code.
3. Start Live Server from `LMS/index.html` (or open `Front-page/Index.html`).
4. Use the browser URL served by Live Server. Do not open the files with `file://`.

## First-time admin account
1. Open `Front-page/pages/admin-setup.html` using Live Server.
2. Create the first admin account with a strong password (minimum 12 characters, uppercase, lowercase, number and special character).
3. After an admin exists, the setup page refuses to create another first admin.
4. Sign in through `Front-page/pages/login.html` and choose Admin.

## Roles
- Student: student dashboard, enrolled courses, learning content, assignments, quizzes and support issue submission.
- Instructor: instructor dashboard, own course management, assignment/quiz authoring, submissions and support issue submission.
- Admin: user records, account provisioning for students/instructors, course management and support issue resolution.

## Instructor content management
Open Instructor Portal → Assignments & Quizzes (`pages/instructor-content.html`).
- Create assignments against courses assigned to the signed-in instructor.
- Edit or delete the instructor's own assignments.
- Create quizzes by entering a JSON array of questions. Each question uses `id`, `question`, `options`, `correctIndex`, and `explanation`.
- Edit quiz title/description or delete the quiz.

## Admin user records and support
The Admin Dashboard now includes individual user records with enrollment/course counts, assignment submissions, quiz attempts and recent activity. Students and instructors can submit support tickets from their dashboards. Admin can mark issues resolved and create student/instructor accounts.

## Important limitation
This project currently uses browser LocalStorage. Data stays in the same browser profile/device and does not sync across users/devices. Role checks and password hashing in a frontend-only app are not a substitute for server-side authentication/authorization. Do not use real credentials or sensitive personal data. A production deployment needs a backend database, server-side sessions, authorization middleware and secure password storage.

## Validation performed for this update
- Node.js syntax checks passed for all 20 JavaScript files in the active `Front-page/JS` folder.
- Inline scripts in all HTML pages passed Node syntax checks.
- All HTML pages parsed successfully.
- Interactive browser testing still needs to be completed on your computer with Live Server.
