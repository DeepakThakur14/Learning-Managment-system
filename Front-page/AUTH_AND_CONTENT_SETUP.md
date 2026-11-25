# LearnX – Authentication, startup and content files

## Startup behavior
- `LMS/index.html` redirects to `Front-page/Index.html`.
- `Front-page/Index.html` redirects to `pages/login.html`.
- The former public landing page is retained at `Front-page/home.html`.
- Use Live Server from the `LMS` folder or open `Front-page/Index.html` directly.

## Authentication changes
- Signup fields start empty; browser autofill hints are disabled on the registration form.
- Student and instructor registration validate email, name and password confirmation.
- New passwords require at least 10 characters, uppercase, lowercase, a number and a special character.
- New passwords are stored as PBKDF2-SHA256 hashes with per-user random salts (210,000 iterations) using Web Crypto.
- Five failed attempts for an email trigger a 60-second local lockout.
- Successful registration does not create a login session; it redirects to `pages/login.html` so the user must sign in.
- The old fictional demo student/instructor/admin accounts are removed by a one-time migration. Existing real accounts are preserved; legacy plaintext passwords are hashed the next time those users log in.
- Instructor/student profile collections start empty. Instructor records are created only when a real instructor registers.
- Catalog courses show `Instructor not assigned` until a real instructor is assigned.

## Security limitation
This remains a frontend-only LocalStorage application. PBKDF2 hashing is safer than storing plaintext passwords, but client-side role checks and LocalStorage can be changed by a user. Do not use real passwords or sensitive data. Production authentication requires server-side credential verification, sessions and role authorization. Admin accounts are not self-registerable; provision them through a trusted server/admin setup process.

## Where to edit syllabus and learning material
- `JS/data.js`: 12 course records, modules and syllabus topics.
- `JS/learning-content.js`: shared topic content, 50 assignment templates and five-question topic quiz generator.
- `JS/jquery.js`: dedicated jQuery and AJAX topic notes, examples and topic-specific YouTube search links.
- `JS/apis.js`: dedicated HTTP, XMLHttpRequest, Fetch API, response handling and JSON Server topic notes/examples/video search links.
- `pages/learning.html`: Learning Studio interface and script loading order.

The two video resource files currently link to topic-specific YouTube search result pages, not a verified single video. Replace each `videoUrl` with your selected video URL when you want a fixed video.
