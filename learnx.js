
let courses = JSON.parse(localStorage.getItem("learnx_courses")) || [];
let lessons = JSON.parse(localStorage.getItem("learnx_lessons")) || [];

// Save courses
function saveCourses() {
    localStorage.setItem("learnx_courses", JSON.stringify(courses));
}

// Save lessons
function saveLessons() {
    localStorage.setItem("learnx_lessons", JSON.stringify(lessons));
}

// Add New Course
function addCourse() {
    let heading = document.querySelector("main h1");
    let form = document.querySelector("main form");

    if (!heading || !form ||
        !heading.innerText.includes("Add New Course")) return;

    form.addEventListener("submit", function(event) {
        event.preventDefault();

        let fields = form.querySelectorAll("input, select, textarea");

        let course = {
            id: Date.now(),
            title: fields[0].value.trim(),
            instructor: fields[1].value.trim(),
            category: fields[2].value,
            duration: fields[3].value,
            price: fields[4].value,
            level: fields[5].value,
            description: fields[6].value
        };

        if (course.title === "" || course.instructor === "") {
            alert("Please fill course title and instructor.");
            return;
        }

        courses.push(course);
        saveCourses();

        alert("Course added successfully!");
        form.reset();
    });
}

// Manage Courses
function manageCourses() {
    let heading = document.querySelector("main h1");
    let table = document.querySelector("main table");

    if (!heading || !table ||
        !heading.innerText.includes("Manage Courses")) return;

    let rows = table.querySelectorAll("tr");

    for (let i = rows.length - 1; i > 0; i--) {
        rows[i].remove();
    }

    courses.forEach(function(course) {
        let row = table.insertRow();

        row.insertCell(0).innerText = course.id;
        row.insertCell(1).innerText = course.title;
        row.insertCell(2).innerText = course.instructor;
        row.insertCell(3).innerText = lessons.filter(function(lesson) {
            return lesson.courseId === course.id;
        }).length;
        row.insertCell(4).innerText = "Published";

        let action = row.insertCell(5);
        let button = document.createElement("button");

        button.innerText = "Delete";
        button.type = "button";

        button.onclick = function() {
            if (confirm("Delete this course?")) {
                courses = courses.filter(function(item) {
                    return item.id !== course.id;
                });

                lessons = lessons.filter(function(item) {
                    return item.courseId !== course.id;
                });

                saveCourses();
                saveLessons();
                row.remove();
            }
        };

        action.appendChild(button);
    });
}

// Teacher My Courses
function showTeacherCourses() {
    let heading = document.querySelector("main h1");
    let grid = document.querySelector(".course-grid");

    if (!heading || !grid ||
        !heading.innerText.includes("My Courses")) return;

    grid.innerHTML = "";

    courses.forEach(function(course) {
        let card = document.createElement("div");
        card.className = "course-card";

        let image = document.createElement("div");
        image.className = "course-image";
        image.innerText = course.title.substring(0, 4).toUpperCase();

        let content = document.createElement("div");
        content.className = "course-content";

        let title = document.createElement("h3");
        title.innerText = course.title;

        let description = document.createElement("p");
        description.innerText = course.description || course.category;

        let count = document.createElement("p");
        count.innerText = "Lessons: " + lessons.filter(function(lesson) {
            return lesson.courseId === course.id;
        }).length;

        let link = document.createElement("a");
        link.href = "add-lesson.html";
        link.className = "btn btn-primary";
        link.innerText = "Manage Course";

        content.append(title, description, count, link);
        card.append(image, content);
        grid.appendChild(card);
    });

    if (courses.length === 0) {
        grid.innerText = "No courses available.";
    }
}

// Add New Lesson
function addLesson() {
    let heading = document.querySelector("main h1");
    let form = document.querySelector("main form");

    if (!heading || !form ||
        !heading.innerText.includes("Add New Lesson")) return;

    let fields = form.querySelectorAll("input, select, textarea");
    let select = fields[0];

    select.innerHTML = '<option value="">Select Course</option>';

    courses.forEach(function(course) {
        let option = document.createElement("option");
        option.value = course.id;
        option.innerText = course.title;
        select.appendChild(option);
    });

    form.addEventListener("submit", function(event) {
        event.preventDefault();

        let course = courses.find(function(item) {
            return String(item.id) === select.value;
        });

        if (!course) {
            alert("Please select a course.");
            return;
        }

        let lesson = {
            id: Date.now(),
            courseId: course.id,
            courseTitle: course.title,
            number: fields[1].value,
            title: fields[2].value.trim(),
            description: fields[3].value,
            video: fields[4].value
        };

        if (!lesson.number || !lesson.title) {
            alert("Please enter lesson number and title.");
            return;
        }

        lessons.push(lesson);
        saveLessons();

        alert("Lesson added successfully!");
        form.reset();
    });
}

// Teacher Dashboard
function teacherDashboard() {
    let heading = document.querySelector("main h1");

    if (!heading ||
        !heading.innerText.includes("Teacher Dashboard")) return;

    let cards = document.querySelectorAll(".cards .card h2");

    if (cards.length >= 3) {
        cards[0].innerText = courses.length;
        cards[1].innerText = "0";
        cards[2].innerText = lessons.length;
    }

    let table = document.querySelector(".section table");

    if (!table) return;

    let rows = table.querySelectorAll("tr");

    for (let i = rows.length - 1; i > 0; i--) {
        rows[i].remove();
    }

    courses.forEach(function(course) {
        let row = table.insertRow();

        row.insertCell(0).innerText = course.title;
        row.insertCell(1).innerText = "0";

        row.insertCell(2).innerText = lessons.filter(function(lesson) {
            return lesson.courseId === course.id;
        }).length;

        row.insertCell(3).innerText = "Available";
    });
}

// Run JavaScript
document.addEventListener("DOMContentLoaded", function() {
    addCourse();
    manageCourses();
    showTeacherCourses();
    addLesson();
    teacherDashboard();
});
