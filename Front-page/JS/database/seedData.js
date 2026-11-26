/**
 * Legacy seed-data module retained for folder compatibility.
 * The active application seed data is defined in ../data.js and contains
 * only the 12 LearnX syllabus-based courses. Do not add a second catalog here.
 */
const SeedDataLegacy = {
    SEED_COURSES: [],
    SEED_ENROLLMENTS: [],
    SEED_LESSON_COMPLETIONS: [],
    SEED_ASSIGNMENTS: [],
    SEED_SUBMISSIONS: [],
    SEED_QUIZZES: [],
    SEED_QUIZ_ATTEMPTS: [],
    SEED_ACTIVITY_LOGS: []
};
if (typeof window !== "undefined") window.SeedDataLegacy = SeedDataLegacy;
if (typeof module !== "undefined" && module.exports) module.exports = SeedDataLegacy;
