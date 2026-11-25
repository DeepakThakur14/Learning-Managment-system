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
