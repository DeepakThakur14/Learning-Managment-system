# LearnX LMS - Course Save Fix

## Fixed
- Added the missing Course Level field to the instructor Create/Edit Course form.
- Added the missing Course Level field to the admin Create/Edit Course form.
- Added user-visible error handling for duplicate course titles and other save failures.
- Forwarded the instructor ID through `LMSStorage.addCourse()` so courses created by instructors retain their ownership ID.
- Refreshes the admin course table after a successful create/update.

## Important
The thumbnail field expects a direct image URL, not a YouTube search/results URL. Leave it blank to use the default course banner, or paste a direct `.jpg`, `.png`, or image-host URL.

## Local testing
Open `LMS/Front-page/index.html` using Live Server. Sign in as an instructor and use Manage Courses > Create New Course. Also test Admin Dashboard > Manage Courses > Add Course. New courses are stored in the browser's LocalStorage in this frontend-only build.
