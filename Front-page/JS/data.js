/**
 * LearnX LMS - Centralized Data Management Engine (Unified Bundle)
 * Course: Frontend Web Development (Single Source of Truth)
 * File: JS/data.js
 */

"use strict";


/* ================= storage.js ================= */
/**
 * LearnX LMS - Centralized Storage & Event Hub
 * File: JS/database/storage.js
 */

"use strict";

const StorageKeys = {
    INITIALIZED: "learnx_initialized_v5",
    USERS: "learnx_users",
    AUTH_USER: "learnx_auth_user",
    COURSES: "learnx_courses",
    INSTRUCTORS: "learnx_instructors",
    STUDENTS: "learnx_students",
    ENROLLMENTS: "learnx_enrollments",
    LESSONS: "learnx_lessons",
    LESSON_COMPLETIONS: "learnx_lesson_completions",
    ASSIGNMENTS: "learnx_assignments",
    SUBMISSIONS: "learnx_submissions",
    QUIZZES: "learnx_quizzes",
    QUIZ_ATTEMPTS: "learnx_quiz_attempts",
    ACTIVITY_LOGS: "learnx_activity_logs",
    NOTIFICATIONS: "learnx_notifications",
    THEME_CONFIG: "learnx_theme_config"
};

const AppStorage = {
    keys: StorageKeys,

    /**
     * Safe retrieval from LocalStorage
     * @param {string} key 
     * @param {*} defaultValue 
     * @returns {*}
     */
    get: function (key, defaultValue = null) {
        try {
            const data = localStorage.getItem(key);
            if (data === null || data === undefined) {
                return defaultValue;
            }
            return JSON.parse(data);
        } catch (error) {
            console.error(`[AppStorage] Error reading key "${key}":`, error);
            return defaultValue;
        }
    },

    /**
     * Safe persistence to LocalStorage
     * @param {string} key 
     * @param {*} value 
     * @param {boolean} notify 
     * @returns {boolean}
     */
    set: function (key, value, notify = true) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            if (notify) {
                this.emit(key, value);
            }
            return true;
        } catch (error) {
            console.error(`[AppStorage] Error saving key "${key}":`, error);
            return false;
        }
    },

    /**
     * Remove key from LocalStorage
     * @param {string} key 
     * @param {boolean} notify 
     */
    remove: function (key, notify = true) {
        try {
            localStorage.removeItem(key);
            if (notify) {
                this.emit(key, null);
            }
            return true;
        } catch (error) {
            console.error(`[AppStorage] Error removing key "${key}":`, error);
            return false;
        }
    },

    /**
     * Check if key exists
     * @param {string} key 
     * @returns {boolean}
     */
    has: function (key) {
        return localStorage.getItem(key) !== null;
    },

    /**
     * Emit custom event across the application
     * @param {string} key 
     * @param {*} data 
     */
    emit: function (key, data) {
        if (typeof window !== "undefined" && typeof window.dispatchEvent === "function") {
            const event = new CustomEvent("learnx:data-changed", {
                detail: {
                    key: key,
                    data: data,
                    timestamp: Date.now()
                }
            });
            window.dispatchEvent(event);
        }
    },

    /**
     * Subscribe to data change events
     * @param {function} callback 
     * @returns {function} unsubscribe function
     */
    onDataChange: function (callback) {
        if (typeof window === "undefined") return () => {};
        
        const handler = (e) => callback(e.detail);
        window.addEventListener("learnx:data-changed", handler);
        
        // Also listen for cross-tab storage events
        const storageHandler = (e) => {
            if (e.key && e.key.startsWith("learnx_")) {
                let parsed = null;
                try { parsed = JSON.parse(e.newValue); } catch (err) {}
                callback({
                    key: e.key,
                    data: parsed,
                    timestamp: Date.now(),
                    crossTab: true
                });
            }
        };
        window.addEventListener("storage", storageHandler);

        return () => {
            window.removeEventListener("learnx:data-changed", handler);
            window.removeEventListener("storage", storageHandler);
        };
    }
};

// Global export
if (typeof window !== "undefined") {
    window.StorageKeys = StorageKeys;
    window.AppStorage = AppStorage;
}
if (typeof module !== "undefined" && module.exports) {
    module.exports = { StorageKeys, AppStorage };
}


/* ================= seedData.js ================= */
/**
 * LearnX LMS - Seed Database (Single Source of Truth)
 * Course: Frontend Web Development (21 Modules + Mid-Term Exam)
 * File: JS/database/seedData.js
 */

"use strict";

const now = Date.now();
const oneDayMs = 24 * 60 * 60 * 1000;

function daysAgo(days, hours = 0) {
    return new Date(now - (days * oneDayMs) - (hours * 3600000)).toISOString();
}

function daysAhead(days) {
    return new Date(now + (days * oneDayMs)).toISOString();
}

const SEED_USERS = [
    {
        id: "stu-1",
        name: "Ayush Sharma",
        email: "ayush@learnx.edu",
        password: "password123",
        role: "student",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80",
        title: "Frontend Engineering Student",
        bio: "Passionate about modern web architecture, CSS Grid, and JavaScript.",
        createdAt: daysAgo(30)
    },
    {
        id: "stu-2",
        name: "Rohan Gupta",
        email: "rohan.gupta@learnx.edu",
        password: "password123",
        role: "student",
        avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=300&q=80",
        title: "Web Development Intern",
        bio: "Enrolled in Frontend Web Development.",
        createdAt: daysAgo(10)
    },
    {
        id: "inst-1",
        name: "Priya Sharma",
        email: "priya.sharma@learnx.edu",
        password: "password123",
        role: "instructor",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
        title: "Senior Web Architect & Lead Educator",
        bio: "Over 12 years of industry experience specializing in modern JavaScript, CSS, and frontend engineering.",
        createdAt: daysAgo(90)
    },
    {
        id: "admin-1",
        name: "System Administrator",
        email: "admin@learnx.edu",
        password: "password123",
        role: "admin",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80",
        title: "LearnX Lead Administrator",
        bio: "Platform operations and curriculum management.",
        createdAt: daysAgo(120)
    }
];

const SEED_INSTRUCTORS = [
    {
        id: "inst-1",
        userId: "inst-1",
        name: "Priya Sharma",
        email: "priya.sharma@learnx.edu",
        role: "instructor",
        title: "Senior Web Architect & Educator",
        bio: "Over 12 years of industry experience in modern frontend web technologies, responsive layouts, and performance.",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
        rating: 4.9,
        reviewsCount: 3840
    }
];

const SEED_STUDENTS = [
    {
        id: "stu-1",
        userId: "stu-1",
        name: "Ayush Sharma",
        email: "ayush@learnx.edu",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80",
        title: "Frontend Engineering Student",
        status: "Active",
        createdAt: daysAgo(30)
    },
    {
        id: "stu-2",
        userId: "stu-2",
        name: "Rohan Gupta",
        email: "rohan.gupta@learnx.edu",
        avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=300&q=80",
        title: "Web Development Intern",
        status: "Active",
        createdAt: daysAgo(10)
    }
];

// Single course matching the strict syllabus: Frontend Web Development
const SEED_COURSES = [
{
    "id": "course-1",
    "title": "Frontend Web Development",
    "slug": "frontend-web-development",
    "category": "Web Development",
    "level": "All Levels",
    "duration": "96 hours",
    "instructorId": "inst-1",
    "instructor": "Priya Sharma",
    "rating": 4.9,
    "reviewsCount": 14850,
    "enrolledCount": 3820,
    "totalLessons": 136,
    "thumbnail": "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
    "description": "The complete, definitive Frontend Web Development masterclass. Master modern web architecture, semantic HTML5, CSS3, Flexbox, CSS Grid, responsive design systems, Bootstrap 5, complete JavaScript from fundamentals to ES6+ features, asynchronous JavaScript, the DOM, OOP, jQuery, AJAX, and RESTful Web APIs.",
    "objectives": [
        "Master web architecture, semantic HTML5, block/inline elements, forms, and iframe security",
        "Design production responsive layouts with CSS3, Box Model, Flexbox, and CSS Grid",
        "Build modern, mobile-first responsive interfaces using Bootstrap 5 components",
        "Write clean, idiomatic JavaScript utilizing ES6+ features, closures, and object-oriented patterns",
        "Manage asynchronous programming using the Event Loop, Callbacks, Promises, and Async/Await",
        "Manipulate the DOM dynamically and engineer high-performance browser event workflows",
        "Work with jQuery, AJAX, the Fetch API, and integrate with external REST API endpoints"
    ],
    "curriculum": [
        {
            "id": "mod-1",
            "title": "MODULE 1: Introduction to Web Development",
            "lessons": [
                {
                    "id": "topic-1-1",
                    "title": "Fundamentals of Web Architecture",
                    "moduleTitle": "MODULE 1: Introduction to Web Development",
                    "duration": "27m",
                    "minutes": 27,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Fundamentals of Web Architecture within MODULE 1: Introduction to Web Development. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-1-2",
                    "title": "Web Development Roles",
                    "moduleTitle": "MODULE 1: Introduction to Web Development",
                    "duration": "34m",
                    "minutes": 34,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Web Development Roles within MODULE 1: Introduction to Web Development. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-1-3",
                    "title": "Setting Up the Environment",
                    "moduleTitle": "MODULE 1: Introduction to Web Development",
                    "duration": "41m",
                    "minutes": 41,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Setting Up the Environment within MODULE 1: Introduction to Web Development. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                }
            ]
        },
        {
            "id": "mod-2",
            "title": "MODULE 2: HTML",
            "lessons": [
                {
                    "id": "topic-2-1",
                    "title": "HTML Basics",
                    "moduleTitle": "MODULE 2: HTML",
                    "duration": "23m",
                    "minutes": 23,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of HTML Basics within MODULE 2: HTML. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-2-2",
                    "title": "HTML Syntax and Documentation",
                    "moduleTitle": "MODULE 2: HTML",
                    "duration": "30m",
                    "minutes": 30,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of HTML Syntax and Documentation within MODULE 2: HTML. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-2-3",
                    "title": "HTML Tags and HTML Elements",
                    "moduleTitle": "MODULE 2: HTML",
                    "duration": "37m",
                    "minutes": 37,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of HTML Tags and HTML Elements within MODULE 2: HTML. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-2-4",
                    "title": "Semantic HTML",
                    "moduleTitle": "MODULE 2: HTML",
                    "duration": "44m",
                    "minutes": 44,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Semantic HTML within MODULE 2: HTML. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                }
            ]
        },
        {
            "id": "mod-3",
            "title": "MODULE 3: HTML Block and Inline Elements",
            "lessons": [
                {
                    "id": "topic-3-1",
                    "title": "Attributes",
                    "moduleTitle": "MODULE 3: HTML Block and Inline Elements",
                    "duration": "26m",
                    "minutes": 26,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Attributes within MODULE 3: HTML Block and Inline Elements. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-3-2",
                    "title": "Headings",
                    "moduleTitle": "MODULE 3: HTML Block and Inline Elements",
                    "duration": "33m",
                    "minutes": 33,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Headings within MODULE 3: HTML Block and Inline Elements. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-3-3",
                    "title": "Paragraph",
                    "moduleTitle": "MODULE 3: HTML Block and Inline Elements",
                    "duration": "40m",
                    "minutes": 40,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Paragraph within MODULE 3: HTML Block and Inline Elements. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-3-4",
                    "title": "Tables",
                    "moduleTitle": "MODULE 3: HTML Block and Inline Elements",
                    "duration": "22m",
                    "minutes": 22,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Tables within MODULE 3: HTML Block and Inline Elements. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-3-5",
                    "title": "Dropdown",
                    "moduleTitle": "MODULE 3: HTML Block and Inline Elements",
                    "duration": "29m",
                    "minutes": 29,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Dropdown within MODULE 3: HTML Block and Inline Elements. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-3-6",
                    "title": "Quotations",
                    "moduleTitle": "MODULE 3: HTML Block and Inline Elements",
                    "duration": "36m",
                    "minutes": 36,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Quotations within MODULE 3: HTML Block and Inline Elements. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-3-7",
                    "title": "Lists",
                    "moduleTitle": "MODULE 3: HTML Block and Inline Elements",
                    "duration": "43m",
                    "minutes": 43,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Lists within MODULE 3: HTML Block and Inline Elements. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-3-8",
                    "title": "Blocks",
                    "moduleTitle": "MODULE 3: HTML Block and Inline Elements",
                    "duration": "25m",
                    "minutes": 25,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Blocks within MODULE 3: HTML Block and Inline Elements. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-3-9",
                    "title": "Layout",
                    "moduleTitle": "MODULE 3: HTML Block and Inline Elements",
                    "duration": "32m",
                    "minutes": 32,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Layout within MODULE 3: HTML Block and Inline Elements. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                }
            ]
        },
        {
            "id": "mod-4",
            "title": "MODULE 4: HTML Iframes",
            "lessons": [
                {
                    "id": "topic-4-1",
                    "title": "Responsive Iframes",
                    "moduleTitle": "MODULE 4: HTML Iframes",
                    "duration": "39m",
                    "minutes": 39,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Responsive Iframes within MODULE 4: HTML Iframes. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-4-2",
                    "title": "Head",
                    "moduleTitle": "MODULE 4: HTML Iframes",
                    "duration": "21m",
                    "minutes": 21,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Head within MODULE 4: HTML Iframes. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-4-3",
                    "title": "Entities and URI Code",
                    "moduleTitle": "MODULE 4: HTML Iframes",
                    "duration": "28m",
                    "minutes": 28,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Entities and URI Code within MODULE 4: HTML Iframes. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-4-4",
                    "title": "Frames",
                    "moduleTitle": "MODULE 4: HTML Iframes",
                    "duration": "35m",
                    "minutes": 35,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Frames within MODULE 4: HTML Iframes. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-4-5",
                    "title": "Charset and Forms",
                    "moduleTitle": "MODULE 4: HTML Iframes",
                    "duration": "42m",
                    "minutes": 42,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Charset and Forms within MODULE 4: HTML Iframes. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-4-6",
                    "title": "Elements",
                    "moduleTitle": "MODULE 4: HTML Iframes",
                    "duration": "24m",
                    "minutes": 24,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Elements within MODULE 4: HTML Iframes. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-4-7",
                    "title": "Securities",
                    "moduleTitle": "MODULE 4: HTML Iframes",
                    "duration": "31m",
                    "minutes": 31,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Securities within MODULE 4: HTML Iframes. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                }
            ]
        },
        {
            "id": "mod-5",
            "title": "MODULE 5: CSS",
            "lessons": [
                {
                    "id": "topic-5-1",
                    "title": "Introduction to CSS",
                    "moduleTitle": "MODULE 5: CSS",
                    "duration": "38m",
                    "minutes": 38,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Introduction to CSS within MODULE 5: CSS. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-5-2",
                    "title": "CSS Syntax",
                    "moduleTitle": "MODULE 5: CSS",
                    "duration": "20m",
                    "minutes": 20,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of CSS Syntax within MODULE 5: CSS. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-5-3",
                    "title": "Types of CSS",
                    "moduleTitle": "MODULE 5: CSS",
                    "duration": "27m",
                    "minutes": 27,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Types of CSS within MODULE 5: CSS. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-5-4",
                    "title": "Adding CSS to HTML",
                    "moduleTitle": "MODULE 5: CSS",
                    "duration": "34m",
                    "minutes": 34,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Adding CSS to HTML within MODULE 5: CSS. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-5-5",
                    "title": "CSS Selectors",
                    "moduleTitle": "MODULE 5: CSS",
                    "duration": "41m",
                    "minutes": 41,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of CSS Selectors within MODULE 5: CSS. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-5-6",
                    "title": "CSS Colors and Backgrounds",
                    "moduleTitle": "MODULE 5: CSS",
                    "duration": "23m",
                    "minutes": 23,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of CSS Colors and Backgrounds within MODULE 5: CSS. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-5-7",
                    "title": "CSS Box Model",
                    "moduleTitle": "MODULE 5: CSS",
                    "duration": "30m",
                    "minutes": 30,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of CSS Box Model within MODULE 5: CSS. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-5-8",
                    "title": "CSS Units",
                    "moduleTitle": "MODULE 5: CSS",
                    "duration": "37m",
                    "minutes": 37,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of CSS Units within MODULE 5: CSS. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-5-9",
                    "title": "CSS Layout Basics",
                    "moduleTitle": "MODULE 5: CSS",
                    "duration": "44m",
                    "minutes": 44,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of CSS Layout Basics within MODULE 5: CSS. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-5-10",
                    "title": "Positioning Elements",
                    "moduleTitle": "MODULE 5: CSS",
                    "duration": "26m",
                    "minutes": 26,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Positioning Elements within MODULE 5: CSS. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-5-11",
                    "title": "Hands-on Practice",
                    "moduleTitle": "MODULE 5: CSS",
                    "duration": "33m",
                    "minutes": 33,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Hands-on Practice within MODULE 5: CSS. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                }
            ]
        },
        {
            "id": "mod-6",
            "title": "MODULE 6: Flexbox and Grid",
            "lessons": [
                {
                    "id": "topic-6-1",
                    "title": "Flexbox Basics",
                    "moduleTitle": "MODULE 6: Flexbox and Grid",
                    "duration": "40m",
                    "minutes": 40,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Flexbox Basics within MODULE 6: Flexbox and Grid. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-6-2",
                    "title": "CSS Grid Basics",
                    "moduleTitle": "MODULE 6: Flexbox and Grid",
                    "duration": "22m",
                    "minutes": 22,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of CSS Grid Basics within MODULE 6: Flexbox and Grid. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-6-3",
                    "title": "CSS Transformations",
                    "moduleTitle": "MODULE 6: Flexbox and Grid",
                    "duration": "29m",
                    "minutes": 29,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of CSS Transformations within MODULE 6: Flexbox and Grid. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-6-4",
                    "title": "CSS Animations",
                    "moduleTitle": "MODULE 6: Flexbox and Grid",
                    "duration": "36m",
                    "minutes": 36,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of CSS Animations within MODULE 6: Flexbox and Grid. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-6-5",
                    "title": "CSS Frameworks",
                    "moduleTitle": "MODULE 6: Flexbox and Grid",
                    "duration": "43m",
                    "minutes": 43,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of CSS Frameworks within MODULE 6: Flexbox and Grid. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                }
            ]
        },
        {
            "id": "mod-7",
            "title": "MODULE 7: CSS Model",
            "lessons": [
                {
                    "id": "topic-7-1",
                    "title": "Borders",
                    "moduleTitle": "MODULE 7: CSS Model",
                    "duration": "25m",
                    "minutes": 25,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Borders within MODULE 7: CSS Model. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-7-2",
                    "title": "Padding",
                    "moduleTitle": "MODULE 7: CSS Model",
                    "duration": "32m",
                    "minutes": 32,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Padding within MODULE 7: CSS Model. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-7-3",
                    "title": "Height and Width",
                    "moduleTitle": "MODULE 7: CSS Model",
                    "duration": "39m",
                    "minutes": 39,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Height and Width within MODULE 7: CSS Model. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-7-4",
                    "title": "Gradients",
                    "moduleTitle": "MODULE 7: CSS Model",
                    "duration": "21m",
                    "minutes": 21,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Gradients within MODULE 7: CSS Model. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-7-5",
                    "title": "Shadows",
                    "moduleTitle": "MODULE 7: CSS Model",
                    "duration": "28m",
                    "minutes": 28,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Shadows within MODULE 7: CSS Model. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-7-6",
                    "title": "Selectors",
                    "moduleTitle": "MODULE 7: CSS Model",
                    "duration": "35m",
                    "minutes": 35,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Selectors within MODULE 7: CSS Model. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-7-7",
                    "title": "Transformations",
                    "moduleTitle": "MODULE 7: CSS Model",
                    "duration": "42m",
                    "minutes": 42,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Transformations within MODULE 7: CSS Model. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-7-8",
                    "title": "Typography",
                    "moduleTitle": "MODULE 7: CSS Model",
                    "duration": "24m",
                    "minutes": 24,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Typography within MODULE 7: CSS Model. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-7-9",
                    "title": "Box Model",
                    "moduleTitle": "MODULE 7: CSS Model",
                    "duration": "31m",
                    "minutes": 31,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Box Model within MODULE 7: CSS Model. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-7-10",
                    "title": "Outline",
                    "moduleTitle": "MODULE 7: CSS Model",
                    "duration": "38m",
                    "minutes": 38,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Outline within MODULE 7: CSS Model. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-7-11",
                    "title": "Transitions",
                    "moduleTitle": "MODULE 7: CSS Model",
                    "duration": "20m",
                    "minutes": 20,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Transitions within MODULE 7: CSS Model. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-7-12",
                    "title": "Navigation Bar",
                    "moduleTitle": "MODULE 7: CSS Model",
                    "duration": "27m",
                    "minutes": 27,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Navigation Bar within MODULE 7: CSS Model. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-7-13",
                    "title": "CSS Combinators",
                    "moduleTitle": "MODULE 7: CSS Model",
                    "duration": "34m",
                    "minutes": 34,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of CSS Combinators within MODULE 7: CSS Model. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-7-14",
                    "title": "CSS",
                    "moduleTitle": "MODULE 7: CSS Model",
                    "duration": "41m",
                    "minutes": 41,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of CSS within MODULE 7: CSS Model. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                }
            ]
        },
        {
            "id": "mod-8",
            "title": "MODULE 8: CSS Classes",
            "lessons": [
                {
                    "id": "topic-8-1",
                    "title": "Pseudo-classes",
                    "moduleTitle": "MODULE 8: CSS Classes",
                    "duration": "23m",
                    "minutes": 23,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Pseudo-classes within MODULE 8: CSS Classes. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-8-2",
                    "title": "Tooltips",
                    "moduleTitle": "MODULE 8: CSS Classes",
                    "duration": "30m",
                    "minutes": 30,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Tooltips within MODULE 8: CSS Classes. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-8-3",
                    "title": "Images",
                    "moduleTitle": "MODULE 8: CSS Classes",
                    "duration": "37m",
                    "minutes": 37,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Images within MODULE 8: CSS Classes. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-8-4",
                    "title": "Selectors",
                    "moduleTitle": "MODULE 8: CSS Classes",
                    "duration": "44m",
                    "minutes": 44,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Selectors within MODULE 8: CSS Classes. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-8-5",
                    "title": "Buttons",
                    "moduleTitle": "MODULE 8: CSS Classes",
                    "duration": "26m",
                    "minutes": 26,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Buttons within MODULE 8: CSS Classes. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-8-6",
                    "title": "Animations",
                    "moduleTitle": "MODULE 8: CSS Classes",
                    "duration": "33m",
                    "minutes": 33,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Animations within MODULE 8: CSS Classes. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-8-7",
                    "title": "User Interface",
                    "moduleTitle": "MODULE 8: CSS Classes",
                    "duration": "40m",
                    "minutes": 40,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of User Interface within MODULE 8: CSS Classes. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-8-8",
                    "title": "Box Sizing",
                    "moduleTitle": "MODULE 8: CSS Classes",
                    "duration": "22m",
                    "minutes": 22,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Box Sizing within MODULE 8: CSS Classes. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                }
            ]
        },
        {
            "id": "mod-9",
            "title": "MODULE 9: Responsive CSS",
            "lessons": [
                {
                    "id": "topic-9-1",
                    "title": "Filters",
                    "moduleTitle": "MODULE 9: Responsive CSS",
                    "duration": "29m",
                    "minutes": 29,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Filters within MODULE 9: Responsive CSS. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-9-2",
                    "title": "Responsive Web Designs",
                    "moduleTitle": "MODULE 9: Responsive CSS",
                    "duration": "36m",
                    "minutes": 36,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Responsive Web Designs within MODULE 9: Responsive CSS. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-9-3",
                    "title": "CSS Media Queries",
                    "moduleTitle": "MODULE 9: Responsive CSS",
                    "duration": "43m",
                    "minutes": 43,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of CSS Media Queries within MODULE 9: Responsive CSS. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-9-4",
                    "title": "Cheat Sheets",
                    "moduleTitle": "MODULE 9: Responsive CSS",
                    "duration": "25m",
                    "minutes": 25,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Cheat Sheets within MODULE 9: Responsive CSS. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                }
            ]
        },
        {
            "id": "mod-10",
            "title": "MODULE 10: Bootstrap",
            "lessons": [
                {
                    "id": "topic-10-1",
                    "title": "Introduction to Bootstrap",
                    "moduleTitle": "MODULE 10: Bootstrap",
                    "duration": "32m",
                    "minutes": 32,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Introduction to Bootstrap within MODULE 10: Bootstrap. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-10-2",
                    "title": "Bootstrap Basics",
                    "moduleTitle": "MODULE 10: Bootstrap",
                    "duration": "39m",
                    "minutes": 39,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Bootstrap Basics within MODULE 10: Bootstrap. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-10-3",
                    "title": "Bootstrap Grids",
                    "moduleTitle": "MODULE 10: Bootstrap",
                    "duration": "21m",
                    "minutes": 21,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Bootstrap Grids within MODULE 10: Bootstrap. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-10-4",
                    "title": "Bootstrap CSS",
                    "moduleTitle": "MODULE 10: Bootstrap",
                    "duration": "28m",
                    "minutes": 28,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Bootstrap CSS within MODULE 10: Bootstrap. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-10-5",
                    "title": "Bootstrap Themes",
                    "moduleTitle": "MODULE 10: Bootstrap",
                    "duration": "35m",
                    "minutes": 35,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Bootstrap Themes within MODULE 10: Bootstrap. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-10-6",
                    "title": "Alert Wells",
                    "moduleTitle": "MODULE 10: Bootstrap",
                    "duration": "42m",
                    "minutes": 42,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Alert Wells within MODULE 10: Bootstrap. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-10-7",
                    "title": "Badge and Label",
                    "moduleTitle": "MODULE 10: Bootstrap",
                    "duration": "24m",
                    "minutes": 24,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Badge and Label within MODULE 10: Bootstrap. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-10-8",
                    "title": "Panels",
                    "moduleTitle": "MODULE 10: Bootstrap",
                    "duration": "31m",
                    "minutes": 31,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Panels within MODULE 10: Bootstrap. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-10-9",
                    "title": "Pagination",
                    "moduleTitle": "MODULE 10: Bootstrap",
                    "duration": "38m",
                    "minutes": 38,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Pagination within MODULE 10: Bootstrap. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-10-10",
                    "title": "Pager",
                    "moduleTitle": "MODULE 10: Bootstrap",
                    "duration": "20m",
                    "minutes": 20,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Pager within MODULE 10: Bootstrap. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-10-11",
                    "title": "Carousel",
                    "moduleTitle": "MODULE 10: Bootstrap",
                    "duration": "27m",
                    "minutes": 27,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Carousel within MODULE 10: Bootstrap. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-10-12",
                    "title": "Progress Bar",
                    "moduleTitle": "MODULE 10: Bootstrap",
                    "duration": "34m",
                    "minutes": 34,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Progress Bar within MODULE 10: Bootstrap. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                }
            ]
        },
        {
            "id": "mod-11",
            "title": "MODULE 11: Revision and Story-Based Problem Solving",
            "lessons": [
                {
                    "id": "topic-11-1",
                    "title": "Revision and Story-Based Problem Solving",
                    "moduleTitle": "MODULE 11: Revision and Story-Based Problem Solving",
                    "duration": "41m",
                    "minutes": 41,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Revision and Story-Based Problem Solving within MODULE 11: Revision and Story-Based Problem Solving. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                }
            ]
        },
        {
            "id": "mod-midterm",
            "title": "MID-TERM EXAM",
            "lessons": [
                {
                    "id": "topic-12-1",
                    "title": "Mid-Term Comprehensive Assessment",
                    "moduleTitle": "MID-TERM EXAM",
                    "duration": "23m",
                    "minutes": 23,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Mid-Term Comprehensive Assessment within MID-TERM EXAM. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                }
            ]
        },
        {
            "id": "mod-12",
            "title": "MODULE 12: JavaScript",
            "lessons": [
                {
                    "id": "topic-13-1",
                    "title": "Introduction to JavaScript",
                    "moduleTitle": "MODULE 12: JavaScript",
                    "duration": "30m",
                    "minutes": 30,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Introduction to JavaScript within MODULE 12: JavaScript. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-13-2",
                    "title": "JavaScript Types",
                    "moduleTitle": "MODULE 12: JavaScript",
                    "duration": "37m",
                    "minutes": 37,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of JavaScript Types within MODULE 12: JavaScript. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-13-3",
                    "title": "Operators",
                    "moduleTitle": "MODULE 12: JavaScript",
                    "duration": "44m",
                    "minutes": 44,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Operators within MODULE 12: JavaScript. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-13-4",
                    "title": "Logical Operators",
                    "moduleTitle": "MODULE 12: JavaScript",
                    "duration": "26m",
                    "minutes": 26,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Logical Operators within MODULE 12: JavaScript. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-13-5",
                    "title": "Math in JavaScript",
                    "moduleTitle": "MODULE 12: JavaScript",
                    "duration": "33m",
                    "minutes": 33,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Math in JavaScript within MODULE 12: JavaScript. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-13-6",
                    "title": "Control Structures",
                    "moduleTitle": "MODULE 12: JavaScript",
                    "duration": "40m",
                    "minutes": 40,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Control Structures within MODULE 12: JavaScript. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                }
            ]
        },
        {
            "id": "mod-13",
            "title": "MODULE 13: JS Operators",
            "lessons": [
                {
                    "id": "topic-14-1",
                    "title": "Scope",
                    "moduleTitle": "MODULE 13: JS Operators",
                    "duration": "22m",
                    "minutes": 22,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Scope within MODULE 13: JS Operators. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-14-2",
                    "title": "Events",
                    "moduleTitle": "MODULE 13: JS Operators",
                    "duration": "29m",
                    "minutes": 29,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Events within MODULE 13: JS Operators. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-14-3",
                    "title": "Strings",
                    "moduleTitle": "MODULE 13: JS Operators",
                    "duration": "36m",
                    "minutes": 36,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Strings within MODULE 13: JS Operators. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-14-4",
                    "title": "Math",
                    "moduleTitle": "MODULE 13: JS Operators",
                    "duration": "43m",
                    "minutes": 43,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Math within MODULE 13: JS Operators. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-14-5",
                    "title": "Arrays",
                    "moduleTitle": "MODULE 13: JS Operators",
                    "duration": "25m",
                    "minutes": 25,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Arrays within MODULE 13: JS Operators. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-14-6",
                    "title": "Boolean",
                    "moduleTitle": "MODULE 13: JS Operators",
                    "duration": "32m",
                    "minutes": 32,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Boolean within MODULE 13: JS Operators. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-14-7",
                    "title": "Comparisons",
                    "moduleTitle": "MODULE 13: JS Operators",
                    "duration": "39m",
                    "minutes": 39,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Comparisons within MODULE 13: JS Operators. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-14-8",
                    "title": "Conditions",
                    "moduleTitle": "MODULE 13: JS Operators",
                    "duration": "21m",
                    "minutes": 21,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Conditions within MODULE 13: JS Operators. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                }
            ]
        },
        {
            "id": "mod-14",
            "title": "MODULE 14: JS ES Features",
            "lessons": [
                {
                    "id": "topic-15-1",
                    "title": "Switch",
                    "moduleTitle": "MODULE 14: JS ES Features",
                    "duration": "28m",
                    "minutes": 28,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Switch within MODULE 14: JS ES Features. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-15-2",
                    "title": "Loops",
                    "moduleTitle": "MODULE 14: JS ES Features",
                    "duration": "35m",
                    "minutes": 35,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Loops within MODULE 14: JS ES Features. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-15-3",
                    "title": "Type Conversion",
                    "moduleTitle": "MODULE 14: JS ES Features",
                    "duration": "42m",
                    "minutes": 42,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Type Conversion within MODULE 14: JS ES Features. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-15-4",
                    "title": "Errors",
                    "moduleTitle": "MODULE 14: JS ES Features",
                    "duration": "24m",
                    "minutes": 24,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Errors within MODULE 14: JS ES Features. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-15-5",
                    "title": "Debugging",
                    "moduleTitle": "MODULE 14: JS ES Features",
                    "duration": "31m",
                    "minutes": 31,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Debugging within MODULE 14: JS ES Features. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-15-6",
                    "title": "Hoisting",
                    "moduleTitle": "MODULE 14: JS ES Features",
                    "duration": "38m",
                    "minutes": 38,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Hoisting within MODULE 14: JS ES Features. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-15-7",
                    "title": "Strict Mode",
                    "moduleTitle": "MODULE 14: JS ES Features",
                    "duration": "20m",
                    "minutes": 20,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Strict Mode within MODULE 14: JS ES Features. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                }
            ]
        },
        {
            "id": "mod-15",
            "title": "MODULE 15: JS Classes",
            "lessons": [
                {
                    "id": "topic-16-1",
                    "title": "Arrays",
                    "moduleTitle": "MODULE 15: JS Classes",
                    "duration": "27m",
                    "minutes": 27,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Arrays within MODULE 15: JS Classes. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-16-2",
                    "title": "Objects and Loops",
                    "moduleTitle": "MODULE 15: JS Classes",
                    "duration": "34m",
                    "minutes": 34,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Objects and Loops within MODULE 15: JS Classes. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-16-3",
                    "title": "Forms",
                    "moduleTitle": "MODULE 15: JS Classes",
                    "duration": "41m",
                    "minutes": 41,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Forms within MODULE 15: JS Classes. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-16-4",
                    "title": "JavaScript RegExp",
                    "moduleTitle": "MODULE 15: JS Classes",
                    "duration": "23m",
                    "minutes": 23,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of JavaScript RegExp within MODULE 15: JS Classes. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                }
            ]
        },
        {
            "id": "mod-16",
            "title": "MODULE 16: JS Functions",
            "lessons": [
                {
                    "id": "topic-17-1",
                    "title": "Functions",
                    "moduleTitle": "MODULE 16: JS Functions",
                    "duration": "30m",
                    "minutes": 30,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Functions within MODULE 16: JS Functions. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-17-2",
                    "title": "Advanced Functions",
                    "moduleTitle": "MODULE 16: JS Functions",
                    "duration": "37m",
                    "minutes": 37,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Advanced Functions within MODULE 16: JS Functions. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-17-3",
                    "title": "Prototypes",
                    "moduleTitle": "MODULE 16: JS Functions",
                    "duration": "44m",
                    "minutes": 44,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Prototypes within MODULE 16: JS Functions. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-17-4",
                    "title": "Constructor Functions",
                    "moduleTitle": "MODULE 16: JS Functions",
                    "duration": "26m",
                    "minutes": 26,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Constructor Functions within MODULE 16: JS Functions. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                }
            ]
        },
        {
            "id": "mod-17",
            "title": "MODULE 17: Async Programming with JavaScript",
            "lessons": [
                {
                    "id": "topic-18-1",
                    "title": "Event Loop",
                    "moduleTitle": "MODULE 17: Async Programming with JavaScript",
                    "duration": "33m",
                    "minutes": 33,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Event Loop within MODULE 17: Async Programming with JavaScript. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-18-2",
                    "title": "Callbacks",
                    "moduleTitle": "MODULE 17: Async Programming with JavaScript",
                    "duration": "40m",
                    "minutes": 40,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Callbacks within MODULE 17: Async Programming with JavaScript. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-18-3",
                    "title": "Promises",
                    "moduleTitle": "MODULE 17: Async Programming with JavaScript",
                    "duration": "22m",
                    "minutes": 22,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Promises within MODULE 17: Async Programming with JavaScript. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-18-4",
                    "title": "Async/Await",
                    "moduleTitle": "MODULE 17: Async Programming with JavaScript",
                    "duration": "29m",
                    "minutes": 29,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Async/Await within MODULE 17: Async Programming with JavaScript. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                }
            ]
        },
        {
            "id": "mod-18",
            "title": "MODULE 18: DOM",
            "lessons": [
                {
                    "id": "topic-19-1",
                    "title": "Introduction to DOM",
                    "moduleTitle": "MODULE 18: DOM",
                    "duration": "36m",
                    "minutes": 36,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Introduction to DOM within MODULE 18: DOM. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-19-2",
                    "title": "Selecting Elements",
                    "moduleTitle": "MODULE 18: DOM",
                    "duration": "43m",
                    "minutes": 43,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Selecting Elements within MODULE 18: DOM. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-19-3",
                    "title": "Events and Event Mechanics",
                    "moduleTitle": "MODULE 18: DOM",
                    "duration": "25m",
                    "minutes": 25,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Events and Event Mechanics within MODULE 18: DOM. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                }
            ]
        },
        {
            "id": "mod-19",
            "title": "MODULE 19: OOPS with JavaScript",
            "lessons": [
                {
                    "id": "topic-20-1",
                    "title": "Advanced Object-Oriented Concepts",
                    "moduleTitle": "MODULE 19: OOPS with JavaScript",
                    "duration": "32m",
                    "minutes": 32,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Advanced Object-Oriented Concepts within MODULE 19: OOPS with JavaScript. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-20-2",
                    "title": "Advanced Array Methods",
                    "moduleTitle": "MODULE 19: OOPS with JavaScript",
                    "duration": "39m",
                    "minutes": 39,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Advanced Array Methods within MODULE 19: OOPS with JavaScript. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-20-3",
                    "title": "Error Handling",
                    "moduleTitle": "MODULE 19: OOPS with JavaScript",
                    "duration": "21m",
                    "minutes": 21,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Error Handling within MODULE 19: OOPS with JavaScript. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                }
            ]
        },
        {
            "id": "mod-20",
            "title": "MODULE 20: jQuery and Ajax",
            "lessons": [
                {
                    "id": "topic-21-1",
                    "title": "Introduction to jQuery",
                    "moduleTitle": "MODULE 20: jQuery and Ajax",
                    "duration": "28m",
                    "minutes": 28,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Introduction to jQuery within MODULE 20: jQuery and Ajax. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-21-2",
                    "title": "jQuery DOM Manipulation",
                    "moduleTitle": "MODULE 20: jQuery and Ajax",
                    "duration": "35m",
                    "minutes": 35,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of jQuery DOM Manipulation within MODULE 20: jQuery and Ajax. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-21-3",
                    "title": "jQuery Syntax",
                    "moduleTitle": "MODULE 20: jQuery and Ajax",
                    "duration": "42m",
                    "minutes": 42,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of jQuery Syntax within MODULE 20: jQuery and Ajax. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-21-4",
                    "title": "jQuery Selectors",
                    "moduleTitle": "MODULE 20: jQuery and Ajax",
                    "duration": "24m",
                    "minutes": 24,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of jQuery Selectors within MODULE 20: jQuery and Ajax. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-21-5",
                    "title": "jQuery Events",
                    "moduleTitle": "MODULE 20: jQuery and Ajax",
                    "duration": "31m",
                    "minutes": 31,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of jQuery Events within MODULE 20: jQuery and Ajax. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-21-6",
                    "title": "jQuery Effects",
                    "moduleTitle": "MODULE 20: jQuery and Ajax",
                    "duration": "38m",
                    "minutes": 38,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of jQuery Effects within MODULE 20: jQuery and Ajax. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-21-7",
                    "title": "jQuery Traversing",
                    "moduleTitle": "MODULE 20: jQuery and Ajax",
                    "duration": "20m",
                    "minutes": 20,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of jQuery Traversing within MODULE 20: jQuery and Ajax. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-21-8",
                    "title": "Event Handling in jQuery",
                    "moduleTitle": "MODULE 20: jQuery and Ajax",
                    "duration": "27m",
                    "minutes": 27,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Event Handling in jQuery within MODULE 20: jQuery and Ajax. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-21-9",
                    "title": "Introduction to AJAX",
                    "moduleTitle": "MODULE 20: jQuery and Ajax",
                    "duration": "34m",
                    "minutes": 34,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Introduction to AJAX within MODULE 20: jQuery and Ajax. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-21-10",
                    "title": "Traditional vs. AJAX Model",
                    "moduleTitle": "MODULE 20: jQuery and Ajax",
                    "duration": "41m",
                    "minutes": 41,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Traditional vs. AJAX Model within MODULE 20: jQuery and Ajax. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-21-11",
                    "title": "jQuery Ajax",
                    "moduleTitle": "MODULE 20: jQuery and Ajax",
                    "duration": "23m",
                    "minutes": 23,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of jQuery Ajax within MODULE 20: jQuery and Ajax. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                }
            ]
        },
        {
            "id": "mod-21",
            "title": "MODULE 21: APIs and Endpoints",
            "lessons": [
                {
                    "id": "topic-22-1",
                    "title": "Making HTTP Requests with JavaScript",
                    "moduleTitle": "MODULE 21: APIs and Endpoints",
                    "duration": "30m",
                    "minutes": 30,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Making HTTP Requests with JavaScript within MODULE 21: APIs and Endpoints. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-22-2",
                    "title": "AJAX with XMLHttpRequest",
                    "moduleTitle": "MODULE 21: APIs and Endpoints",
                    "duration": "37m",
                    "minutes": 37,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of AJAX with XMLHttpRequest within MODULE 21: APIs and Endpoints. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-22-3",
                    "title": "Fetch API",
                    "moduleTitle": "MODULE 21: APIs and Endpoints",
                    "duration": "44m",
                    "minutes": 44,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Fetch API within MODULE 21: APIs and Endpoints. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-22-4",
                    "title": "Using Fetch API",
                    "moduleTitle": "MODULE 21: APIs and Endpoints",
                    "duration": "26m",
                    "minutes": 26,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Using Fetch API within MODULE 21: APIs and Endpoints. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-22-5",
                    "title": "Third-Party Libraries",
                    "moduleTitle": "MODULE 21: APIs and Endpoints",
                    "duration": "33m",
                    "minutes": 33,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Third-Party Libraries within MODULE 21: APIs and Endpoints. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-22-6",
                    "title": "Handling Responses",
                    "moduleTitle": "MODULE 21: APIs and Endpoints",
                    "duration": "40m",
                    "minutes": 40,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of Handling Responses within MODULE 21: APIs and Endpoints. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                },
                {
                    "id": "topic-22-7",
                    "title": "JSON Server",
                    "moduleTitle": "MODULE 21: APIs and Endpoints",
                    "duration": "22m",
                    "minutes": 22,
                    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "summary": "In-depth exploration of JSON Server within MODULE 21: APIs and Endpoints. Master practical syntax, key patterns, industry best practices, and hands-on exercises."
                }
            ]
        }
    ],
    "createdAt": "2026-09-26T11:09:31.408Z"
}
];

// Enrollments
const SEED_ENROLLMENTS = [
    {
        id: "enr-1",
        studentId: "stu-1",
        courseId: "course-1",
        enrolledAt: daysAgo(14),
        status: "active"
    },
    {
        id: "enr-2",
        studentId: "stu-2",
        courseId: "course-1",
        enrolledAt: daysAgo(5),
        status: "active"
    }
];

// Completed Topics for stu-1 (first 10 topics across Modules 1-3)
const SEED_LESSON_COMPLETIONS = [
    { id: "comp-1", studentId: "stu-1", courseId: "course-1", lessonId: "topic-1-1", completedAt: daysAgo(6, 4), timeSpentMinutes: 25 },
    { id: "comp-2", studentId: "stu-1", courseId: "course-1", lessonId: "topic-1-2", completedAt: daysAgo(5, 3), timeSpentMinutes: 30 },
    { id: "comp-3", studentId: "stu-1", courseId: "course-1", lessonId: "topic-1-3", completedAt: daysAgo(5, 1), timeSpentMinutes: 28 },
    { id: "comp-4", studentId: "stu-1", courseId: "course-1", lessonId: "topic-2-1", completedAt: daysAgo(4, 5), timeSpentMinutes: 35 },
    { id: "comp-5", studentId: "stu-1", courseId: "course-1", lessonId: "topic-2-2", completedAt: daysAgo(3, 2), timeSpentMinutes: 24 },
    { id: "comp-6", studentId: "stu-1", courseId: "course-1", lessonId: "topic-2-3", completedAt: daysAgo(3, 1), timeSpentMinutes: 32 },
    { id: "comp-7", studentId: "stu-1", courseId: "course-1", lessonId: "topic-2-4", completedAt: daysAgo(2, 6), timeSpentMinutes: 40 },
    { id: "comp-8", studentId: "stu-1", courseId: "course-1", lessonId: "topic-3-1", completedAt: daysAgo(2, 2), timeSpentMinutes: 22 },
    { id: "comp-9", studentId: "stu-1", courseId: "course-1", lessonId: "topic-3-2", completedAt: daysAgo(1, 4), timeSpentMinutes: 20 },
    { id: "comp-10", studentId: "stu-1", courseId: "course-1", lessonId: "topic-3-3", completedAt: daysAgo(0, 3), timeSpentMinutes: 26 }
];

// Assignments based exclusively on syllabus modules
const SEED_ASSIGNMENTS = [
    {
        id: "asg-1",
        courseId: "course-1",
        instructorId: "inst-1",
        title: "Semantic HTML5 Structure & Table Design",
        courseTitle: "Frontend Web Development",
        module: "MODULE 1, 2, 3, 4",
        dueDate: daysAhead(4).slice(0, 10),
        points: 100,
        description: "Build an accessible multi-section web document using semantic HTML5 elements (<header>, <nav>, <main>, <article>), interactive tables, forms with input validation, dropdowns, and responsive iframe embeds.",
        createdAt: daysAgo(10)
    },
    {
        id: "asg-2",
        courseId: "course-1",
        instructorId: "inst-1",
        title: "Modern CSS3 Box Model & Visual Styling",
        courseTitle: "Frontend Web Development",
        module: "MODULE 5, 7, 8",
        dueDate: daysAhead(8).slice(0, 10),
        points: 100,
        description: "Implement a modern styling system utilizing the CSS Box Model, custom borders, padding, linear gradients, box-shadows, pseudo-classes (:hover, :focus), buttons, and typography.",
        createdAt: daysAgo(8)
    },
    {
        id: "asg-3",
        courseId: "course-1",
        instructorId: "inst-1",
        title: "Responsive Web Layouts with Flexbox & CSS Grid",
        courseTitle: "Frontend Web Development",
        module: "MODULE 6 & 9",
        dueDate: daysAhead(12).slice(0, 10),
        points: 120,
        description: "Develop a mobile-first responsive landing page utilizing Flexbox for navigation, CSS Grid for two-dimensional content structures, CSS transitions, and media queries across breakpoints.",
        createdAt: daysAgo(7)
    },
    {
        id: "asg-4",
        courseId: "course-1",
        instructorId: "inst-1",
        title: "Bootstrap 5 Component System & Grid Architecture",
        courseTitle: "Frontend Web Development",
        module: "MODULE 10",
        dueDate: daysAhead(16).slice(0, 10),
        points: 100,
        description: "Build a responsive web application dashboard using Bootstrap 5 12-column grid system, alert wells, badges, progress bars, pagination, and carousel components.",
        createdAt: daysAgo(5)
    },
    {
        id: "asg-5",
        courseId: "course-1",
        instructorId: "inst-1",
        title: "Mid-Term Comprehensive Story-Based Problem Solving",
        courseTitle: "Frontend Web Development",
        module: "MODULE 11 & MID-TERM EXAM",
        dueDate: daysAhead(20).slice(0, 10),
        points: 150,
        description: "Solve the story-based frontend engineering scenario by integrating semantic HTML, advanced CSS animations, and responsive Bootstrap components into an interactive user experience.",
        createdAt: daysAgo(4)
    },
    {
        id: "asg-6",
        courseId: "course-1",
        instructorId: "inst-1",
        title: "JavaScript Core Programming & Control Flow",
        courseTitle: "Frontend Web Development",
        module: "MODULE 12, 13, 14, 15",
        dueDate: daysAhead(25).slice(0, 10),
        points: 120,
        description: "Write modular JavaScript scripts demonstrating control structures, ES6+ features, scope, operators, array transformations, objects, and form validation with regular expressions.",
        createdAt: daysAgo(3)
    },
    {
        id: "asg-7",
        courseId: "course-1",
        instructorId: "inst-1",
        title: "Interactive DOM Manipulation & Browser Event Mechanics",
        courseTitle: "Frontend Web Development",
        module: "MODULE 16, 18, 19",
        dueDate: daysAhead(30).slice(0, 10),
        points: 130,
        description: "Create an interactive task manager and live filter using DOM query selectors, event delegation, constructor functions, OOP patterns, and defensive error handling.",
        createdAt: daysAgo(2)
    },
    {
        id: "asg-8",
        courseId: "course-1",
        instructorId: "inst-1",
        title: "Asynchronous JavaScript, jQuery, AJAX & REST Endpoints",
        courseTitle: "Frontend Web Development",
        module: "MODULE 17, 20, 21",
        dueDate: daysAhead(35).slice(0, 10),
        points: 150,
        description: "Implement asynchronous data fetching using Promises, Async/Await, the Fetch API, and jQuery AJAX to communicate with a REST API endpoint and handle JSON responses.",
        createdAt: daysAgo(1)
    }
];

// Submissions: stu-1 has submitted asg-1 (Graded)
const SEED_SUBMISSIONS = [
    {
        id: "sub-1",
        assignmentId: "asg-1",
        studentId: "stu-1",
        courseId: "course-1",
        fileName: "semantic_html_structure_solution.zip",
        comments: "Implemented clean semantic HTML5 layout with accessible table headers and validated forms.",
        submittedAt: daysAgo(2),
        status: "Graded",
        grade: "95/100",
        feedback: "Outstanding semantic markup, well-structured table tags, and responsive iframe integration. Excellent work!"
    }
];

// Quizzes based strictly on syllabus modules
const SEED_QUIZZES = [
    {
        id: "quiz-1",
        courseId: "course-1",
        title: "HTML Architecture, Semantic Elements & Forms Quiz",
        description: "Test your mastery of Web Architecture, HTML syntax, semantic tags, tables, block/inline elements, and iframes.",
        passingScore: 70,
        questions: [
            {
                id: "q1-1",
                question: "Which HTML5 semantic element represents the primary content unique to the document?",
                options: ["<section>", "<article>", "<main>", "<div>"],
                correctIndex: 2,
                explanation: "<main> designates the central, non-repeated content of the <body>."
            },
            {
                id: "q1-2",
                question: "What is the difference between block-level and inline elements in HTML?",
                options: [
                    "Block elements start on a new line and take full width; inline elements only take as much width as necessary",
                    "Block elements can only contain text; inline elements can contain anything",
                    "Inline elements start on a new line; block elements do not",
                    "There is no difference in modern HTML5"
                ],
                correctIndex: 0,
                explanation: "Block elements generate a line break and expand to the container width, while inline elements flow alongside text."
            },
            {
                id: "q1-3",
                question: "Which attribute ensures an <iframe> cannot run malicious scripts from untrusted sources?",
                options: ["secure", "sandbox", "csp", "restricted"],
                correctIndex: 1,
                explanation: "The 'sandbox' attribute enforces security restrictions on the iframe content."
            }
        ]
    },
    {
        id: "quiz-2",
        courseId: "course-1",
        title: "CSS3 Box Model, Styling & Selectors Quiz",
        description: "Evaluate your understanding of CSS syntax, selectors, the Box Model, borders, gradients, and pseudo-classes.",
        passingScore: 70,
        questions: [
            {
                id: "q2-1",
                question: "When 'box-sizing: border-box' is applied to an element, what is included in the specified width?",
                options: [
                    "Content only",
                    "Content and margin",
                    "Content, padding, and border",
                    "Content, padding, border, and margin"
                ],
                correctIndex: 2,
                explanation: "Border-box calculates width and height including padding and border, preventing layout overflow."
            },
            {
                id: "q2-2",
                question: "Which CSS pseudo-class styles an interactive button when the user hovers their cursor over it?",
                options: [":active", ":hover", ":focus", ":target"],
                correctIndex: 1,
                explanation: ":hover applies when the pointer is positioned over the element."
            }
        ]
    },
    {
        id: "quiz-3",
        courseId: "course-1",
        title: "Flexbox, CSS Grid & Responsive Design Quiz",
        description: "Assess your skills with Flexbox axes, CSS Grid 2D layout systems, and media query breakpoints.",
        passingScore: 70,
        questions: [
            {
                id: "q3-1",
                question: "Which CSS property aligns Flexbox items along the cross axis?",
                options: ["justify-content", "align-items", "flex-direction", "align-content"],
                correctIndex: 1,
                explanation: "align-items aligns items along the cross axis, while justify-content aligns along the main axis."
            },
            {
                id: "q3-2",
                question: "What makes CSS Grid distinct from Flexbox?",
                options: [
                    "Grid is strictly one-dimensional, whereas Flexbox is two-dimensional",
                    "Grid handles two-dimensional layouts (rows and columns simultaneously), whereas Flexbox is primarily one-dimensional",
                    "Grid cannot be used with media queries",
                    "Flexbox is only supported on mobile devices"
                ],
                correctIndex: 1,
                explanation: "CSS Grid is a 2D layout engine for simultaneous row and column track sizing."
            }
        ]
    },
    {
        id: "quiz-4",
        courseId: "course-1",
        title: "Bootstrap 5 Components & Utilities Quiz",
        description: "Test your knowledge of the Bootstrap 12-column grid, alerts, progress bars, and navigation components.",
        passingScore: 70,
        questions: [
            {
                id: "q4-1",
                question: "How many columns are there in the standard Bootstrap responsive grid system?",
                options: ["10", "12", "16", "24"],
                correctIndex: 1,
                explanation: "Bootstrap uses a 12-column responsive layout grid."
            }
        ]
    },
    {
        id: "quiz-5",
        courseId: "course-1",
        title: "JavaScript Fundamentals, Scope & ES6+ Quiz",
        description: "Evaluate your knowledge of JavaScript types, operators, scope, let/const, arrow functions, and loops.",
        passingScore: 70,
        questions: [
            {
                id: "q5-1",
                question: "What is the key difference between 'let' and 'var' in modern JavaScript?",
                options: [
                    "let has block scope, while var has function scope",
                    "var cannot be reassigned, while let can",
                    "let is global only, while var is local",
                    "There is no difference"
                ],
                correctIndex: 0,
                explanation: "let is block-scoped ({ ... }), whereas var is function-scoped and hoisted with undefined."
            }
        ]
    },
    {
        id: "quiz-6",
        courseId: "course-1",
        title: "Async Programming, DOM, jQuery & Web APIs Quiz",
        description: "Test your understanding of the Event Loop, Promises, Async/Await, DOM manipulation, jQuery, and the Fetch API.",
        passingScore: 70,
        questions: [
            {
                id: "q6-1",
                question: "What JavaScript mechanism handles asynchronous non-blocking I/O using microtasks and macrotasks?",
                options: ["Event Loop", "Garbage Collector", "Call Stack", "Prototype Chain"],
                correctIndex: 0,
                explanation: "The Event Loop continuously checks the microtask and macrotask queues to execute callbacks."
            },
            {
                id: "q6-2",
                question: "Which modern Web API is used to perform asynchronous HTTP requests with Promise-based responses?",
                options: ["XMLHttpRequest", "Fetch API", "WebSocket", "DOMParser"],
                correctIndex: 1,
                explanation: "The Fetch API provides a modern, Promise-based interface for making HTTP requests."
            }
        ]
    }
];

const SEED_QUIZ_ATTEMPTS = [
    {
        id: "att-1",
        quizId: "quiz-1",
        studentId: "stu-1",
        score: 100,
        passed: true,
        attemptedAt: daysAgo(2)
    }
];

const SEED_ACTIVITY_LOGS = [
    { id: "act-1", userId: "stu-1", role: "student", action: "topic_completed", details: "Completed topic: Fundamentals of Web Architecture", timestamp: daysAgo(6, 4) },
    { id: "act-2", userId: "stu-1", role: "student", action: "topic_completed", details: "Completed topic: Web Development Roles", timestamp: daysAgo(5, 3) },
    { id: "act-3", userId: "stu-1", role: "student", action: "topic_completed", details: "Completed topic: Setting Up the Environment", timestamp: daysAgo(5, 1) },
    { id: "act-4", userId: "stu-1", role: "student", action: "assignment_submitted", details: "Submitted assignment: Semantic HTML5 Structure & Table Design", timestamp: daysAgo(2) },
    { id: "act-5", userId: "stu-1", role: "student", action: "quiz_completed", details: "Scored 100% on HTML Architecture, Semantic Elements & Forms Quiz", timestamp: daysAgo(2) }
];

const SeedData = {
    SEED_USERS,
    SEED_INSTRUCTORS,
    SEED_STUDENTS,
    SEED_COURSES,
    SEED_ENROLLMENTS,
    SEED_LESSON_COMPLETIONS,
    SEED_ASSIGNMENTS,
    SEED_SUBMISSIONS,
    SEED_QUIZZES,
    SEED_QUIZ_ATTEMPTS,
    SEED_ACTIVITY_LOGS
};

if (typeof window !== "undefined") {
    window.SeedData = SeedData;
}
if (typeof module !== "undefined" && module.exports) {
    module.exports = SeedData;
}


/* ================= db.js ================= */
/**
 * LearnX LMS - Central Database Engine
 * File: JS/database/db.js
 */

"use strict";

const AppDB = {
    /**
     * Initialize database if first time
     */
    init: function () {
        if (!AppStorage.has(StorageKeys.INITIALIZED)) {
            console.log("[AppDB] First launch detected. Initializing database with seed data...");

            AppStorage.set(StorageKeys.USERS, SeedData.SEED_USERS, false);
            AppStorage.set(StorageKeys.INSTRUCTORS, SeedData.SEED_INSTRUCTORS, false);
            AppStorage.set(StorageKeys.STUDENTS, SeedData.SEED_STUDENTS, false);
            AppStorage.set(StorageKeys.COURSES, SeedData.SEED_COURSES, false);
            AppStorage.set(StorageKeys.ENROLLMENTS, SeedData.SEED_ENROLLMENTS, false);
            AppStorage.set(StorageKeys.LESSON_COMPLETIONS, SeedData.SEED_LESSON_COMPLETIONS, false);
            AppStorage.set(StorageKeys.ASSIGNMENTS, SeedData.SEED_ASSIGNMENTS, false);
            AppStorage.set(StorageKeys.SUBMISSIONS, SeedData.SEED_SUBMISSIONS, false);
            AppStorage.set(StorageKeys.QUIZZES, SeedData.SEED_QUIZZES, false);
            AppStorage.set(StorageKeys.QUIZ_ATTEMPTS, SeedData.SEED_QUIZ_ATTEMPTS, false);
            AppStorage.set(StorageKeys.ACTIVITY_LOGS, SeedData.SEED_ACTIVITY_LOGS, false);

            AppStorage.set(StorageKeys.INITIALIZED, "true", true);
            console.log("[AppDB] Database initialization complete.");
        }
    },

    /**
     * Reset database back to initial seed data
     */
    reset: function () {
        localStorage.clear();
        this.init();
        AppStorage.emit("database_reset", { timestamp: Date.now() });
    },

    /**
     * Retrieve all items in a table
     * @param {string} tableKey 
     * @returns {Array}
     */
    findAll: function (tableKey) {
        return AppStorage.get(tableKey, []);
    },

    /**
     * Find item by unique ID
     * @param {string} tableKey 
     * @param {string} id 
     * @returns {Object|null}
     */
    findById: function (tableKey, id) {
        const items = this.findAll(tableKey);
        return items.find(item => item.id === id) || null;
    },

    /**
     * Find items matching a filter function
     * @param {string} tableKey 
     * @param {function} predicate 
     * @returns {Array}
     */
    findBy: function (tableKey, predicate) {
        const items = this.findAll(tableKey);
        return items.filter(predicate);
    },

    /**
     * Insert a new record into table
     * @param {string} tableKey 
     * @param {Object} item 
     * @returns {Object}
     */
    insert: function (tableKey, item) {
        const items = this.findAll(tableKey);
        if (!item.id) {
            item.id = "id-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
        }
        if (!item.createdAt) {
            item.createdAt = new Date().toISOString();
        }
        items.push(item);
        AppStorage.set(tableKey, items);
        return item;
    },

    /**
     * Update an existing record in table
     * @param {string} tableKey 
     * @param {string} id 
     * @param {Object} updates 
     * @returns {Object|null}
     */
    update: function (tableKey, id, updates) {
        const items = this.findAll(tableKey);
        const index = items.findIndex(item => item.id === id);
        if (index === -1) {
            console.warn(`[AppDB] Update failed: record "${id}" not found in table "${tableKey}".`);
            return null;
        }
        items[index] = { ...items[index], ...updates, updatedAt: new Date().toISOString() };
        AppStorage.set(tableKey, items);
        return items[index];
    },

    /**
     * Delete a record by ID
     * @param {string} tableKey 
     * @param {string} id 
     * @returns {boolean}
     */
    delete: function (tableKey, id) {
        const items = this.findAll(tableKey);
        const filtered = items.filter(item => item.id !== id);
        if (filtered.length !== items.length) {
            AppStorage.set(tableKey, filtered);
            return true;
        }
        return false;
    },

    /**
     * Log user or system activity
     * @param {string} userId 
     * @param {string} userRole 
     * @param {string} action 
     * @param {string} details 
     * @returns {Object}
     */
    logActivity: function (userId, userRole, action, details) {
        const log = {
            id: "act-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
            userId: userId,
            userRole: userRole,
            action: action,
            details: details,
            timestamp: new Date().toISOString()
        };
        const logs = this.findAll(StorageKeys.ACTIVITY_LOGS);
        logs.unshift(log); // prepend to top
        // Keep last 100 logs
        if (logs.length > 100) logs.pop();
        AppStorage.set(StorageKeys.ACTIVITY_LOGS, logs);
        return log;
    }
};

// Global export
if (typeof window !== "undefined") {
    window.AppDB = AppDB;
}
if (typeof module !== "undefined" && module.exports) {
    module.exports = { AppDB };
}


/* ================= authService.js ================= */
/**
 * LearnX LMS - Authentication Service
 * File: JS/services/authService.js
 */

"use strict";

const AuthService = {
    /**
     * Get active logged-in user
     * @returns {Object|null}
     */
    getCurrentUser: function () {
        if (typeof AppStorage !== "undefined") {
            return AppStorage.get(StorageKeys.AUTH_USER, null);
        }
        try {
            return JSON.parse(localStorage.getItem("learnx_auth_user"));
        } catch (e) {
            return null;
        }
    },

    /**
     * Set active user session
     * @param {Object} user 
     */
    setCurrentUser: function (user) {
        if (typeof AppStorage !== "undefined") {
            AppStorage.set(StorageKeys.AUTH_USER, user);
        } else {
            localStorage.setItem("learnx_auth_user", JSON.stringify(user));
        }
    },

    /**
     * Check if user is authenticated
     * @returns {boolean}
     */
    isAuthenticated: function () {
        return this.getCurrentUser() !== null;
    },

    /**
     * Log out current user
     */
    logout: function () {
        const user = this.getCurrentUser();
        if (user && typeof AppDB !== "undefined") {
            AppDB.logActivity(user.id, user.role, "logout", "Logged out of platform");
        }
        if (typeof AppStorage !== "undefined") {
            AppStorage.remove(StorageKeys.AUTH_USER);
        } else {
            localStorage.removeItem("learnx_auth_user");
        }
    },

    /**
     * Authenticate user with credentials
     * @param {string} email 
     * @param {string} password 
     * @param {string} role 
     * @returns {Promise<{success: boolean, user?: Object, message?: string}>}
     */
    login: async function (email, password, role = "student") {
        email = (email || "").trim().toLowerCase();
        if (!email || !password) {
            return { success: false, message: "Please provide both email and password." };
        }

        const users = typeof AppDB !== "undefined"
            ? AppDB.findAll(StorageKeys.USERS)
            : JSON.parse(localStorage.getItem("learnx_users") || "[]");

        let user = users.find(u => u.email.toLowerCase() === email);

        // Check if demo credentials alias used (e.g. student@learnx.edu or instructor@learnx.edu)
        if (!user) {
            if (email === "student@learnx.edu") {
                user = users.find(u => u.id === "stu-1");
            } else if (email === "instructor@learnx.edu") {
                user = users.find(u => u.id === "inst-1");
            } else if (email === "admin@learnx.edu") {
                user = users.find(u => u.id === "admin-1");
            }
        }

        if (user) {
            if (role && user.role !== role) {
                return { success: false, message: `Account exists but role is ${user.role}, not ${role}.` };
            }
            if (user.password && user.password !== password) {
                return { success: false, message: "Invalid password. Try 'password123'." };
            }
        } else {
            // Register user dynamically for demo flexibility
            const nameFromEmail = email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, l => l.toUpperCase());
            user = {
                id: (role === "admin" ? "admin-" : (role === "instructor" ? "inst-" : "stu-")) + Date.now().toString().slice(-4),
                name: nameFromEmail || "LearnX User",
                email: email,
                password: password,
                role: role,
                avatar: role === "instructor"
                    ? "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80"
                    : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80",
                title: role === "instructor" ? "Educator" : "Student",
                createdAt: new Date().toISOString()
            };
            if (typeof AppDB !== "undefined") {
                AppDB.insert(StorageKeys.USERS, user);
                if (role === "student") {
                    AppDB.insert(StorageKeys.STUDENTS, {
                        id: user.id,
                        userId: user.id,
                        name: user.name,
                        email: user.email,
                        avatar: user.avatar,
                        status: "Active",
                        createdAt: user.createdAt
                    });
                }
            }
        }

        this.setCurrentUser(user);
        if (typeof AppDB !== "undefined") {
            AppDB.logActivity(user.id, user.role, "login", `Logged in as ${user.role}`);
        }
        return { success: true, user: user };
    },

    /**
     * Register a new user
     * @param {Object} data 
     * @returns {Promise<{success: boolean, user?: Object, message?: string}>}
     */
    register: async function (data) {
        const name = (data.name || "").trim();
        const email = (data.email || "").trim().toLowerCase();
        const password = data.password || "";
        const role = data.role || "student";

        if (!name || !email || !password) {
            return { success: false, message: "Please fill in all required fields." };
        }

        const users = typeof AppDB !== "undefined"
            ? AppDB.findAll(StorageKeys.USERS)
            : JSON.parse(localStorage.getItem("learnx_users") || "[]");

        if (users.some(u => u.email.toLowerCase() === email)) {
            return { success: false, message: "An account with this email already exists." };
        }

        const newUser = {
            id: (role === "admin" ? "admin-" : (role === "instructor" ? "inst-" : "stu-")) + Date.now().toString().slice(-4),
            name: name,
            email: email,
            password: password,
            role: role,
            avatar: role === "instructor"
                ? "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80"
                : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80",
            title: role === "instructor" ? "Course Instructor" : "Enrolled Student",
            createdAt: new Date().toISOString()
        };

        if (typeof AppDB !== "undefined") {
            AppDB.insert(StorageKeys.USERS, newUser);
            if (role === "student") {
                AppDB.insert(StorageKeys.STUDENTS, {
                    id: newUser.id,
                    userId: newUser.id,
                    name: newUser.name,
                    email: newUser.email,
                    avatar: newUser.avatar,
                    status: "Active",
                    createdAt: newUser.createdAt
                });
            } else if (role === "instructor") {
                AppDB.insert(StorageKeys.INSTRUCTORS, {
                    id: newUser.id,
                    userId: newUser.id,
                    name: newUser.name,
                    email: newUser.email,
                    title: "Educator",
                    bio: "Experienced instructor at LearnX.",
                    avatar: newUser.avatar,
                    rating: 5.0,
                    reviewsCount: 0
                });
            }
            AppDB.logActivity(newUser.id, newUser.role, "registered", `Created new ${newUser.role} account`);
        }

        return { success: true, user: newUser };
    },

    /**
     * Bootstrap platform admin
     */
    bootstrapAdmin: async function (data) {
        return this.register({ ...data, role: "admin" });
    },

    /**
     * Reset admin password
     */
    resetAdminPassword: async function (data) {
        const users = typeof AppDB !== "undefined"
            ? AppDB.findAll(StorageKeys.USERS)
            : [];
        const admin = users.find(u => u.email.toLowerCase() === data.email.toLowerCase() && u.role === "admin");
        if (!admin) return { success: false, message: "Admin account not found." };
        if (typeof AppDB !== "undefined") {
            AppDB.update(StorageKeys.USERS, admin.id, { password: data.password });
        }
        return { success: true };
    },

    /**
     * Replace local administrator
     */
    replaceLocalAdmin: async function (data) {
        if (typeof AppDB !== "undefined") {
            const users = AppDB.findAll(StorageKeys.USERS);
            const oldAdmins = users.filter(u => u.role === "admin");
            oldAdmins.forEach(a => AppDB.delete(StorageKeys.USERS, a.id));
        }
        return this.register({ ...data, role: "admin" });
    }
};

// Global export
if (typeof window !== "undefined") {
    window.AuthService = AuthService;
}
if (typeof module !== "undefined" && module.exports) {
    module.exports = { AuthService };
}


/* ================= courseService.js ================= */
/**
 * LearnX LMS - Course Service
 * File: JS/services/courseService.js
 */

"use strict";

const CourseService = {
    /**
     * Get all courses in database
     * @returns {Array}
     */
    getAllCourses: function () {
        return AppDB.findAll(StorageKeys.COURSES);
    },

    /**
     * Get course by ID
     * @param {string} id 
     * @returns {Object|null}
     */
    getCourseById: function (id) {
        return AppDB.findById(StorageKeys.COURSES, id);
    },

    /**
     * Get courses by category
     * @param {string} category 
     * @returns {Array}
     */
    getCoursesByCategory: function (category) {
        if (!category || category === "all") return this.getAllCourses();
        return AppDB.findBy(StorageKeys.COURSES, c => c.category.toLowerCase() === category.toLowerCase());
    },

    /**
     * Search courses by title, category, or instructor
     * @param {string} query 
     * @returns {Array}
     */
    searchCourses: function (query) {
        query = (query || "").trim().toLowerCase();
        if (!query) return this.getAllCourses();
        return AppDB.findBy(StorageKeys.COURSES, c =>
            c.title.toLowerCase().includes(query) ||
            c.category.toLowerCase().includes(query) ||
            c.instructor.toLowerCase().includes(query) ||
            (c.description && c.description.toLowerCase().includes(query))
        );
    },

    /**
     * Get courses created by a specific instructor
     * @param {string} instructorIdOrName 
     * @returns {Array}
     */
    getCoursesByInstructor: function (instructorIdOrName) {
        if (!instructorIdOrName) return [];
        return AppDB.findBy(StorageKeys.COURSES, c =>
            c.instructorId === instructorIdOrName ||
            (c.instructor && c.instructor.toLowerCase() === instructorIdOrName.toLowerCase())
        );
    },

    /**
     * Add a new course
     * @param {Object} courseData 
     * @param {string} instructorId 
     * @returns {Object}
     */
    createCourse: function (courseData, instructorId) {
        const courses = this.getAllCourses();
        if (!courseData || !courseData.title || !courseData.title.trim()) {
            throw new Error("Course title is required.");
        }
        const normalizedTitle = courseData.title.trim().toLowerCase();
        if (courses.some(course => (course.title || "").trim().toLowerCase() === normalizedTitle)) {
            throw new Error("A course with this title already exists.");
        }
        const newId = "course-custom-" + Date.now().toString(36);
        
        let instructorName = courseData.instructor || "Instructor not assigned";
        let instId = instructorId || courseData.instructorId || "";

        const newCourse = {
            id: newId,
            title: courseData.title.trim(),
            slug: courseData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
            category: courseData.category || "Web Development",
            level: courseData.level || "Beginner",
            duration: courseData.duration || "20 hours",
            rating: 0,
            reviewsCount: 0,
            enrolledCount: 0,
            badge: "New",
            instructorId: instId,
            instructor: instructorName,
            thumbnail: courseData.thumbnail || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80",
            description: courseData.description || "Master core concepts through interactive lectures.",
            objectives: courseData.objectives || [
                "Understand fundamental theory and best practices",
                "Apply modern practical approaches and design patterns",
                "Build realistic capstone projects"
            ],
            curriculum: courseData.curriculum || [
                {
                    id: "mod-" + newId + "-1",
                    title: "Module 1: Introduction & Fundamentals",
                    lessons: [
                        {
                            id: newId + "-l1",
                            title: "1. Core Overview & Setup",
                            duration: "20m",
                            minutes: 20,
                            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
                            summary: "Foundational concepts and practical setup."
                        }
                    ]
                }
            ],
            createdAt: new Date().toISOString()
        };

        newCourse.totalLessons = (newCourse.curriculum || []).reduce((total, module) => total + ((module.lessons || []).length), 0);
        AppDB.insert(StorageKeys.COURSES, newCourse);
        AppDB.logActivity(instId, "instructor", "course_created", `Created course: ${newCourse.title}`);
        return newCourse;
    },

    /**
     * Update an existing course
     * @param {string} id 
     * @param {Object} updates 
     * @returns {Object|null}
     */
    updateCourse: function (id, updates) {
        const updated = AppDB.update(StorageKeys.COURSES, id, updates);
        if (updated) {
            AppDB.logActivity(updated.instructorId || "admin", "instructor", "course_updated", `Updated course: ${updated.title}`);
        }
        return updated;
    },

    /**
     * Delete a course
     * @param {string} id 
     * @returns {boolean}
     */
    deleteCourse: function (id) {
        if (id === "course-1") return false;
        const course = this.getCourseById(id);
        const title = course ? course.title : id;
        const res = AppDB.delete(StorageKeys.COURSES, id);
        if (res) {
            // Also clean up related enrollments, assignments, lesson completions
            const enrollments = AppDB.findBy(StorageKeys.ENROLLMENTS, e => e.courseId === id);
            enrollments.forEach(e => AppDB.delete(StorageKeys.ENROLLMENTS, e.id));

            AppDB.logActivity("admin", "admin", "course_deleted", `Deleted course: ${title}`);
        }
        return res;
    }
};

// Global export
if (typeof window !== "undefined") {
    window.CourseService = CourseService;
}
if (typeof module !== "undefined" && module.exports) {
    module.exports = { CourseService };
}


/* ================= enrollmentService.js ================= */
/**
 * LearnX LMS - Enrollment Service
 * File: JS/services/enrollmentService.js
 */

"use strict";

const EnrollmentService = {
    /**
     * Get all enrollments in system
     * @returns {Array}
     */
    getAllEnrollments: function () {
        return AppDB.findAll(StorageKeys.ENROLLMENTS);
    },

    /**
     * Get enrollments for a specific student
     * @param {string} studentId 
     * @returns {Array}
     */
    getStudentEnrollments: function (studentId) {
        if (!studentId) return [];
        return AppDB.findBy(StorageKeys.ENROLLMENTS, e => e.studentId === studentId);
    },

    /**
     * Get enrolled course IDs for a student
     * @param {string} studentId 
     * @returns {Array<string>}
     */
    getEnrolledCourseIds: function (studentId) {
        return this.getStudentEnrollments(studentId).map(e => e.courseId);
    },

    /**
     * Get enrolled courses with full details for a student
     * @param {string} studentId 
     * @returns {Array}
     */
    getEnrolledCourses: function (studentId) {
        const ids = this.getEnrolledCourseIds(studentId);
        const courses = AppDB.findAll(StorageKeys.COURSES);
        return courses.filter(c => ids.includes(c.id));
    },

    /**
     * Check if student is enrolled in a course
     * @param {string} studentId 
     * @param {string} courseId 
     * @returns {boolean}
     */
    isEnrolled: function (studentId, courseId) {
        if (!studentId || !courseId) return false;
        return AppDB.findBy(StorageKeys.ENROLLMENTS, e => e.studentId === studentId && e.courseId === courseId).length > 0;
    },

    /**
     * Enroll a student in a course
     * @param {string} studentId 
     * @param {string} courseId 
     * @returns {{success: boolean, message: string, enrollment?: Object}}
     */
    enroll: function (studentId, courseId) {
        if (!studentId || !courseId) {
            return { success: false, message: "Invalid student or course identifier." };
        }

        if (this.isEnrolled(studentId, courseId)) {
            return { success: false, message: "Student is already enrolled in this course." };
        }

        const course = CourseService.getCourseById(courseId);
        if (!course) {
            return { success: false, message: "Course not found." };
        }

        const enrollment = {
            id: "enr-" + studentId + "-" + courseId + "-" + Date.now().toString().slice(-4),
            studentId: studentId,
            courseId: courseId,
            enrolledAt: new Date().toISOString(),
            status: "active"
        };

        AppDB.insert(StorageKeys.ENROLLMENTS, enrollment);
        AppDB.logActivity(studentId, "student", "enrolled", `Enrolled in ${course.title}`);

        return { success: true, message: `Successfully enrolled in ${course.title}!`, enrollment };
    },

    /**
     * Get count of enrolled students for a specific course
     * @param {string} courseId 
     * @returns {number}
     */
    getCourseEnrollmentsCount: function (courseId) {
        return AppDB.findBy(StorageKeys.ENROLLMENTS, e => e.courseId === courseId).length;
    },

    /**
     * Get list of students enrolled in a specific course
     * @param {string} courseId 
     * @returns {Array}
     */
    getStudentsEnrolledInCourse: function (courseId) {
        const enrollments = AppDB.findBy(StorageKeys.ENROLLMENTS, e => e.courseId === courseId);
        const studentIds = enrollments.map(e => e.studentId);
        const students = AppDB.findAll(StorageKeys.STUDENTS);
        return students.filter(s => studentIds.includes(s.id));
    },

    /**
     * Get total unique students across an instructor's courses
     * @param {string} instructorIdOrName 
     * @returns {number}
     */
    getInstructorUniqueStudentsCount: function (instructorIdOrName) {
        const courses = CourseService.getCoursesByInstructor(instructorIdOrName);
        const courseIds = courses.map(c => c.id);
        const enrollments = AppDB.findBy(StorageKeys.ENROLLMENTS, e => courseIds.includes(e.courseId));
        const uniqueStudentIds = new Set(enrollments.map(e => e.studentId));
        return uniqueStudentIds.size;
    }
};

// Global export
if (typeof window !== "undefined") {
    window.EnrollmentService = EnrollmentService;
}
if (typeof module !== "undefined" && module.exports) {
    module.exports = { EnrollmentService };
}


/* ================= progressService.js ================= */
/**
 * LearnX LMS - Progress & Completion Service
 * File: JS/services/progressService.js
 */

"use strict";

const ProgressService = {
    /**
     * Get all lesson completions in system
     * @returns {Array}
     */
    getAllCompletions: function () {
        return AppDB.findAll(StorageKeys.LESSON_COMPLETIONS);
    },

    /**
     * Get completions for a student
     * @param {string} studentId 
     * @returns {Array}
     */
    getStudentCompletions: function (studentId) {
        if (!studentId) return [];
        return AppDB.findBy(StorageKeys.LESSON_COMPLETIONS, c => c.studentId === studentId);
    },

    /**
     * Get completed lesson IDs for a student
     * @param {string} studentId 
     * @returns {Array<string>}
     */
    getCompletedLessonIds: function (studentId) {
        return this.getStudentCompletions(studentId).map(c => c.lessonId);
    },

    /**
     * Check if a lesson is completed by student
     * @param {string} studentId 
     * @param {string} lessonId 
     * @returns {boolean}
     */
    isLessonCompleted: function (studentId, lessonId) {
        if (!studentId || !lessonId) return false;
        return AppDB.findBy(StorageKeys.LESSON_COMPLETIONS, c => c.studentId === studentId && c.lessonId === lessonId).length > 0;
    },

    /**
     * Mark or unmark a lesson as completed
     * @param {string} studentId 
     * @param {string} courseId 
     * @param {string} lessonId 
     * @param {boolean} isCompleted 
     * @param {number} timeSpentMinutes 
     * @returns {{success: boolean, isCompleted: boolean, percentage: number}}
     */
    setLessonCompleted: function (studentId, courseId, lessonId, isCompleted = true, timeSpentMinutes = 0) {
        if (!studentId || !lessonId) return { success: false, isCompleted: false, percentage: 0 };

        const existing = AppDB.findBy(StorageKeys.LESSON_COMPLETIONS, c => c.studentId === studentId && c.lessonId === lessonId);

        if (isCompleted) {
            if (existing.length === 0) {
                // A lesson can only be completed after an explicit course enrollment.
                if (!courseId || !EnrollmentService.isEnrolled(studentId, courseId)) {
                    return { success: false, isCompleted: false, percentage: 0, message: "Enroll in this course before completing lessons." };
                }

                const completion = {
                    id: "comp-" + studentId + "-" + lessonId + "-" + Date.now().toString().slice(-4),
                    studentId: studentId,
                    courseId: courseId,
                    lessonId: lessonId,
                    completedAt: new Date().toISOString(),
                    timeSpentMinutes: Math.max(0, Number(timeSpentMinutes) || 0)
                };
                AppDB.insert(StorageKeys.LESSON_COMPLETIONS, completion);

                const course = CourseService.getCourseById(courseId);
                AppDB.logActivity(studentId, "student", "completed_lesson", `Completed lecture in ${course ? course.title : "course"}`);
            }
        } else {
            if (existing.length > 0) {
                existing.forEach(item => AppDB.delete(StorageKeys.LESSON_COMPLETIONS, item.id));
            }
        }

        const prog = this.getCourseProgress(studentId, courseId);
        return { success: true, isCompleted: isCompleted, percentage: prog.percentage };
    },

    /**
     * Calculate progress for a specific course
     * @param {string} studentId 
     * @param {string} courseId 
     * @returns {{completedCount: number, totalCount: number, percentage: number, remainingCount: number, isCompleted: boolean}}
     */
    getCourseProgress: function (studentId, courseId) {
        const course = CourseService.getCourseById(courseId);
        if (!course || !course.curriculum) {
            return { completedCount: 0, totalCount: 0, percentage: 0, remainingCount: 0, isCompleted: false };
        }

        let total = 0;
        let done = 0;
        const studentCompletions = this.getCompletedLessonIds(studentId);

        course.curriculum.forEach(mod => {
            if (mod.lessons) {
                mod.lessons.forEach(lesson => {
                    total++;
                    if (studentCompletions.includes(lesson.id)) {
                        done++;
                    }
                });
            }
        });

        const percentage = total > 0 ? Math.round((done / total) * 100) : 0;
        const remainingCount = Math.max(0, total - done);
        const isCompleted = total > 0 && done === total;

        return {
            completedCount: done,
            totalCount: total,
            percentage: percentage,
            remainingCount: remainingCount,
            isCompleted: isCompleted
        };
    },

    /**
     * Calculate overall student progress across all enrolled courses
     * Formula: Progress = (Completed Lessons / Total Enrolled Course Lessons) * 100
     * @param {string} studentId 
     * @returns {{overallPercent: number, completedInEnrolled: number, totalLessonsInEnrolled: number, enrolledCoursesCount: number, completedCoursesCount: number}}
     */
    getStudentOverallProgress: function (studentId) {
        const enrolledCourseIds = EnrollmentService.getEnrolledCourseIds(studentId);
        let totalLessonsInEnrolled = 0;
        let completedInEnrolled = 0;
        let completedCoursesCount = 0;

        enrolledCourseIds.forEach(cId => {
            const prog = this.getCourseProgress(studentId, cId);
            totalLessonsInEnrolled += prog.totalCount;
            completedInEnrolled += prog.completedCount;
            if (prog.isCompleted) {
                completedCoursesCount++;
            }
        });

        const overallPercent = totalLessonsInEnrolled > 0
            ? Math.round((completedInEnrolled / totalLessonsInEnrolled) * 100)
            : 0;

        return {
            overallPercent: overallPercent,
            completedInEnrolled: completedInEnrolled,
            totalLessonsInEnrolled: totalLessonsInEnrolled,
            enrolledCoursesCount: enrolledCourseIds.length,
            completedCoursesCount: completedCoursesCount
        };
    },

    /**
     * Calculate real weekly learning activity grouped by past 7 days
     * @param {string} studentId 
     * @returns {{labels: Array<string>, hours: Array<number>, totalHours: number}}
     */
    getWeeklyLearningActivity: function (studentId) {
        const completions = this.getStudentCompletions(studentId);
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const now = new Date();

        const labels = [];
        const hours = [];
        let totalMinutes = 0;

        // Build array for past 7 days (ending today)
        for (let i = 6; i >= 0; i--) {
            const targetDate = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000));
            const dayName = days[targetDate.getDay()];
            const dateStr = targetDate.toISOString().slice(0, 10);
            labels.push(dayName);

            // Sum minutes spent on this date
            const dayMinutes = completions
                .filter(c => c.completedAt && c.completedAt.slice(0, 10) === dateStr)
                .reduce((acc, c) => acc + (Number(c.timeSpentMinutes) || 0), 0);

            totalMinutes += dayMinutes;
            hours.push(parseFloat((dayMinutes / 60).toFixed(1)));
        }

        return {
            labels: labels,
            hours: hours,
            totalHours: parseFloat((totalMinutes / 60).toFixed(1))
        };
    }
};

// Global export
if (typeof window !== "undefined") {
    window.ProgressService = ProgressService;
}
if (typeof module !== "undefined" && module.exports) {
    module.exports = { ProgressService };
}


/* ================= assignmentService.js ================= */
/**
 * LearnX LMS - Assignment Service
 * File: JS/services/assignmentService.js
 */

"use strict";

const AssignmentService = {
    /**
     * Get all assignments in system
     * @returns {Array}
     */
    getAllAssignments: function () {
        return AppDB.findAll(StorageKeys.ASSIGNMENTS);
    },

    /**
     * Get assignments associated with a course
     * @param {string} courseId 
     * @returns {Array}
     */
    getAssignmentsByCourse: function (courseId) {
        return AppDB.findBy(StorageKeys.ASSIGNMENTS, a => a.courseId === courseId);
    },

    /**
     * Get assignments for courses the student is enrolled in, with student-specific submission status!
     * @param {string} studentId 
     * @returns {Array}
     */
    getStudentAssignments: function (studentId) {
        const enrolledCourseIds = EnrollmentService.getEnrolledCourseIds(studentId);
        const assignments = this.getAllAssignments();
        const submissions = AppDB.findBy(StorageKeys.SUBMISSIONS, s => s.studentId === studentId);

        // If student is not enrolled in any course, they have 0 assignments
        if (!enrolledCourseIds || enrolledCourseIds.length === 0) {
            return [];
        }

        const targetAssignments = assignments.filter(a => enrolledCourseIds.includes(a.courseId));

        return targetAssignments.map(asg => {
            const sub = submissions.find(s => s.assignmentId === asg.id);
            const status = sub ? sub.status : "Pending";
            return {
                ...asg,
                submission: sub || null,
                status: status,
                isSubmitted: !!sub,
                grade: sub ? sub.grade : null,
                feedback: sub ? sub.feedback : null
            };
        });
    },

    /**
     * Count pending (unsubmitted) assignments for a student
     * @param {string} studentId 
     * @returns {number}
     */
    getPendingAssignmentsCount: function (studentId) {
        const asgs = this.getStudentAssignments(studentId);
        return asgs.filter(a => a.status === "Pending").length;
    },

    /**
     * Submit an assignment
     * @param {string} studentId 
     * @param {string} assignmentId 
     * @param {string} fileName 
     * @param {string} comments 
     * @returns {{success: boolean, submission?: Object, message: string}}
     */
    submitAssignment: function (studentId, assignmentId, fileName = "solution.zip", comments = "") {
        if (!studentId || !assignmentId) {
            return { success: false, message: "Invalid submission data." };
        }

        const asg = AppDB.findById(StorageKeys.ASSIGNMENTS, assignmentId);
        if (!asg) {
            return { success: false, message: "Assignment not found." };
        }

        // Check if already submitted
        const existingSub = AppDB.findBy(StorageKeys.SUBMISSIONS, s => s.studentId === studentId && s.assignmentId === assignmentId);

        let submission;
        if (existingSub.length > 0) {
            submission = AppDB.update(StorageKeys.SUBMISSIONS, existingSub[0].id, {
                fileName: fileName,
                comments: comments,
                submittedAt: new Date().toISOString(),
                status: "Submitted"
            });
        } else {
            submission = {
                id: "sub-" + studentId + "-" + assignmentId + "-" + Date.now().toString().slice(-4),
                assignmentId: assignmentId,
                studentId: studentId,
                courseId: asg.courseId,
                fileName: fileName,
                comments: comments,
                submittedAt: new Date().toISOString(),
                status: "Submitted",
                grade: null,
                feedback: null
            };
            AppDB.insert(StorageKeys.SUBMISSIONS, submission);
        }

        AppDB.logActivity(studentId, "student", "submitted_assignment", `Submitted assignment: ${asg.title}`);

        return {
            success: true,
            submission: submission,
            message: `Assignment "${asg.title}" submitted successfully!`
        };
    },

    /**
     * Create a new assignment (Instructor/Admin)
     * @param {Object} data 
     * @param {string} instructorId 
     * @returns {Object}
     */
    createAssignment: function (data, instructorId) {
        const course = CourseService.getCourseById(data.courseId);
        const newAsg = {
            id: "asg-" + (this.getAllAssignments().length + 1) + "-" + Date.now().toString().slice(-4),
            courseId: data.courseId,
            courseTitle: course ? course.title : "Course Assignment",
            instructorId: instructorId || (course ? course.instructorId : "inst-1"),
            title: data.title.trim(),
            description: data.description || "Complete the assignment tasks according to instructions.",
            dueDate: data.dueDate || new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().slice(0, 10),
            points: parseInt(data.points) || 100,
            createdAt: new Date().toISOString()
        };

        AppDB.insert(StorageKeys.ASSIGNMENTS, newAsg);
        AppDB.logActivity(instructorId || "admin", "instructor", "assignment_created", `Created assignment: ${newAsg.title}`);

        return newAsg;
    },

    /**
     * Grade a student submission (Instructor)
     * @param {string} submissionId 
     * @param {string} grade 
     * @param {string} feedback 
     * @returns {Object|null}
     */
    gradeSubmission: function (submissionId, grade, feedback) {
        const updated = AppDB.update(StorageKeys.SUBMISSIONS, submissionId, {
            status: "Graded",
            grade: grade,
            feedback: feedback
        });

        if (updated) {
            AppDB.logActivity(updated.studentId, "student", "assignment_graded", `Assignment received grade: ${grade}`);
        }

        return updated;
    },

    /**
     * Get submissions for an instructor's courses
     * @param {string} instructorIdOrName 
     * @returns {Array}
     */
    getInstructorSubmissions: function (instructorIdOrName) {
        const courses = CourseService.getCoursesByInstructor(instructorIdOrName);
        const courseIds = courses.map(c => c.id);
        const allSubs = AppDB.findAll(StorageKeys.SUBMISSIONS);
        const assignments = this.getAllAssignments();
        const students = AppDB.findAll(StorageKeys.STUDENTS);

        return allSubs
            .filter(s => courseIds.includes(s.courseId))
            .map(sub => {
                const asg = assignments.find(a => a.id === sub.assignmentId);
                const student = students.find(st => st.id === sub.studentId);
                return {
                    ...sub,
                    assignmentTitle: asg ? asg.title : "Assignment",
                    studentName: student ? student.name : "Student",
                    studentEmail: student ? student.email : ""
                };
            });
    }
};

// Global export
if (typeof window !== "undefined") {
    window.AssignmentService = AssignmentService;
}
if (typeof module !== "undefined" && module.exports) {
    module.exports = { AssignmentService };
}


/* ================= quizService.js ================= */
/**
 * LearnX LMS - Quiz Service
 * File: JS/services/quizService.js
 */

"use strict";

const QuizService = {
    /**
     * Get all quizzes in system
     * @returns {Array}
     */
    getAllQuizzes: function () {
        return AppDB.findAll(StorageKeys.QUIZZES);
    },

    /**
     * Get quiz by ID
     * @param {string} id 
     * @returns {Object|null}
     */
    getQuizById: function (id) {
        return AppDB.findById(StorageKeys.QUIZZES, id);
    },

    /**
     * Get quizzes for a specific course
     * @param {string} courseId 
     * @returns {Array}
     */
    getQuizzesByCourse: function (courseId) {
        return AppDB.findBy(StorageKeys.QUIZZES, q => q.courseId === courseId);
    },

    /**
     * Submit a quiz attempt and automatically calculate score
     * @param {string} studentId 
     * @param {string} quizId 
     * @param {Object} selectedAnswers Map of { questionId: selectedOptionIndex }
     * @returns {{success: boolean, score: number, totalQuestions: number, percentage: number, passed: boolean, results: Array}}
     */
    submitQuizAttempt: function (studentId, quizId, selectedAnswers = {}) {
        const quiz = this.getQuizById(quizId);
        if (!quiz) {
            return { success: false, message: "Quiz not found." };
        }

        let score = 0;
        const totalQuestions = quiz.questions ? quiz.questions.length : 0;
        const results = [];

        if (quiz.questions) {
            quiz.questions.forEach(q => {
                const chosen = selectedAnswers[q.id];
                const isCorrect = chosen !== undefined && parseInt(chosen) === q.correctIndex;
                if (isCorrect) score++;

                results.push({
                    questionId: q.id,
                    question: q.question,
                    chosenIndex: chosen,
                    correctIndex: q.correctIndex,
                    isCorrect: isCorrect,
                    explanation: q.explanation
                });
            });
        }

        const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
        const passed = percentage >= (quiz.passingScore || 70);

        const attempt = {
            id: "atm-" + studentId + "-" + quizId + "-" + Date.now().toString().slice(-4),
            quizId: quizId,
            quizTitle: quiz.title,
            studentId: studentId,
            courseId: quiz.courseId,
            score: score,
            totalQuestions: totalQuestions,
            percentage: percentage,
            passed: passed,
            results: results,
            attemptedAt: new Date().toISOString()
        };

        AppDB.insert(StorageKeys.QUIZ_ATTEMPTS, attempt);
        AppDB.logActivity(studentId, "student", "quiz_attempted", `Attempted ${quiz.title}: Scored ${percentage}% (${passed ? "Passed" : "Needs Review"})`);

        return {
            success: true,
            score: score,
            totalQuestions: totalQuestions,
            percentage: percentage,
            passed: passed,
            attempt: attempt,
            results: results
        };
    },

    /**
     * Get quiz attempts for a student
     * @param {string} studentId 
     * @returns {Array}
     */
    getStudentQuizAttempts: function (studentId) {
        if (!studentId) return [];
        return AppDB.findBy(StorageKeys.QUIZ_ATTEMPTS, a => a.studentId === studentId);
    },

    /**
     * Get latest attempt for a student on a specific quiz
     * @param {string} studentId 
     * @param {string} quizId 
     * @returns {Object|null}
     */
    getLatestAttempt: function (studentId, quizId) {
        const attempts = AppDB.findBy(StorageKeys.QUIZ_ATTEMPTS, a => a.studentId === studentId && a.quizId === quizId);
        if (attempts.length === 0) return null;
        attempts.sort((a, b) => new Date(b.attemptedAt) - new Date(a.attemptedAt));
        return attempts[0];
    },

    /**
     * Create a new quiz (Instructor/Admin)
     * @param {Object} quizData 
     * @param {string} instructorId 
     * @returns {Object}
     */
    createQuiz: function (quizData, instructorId) {
        const newQuiz = {
            id: "quiz-" + Date.now().toString().slice(-4),
            courseId: quizData.courseId,
            title: quizData.title.trim(),
            description: quizData.description || "Test your understanding of the material.",
            passingScore: parseInt(quizData.passingScore) || 70,
            questions: quizData.questions || [],
            createdAt: new Date().toISOString()
        };

        AppDB.insert(StorageKeys.QUIZZES, newQuiz);
        AppDB.logActivity(instructorId || "instructor", "instructor", "quiz_created", `Created quiz: ${newQuiz.title}`);
        return newQuiz;
    }
};

// Global export
if (typeof window !== "undefined") {
    window.QuizService = QuizService;
}
if (typeof module !== "undefined" && module.exports) {
    module.exports = { QuizService };
}


/* ================= analyticsService.js ================= */
/**
 * LearnX LMS - Analytics & Metrics Aggregation Service
 * File: JS/services/analyticsService.js
 */

"use strict";

const AnalyticsService = {
    /**
     * Compute comprehensive metrics for Student Dashboard
     * @param {string} studentId 
     * @returns {Object}
     */
    getStudentDashboardMetrics: function (studentId) {
        const enrolledCourses = EnrollmentService.getEnrolledCourses(studentId);
        const enrolledCourseIds = enrolledCourses.map(c => c.id);
        const completedCompletions = ProgressService.getStudentCompletions(studentId);
        const completedLessonIds = completedCompletions.map(c => c.lessonId);
        const overallProg = ProgressService.getStudentOverallProgress(studentId);
        const pendingCount = AssignmentService.getPendingAssignmentsCount(studentId);
        const weeklyActivity = ProgressService.getWeeklyLearningActivity(studentId);

        // Filter upcoming tasks (unsubmitted assignments)
        const assignments = AssignmentService.getStudentAssignments(studentId);
        const upcomingTasks = assignments
            .filter(a => a.status === "Pending")
            .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
            .slice(0, 4);

        // Attach real progress calculations to each enrolled course
        const coursesWithProgress = enrolledCourses.map(c => {
            const prog = ProgressService.getCourseProgress(studentId, c.id);
            return {
                ...c,
                progress: prog
            };
        });

        // Filter recent activities for this student
        const allLogs = AppDB.findAll(StorageKeys.ACTIVITY_LOGS);
        const studentLogs = allLogs
            .filter(l => l.userId === studentId)
            .slice(0, 6);

        const totalTopicsCount = overallProg.totalLessonsInEnrolled;
        const completedTopicsCount = completedLessonIds.length;
        const remainingTopicsCount = Math.max(0, totalTopicsCount - completedTopicsCount);

        return {
            enrolledCount: enrolledCourseIds.length,
            completedLessonsCount: completedTopicsCount,
            completedTopicsCount: completedTopicsCount,
            remainingTopicsCount: remainingTopicsCount,
            totalLessonsCount: totalTopicsCount,
            totalTopicsCount: totalTopicsCount,
            overallProgressPercentage: overallProg.overallPercent,
            pendingAssignmentsCount: pendingCount,
            weeklyActivity: weeklyActivity,
            upcomingTasks: upcomingTasks,
            enrolledCourses: coursesWithProgress,
            recentActivities: studentLogs
        };
    },

    /**
     * Compute comprehensive metrics for Instructor Dashboard
     * @param {string} instructorIdOrName 
     * @returns {Object}
     */
    getInstructorDashboardMetrics: function (instructorIdOrName) {
        const courses = CourseService.getCoursesByInstructor(instructorIdOrName);
        const courseIds = courses.map(c => c.id);

        // Unique enrolled students
        const allEnrollments = AppDB.findAll(StorageKeys.ENROLLMENTS);
        const instructorEnrollments = allEnrollments.filter(e => courseIds.includes(e.courseId));
        const uniqueStudentIds = new Set(instructorEnrollments.map(e => e.studentId));

        // Total lessons count
        let totalLessons = 0;
        courses.forEach(c => {
            if (c.curriculum) {
                c.curriculum.forEach(m => {
                    if (m.lessons) totalLessons += m.lessons.length;
                });
            }
        });

        // Submissions to review
        const submissions = AssignmentService.getInstructorSubmissions(instructorIdOrName);
        const pendingReviewCount = submissions.filter(s => s.status === "Submitted").length;

        // Course performance list
        const coursePerformance = courses.map(course => {
            let lessonCount = 0;
            if (course.curriculum) {
                course.curriculum.forEach(m => { if (m.lessons) lessonCount += m.lessons.length; });
            }
            const enrolledCount = allEnrollments.filter(e => e.courseId === course.id).length;
            return {
                id: course.id,
                title: course.title,
                category: course.category,
                level: course.level,
                lessonCount: lessonCount,
                enrolledCount: enrolledCount,
                rating: course.rating || 5.0
            };
        });

        // Monthly enrollment trends calculated from actual enrollment timestamps
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthlyCounts = {};
        months.forEach(m => monthlyCounts[m] = 0);

        instructorEnrollments.forEach(e => {
            if (e.enrolledAt) {
                const date = new Date(e.enrolledAt);
                const monthName = months[date.getMonth()];
                monthlyCounts[monthName] = (monthlyCounts[monthName] || 0) + 1;
            }
        });

        // Pick last 6 months for chart
        const currentMonthIdx = new Date().getMonth();
        const trendLabels = [];
        const trendData = [];
        for (let i = 5; i >= 0; i--) {
            const mIdx = (currentMonthIdx - i + 12) % 12;
            trendLabels.push(months[mIdx]);
            trendData.push(monthlyCounts[months[mIdx]] || 0);
        }

        // Category distribution of instructor's courses
        const categoryCounts = {};
        courses.forEach(c => {
            categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
        });

        // Recent activities
        const allLogs = AppDB.findAll(StorageKeys.ACTIVITY_LOGS);
        const instructorLogs = allLogs
            .filter(l => l.userId === instructorIdOrName || l.userRole === "instructor")
            .slice(0, 5);

        return {
            totalCourses: courses.length,
            totalStudents: uniqueStudentIds.size,
            totalLessons: totalLessons,
            totalSubmissions: submissions.length,
            pendingReviewCount: pendingReviewCount,
            coursePerformance: coursePerformance,
            enrollmentTrend: {
                labels: trendLabels,
                data: trendData
            },
            categoryDistribution: {
                labels: Object.keys(categoryCounts),
                data: Object.values(categoryCounts)
            },
            recentActivities: instructorLogs
        };
    },

    /**
     * Compute comprehensive metrics for Admin Dashboard
     * @returns {Object}
     */
    getAdminDashboardMetrics: function () {
        const students = AppDB.findAll(StorageKeys.STUDENTS);
        const instructors = AppDB.findAll(StorageKeys.INSTRUCTORS);
        const courses = AppDB.findAll(StorageKeys.COURSES);
        const enrollments = AppDB.findAll(StorageKeys.ENROLLMENTS);
        const assignments = AppDB.findAll(StorageKeys.ASSIGNMENTS);
        const users = AppDB.findAll(StorageKeys.USERS);

        // Courses that have active enrollments
        const activeCourseIds = new Set(enrollments.map(e => e.courseId));
        const activeCoursesCount = courses.filter(c => activeCourseIds.has(c.id)).length;

        // User registration trend over the past 6 months
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthlyRegistrations = {};
        months.forEach(m => monthlyRegistrations[m] = 0);

        users.forEach(u => {
            if (u.createdAt) {
                const date = new Date(u.createdAt);
                const mName = months[date.getMonth()];
                monthlyRegistrations[mName] = (monthlyRegistrations[mName] || 0) + 1;
            }
        });

        const currentMonthIdx = new Date().getMonth();
        const trendLabels = [];
        const trendData = [];
        for (let i = 5; i >= 0; i--) {
            const mIdx = (currentMonthIdx - i + 12) % 12;
            trendLabels.push(months[mIdx]);
            trendData.push(monthlyRegistrations[months[mIdx]] || 0);
        }

        // Category distribution of all platform courses
        const categoryCounts = {};
        courses.forEach(c => {
            categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
        });

        // Platform activity logs
        const logs = AppDB.findAll(StorageKeys.ACTIVITY_LOGS).slice(0, 10);

        return {
            totalStudents: students.length,
            totalInstructors: instructors.length,
            totalCourses: courses.length,
            totalEnrollments: enrollments.length,
            activeCoursesCount: activeCoursesCount,
            totalAssignments: assignments.length,
            registrationTrends: {
                labels: trendLabels,
                data: trendData
            },
            categoryDistribution: {
                labels: Object.keys(categoryCounts),
                data: Object.values(categoryCounts)
            },
            platformActivities: logs
        };
    }
};

// Global export
if (typeof window !== "undefined") {
    window.AnalyticsService = AnalyticsService;
}
if (typeof module !== "undefined" && module.exports) {
    module.exports = { AnalyticsService };
}


/* ================= LMSStorage Facade ================= */
const LMS_STORAGE_KEYS = typeof StorageKeys !== "undefined" ? StorageKeys : {};

const LMSStorage = {
    init: function () {
        if (typeof AppDB !== "undefined") {
            AppDB.init();
        }
    },

    // ----------------- Auth User & Session -----------------
    getCurrentUser: function () {
        if (typeof AuthService !== "undefined") {
            return AuthService.getCurrentUser();
        }
        try {
            return JSON.parse(localStorage.getItem(LMS_STORAGE_KEYS.AUTH_USER));
        } catch (e) {
            return null;
        }
    },

    setCurrentUser: function (user) {
        if (typeof AuthService !== "undefined") {
            AuthService.setCurrentUser(user);
        } else {
            localStorage.setItem(LMS_STORAGE_KEYS.AUTH_USER, JSON.stringify(user));
        }
    },

    logout: function () {
        if (typeof AuthService !== "undefined") {
            AuthService.logout();
        } else {
            localStorage.removeItem(LMS_STORAGE_KEYS.AUTH_USER);
        }
    },

    getAllUsers: function () {
        if (typeof AppDB !== "undefined") {
            return AppDB.findAll(LMS_STORAGE_KEYS.USERS);
        }
        try {
            return JSON.parse(localStorage.getItem(LMS_STORAGE_KEYS.USERS)) || [];
        } catch (e) {
            return [];
        }
    },

    addUser: function (user) {
        if (typeof AppDB !== "undefined") {
            return AppDB.insert(LMS_STORAGE_KEYS.USERS, user);
        }
    },

    // ----------------- Courses Catalog (Single Source of Truth) -----------------
    getCourses: function () {
        if (typeof CourseService !== "undefined") {
            return CourseService.getAllCourses();
        }
        try {
            return JSON.parse(localStorage.getItem(LMS_STORAGE_KEYS.COURSES)) || [];
        } catch (e) {
            return [];
        }
    },

    getCourseById: function (id) {
        if (typeof CourseService !== "undefined") {
            return CourseService.getCourseById(id);
        }
        const courses = this.getCourses();
        return courses.find(c => c.id === id) || courses[0] || null;
    },

    saveCourses: function (courses) {
        if (typeof AppStorage !== "undefined") {
            AppStorage.set(LMS_STORAGE_KEYS.COURSES, courses);
        }
    },

    addCourse: function (course, instructorId) {
        if (typeof CourseService !== "undefined") {
            return CourseService.createCourse(course, instructorId);
        }
    },

    updateCourse: function (id, courseData) {
        if (typeof CourseService !== "undefined") {
            return CourseService.updateCourse(id, courseData);
        }
    },

    deleteCourse: function (id) {
        if (id === "course-1") {
            return false; // protect single source of truth syllabus course
        }
        if (typeof CourseService !== "undefined") {
            return CourseService.deleteCourse(id);
        }
    },

    // ----------------- Instructors -----------------
    getInstructors: function () {
        if (typeof AppDB !== "undefined") {
            return AppDB.findAll(LMS_STORAGE_KEYS.INSTRUCTORS);
        }
        return [];
    },

    addInstructor: function (inst) {
        if (typeof AppDB !== "undefined") {
            return AppDB.insert(LMS_STORAGE_KEYS.INSTRUCTORS, {
                id: inst.id || "inst-" + Date.now().toString().slice(-4),
                rating: 5.0,
                reviewsCount: 1,
                ...inst
            });
        }
    },

    updateInstructor: function (id, data) {
        if (typeof AppDB !== "undefined") {
            return AppDB.update(LMS_STORAGE_KEYS.INSTRUCTORS, id, data);
        }
    },

    deleteInstructor: function (id) {
        if (typeof AppDB !== "undefined") {
            return AppDB.delete(LMS_STORAGE_KEYS.INSTRUCTORS, id);
        }
    },

    // ----------------- Students -----------------
    getStudents: function () {
        if (typeof AppDB !== "undefined") {
            return AppDB.findAll(LMS_STORAGE_KEYS.STUDENTS);
        }
        return [];
    },

    addStudent: function (student) {
        if (typeof AppDB !== "undefined") {
            return AppDB.insert(LMS_STORAGE_KEYS.STUDENTS, {
                id: student.id || "stu-" + Date.now().toString().slice(-4),
                status: "Active",
                ...student
            });
        }
    },

    updateStudent: function (id, data) {
        if (typeof AppDB !== "undefined") {
            return AppDB.update(LMS_STORAGE_KEYS.STUDENTS, id, data);
        }
    },

    deleteStudent: function (id) {
        if (typeof AppDB !== "undefined") {
            return AppDB.delete(LMS_STORAGE_KEYS.STUDENTS, id);
        }
    },

    // ----------------- Enrollments -----------------
    getEnrolledCourseIds: function (studentId) {
        const user = this.getCurrentUser();
        const sId = studentId || (user ? user.id : null);
        if (!sId) return [];
        if (typeof EnrollmentService !== "undefined") {
            return EnrollmentService.getEnrolledCourseIds(sId);
        }
        return [];
    },

    getEnrollments: function () {
        if (typeof AppDB !== "undefined") {
            return AppDB.findAll(LMS_STORAGE_KEYS.ENROLLMENTS);
        }
        return [];
    },

    isEnrolled: function (courseId, studentId) {
        const user = this.getCurrentUser();
        const sId = studentId || (user ? user.id : null);
        if (!sId) return false;
        if (typeof EnrollmentService !== "undefined") {
            return EnrollmentService.isEnrolled(sId, courseId);
        }
        return false;
    },

    enrollCourse: function (courseId, studentId) {
        const user = this.getCurrentUser();
        const sId = studentId || (user ? user.id : null);
        if (!sId) return { success: false, message: "User not logged in." };
        if (typeof EnrollmentService !== "undefined") {
            return EnrollmentService.enrollStudent(sId, courseId);
        }
        return { success: false };
    },

    // ----------------- Progress Tracking & Topics -----------------
    getCompletedLessonIds: function (studentId) {
        const user = this.getCurrentUser();
        const sId = studentId || (user ? user.id : null);
        if (!sId) return [];
        if (typeof ProgressService !== "undefined") {
            return ProgressService.getCompletedLessonIds(sId);
        }
        return [];
    },

    markLessonCompleted: function (lessonId, isCompleted = true, courseId = "course-1", timeSpentMinutes = 25) {
        const user = this.getCurrentUser();
        if (!user) return false;
        if (typeof ProgressService !== "undefined") {
            return ProgressService.markLessonCompleted(user.id, courseId, lessonId, isCompleted, timeSpentMinutes);
        }
        return false;
    },

    getCourseProgress: function (courseId = "course-1", studentId) {
        const user = this.getCurrentUser();
        const sId = studentId || (user ? user.id : null);
        if (typeof ProgressService !== "undefined") {
            return ProgressService.getCourseProgress(sId, courseId);
        }
        return { completedCount: 0, totalCount: 0, percentage: 0, remainingCount: 0, isCompleted: false };
    },

    // ----------------- Assignments -----------------
    getAssignments: function (studentId) {
        const user = this.getCurrentUser();
        const sId = studentId || (user ? user.id : null);
        if (!sId) return [];
        if (typeof AssignmentService !== "undefined") {
            return AssignmentService.getStudentAssignments(sId);
        }
        return [];
    },

    submitAssignment: function (assignmentId, submissionData = {}) {
        const user = this.getCurrentUser();
        if (!user) return { success: false, message: "Please log in first." };
        if (typeof AssignmentService !== "undefined") {
            return AssignmentService.submitAssignment(
                user.id,
                assignmentId,
                submissionData.fileName || "solution.zip",
                submissionData.notes || submissionData.comments || ""
            );
        }
        return { success: false };
    },

    // ----------------- Quizzes -----------------
    getQuizzesByCourse: function (courseId = "course-1") {
        if (typeof QuizService !== "undefined") {
            return QuizService.getQuizzesByCourse(courseId);
        }
        return [];
    },

    submitQuizAttempt: function (quizId, answers, studentId) {
        const user = this.getCurrentUser();
        const sId = studentId || (user ? user.id : null);
        if (!sId) return { success: false, message: "User not logged in." };
        if (typeof QuizService !== "undefined") {
            return QuizService.submitQuizAttempt(quizId, sId, answers);
        }
        return { success: false };
    },

    // ----------------- Metrics Aggregation -----------------
    getStudentMetrics: function (studentId) {
        const user = this.getCurrentUser();
        const sId = studentId || (user ? user.id : null);
        if (!sId) return null;
        if (typeof AnalyticsService !== "undefined") {
            return AnalyticsService.getStudentDashboardMetrics(sId);
        }
        return null;
    },

    getInstructorMetrics: function (instructorIdOrName) {
        if (typeof AnalyticsService !== "undefined") {
            return AnalyticsService.getInstructorDashboardMetrics(instructorIdOrName);
        }
        return null;
    },

    getAdminMetrics: function () {
        if (typeof AnalyticsService !== "undefined") {
            return AnalyticsService.getAdminDashboardMetrics();
        }
        return null;
    },

    // ----------------- Toast Notifications -----------------
    showToast: function (message, type = "info") {
        let container = document.getElementById("lmsToastContainer");
        if (!container) {
            container = document.createElement("div");
            container.id = "lmsToastContainer";
            container.style.cssText = "position: fixed; bottom: 24px; right: 24px; z-index: 99999; display: flex; flex-direction: column; gap: 8px;";
            document.body.appendChild(container);
        }

        const toast = document.createElement("div");
        const bg = type === "success" ? "#10b981" : (type === "danger" ? "#ef4444" : "#4f46e5");
        toast.style.cssText = `background: ${bg}; color: #ffffff; padding: 12px 20px; border-radius: 8px; font-size: 14px; font-weight: 600; box-shadow: 0 8px 20px rgba(0,0,0,0.18); display: flex; align-items: center; gap: 8px; transition: all 0.3s ease; opacity: 0; transform: translateY(12px);`;
        toast.innerHTML = `<span>${message}</span>`;
        container.appendChild(toast);

        requestAnimationFrame(() => {
            toast.style.opacity = "1";
            toast.style.transform = "translateY(0)";
        });

        setTimeout(() => {
            toast.style.opacity = "0";
            toast.style.transform = "translateY(12px)";
            setTimeout(() => toast.remove(), 300);
        }, 3200);
    }
};

if (typeof window !== "undefined") {
    window.LMSStorage = LMSStorage;
}
if (typeof module !== "undefined" && module.exports) {
    module.exports = { LMSStorage };
}

// Auto-initialize DB immediately
if (typeof AppDB !== "undefined") {
    AppDB.init();
}
