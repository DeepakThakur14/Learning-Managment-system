# Run LearnX LMS (frontend-only)

1. Extract the complete ZIP.
2. Open `LMS/Front-page` in VS Code (open this folder, not the outer `LMS` folder).
3. Open `Index.html` and choose **Open with Live Server**.
4. The course catalog is available from the **Courses** link in the navbar.
5. Use a demo account below or register a new student/instructor.

## Demo accounts
- Student: `ayush@learnx.edu` / `password123`
- Instructor: `priya.sharma@learnx.edu` / `password123`
- Admin: `admin@learnx.edu` / `password123`

## Course catalog
The initial catalog contains 12 courses, grouped from the supplied syllabus. The catalog includes all 21 syllabus modules and 135 trackable topic lessons. The revision/story-based problem-solving and Mid Term Exam topics remain in the Responsive Web Design & Bootstrap course, matching their position in the supplied syllabus.

On first load, the one-time `learnx_course_catalog_migration_v2` migration replaces the previous single-course catalog with the 12 syllabus tracks. It preserves registered accounts. Existing enrollments in the former all-in-one `course-1` are expanded to the 12 new tracks, and completed syllabus lessons are assigned to the correct new course. New users start with no enrollments or progress until they perform those actions.

## Important
This is Option A: a frontend-only demonstration. LocalStorage is limited to the current browser/device and is not secure production authentication. Passwords are not protected like a real backend. Do not use real passwords or sensitive information. External Bootstrap, Bootstrap Icons and image assets require an internet connection.


## Default startup
Open `Index.html` with Live Server to go directly to `pages/login.html`. The previous public landing page is available at `home.html`.
