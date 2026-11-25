# LearnX lesson content update

## What is included

- Every syllabus lesson now has a topic-specific study-notes panel.
- Each lesson has a topic-specific YouTube search link and a relevant MDN documentation link.
- Every lesson has a bank of 50 practice assignments (10 task styles × 5 scenario constraints).
- Every lesson has a five-question topic quiz.
- Assignment submissions and quiz attempts are saved in browser LocalStorage under keys scoped by student and lesson.
- The main Assignments page includes a Topic Practice Bank for the student's enrolled courses.

## Content and video transparency

The video button opens YouTube search results for the exact lesson topic and module. It does not claim that a specific video has been reviewed or endorsed, and it does not embed an unverified video. A learner can choose the video that best matches their language and learning level.

The 50 assignments per topic are generated from ten task types (explain, build, compare, debug, apply, test, refactor, document, extend and mini-project), each with five different constraints. They are practice-bank prompts, not individually instructor-authored or automatically graded assignments. Students submit a written explanation or describe their completed files; the current frontend stores this submission locally.

Each topic quiz contains five automatically generated questions based on the topic notes and practice guidance. Quiz attempts are saved locally. This is a frontend-only demonstration: submissions and quiz results do not synchronize across devices and are not sent to an instructor or server.

## Files changed

- `pages/learning.html`
- `pages/assignments.html`
- `JS/learning-content.js` (new)

No course catalog or syllabus records were removed.
