/**
 * LearnX LMS - Main Landing Page Script
 * File: JS/main.js
 */

"use strict";

document.addEventListener("DOMContentLoaded", function () {

    // ---------------------------------------------------------
    // 1. MOBILE NAVIGATION TOGGLE
    // ---------------------------------------------------------
    const mobileToggle = document.getElementById("mobileNavToggle");
    const navLinks = document.getElementById("mainNavLinks");

    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener("click", function () {
            navLinks.classList.toggle("show");
        });
    }

    // ---------------------------------------------------------
    // 2. HERO SEARCH FUNCTIONALITY
    // ---------------------------------------------------------
    const heroSearchForm = document.getElementById("heroSearchForm");
    const heroSearchInput = document.getElementById("heroSearchInput");

    if (heroSearchForm && heroSearchInput) {
        heroSearchForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const query = heroSearchInput.value.trim();
            if (query) {
                window.location.href = `pages/courses.html?search=${encodeURIComponent(query)}`;
            } else {
                window.location.href = "pages/courses.html";
            }
        });
    }

    // ---------------------------------------------------------
    // 3. DYNAMIC FEATURED COURSES
    // ---------------------------------------------------------
    renderHomeFeaturedCourses();

    // ---------------------------------------------------------
    // 4. DYNAMIC TOP INSTRUCTORS
    // ---------------------------------------------------------
    renderHomeInstructors();

    // ---------------------------------------------------------
    // 5. PERSONALIZED LEARNING PATH GENERATOR
    // ---------------------------------------------------------
    setupLearningPath();

    // ---------------------------------------------------------
    // 6. REAL-TIME DATA SYNCHRONIZATION
    // ---------------------------------------------------------
    if (typeof AppStorage !== "undefined") {
        AppStorage.onDataChange(() => {
            renderHomeFeaturedCourses();
            renderHomeInstructors();
        });
    }
});

/**
 * Render top featured courses on landing page
 */
function renderHomeFeaturedCourses() {
    const container = document.getElementById("homeFeaturedCourses");
    if (!container || typeof LMSStorage === "undefined") return;

    const courses = LMSStorage.getCourses().slice(0, 3);
    const enrolledIds = LMSStorage.getEnrolledCourseIds();

    container.innerHTML = courses.map(course => {
        const isEnrolled = enrolledIds.includes(course.id);
        const actionBtn = isEnrolled 
            ? `<a href="pages/learning.html?course=${course.id}" class="lms-btn lms-btn-primary lms-btn-sm" style="flex:1;">Continue Learning</a>`
            : `<button type="button" class="lms-btn lms-btn-primary lms-btn-sm home-enroll-btn" data-course-id="${course.id}" style="flex:1;">Enroll Now</button>`;

        return `
            <div class="lms-course-card">
                <div class="lms-course-thumbnail-wrap">
                    <img src="${course.thumbnail}" alt="${course.title}" class="lms-course-thumbnail" onerror="this.src='https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80'">
                    <span class="lms-course-badge">${course.badge || course.level}</span>
                </div>
                <div class="lms-course-body">
                    <div class="lms-course-meta-top">
                        <span>${course.category}</span>
                        <span>${course.level}</span>
                    </div>
                    <h3 class="lms-course-title">
                        <a href="pages/course-details.html?id=${course.id}">${course.title}</a>
                    </h3>
                    <p class="lms-course-desc">${course.description}</p>
                    <div class="lms-course-instructor">
                        <span>👨‍🏫 By ${course.instructor}</span>
                    </div>
                    <div class="lms-course-stats">
                        <span class="lms-rating-star">${course.reviewsCount > 0 ? `★ ${course.rating} (${course.reviewsCount.toLocaleString()} reviews)` : "New • No reviews yet"}</span>
                        <span>📚 ${course.totalLessons || 0} topics</span>
                    </div>
                    <div class="lms-course-actions">
                        <a href="pages/course-details.html?id=${course.id}" class="lms-btn lms-btn-outline lms-btn-sm">Details</a>
                        ${actionBtn}
                    </div>
                </div>
            </div>
        `;
    }).join("");

    // Attach enroll event listeners
    container.querySelectorAll(".home-enroll-btn").forEach(btn => {
        btn.addEventListener("click", function () {
            const courseId = this.getAttribute("data-course-id");
            if (LMSStorage.enrollCourse(courseId)) {
                LMSStorage.showToast("Enrolled successfully in course!", "success");
                renderHomeFeaturedCourses();
            } else {
                LMSStorage.showToast("You are already enrolled in this course.", "info");
            }
        });
    });
}

/**
 * Render top instructors on home page
 */
function renderHomeInstructors() {
    const container = document.getElementById("homeInstructorsContainer");
    if (!container || typeof LMSStorage === "undefined") return;

    const allCourses = LMSStorage.getCourses();
    const allEnrollments = LMSStorage.getEnrollments ? LMSStorage.getEnrollments() : [];
    const instructors = LMSStorage.getInstructors().filter(inst =>
        allCourses.some(course => course.instructorId === inst.id || course.instructor === inst.name)
    ).slice(0, 4);

    container.innerHTML = instructors.map(inst => {
        const instructorCourses = allCourses.filter(course => course.instructorId === inst.id || course.instructor === inst.name);
        const courseIds = instructorCourses.map(course => course.id);
        const learnerCount = new Set(allEnrollments.filter(enrollment => courseIds.includes(enrollment.courseId)).map(enrollment => enrollment.studentId)).size;
        return `
        <div class="col-md-6 col-lg-3">
            <div class="lms-card text-center h-100 p-4">
                <img src="${inst.avatar}" alt="${inst.name}" class="rounded-circle mx-auto mb-3" style="width: 88px; height: 88px; object-fit: cover; border: 3px solid var(--theme-secondary);">
                <h5 class="fw-bold mb-1" style="color: var(--theme-text);">${inst.name}</h5>
                <p class="text-primary small fw-semibold mb-2">${inst.title}</p>
                <p class="text-muted small mb-3" style="line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">${inst.bio}</p>
                <div class="d-flex justify-content-center gap-3 pt-3 border-top" style="font-size: 13px; color: var(--theme-muted); font-weight: 600;">
                    <span>${instructorCourses.length} Courses</span>
                    <span>•</span>
                    <span>${learnerCount} Enrolled Learners</span>
                </div>
            </div>
        </div>
    `;
    }).join("");
}

/**
 * Personalized learning path generator
 */
function setupLearningPath() {
    const form = document.getElementById("learningPathForm");
    const interest = document.getElementById("interest");
    const level = document.getElementById("level");
    const goal = document.getElementById("goal");
    const result = document.getElementById("learningPathResult");

    if (!form || !interest || !level || !goal || !result) return;

    const roadmaps = {
        web: [
            "Web Development Fundamentals: Web Architecture, Roles, Environment Setup",
            "HTML Essentials: HTML Basics, Syntax, Tags, Elements, Semantic HTML",
            "Advanced HTML: Attributes, Tables, Lists, Layout, Iframes, Forms",
            "CSS Fundamentals: Syntax, Selectors, Colors, Box Model, Units, Positioning",
            "Flexbox & CSS Grid: Layouts, Transformations, Animations, CSS Frameworks",
            "Responsive Web Design & Bootstrap: Media Queries, Bootstrap Components, Revision & Mid Term Exam"
        ],
        html: [
            "HTML Essentials: HTML Basics, Syntax, Tags, Elements, Semantic HTML",
            "Advanced HTML: Attributes, Headings, Paragraphs, Tables, Dropdowns, Lists, Iframes, Frames, Entities, Charset and Forms"
        ],
        css: [
            "CSS Fundamentals: CSS Syntax, Types, Selectors, Colors, Backgrounds, Box Model, Units and Positioning",
            "Advanced CSS Styling: Borders, Padding, Dimensions, Gradients, Shadows, Typography, Transitions, Pseudo-classes and Tooltips",
            "Flexbox & CSS Grid: Flexbox, Grid, Transformations and Animations",
            "Responsive Web Design & Bootstrap: Responsive Layouts, Media Queries, Bootstrap Grid, Themes and Components"
        ],
        javascript: [
            "JavaScript Fundamentals: JavaScript Types, Operators, Math and Control Structures",
            "Advanced JavaScript: Scope, Events, Strings, Arrays, Boolean, Comparisons, Conditions, Loops, Type Conversion, Errors, Debugging, Hoisting and Strict Mode",
            "JavaScript Objects & Functions: Arrays, Objects, Forms, RegExp, Functions, Prototypes and Constructor Functions",
            "DOM Manipulation & OOP with JavaScript: DOM, Selecting Elements, Events, OOP Concepts, Advanced Array Methods and Error Handling"
        ],
        apis: [
            "Async JavaScript, jQuery & APIs: Event Loop, Callbacks, Promises, Async/Await, jQuery, AJAX, HTTP Requests, XMLHttpRequest, Fetch API and JSON Server"
        ]
    };

    const levels = {
        beginner: "Recommended Pace: Start with fundamental syntax and practice daily exercises.",
        intermediate: "Recommended Pace: Focus on practical architecture patterns and real-world projects.",
        advanced: "Recommended Pace: Deep dive into asynchronous JavaScript, jQuery, AJAX, HTTP requests and API response handling."
    };

    const goals = {
        exams: "Focus: Review the syllabus modules, revision topics, and mid-term exam material.",
        placement: "Focus: Practice HTML, CSS, JavaScript, DOM, and frontend problem-solving topics from the syllabus.",
        skills: "Focus: Build practical web pages using HTML, CSS, Flexbox, Grid, and Bootstrap topics from the syllabus.",
        career: "Focus: Strengthen JavaScript, asynchronous programming, jQuery, AJAX, and API skills from the syllabus."
    };

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const selectedInterest = interest.value;
        const selectedLevel = level.value;
        const selectedGoal = goal.value;

        if (!roadmaps[selectedInterest] || !levels[selectedLevel] || !goals[selectedGoal]) {
            result.hidden = false;
            result.textContent = "Please select all 3 criteria to generate your path.";
            return;
        }

        result.replaceChildren();
        result.hidden = false;

        const heading = document.createElement("h3");
        heading.textContent = "🚀 Your Personalized LearnX Curriculum Path";
        result.appendChild(heading);

        const metaP = document.createElement("p");
        metaP.innerHTML = `<strong>Domain:</strong> ${interest.options[interest.selectedIndex].text} | <strong>Level:</strong> ${level.options[level.selectedIndex].text} | <strong>Goal:</strong> ${goal.options[goal.selectedIndex].text}`;
        result.appendChild(metaP);

        const listHeading = document.createElement("h4");
        listHeading.textContent = "Recommended Milestone Steps:";
        result.appendChild(listHeading);

        const roadmapList = document.createElement("ol");
        roadmaps[selectedInterest].forEach(step => {
            const item = document.createElement("li");
            item.textContent = step;
            roadmapList.appendChild(item);
        });
        result.appendChild(roadmapList);

        const adviceBox = document.createElement("div");
        adviceBox.style.cssText = "margin-top: 15px; padding: 12px; background: rgba(99, 102, 241, 0.08); border-radius: 8px; font-size: 13px;";
        adviceBox.innerHTML = `💡 <strong>Strategic Advice:</strong> ${levels[selectedLevel]} ${goals[selectedGoal]}`;
        result.appendChild(adviceBox);

        const exploreBtn = document.createElement("a");
        exploreBtn.href = "pages/courses.html";
        exploreBtn.className = "lms-btn lms-btn-primary lms-btn-sm";
        exploreBtn.style.marginTop = "15px";
        exploreBtn.textContent = "Browse Matching Courses →";
        result.appendChild(exploreBtn);

        result.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
}
