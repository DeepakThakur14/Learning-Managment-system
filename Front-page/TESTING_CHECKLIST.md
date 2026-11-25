# LearnX LMS manual QA checklist

## Course catalog
- [ ] Open `Index.html` using Live Server.
- [ ] Open Courses and verify 12 course cards appear.
- [ ] Verify the catalog reports 12 courses.
- [ ] Search by course title.
- [ ] Search by a topic, e.g. `Semantic HTML`, `Flexbox`, or `Promises`.
- [ ] Test every category filter.
- [ ] Test Beginner, Intermediate, and Advanced filters.
- [ ] Test sorting by popularity, rating, fewest topics, most topics, and title.
- [ ] Open all 12 Details pages and verify each curriculum.
- [ ] Verify ratings say no reviews yet until real reviews exist.
- [ ] Verify enrollment counts start at zero and use actual enrollment records.

## Authentication
- [ ] Student demo login: `ayush@learnx.edu` / `password123`
- [ ] Instructor demo login: `priya.sharma@learnx.edu` / `password123`
- [ ] Admin demo login: `admin@learnx.edu` / `password123`
- [ ] Wrong password is rejected.
- [ ] Unknown email is rejected.
- [ ] Registration accepts student/instructor only.
- [ ] Duplicate email is rejected.
- [ ] Password and confirm-password visibility toggles work.
- [ ] Logout clears the active session.

## Student workflow
- [ ] A new student starts with zero enrollments and zero completed topics.
- [ ] Enroll in one of the 12 courses.
- [ ] Verify My Courses and dashboard enrollment count update.
- [ ] Open a syllabus topic and mark it complete.
- [ ] Completed-topic count and course percentage update.
- [ ] Refresh and confirm progress persists.
- [ ] Confirm other student accounts do not see this student's progress.

## Instructor/Admin workflow
- [ ] Instructor dashboard only opens for instructor accounts.
- [ ] Admin dashboard only opens for admin account.
- [ ] Instructor/admin course category options match the syllabus categories.
- [ ] Verify course and platform statistics after student actions.

## Responsive/UI
- [ ] Check desktop, tablet and mobile layouts.
- [ ] Check browser console on every page.
- [ ] Check navigation, forms, buttons, charts and modals.
