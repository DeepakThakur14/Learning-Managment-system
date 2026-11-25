
document.addEventListener("DOMContentLoaded", function () {
    const STORAGE_KEY = "learnx_completed_lectures";
    const ENROLLED_KEY = "learnx_enrolled_courses";

    function readStorage(key, fallback) {
        try {
            const value = JSON.parse(localStorage.getItem(key));
            return value === null ? fallback : value;
        } catch (error) {
            return fallback;
        }
    }

    function saveStorage(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.warn("Unable to save progress.");
        }
    }

    function createElement(tag, className, text) {
        const element = document.createElement(tag);

        if (className) {
            element.className = className;
        }

        if (text !== undefined) {
            element.textContent = text;
        }

        return element;
    }

    // Course search and category filtering
    function setupCourseSearch() {
        const cards = Array.from(
            document.querySelectorAll(".course-card")
        );

        const grid = document.querySelector(".course-grid");

        if (!grid || cards.length === 0) return;

        const tools = createElement("div", "learnx-course-tools");
        tools.style.cssText =
            "display:flex;gap:10px;flex-wrap:wrap;margin:16px 0;";

        const search = createElement("input");
        search.type = "search";
        search.placeholder = "Search courses...";
        search.setAttribute("aria-label", "Search courses");
        search.style.cssText =
            "padding:10px;min-width:220px;flex:1;border:1px solid #ccc;border-radius:5px;";

        const category = createElement("select");
        category.setAttribute(
            "aria-label",
            "Filter courses by category"
        );
        category.style.cssText =
            "padding:10px;border:1px solid #ccc;border-radius:5px;";

        const categories = [
            ["all", "All categories"],
            ["web development", "Web Development"],
            ["programming", "Programming"],
            ["database", "Database"],
            ["ai/ml", "AI/ML"]
        ];

        categories.forEach(function (item) {
            const option = createElement("option", "", item[1]);
            option.value = item[0];
            category.appendChild(option);
        });

        const count = createElement("p", "learnx-course-count");

        tools.append(search, category);

        grid.parentNode.insertBefore(tools, grid);
        grid.parentNode.insertBefore(count, grid);

        function filterCourses() {
            const term = search.value.trim().toLowerCase();
            const selectedCategory = category.value;
            let visible = 0;

            cards.forEach(function (card) {
                const text = card.textContent.toLowerCase();

                const matchesSearch = text.includes(term);
                const matchesCategory =
                    selectedCategory === "all" ||
                    text.includes(selectedCategory);

                const show = matchesSearch && matchesCategory;

                card.hidden = !show;

                if (show) visible++;
            });

            count.textContent =
                "Showing " + visible + " of " + cards.length + " courses";
        }

        search.addEventListener("input", filterCourses);
        category.addEventListener("change", filterCourses);

        filterCourses();
    }

    // Course enrollment
    function setupEnrollment() {
        const enrollLink = Array.from(
            document.querySelectorAll("a.button")
        ).find(function (link) {
            return link.textContent.trim().toLowerCase() === "enroll now";
        });

        if (enrollLink) {
            enrollLink.addEventListener("click", function () {
                const enrolled = readStorage(ENROLLED_KEY, []);

                const courseName = "Web Development Fundamentals";

                if (!enrolled.includes(courseName)) {
                    enrolled.push(courseName);
                    saveStorage(ENROLLED_KEY, enrolled);
                }
            });
        }

        const learningHeading = Array.from(
            document.querySelectorAll("main h1")
        ).find(function (heading) {
            return heading.textContent
                .toLowerCase()
                .includes("web development fundamentals");
        });

        if (learningHeading) {
            const enrolled = readStorage(ENROLLED_KEY, []);
            const courseName = "Web Development Fundamentals";

            if (!enrolled.includes(courseName)) {
                enrolled.push(courseName);
                saveStorage(ENROLLED_KEY, enrolled);
            }
        }
    }

    // Learning progress and lesson completion
    function setupLearningProgress() {
        const main = document.querySelector("main");

        const lessons = Array.from(
            document.querySelectorAll("main section.lesson")
        );

        if (!main || lessons.length === 0) return;

        const completed = readStorage(STORAGE_KEY, []);

        const progressText = Array.from(
            main.querySelectorAll("p")
        ).find(function (paragraph) {
            return /lectures?\s+completed/i.test(
                paragraph.textContent
            );
        });

        const progress = createElement("div", "learnx-progress");

        progress.style.cssText =
            "margin:16px 0;padding:14px;background:#fff;border:1px solid #ddd;border-radius:8px;";

        const label = createElement("p");

        label.style.cssText =
            "margin:0 0 8px;font-weight:bold;";

        const track = createElement("div");

        track.style.cssText =
            "height:10px;background:#e5e7eb;border-radius:10px;overflow:hidden;";

        const bar = createElement("div");

        bar.style.cssText =
            "height:100%;width:0;background:#0f8b8d;transition:width .2s ease;";

        track.appendChild(bar);
        progress.append(label, track);

        if (progressText) {
            progressText.textContent = "";
            progressText.appendChild(progress);
        } else {
            main.insertBefore(progress, lessons[0]);
        }

        lessons.forEach(function (lesson, index) {
            const heading = lesson.querySelector("h2");

            const lessonName = lesson.id ||
                (heading
                    ? heading.textContent.trim()
                    : "Lesson " + (index + 1));

            if (!lesson.id) {
                lesson.id = "learnx-lesson-" + (index + 1);
            }

            const currentName = lesson.id;

            const checkbox = createElement("input");
            checkbox.type = "checkbox";

            checkbox.checked =
                completed.includes(currentName) ||
                completed.includes(lessonName);

            checkbox.setAttribute(
                "aria-label",
                "Mark " + lessonName + " as completed"
            );

            const lessonLabel = createElement(
                "label",
                "learnx-complete-label",
                " Mark as completed"
            );

            lessonLabel.style.cssText =
                "display:inline-flex;align-items:center;gap:6px;margin-top:12px;cursor:pointer;font-weight:bold;";

            lessonLabel.prepend(checkbox);
            lesson.appendChild(lessonLabel);

            if (checkbox.checked) {
                lesson.style.borderLeft = "4px solid #0f8b8d";
            }

            checkbox.addEventListener("change", function () {
                let latest = readStorage(STORAGE_KEY, []);

                latest = latest.filter(function (item) {
                    return item !== currentName &&
                        item !== lessonName;
                });

                if (checkbox.checked) {
                    latest.push(currentName);
                }

                saveStorage(STORAGE_KEY, latest);

                completed.splice(
                    0,
                    completed.length,
                    ...latest
                );

                lesson.style.borderLeft = checkbox.checked
                    ? "4px solid #0f8b8d"
                    : "";

                updateProgress();
            });
        });

        function updateProgress() {
            const total = lessons.length;

            const done = lessons.filter(function (lesson) {
                const heading = lesson.querySelector("h2");
                const lessonName = lesson.id ||
                    (heading ? heading.textContent.trim() : "");

                return completed.includes(lessonName) ||
                    completed.includes(
                        heading ? heading.textContent.trim() : ""
                    );
            }).length;

            label.textContent =
                done + " of " + total + " displayed lessons completed";

            bar.style.width =
                (total ? (done / total) * 100 : 0) + "%";

            bar.setAttribute("role", "progressbar");
            bar.setAttribute("aria-valuemin", "0");
            bar.setAttribute("aria-valuemax", String(total));
            bar.setAttribute("aria-valuenow", String(done));
        }

        updateProgress();
    }

    // Syllabus navigation support
    function setupSyllabusNavigation() {
        const lectures = Array.from(
            document.querySelectorAll("main .lecture")
        );

        lectures.forEach(function (lecture, index) {
            if (!lecture.id) {
                lecture.id = "learnx-syllabus-" + (index + 1);
            }

            const heading = lecture.querySelector("h3");

            if (heading) {
                heading.tabIndex = 0;
            }
        });
    }

    // Initialize project features
    setupCourseSearch();
    setupEnrollment();
    setupLearningProgress();
    setupSyllabusNavigation();
});
