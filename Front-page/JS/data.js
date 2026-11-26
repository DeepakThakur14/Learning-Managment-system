/**
 * LearnX LMS - Centralized Data Management Engine (Unified Bundle)
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
    INITIALIZED: "learnx_initialized",
    USERS: "learnx_users",
    AUTH_USER: "learnx_auth_user",
    COURSES: "learnx_courses",
    INSTRUCTORS: "learnx_instructors",
    STUDENTS: "learnx_students",
    ENROLLMENTS: "learnx_enrollments",
    LESSON_COMPLETIONS: "learnx_lesson_completions",
    ASSIGNMENTS: "learnx_assignments",
    SUBMISSIONS: "learnx_submissions",
    QUIZZES: "learnx_quizzes",
    QUIZ_ATTEMPTS: "learnx_quiz_attempts",
    ACTIVITY_LOGS: "learnx_activity_logs",
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
        if (typeof window !== "undefined") {
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
        if (typeof window === "undefined") return () => { };

        const handler = (e) => callback(e.detail);
        window.addEventListener("learnx:data-changed", handler);

        // Also listen for cross-tab storage events
        const storageHandler = (e) => {
            if (e.key && e.key.startsWith("learnx_")) {
                let parsed = null;
                try { parsed = JSON.parse(e.newValue); } catch (err) { }
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
 * LearnX LMS - Seed Database
 * File: JS/database/seedData.js
 */

"use strict";

const now = Date.now();
const oneDayMs = 24 * 60 * 60 * 1000;

// Helper to generate past ISO date strings
function daysAgo(days, hours = 0) {
    return new Date(now - (days * oneDayMs) - (hours * 3600000)).toISOString();
}

function daysAhead(days) {
    return new Date(now + (days * oneDayMs)).toISOString();
}

const SEED_USERS = [];
const SEED_INSTRUCTORS = [];
const SEED_STUDENTS = [];

const SEED_COURSES = [];

const SEED_ENROLLMENTS = [];

const SEED_LESSON_COMPLETIONS = [];

const SEED_ASSIGNMENTS = [];

const SEED_SUBMISSIONS = [];

const SEED_QUIZZES = [];

const SEED_QUIZ_ATTEMPTS = [];

const SEED_ACTIVITY_LOGS = [];

// Global export
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
        this.removeLegacyDemoPeople();
    },

    /** Remove fictional demo people from earlier LearnX builds while preserving real registrations. */
    removeLegacyDemoPeople: function () {
        const marker = "learnx_auth_cleanup_v3";
        if (localStorage.getItem(marker) === "done") return;
        const demoEmails = new Set([
            "ayush@learnx.edu", "priya.sharma@learnx.edu", "vikram.rao@learnx.edu",
            "admin@learnx.edu", "rohan.gupta@learnx.edu", "ananya.iyer@learnx.edu",
            "karan.m@learnx.edu", "rahul.verma@learnx.edu", "neha.patel@learnx.edu",
            "amit.singhal@learnx.edu"
        ]);
        const demoIds = new Set(["stu-1", "stu-2", "stu-3", "stu-4", "inst-1", "inst-2", "inst-3", "inst-4", "inst-5", "admin-1"]);
        const users = this.findAll(StorageKeys.USERS).filter(u => !demoEmails.has(String(u.email || "").toLowerCase()) && !demoIds.has(u.id));
        const instructors = this.findAll(StorageKeys.INSTRUCTORS).filter(u => !demoEmails.has(String(u.email || "").toLowerCase()) && !demoIds.has(u.id) && !demoIds.has(u.userId));
        const students = this.findAll(StorageKeys.STUDENTS).filter(u => !demoEmails.has(String(u.email || "").toLowerCase()) && !demoIds.has(u.id) && !demoIds.has(u.userId));
        AppStorage.set(StorageKeys.USERS, users, false);
        AppStorage.set(StorageKeys.INSTRUCTORS, instructors, false);
        AppStorage.set(StorageKeys.STUDENTS, students, false);
        const current = AppStorage.get(StorageKeys.AUTH_USER, null);
        if (current && (demoEmails.has(String(current.email || "").toLowerCase()) || demoIds.has(current.id))) {
            AppStorage.remove(StorageKeys.AUTH_USER, false);
        } else if (current) {
            const { password, passwordHash, passwordSalt, passwordAlgorithm, passwordIterations, ...safeSession } = current;
            AppStorage.set(StorageKeys.AUTH_USER, safeSession, false);
        }
        const courses = this.findAll(StorageKeys.COURSES).map(course => {
            if (String(course.instructorId || "").startsWith("inst-") || demoEmails.has(String(course.instructorEmail || "").toLowerCase())) {
                return { ...course, instructorId: "", instructor: "Instructor not assigned" };
            }
            return course;
        });
        AppStorage.set(StorageKeys.COURSES, courses, false);
        localStorage.setItem(marker, "done");
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
    getCurrentUser: function () {
        return AppStorage.get(StorageKeys.AUTH_USER, null);
    },
    setCurrentUser: function (user) {
        if (!user) return AppStorage.remove(StorageKeys.AUTH_USER);
        const { password, passwordHash, passwordSalt, ...safeUser } = user;
        AppStorage.set(StorageKeys.AUTH_USER, safeUser);
    },
    _crypto: function () {
        if (!window.crypto || !window.crypto.subtle) throw new Error("Secure password hashing requires a secure browser context. Open LearnX using VS Code Live Server on localhost.");
        return window.crypto;
    },
    _toBase64: function (bytes) {
        let binary = "";
        new Uint8Array(bytes).forEach(byte => binary += String.fromCharCode(byte));
        return btoa(binary);
    },
    _fromBase64: function (value) {
        return Uint8Array.from(atob(value), char => char.charCodeAt(0));
    },
    _hashPassword: async function (password, saltBase64) {
        const cryptoApi = this._crypto();
        const salt = saltBase64 ? this._fromBase64(saltBase64) : cryptoApi.getRandomValues(new Uint8Array(16));
        const key = await cryptoApi.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
        const iterations = 210000;
        const bits = await cryptoApi.subtle.deriveBits({ name: "PBKDF2", salt, iterations, hash: "SHA-256" }, key, 256);
        return { passwordHash: this._toBase64(bits), passwordSalt: this._toBase64(salt), passwordAlgorithm: "PBKDF2-SHA256", passwordIterations: iterations };
    },
    _safeUser: function (user) {
        const { password, passwordHash, passwordSalt, passwordAlgorithm, passwordIterations, ...safeUser } = user;
        return safeUser;
    },
    _recordFailure: function (email) {
        const key = "learnx_login_attempts_v1";
        const records = AppStorage.get(key, {});
        const now = Date.now();
        const old = records[email] || { count: 0, firstAt: now, lockedUntil: 0 };
        if (now - old.firstAt > 15 * 60 * 1000) { old.count = 0; old.firstAt = now; }
        old.count += 1;
        if (old.count >= 5) old.lockedUntil = now + 60 * 1000;
        records[email] = old;
        AppStorage.set(key, records, false);
        return old;
    },
    login: async function (email, password, role) {
        email = (email || "").trim().toLowerCase();
        if (!email || !password) return { success: false, message: "Enter your email and password." };
        const attemptsKey = "learnx_login_attempts_v1";
        const attempts = AppStorage.get(attemptsKey, {});
        const lock = attempts[email];
        if (lock && lock.lockedUntil > Date.now()) return { success: false, message: "Too many failed attempts. Try again in one minute." };
        const user = AppDB.findAll(StorageKeys.USERS).find(item => (item.email || "").toLowerCase() === email);
        if (!user) { this._recordFailure(email); return { success: false, message: "No account exists with this email. Please register first." }; }
        let valid = false;
        try {
            if (user.passwordHash && user.passwordSalt) {
                const computed = await this._hashPassword(password, user.passwordSalt);
                const a = this._fromBase64(computed.passwordHash), b = this._fromBase64(user.passwordHash);
                if (a.length === b.length) {
                    let difference = 0;
                    for (let index = 0; index < a.length; index++) difference |= a[index] ^ b[index];
                    valid = difference === 0;
                }
            } else if (typeof user.password === "string") {
                // One-time migration for accounts created by earlier plaintext-password builds.
                valid = user.password === password;
                if (valid) {
                    const hashed = await this._hashPassword(password);
                    const migrated = { ...user, ...hashed };
                    delete migrated.password;
                    AppStorage.set(StorageKeys.USERS, AppDB.findAll(StorageKeys.USERS).map(item => item.id === user.id ? migrated : item), false);
                    Object.assign(user, migrated);
                }
            }
        } catch (error) {
            return { success: false, message: error.message || "Could not verify password in this browser." };
        }
        if (!valid) { this._recordFailure(email); return { success: false, message: "Email or password is incorrect." }; }
        if (role && user.role !== role) return { success: false, message: `This account belongs to the ${user.role} portal.` };
        delete attempts[email];
        AppStorage.set(attemptsKey, attempts, false);
        const safeUser = this._safeUser(user);
        this.setCurrentUser(safeUser);
        AppDB.logActivity(user.id, user.role, "login", `Logged in as ${user.role}`);
        return { success: true, user: safeUser };
    },
    register: async function (data) {
        const name = (data.name || "").trim();
        const email = (data.email || "").trim().toLowerCase();
        const password = data.password || "";
        const role = data.role || "student";
        if (name.length < 2 || name.length > 70) return { success: false, message: "Name must contain between 2 and 70 characters." };
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { success: false, message: "Enter a valid email address." };
        if (password.length < 10 || !/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/[0-9]/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
            return { success: false, message: "Use at least 10 characters with uppercase, lowercase, a number and a special character." };
        }
        if (!/[a-zA-Z]/.test(name)) return { success: false, message: "Enter a valid full name." };
        if (!["student", "instructor"].includes(role)) return { success: false, message: "Only student and instructor registration is available." };
        const users = AppDB.findAll(StorageKeys.USERS);
        if (users.some(item => (item.email || "").toLowerCase() === email)) return { success: false, message: "An account with this email already exists." };
        let hashed;
        try { hashed = await this._hashPassword(password); }
        catch (error) { return { success: false, message: error.message || "Secure password hashing is unavailable." }; }
        const id = `${role}-${Date.now()}-${window.crypto.getRandomValues(new Uint32Array(1))[0].toString(36)}`;
        const createdAt = new Date().toISOString();
        const newUser = { id, name, email, role, ...hashed, avatar: "", title: "", bio: "", createdAt };
        AppDB.insert(StorageKeys.USERS, newUser);
        if (role === "student") AppDB.insert(StorageKeys.STUDENTS, { id, userId: id, name, email, avatar: "", title: "", status: "Active", createdAt });
        if (role === "instructor") AppDB.insert(StorageKeys.INSTRUCTORS, { id, userId: id, name, email, role, title: "", bio: "", avatar: "", rating: 0, reviewsCount: 0, createdAt });
        AppDB.logActivity(id, role, "registered", `Created new ${role} account`);
        return { success: true, user: this._safeUser(newUser) };
    },
    logout: function () {
        const user = this.getCurrentUser();
        if (user) AppDB.logActivity(user.id, user.role, "logout", "Logged out");
        AppStorage.remove(StorageKeys.AUTH_USER);
    },
    isAuthenticated: function () { return this.getCurrentUser() !== null; }
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
        const protectedSyllabusIds = new Set(Array.from({ length: 12 }, (_, index) => `course-${index + 1}`));
        if (protectedSyllabusIds.has(id)) {
            if (typeof document !== "undefined" && typeof LMSStorage !== "undefined") LMSStorage.showToast("This syllabus course is part of the LearnX core catalog and cannot be deleted.", "info");
            return false;
        }
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

        // Filter assignments for enrolled courses only (or all if not enrolled in any)
        const targetAssignments = enrolledCourseIds.length > 0
            ? assignments.filter(a => enrolledCourseIds.includes(a.courseId))
            : assignments;

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

        return {
            enrolledCount: enrolledCourseIds.length,
            completedLessonsCount: completedLessonIds.length,
            overallProgressPercentage: overallProg.overallPercent,
            totalLessonsCount: overallProg.totalLessonsInEnrolled,
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
        const users = this.getAllUsers();
        users.push(user);
        localStorage.setItem(LMS_STORAGE_KEYS.USERS, JSON.stringify(users));
        return user;
    },

    // ----------------- Courses -----------------
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
        return courses.find(c => c.id === id) || null;
    },

    saveCourses: function (courses) {
        localStorage.setItem(LMS_STORAGE_KEYS.COURSES, JSON.stringify(courses));
        if (typeof AppStorage !== "undefined") {
            AppStorage.emit(LMS_STORAGE_KEYS.COURSES, courses);
        }
    },

    addCourse: function (courseData, instructorId) {
        if (typeof CourseService !== "undefined") {
            return CourseService.createCourse(courseData, instructorId);
        }
        const courses = this.getCourses();
        const newId = "course-" + (courses.length + 1) + "-" + Date.now().toString().slice(-4);
        const newCourse = {
            id: newId,
            rating: 5.0,
            reviewsCount: 1,
            enrolledCount: 0,
            badge: "New",
            curriculum: courseData.curriculum || [
                {
                    id: "mod-" + Date.now(),
                    title: "Module 1: Introduction",
                    lessons: [
                        { id: newId + "-l1", title: "1. Overview & Setup", duration: "20m", minutes: 20, videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", summary: "Overview" }
                    ]
                }
            ],
            ...courseData
        };
        courses.unshift(newCourse);
        this.saveCourses(courses);
        return newCourse;
    },

    updateCourse: function (courseId, updatedFields) {
        if (typeof CourseService !== "undefined") {
            return CourseService.updateCourse(courseId, updatedFields);
        }
        const courses = this.getCourses();
        const index = courses.findIndex(c => c.id === courseId);
        if (index !== -1) {
            courses[index] = { ...courses[index], ...updatedFields };
            this.saveCourses(courses);
            return courses[index];
        }
        return null;
    },

    deleteCourse: function (courseId) {
        if (typeof CourseService !== "undefined") {
            return CourseService.deleteCourse(courseId);
        }
        let courses = this.getCourses();
        courses = courses.filter(c => c.id !== courseId);
        this.saveCourses(courses);
        return true;
    },

    // ----------------- Instructors -----------------
    getInstructors: function () {
        if (typeof AppDB !== "undefined") {
            return AppDB.findAll(LMS_STORAGE_KEYS.INSTRUCTORS);
        }
        try {
            return JSON.parse(localStorage.getItem(LMS_STORAGE_KEYS.INSTRUCTORS)) || [];
        } catch (e) {
            return [];
        }
    },

    addInstructor: function (instructorData) {
        if (typeof AppDB !== "undefined") {
            const inst = {
                id: "inst-" + Date.now().toString().slice(-4),
                rating: 5.0,
                reviewsCount: 0,
                avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
                ...instructorData
            };
            return AppDB.insert(LMS_STORAGE_KEYS.INSTRUCTORS, inst);
        }
        return null;
    },

    updateInstructor: function (id, updatedFields) {
        if (typeof AppDB !== "undefined") {
            return AppDB.update(LMS_STORAGE_KEYS.INSTRUCTORS, id, updatedFields);
        }
        return null;
    },

    deleteInstructor: function (id) {
        if (typeof AppDB !== "undefined") {
            return AppDB.delete(LMS_STORAGE_KEYS.INSTRUCTORS, id);
        }
        return false;
    },

    // ----------------- Students -----------------
    getStudents: function () {
        if (typeof AppDB !== "undefined") {
            return AppDB.findAll(LMS_STORAGE_KEYS.STUDENTS);
        }
        try {
            return JSON.parse(localStorage.getItem(LMS_STORAGE_KEYS.STUDENTS)) || [];
        } catch (e) {
            return [];
        }
    },

    addStudent: function (studentData) {
        if (typeof AppDB !== "undefined") {
            const stu = {
                id: "STU-" + Date.now().toString().slice(-4),
                avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80",
                status: "Active",
                ...studentData
            };
            return AppDB.insert(LMS_STORAGE_KEYS.STUDENTS, stu);
        }
        return null;
    },

    updateStudent: function (id, updatedFields) {
        if (typeof AppDB !== "undefined") {
            return AppDB.update(LMS_STORAGE_KEYS.STUDENTS, id, updatedFields);
        }
        return null;
    },

    deleteStudent: function (id) {
        if (typeof AppDB !== "undefined") {
            return AppDB.delete(LMS_STORAGE_KEYS.STUDENTS, id);
        }
        return false;
    },

    // ----------------- Enrollments & Progress -----------------
    getEnrolledCourseIds: function (studentId) {
        const user = this.getCurrentUser();
        const sId = studentId || (user ? user.id : null);
        if (!sId) return [];
        if (typeof EnrollmentService !== "undefined") return EnrollmentService.getEnrolledCourseIds(sId);
        return [];
    },

    getEnrollments: function () {
        return typeof AppDB !== "undefined" ? AppDB.findAll(StorageKeys.ENROLLMENTS) : [];
    },

    isEnrolled: function (courseId, studentId) {
        const user = this.getCurrentUser();
        const sId = studentId || (user ? user.id : null);
        return !!(sId && typeof EnrollmentService !== "undefined" && EnrollmentService.isEnrolled(sId, courseId));
    },

    enrollCourse: function (courseId, studentId) {
        const user = this.getCurrentUser();
        const sId = studentId || (user ? user.id : null);
        if (!sId || !user || user.role !== "student") return false;
        if (typeof EnrollmentService !== "undefined") {
            const res = EnrollmentService.enroll(sId, courseId);
            return res.success;
        }
        return false;
    },

    getCompletedLessonIds: function (studentId) {
        const user = this.getCurrentUser();
        const sId = studentId || (user ? user.id : null);
        if (!sId) return [];
        if (typeof ProgressService !== "undefined") {
            return ProgressService.getCompletedLessonIds(sId);
        }
        return [];
    },

    markLessonCompleted: function (lessonId, isCompleted = true, courseId = null, minutes = 0) {
        const user = this.getCurrentUser();
        const sId = user && user.role === "student" ? user.id : null;
        if (!sId) return false;

        if (typeof ProgressService !== "undefined") {
            // Find courseId if not provided
            if (!courseId) {
                const courses = this.getCourses();
                for (const c of courses) {
                    if (c.curriculum) {
                        for (const m of c.curriculum) {
                            if (m.lessons && m.lessons.some(l => l.id === lessonId)) {
                                courseId = c.id;
                                break;
                            }
                        }
                    }
                    if (courseId) break;
                }
            }
            const res = ProgressService.setLessonCompleted(sId, courseId, lessonId, isCompleted, minutes);
            return res.isCompleted;
        }
        return isCompleted;
    },

    recalculateStudentProgress: function (studentId) {
        const user = this.getCurrentUser();
        const sId = studentId || (user ? user.id : null);
        if (!sId) return { overallPercent: 0, completedInEnrolled: 0, totalLessonsInEnrolled: 0, enrolledCoursesCount: 0, completedCoursesCount: 0 };
        if (typeof ProgressService !== "undefined") {
            return ProgressService.getStudentOverallProgress(sId);
        }
        return { overallPercent: 0, completedInEnrolled: 0, totalLessonsInEnrolled: 0 };
    },

    getCourseProgress: function (courseId, studentId) {
        const user = this.getCurrentUser();
        const sId = studentId || (user ? user.id : null);
        if (!sId) return { completedCount: 0, totalCount: 0, percentage: 0, remainingCount: 0, isCompleted: false };
        if (typeof ProgressService !== "undefined") {
            return ProgressService.getCourseProgress(sId, courseId);
        }
        return { completedCount: 0, totalCount: 0, percentage: 0 };
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

    submitAssignment: function (assignmentId, fileData, notes) {
        const user = this.getCurrentUser();
        const sId = user && user.role === "student" ? user.id : null;
        if (!sId) return null;
        const fileName = (typeof fileData === "string" ? fileData : (fileData && fileData.fileName)) || "solution.zip";
        const comments = notes || (fileData && fileData.notes) || "";

        if (typeof AssignmentService !== "undefined") {
            const res = AssignmentService.submitAssignment(sId, assignmentId, fileName, comments);
            return res.submission;
        }
        return null;
    },

    // ----------------- Quizzes -----------------
    getQuizzesByCourse: function (courseId) {
        if (typeof QuizService !== "undefined") {
            return QuizService.getQuizzesByCourse(courseId);
        }
        return [];
    },

    submitQuizAttempt: function (quizId, answers) {
        const user = this.getCurrentUser();
        const sId = user && user.role === "student" ? user.id : null;
        if (!sId) return null;
        if (typeof QuizService !== "undefined") {
            return QuizService.submitQuizAttempt(sId, quizId, answers);
        }
        return null;
    },

    // ----------------- Analytics -----------------
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

    // ----------------- Toast Notification Helper -----------------
    showToast: function (message, type = "success") {
        let container = document.getElementById("learnx-toast-container");
        if (!container && typeof document !== "undefined") {
            container = document.createElement("div");
            container.id = "learnx-toast-container";
            container.style.cssText = "position:fixed;bottom:24px;right:24px;z-index:99999;display:flex;flex-direction:column;gap:12px;pointer-events:none;";
            document.body.appendChild(container);
        }
        if (!container) return;

        const toast = document.createElement("div");
        toast.className = `learnx-toast learnx-toast-${type}`;
        const bgColor = type === "success" ? "#10b981" : (type === "danger" ? "#ef4444" : "#6366f1");
        const icon = type === "success" ? "✓" : (type === "danger" ? "✕" : "ℹ");

        toast.style.cssText = `
            background: #ffffff;
            color: #1f2937;
            border-left: 5px solid ${bgColor};
            padding: 14px 20px;
            border-radius: 10px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.15);
            font-size: 14px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 12px;
            min-width: 280px;
            max-width: 420px;
            pointer-events: auto;
            transform: translateX(120%);
            transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
        `;

        toast.innerHTML = `
            <span style="display:grid;place-items:center;width:24px;height:24px;border-radius:50%;background:${bgColor}20;color:${bgColor};font-weight:bold;font-size:12px;">${icon}</span>
            <span style="flex:1;">${message}</span>
            <button type="button" style="border:none;background:none;color:#9ca3af;cursor:pointer;font-size:16px;line-height:1;" aria-label="Close">&times;</button>
        `;

        const closeBtn = toast.querySelector("button");
        const removeToast = () => {
            toast.style.transform = "translateX(120%)";
            toast.style.opacity = "0";
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        };

        closeBtn.addEventListener("click", removeToast);
        container.appendChild(toast);

        if (typeof requestAnimationFrame !== "undefined") {
            requestAnimationFrame(() => { toast.style.transform = "translateX(0)"; });
        } else {
            toast.style.transform = "translateX(0)";
        }

        setTimeout(removeToast, 4000);
    }
};

// Global export & auto initialization
if (typeof window !== "undefined") {
    window.LMS_STORAGE_KEYS = LMS_STORAGE_KEYS;
    window.LMSStorage = LMSStorage;
}
if (typeof module !== "undefined" && module.exports) {
    module.exports = { LMS_STORAGE_KEYS, LMSStorage };
}

/* ================= Syllabus-only LearnX course configuration ================= */
// LearnX catalog: 12 courses built only from the supplied 21-module syllabus.
const LEARNX_COURSES = [{"id":"course-1","title":"Web Development Fundamentals","slug":"web-development-fundamentals","category":"Web Development","level":"Beginner","duration":"Self-paced","totalLessons":3,"instructorId":"","instructor":"Instructor not assigned","rating":0,"reviewsCount":0,"enrolledCount":0,"badge":"Beginner","thumbnail":"https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80","description":"Start with the fundamentals of web architecture, understand web development roles, and set up your development environment.","objectives":["Introduction to Web Development"],"curriculum":[{"id":"syllabus-m01","title":"Module 1: Introduction to Web Development","lessons":[{"id":"syllabus-m01-l01","title":"Fundamentals of Web Architecture","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Fundamentals of Web Architecture. Study this topic and complete the related practice activity."},{"id":"syllabus-m01-l02","title":"Web Development Roles","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Web Development Roles. Study this topic and complete the related practice activity."},{"id":"syllabus-m01-l03","title":"Setting Up the Environment","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Setting Up the Environment. Study this topic and complete the related practice activity."}]}],"createdAt":"2026-11-23T00:00:00.000Z"},{"id":"course-2","title":"HTML Essentials","slug":"html-essentials","category":"HTML","level":"Beginner","duration":"Self-paced","totalLessons":4,"instructorId":"","instructor":"Instructor not assigned","rating":0,"reviewsCount":0,"enrolledCount":0,"badge":"Beginner","thumbnail":"https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=900&q=80","description":"Learn HTML basics, syntax, documentation, tags, elements, and semantic HTML.","objectives":["HTML"],"curriculum":[{"id":"syllabus-m02","title":"Module 2: HTML","lessons":[{"id":"syllabus-m02-l01","title":"HTML Basics","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: HTML Basics. Study this topic and complete the related practice activity."},{"id":"syllabus-m02-l02","title":"HTML Syntax and Documentation","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: HTML Syntax and Documentation. Study this topic and complete the related practice activity."},{"id":"syllabus-m02-l03","title":"HTML Tags and HTML Elements","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: HTML Tags and HTML Elements. Study this topic and complete the related practice activity."},{"id":"syllabus-m02-l04","title":"Semantic HTML","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Semantic HTML. Study this topic and complete the related practice activity."}]}],"createdAt":"2026-11-23T00:00:00.000Z"},{"id":"course-3","title":"Advanced HTML","slug":"advanced-html","category":"HTML","level":"Intermediate","duration":"Self-paced","totalLessons":16,"instructorId":"","instructor":"Instructor not assigned","rating":0,"reviewsCount":0,"enrolledCount":0,"badge":"Beginner to Intermediate","thumbnail":"https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80","description":"Work with HTML attributes, headings, paragraphs, tables, dropdowns, quotations, lists, blocks, layouts, iframes, entities, URI code, frames, charset, and forms.","objectives":["HTML Block and Inline Elements","HTML Iframes"],"curriculum":[{"id":"syllabus-m03","title":"Module 3: HTML Block and Inline Elements","lessons":[{"id":"syllabus-m03-l01","title":"Attributes","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Attributes. Study this topic and complete the related practice activity."},{"id":"syllabus-m03-l02","title":"Headings","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Headings. Study this topic and complete the related practice activity."},{"id":"syllabus-m03-l03","title":"Paragraph","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Paragraph. Study this topic and complete the related practice activity."},{"id":"syllabus-m03-l04","title":"Tables","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Tables. Study this topic and complete the related practice activity."},{"id":"syllabus-m03-l05","title":"Dropdown","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Dropdown. Study this topic and complete the related practice activity."},{"id":"syllabus-m03-l06","title":"Quotations","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Quotations. Study this topic and complete the related practice activity."},{"id":"syllabus-m03-l07","title":"Lists","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Lists. Study this topic and complete the related practice activity."},{"id":"syllabus-m03-l08","title":"Blocks","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Blocks. Study this topic and complete the related practice activity."},{"id":"syllabus-m03-l09","title":"Layout","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Layout. Study this topic and complete the related practice activity."}]},{"id":"syllabus-m04","title":"Module 4: HTML Iframes","lessons":[{"id":"syllabus-m04-l01","title":"Responsive Iframes","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Responsive Iframes. Study this topic and complete the related practice activity."},{"id":"syllabus-m04-l02","title":"Head","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Head. Study this topic and complete the related practice activity."},{"id":"syllabus-m04-l03","title":"Entities and URI Code","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Entities and URI Code. Study this topic and complete the related practice activity."},{"id":"syllabus-m04-l04","title":"Frames","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Frames. Study this topic and complete the related practice activity."},{"id":"syllabus-m04-l05","title":"Charset and Forms","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Charset and Forms. Study this topic and complete the related practice activity."},{"id":"syllabus-m04-l06","title":"Elements","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Elements. Study this topic and complete the related practice activity."},{"id":"syllabus-m04-l07","title":"Securities","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Securities. Study this topic and complete the related practice activity."}]}],"createdAt":"2026-11-23T00:00:00.000Z"},{"id":"course-4","title":"CSS Fundamentals","slug":"css-fundamentals","category":"CSS","level":"Beginner","duration":"Self-paced","totalLessons":11,"instructorId":"","instructor":"Instructor not assigned","rating":0,"reviewsCount":0,"enrolledCount":0,"badge":"Beginner","thumbnail":"https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=900&q=80","description":"Learn CSS syntax, stylesheet types, selectors, colors, backgrounds, the box model, units, layout basics, positioning, and hands-on practice.","objectives":["CSS"],"curriculum":[{"id":"syllabus-m05","title":"Module 5: CSS","lessons":[{"id":"syllabus-m05-l01","title":"Intro to CSS","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Intro to CSS. Study this topic and complete the related practice activity."},{"id":"syllabus-m05-l02","title":"Syntax","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Syntax. Study this topic and complete the related practice activity."},{"id":"syllabus-m05-l03","title":"Types CSS","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Types CSS. Study this topic and complete the related practice activity."},{"id":"syllabus-m05-l04","title":"Adding CSS to HTML","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Adding CSS to HTML. Study this topic and complete the related practice activity."},{"id":"syllabus-m05-l05","title":"CSS Selectors","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: CSS Selectors. Study this topic and complete the related practice activity."},{"id":"syllabus-m05-l06","title":"CSS Colors & Backgrounds","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: CSS Colors & Backgrounds. Study this topic and complete the related practice activity."},{"id":"syllabus-m05-l07","title":"CSS Box Model","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: CSS Box Model. Study this topic and complete the related practice activity."},{"id":"syllabus-m05-l08","title":"CSS Units","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: CSS Units. Study this topic and complete the related practice activity."},{"id":"syllabus-m05-l09","title":"CSS Layout Basics","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: CSS Layout Basics. Study this topic and complete the related practice activity."},{"id":"syllabus-m05-l10","title":"Positioning Elements","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Positioning Elements. Study this topic and complete the related practice activity."},{"id":"syllabus-m05-l11","title":"Hands-on Practice","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Hands-on Practice. Study this topic and complete the related practice activity."}]}],"createdAt":"2026-11-23T00:00:00.000Z"},{"id":"course-5","title":"Advanced CSS Styling","slug":"advanced-css-styling","category":"CSS","level":"Intermediate","duration":"Self-paced","totalLessons":22,"instructorId":"","instructor":"Instructor not assigned","rating":0,"reviewsCount":0,"enrolledCount":0,"badge":"Intermediate","thumbnail":"https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=900&q=80","description":"Explore borders, padding, dimensions, gradients, shadows, typography, outlines, transitions, navigation bars, combinators, pseudo-classes, tooltips, images, buttons, animations, UI, and box sizing.","objectives":["CSS Model","CSS Classes"],"curriculum":[{"id":"syllabus-m07","title":"Module 7: CSS Model","lessons":[{"id":"syllabus-m07-l01","title":"Borders","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Borders. Study this topic and complete the related practice activity."},{"id":"syllabus-m07-l02","title":"Padding","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Padding. Study this topic and complete the related practice activity."},{"id":"syllabus-m07-l03","title":"Height/Width","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Height/Width. Study this topic and complete the related practice activity."},{"id":"syllabus-m07-l04","title":"Gradients","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Gradients. Study this topic and complete the related practice activity."},{"id":"syllabus-m07-l05","title":"Shadows","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Shadows. Study this topic and complete the related practice activity."},{"id":"syllabus-m07-l06","title":"Selectors","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Selectors. Study this topic and complete the related practice activity."},{"id":"syllabus-m07-l07","title":"Transformations","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Transformations. Study this topic and complete the related practice activity."},{"id":"syllabus-m07-l08","title":"Typography","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Typography. Study this topic and complete the related practice activity."},{"id":"syllabus-m07-l09","title":"Box Model","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Box Model. Study this topic and complete the related practice activity."},{"id":"syllabus-m07-l10","title":"Outline","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Outline. Study this topic and complete the related practice activity."},{"id":"syllabus-m07-l11","title":"Transitions","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Transitions. Study this topic and complete the related practice activity."},{"id":"syllabus-m07-l12","title":"Navigation Bar","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Navigation Bar. Study this topic and complete the related practice activity."},{"id":"syllabus-m07-l13","title":"CSS Combinators","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: CSS Combinators. Study this topic and complete the related practice activity."},{"id":"syllabus-m07-l14","title":"CSS","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: CSS. Study this topic and complete the related practice activity."}]},{"id":"syllabus-m08","title":"Module 8: CSS Classes","lessons":[{"id":"syllabus-m08-l01","title":"Pseudo-class","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Pseudo-class. Study this topic and complete the related practice activity."},{"id":"syllabus-m08-l02","title":"Tooltips","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Tooltips. Study this topic and complete the related practice activity."},{"id":"syllabus-m08-l03","title":"Images","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Images. Study this topic and complete the related practice activity."},{"id":"syllabus-m08-l04","title":"Selectors","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Selectors. Study this topic and complete the related practice activity."},{"id":"syllabus-m08-l05","title":"Button","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Button. Study this topic and complete the related practice activity."},{"id":"syllabus-m08-l06","title":"Animations","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Animations. Study this topic and complete the related practice activity."},{"id":"syllabus-m08-l07","title":"User Interface","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: User Interface. Study this topic and complete the related practice activity."},{"id":"syllabus-m08-l08","title":"Box Sizing","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Box Sizing. Study this topic and complete the related practice activity."}]}],"createdAt":"2026-11-23T00:00:00.000Z"},{"id":"course-6","title":"Flexbox & CSS Grid","slug":"flexbox-css-grid","category":"CSS","level":"Intermediate","duration":"Self-paced","totalLessons":5,"instructorId":"","instructor":"Instructor not assigned","rating":0,"reviewsCount":0,"enrolledCount":0,"badge":"Beginner to Intermediate","thumbnail":"https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=900&q=80","description":"Build layouts with Flexbox and CSS Grid, and learn CSS transformations, animations, and CSS frameworks.","objectives":["Flex"],"curriculum":[{"id":"syllabus-m06","title":"Module 6: Flex","lessons":[{"id":"syllabus-m06-l01","title":"Flexbox Basics","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Flexbox Basics. Study this topic and complete the related practice activity."},{"id":"syllabus-m06-l02","title":"CSS Grid Basics","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: CSS Grid Basics. Study this topic and complete the related practice activity."},{"id":"syllabus-m06-l03","title":"CSS Transformations","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: CSS Transformations. Study this topic and complete the related practice activity."},{"id":"syllabus-m06-l04","title":"CSS Animations","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: CSS Animations. Study this topic and complete the related practice activity."},{"id":"syllabus-m06-l05","title":"CSS Frameworks","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: CSS Frameworks. Study this topic and complete the related practice activity."}]}],"createdAt":"2026-11-23T00:00:00.000Z"},{"id":"course-7","title":"Responsive Web Design & Bootstrap","slug":"responsive-web-design-bootstrap","category":"Responsive Design","level":"Intermediate","duration":"Self-paced","totalLessons":18,"instructorId":"","instructor":"Instructor not assigned","rating":0,"reviewsCount":0,"enrolledCount":0,"badge":"Intermediate","thumbnail":"https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80","description":"Create responsive interfaces with filters, media queries, Bootstrap grids, themes, alerts, badges, labels, panels, pagination, pager, carousel, and progress bars. Includes syllabus revision and the mid-term exam.","objectives":["Responsive CSS","Bootstrap","Revision & Story-Based Problem Solving"],"curriculum":[{"id":"syllabus-m09","title":"Module 9: Responsive CSS","lessons":[{"id":"syllabus-m09-l01","title":"Filters","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Filters. Study this topic and complete the related practice activity."},{"id":"syllabus-m09-l02","title":"Responsive Web Designs","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Responsive Web Designs. Study this topic and complete the related practice activity."},{"id":"syllabus-m09-l03","title":"CSS Media Queries","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: CSS Media Queries. Study this topic and complete the related practice activity."},{"id":"syllabus-m09-l04","title":"Cheat Sheets","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Cheat Sheets. Study this topic and complete the related practice activity."}]},{"id":"syllabus-m10","title":"Module 10: Bootstrap","lessons":[{"id":"syllabus-m10-l01","title":"Intro to Bootstrap","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Intro to Bootstrap. Study this topic and complete the related practice activity."},{"id":"syllabus-m10-l02","title":"Bootstrap Basics","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Bootstrap Basics. Study this topic and complete the related practice activity."},{"id":"syllabus-m10-l03","title":"Bootstrap Grids","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Bootstrap Grids. Study this topic and complete the related practice activity."},{"id":"syllabus-m10-l04","title":"Bootstrap CSS","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Bootstrap CSS. Study this topic and complete the related practice activity."},{"id":"syllabus-m10-l05","title":"Bootstrap Themes","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Bootstrap Themes. Study this topic and complete the related practice activity."},{"id":"syllabus-m10-l06","title":"Alert Wells","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Alert Wells. Study this topic and complete the related practice activity."},{"id":"syllabus-m10-l07","title":"Badge and Label","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Badge and Label. Study this topic and complete the related practice activity."},{"id":"syllabus-m10-l08","title":"Panels","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Panels. Study this topic and complete the related practice activity."},{"id":"syllabus-m10-l09","title":"Pagination","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Pagination. Study this topic and complete the related practice activity."},{"id":"syllabus-m10-l10","title":"Pager","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Pager. Study this topic and complete the related practice activity."},{"id":"syllabus-m10-l11","title":"Carousel","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Carousel. Study this topic and complete the related practice activity."},{"id":"syllabus-m10-l12","title":"Progress Bar","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Progress Bar. Study this topic and complete the related practice activity."}]},{"id":"syllabus-m11","title":"Module 11: Revision & Story-Based Problem Solving","lessons":[{"id":"syllabus-m11-l01","title":"Revision & Story-Based Problem Solving","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Revision & Story-Based Problem Solving. Study this topic and complete the related practice activity."},{"id":"syllabus-m11-l02","title":"Mid Term Exam","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Mid Term Exam. Study this topic and complete the related practice activity."}]}],"createdAt":"2026-11-23T00:00:00.000Z"},{"id":"course-8","title":"JavaScript Fundamentals","slug":"javascript-fundamentals","category":"JavaScript","level":"Beginner","duration":"Self-paced","totalLessons":5,"instructorId":"","instructor":"Instructor not assigned","rating":0,"reviewsCount":0,"enrolledCount":0,"badge":"Beginner","thumbnail":"https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=900&q=80","description":"Begin JavaScript with language types, operators, logical operators, math, and control structures.","objectives":["Javascript"],"curriculum":[{"id":"syllabus-m12","title":"Module 12: Javascript","lessons":[{"id":"syllabus-m12-l01","title":"Introduction to JavaScript and JavaScript Types","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Introduction to JavaScript and JavaScript Types. Study this topic and complete the related practice activity."},{"id":"syllabus-m12-l02","title":"Operators","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Operators. Study this topic and complete the related practice activity."},{"id":"syllabus-m12-l03","title":"Logical Operators","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Logical Operators. Study this topic and complete the related practice activity."},{"id":"syllabus-m12-l04","title":"Math in JavaScript","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Math in JavaScript. Study this topic and complete the related practice activity."},{"id":"syllabus-m12-l05","title":"Control Structures","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Control Structures. Study this topic and complete the related practice activity."}]}],"createdAt":"2026-11-23T00:00:00.000Z"},{"id":"course-9","title":"Advanced JavaScript","slug":"advanced-javascript","category":"JavaScript","level":"Intermediate","duration":"Self-paced","totalLessons":15,"instructorId":"","instructor":"Instructor not assigned","rating":0,"reviewsCount":0,"enrolledCount":0,"badge":"Intermediate","thumbnail":"https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80","description":"Practice scope, events, strings, arrays, booleans, comparisons, conditions, switch statements, loops, type conversion, errors, debugging, hoisting, and strict mode.","objectives":["JS Operators","JS ES Features"],"curriculum":[{"id":"syllabus-m13","title":"Module 13: JS Operators","lessons":[{"id":"syllabus-m13-l01","title":"Scope","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Scope. Study this topic and complete the related practice activity."},{"id":"syllabus-m13-l02","title":"Events","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Events. Study this topic and complete the related practice activity."},{"id":"syllabus-m13-l03","title":"Strings","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Strings. Study this topic and complete the related practice activity."},{"id":"syllabus-m13-l04","title":"Math","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Math. Study this topic and complete the related practice activity."},{"id":"syllabus-m13-l05","title":"Arrays","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Arrays. Study this topic and complete the related practice activity."},{"id":"syllabus-m13-l06","title":"Boolean","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Boolean. Study this topic and complete the related practice activity."},{"id":"syllabus-m13-l07","title":"Comparisons","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Comparisons. Study this topic and complete the related practice activity."},{"id":"syllabus-m13-l08","title":"Conditions","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Conditions. Study this topic and complete the related practice activity."}]},{"id":"syllabus-m14","title":"Module 14: JS ES Features","lessons":[{"id":"syllabus-m14-l01","title":"Switch","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Switch. Study this topic and complete the related practice activity."},{"id":"syllabus-m14-l02","title":"Loops","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Loops. Study this topic and complete the related practice activity."},{"id":"syllabus-m14-l03","title":"Type Conversion","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Type Conversion. Study this topic and complete the related practice activity."},{"id":"syllabus-m14-l04","title":"Errors","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Errors. Study this topic and complete the related practice activity."},{"id":"syllabus-m14-l05","title":"Debugging","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Debugging. Study this topic and complete the related practice activity."},{"id":"syllabus-m14-l06","title":"Hoisting","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Hoisting. Study this topic and complete the related practice activity."},{"id":"syllabus-m14-l07","title":"Strict Mode","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Strict Mode. Study this topic and complete the related practice activity."}]}],"createdAt":"2026-11-23T00:00:00.000Z"},{"id":"course-10","title":"JavaScript Objects & Functions","slug":"javascript-objects-functions","category":"JavaScript","level":"Intermediate","duration":"Self-paced","totalLessons":8,"instructorId":"","instructor":"Instructor not assigned","rating":0,"reviewsCount":0,"enrolledCount":0,"badge":"Intermediate","thumbnail":"https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=900&q=80","description":"Work with arrays, objects, loops, forms, regular expressions, functions, advanced functions, prototypes, and constructor functions.","objectives":["JS Classes","JS Functions"],"curriculum":[{"id":"syllabus-m15","title":"Module 15: JS Classes","lessons":[{"id":"syllabus-m15-l01","title":"Arrays","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Arrays. Study this topic and complete the related practice activity."},{"id":"syllabus-m15-l02","title":"Objects and Loops","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Objects and Loops. Study this topic and complete the related practice activity."},{"id":"syllabus-m15-l03","title":"Forms","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Forms. Study this topic and complete the related practice activity."},{"id":"syllabus-m15-l04","title":"JavaScript RegExp","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: JavaScript RegExp. Study this topic and complete the related practice activity."}]},{"id":"syllabus-m16","title":"Module 16: JS Functions","lessons":[{"id":"syllabus-m16-l01","title":"Functions","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Functions. Study this topic and complete the related practice activity."},{"id":"syllabus-m16-l02","title":"Advanced Functions","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Advanced Functions. Study this topic and complete the related practice activity."},{"id":"syllabus-m16-l03","title":"Prototypes","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Prototypes. Study this topic and complete the related practice activity."},{"id":"syllabus-m16-l04","title":"Constructor Functions","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Constructor Functions. Study this topic and complete the related practice activity."}]}],"createdAt":"2026-11-23T00:00:00.000Z"},{"id":"course-11","title":"DOM Manipulation & OOP with JavaScript","slug":"dom-manipulation-oop-with-javascript","category":"JavaScript","level":"Intermediate","duration":"Self-paced","totalLessons":6,"instructorId":"","instructor":"Instructor not assigned","rating":0,"reviewsCount":0,"enrolledCount":0,"badge":"Intermediate","thumbnail":"https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=900&q=80","description":"Understand the DOM, select elements, handle events and event mechanics, apply advanced object-oriented concepts, use advanced array methods, and handle errors.","objectives":["DOM","OOPS with JS"],"curriculum":[{"id":"syllabus-m18","title":"Module 18: DOM","lessons":[{"id":"syllabus-m18-l01","title":"Introduction to DOM","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Introduction to DOM. Study this topic and complete the related practice activity."},{"id":"syllabus-m18-l02","title":"Selecting Elements","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Selecting Elements. Study this topic and complete the related practice activity."},{"id":"syllabus-m18-l03","title":"Events and Event Mechanics","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Events and Event Mechanics. Study this topic and complete the related practice activity."}]},{"id":"syllabus-m19","title":"Module 19: OOPS with JS","lessons":[{"id":"syllabus-m19-l01","title":"Advanced Object-Oriented Concepts","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Advanced Object-Oriented Concepts. Study this topic and complete the related practice activity."},{"id":"syllabus-m19-l02","title":"Advanced Array Methods","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Advanced Array Methods. Study this topic and complete the related practice activity."},{"id":"syllabus-m19-l03","title":"Error Handling","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Error Handling. Study this topic and complete the related practice activity."}]}],"createdAt":"2026-11-23T00:00:00.000Z"},{"id":"course-12","title":"Async JavaScript, jQuery & APIs","slug":"async-javascript-jquery-apis","category":"JavaScript & APIs","level":"Advanced","duration":"Self-paced","totalLessons":22,"instructorId":"","instructor":"Instructor not assigned","rating":0,"reviewsCount":0,"enrolledCount":0,"badge":"Advanced","thumbnail":"https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=900&q=80","description":"Study the event loop, callbacks, promises, async/await, jQuery syntax and DOM manipulation, selectors, events, effects, traversing, AJAX, HTTP requests, XMLHttpRequest, Fetch API, third-party libraries, response handling, and JSON Server.","objectives":["Async Programming with JS","jQuery & Ajax","APIs and Endpoints"],"curriculum":[{"id":"syllabus-m17","title":"Module 17: Async Programming with JS","lessons":[{"id":"syllabus-m17-l01","title":"Event Loop","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Event Loop. Study this topic and complete the related practice activity."},{"id":"syllabus-m17-l02","title":"Callbacks","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Callbacks. Study this topic and complete the related practice activity."},{"id":"syllabus-m17-l03","title":"Promises","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Promises. Study this topic and complete the related practice activity."},{"id":"syllabus-m17-l04","title":"Async/Await","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Async/Await. Study this topic and complete the related practice activity."}]},{"id":"syllabus-m20","title":"Module 20: jQuery & Ajax","lessons":[{"id":"syllabus-m20-l01","title":"Introduction to jQuery","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Introduction to jQuery. Study this topic and complete the related practice activity."},{"id":"syllabus-m20-l02","title":"jQuery DOM Manipulation","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: jQuery DOM Manipulation. Study this topic and complete the related practice activity."},{"id":"syllabus-m20-l03","title":"jQuery Syntax","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: jQuery Syntax. Study this topic and complete the related practice activity."},{"id":"syllabus-m20-l04","title":"jQuery Selectors","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: jQuery Selectors. Study this topic and complete the related practice activity."},{"id":"syllabus-m20-l05","title":"jQuery Events","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: jQuery Events. Study this topic and complete the related practice activity."},{"id":"syllabus-m20-l06","title":"jQuery Effects","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: jQuery Effects. Study this topic and complete the related practice activity."},{"id":"syllabus-m20-l07","title":"jQuery Traversing","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: jQuery Traversing. Study this topic and complete the related practice activity."},{"id":"syllabus-m20-l08","title":"Event Handling in jQuery","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Event Handling in jQuery. Study this topic and complete the related practice activity."},{"id":"syllabus-m20-l09","title":"Introduction to AJAX","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Introduction to AJAX. Study this topic and complete the related practice activity."},{"id":"syllabus-m20-l10","title":"Traditional vs. AJAX Model","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Traditional vs. AJAX Model. Study this topic and complete the related practice activity."},{"id":"syllabus-m20-l11","title":"jQuery Ajax","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: jQuery Ajax. Study this topic and complete the related practice activity."}]},{"id":"syllabus-m21","title":"Module 21: APIs and Endpoints","lessons":[{"id":"syllabus-m21-l01","title":"Making HTTP Requests with JavaScript","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Making HTTP Requests with JavaScript. Study this topic and complete the related practice activity."},{"id":"syllabus-m21-l02","title":"AJAX with XMLHttpRequest","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: AJAX with XMLHttpRequest. Study this topic and complete the related practice activity."},{"id":"syllabus-m21-l03","title":"Fetch API","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Fetch API. Study this topic and complete the related practice activity."},{"id":"syllabus-m21-l04","title":"Using Fetch API","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Using Fetch API. Study this topic and complete the related practice activity."},{"id":"syllabus-m21-l05","title":"Third-Party Libraries","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Third-Party Libraries. Study this topic and complete the related practice activity."},{"id":"syllabus-m21-l06","title":"Handling Responses","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: Handling Responses. Study this topic and complete the related practice activity."},{"id":"syllabus-m21-l07","title":"JSON Server","duration":"Self-paced","minutes":0,"summary":"Syllabus topic: JSON Server. Study this topic and complete the related practice activity."}]}],"createdAt":"2026-11-23T00:00:00.000Z"}];

// LearnX starts with no demo accounts or pre-filled instructor/student profiles.
SeedData.SEED_USERS = [];
SeedData.SEED_INSTRUCTORS = [];
SeedData.SEED_STUDENTS = [];

// Use this syllabus-based catalog for first-time initialization.
LEARNX_COURSES.forEach(course => {
    course.instructorId = "";
    course.instructor = "Instructor not assigned";
});
SeedData.SEED_COURSES = LEARNX_COURSES;
SeedData.SEED_ENROLLMENTS = [];
SeedData.SEED_LESSON_COMPLETIONS = [];
SeedData.SEED_ASSIGNMENTS = [];
SeedData.SEED_SUBMISSIONS = [];
SeedData.SEED_QUIZZES = [];
SeedData.SEED_QUIZ_ATTEMPTS = [];
SeedData.SEED_ACTIVITY_LOGS = [];

if (typeof AppDB !== "undefined") {
    AppDB.init();

    // v2 migration splits the previous single 21-module course into 12 syllabus tracks.
    // Existing accounts are preserved. Old course-1 enrollments are expanded to the
    // 12 replacement tracks, and completed lessons are assigned to their new course.
    const catalogMigrationKey = "learnx_course_catalog_migration_v2";
    if (localStorage.getItem(catalogMigrationKey) !== '\"done\"') {
        const previousEnrollments = AppStorage.get(StorageKeys.ENROLLMENTS, []);
        const previousCompletions = AppStorage.get(StorageKeys.LESSON_COMPLETIONS, []);
        const previousAssignments = AppStorage.get(StorageKeys.ASSIGNMENTS, []);
        const previousQuizzes = AppStorage.get(StorageKeys.QUIZZES, []);

        const lessonCourseMap = {};
        LEARNX_COURSES.forEach(course => {
            (course.curriculum || []).forEach(module => {
                (module.lessons || []).forEach(lesson => { lessonCourseMap[lesson.id] = course.id; });
            });
        });

        const migratedEnrollments = [];
        const addEnrollment = (studentId, courseId, source) => {
            if (!studentId || !courseId) return;
            if (migratedEnrollments.some(item => item.studentId === studentId && item.courseId === courseId)) return;
            migratedEnrollments.push({
                id: `catalog-v2-${studentId}-${courseId}`,
                studentId,
                courseId,
                enrolledAt: source && source.enrolledAt ? source.enrolledAt : new Date().toISOString(),
                status: source && source.status ? source.status : "active"
            });
        };

        previousEnrollments.forEach(enrollment => {
            if (enrollment.courseId === "course-1") {
                LEARNX_COURSES.forEach(course => addEnrollment(enrollment.studentId, course.id, enrollment));
            } else if (LEARNX_COURSES.some(course => course.id === enrollment.courseId)) {
                addEnrollment(enrollment.studentId, enrollment.courseId, enrollment);
            }
        });

        const migratedCompletions = previousCompletions.reduce((result, completion) => {
            const mappedCourseId = lessonCourseMap[completion.lessonId];
            if (!mappedCourseId) return result;
            const alreadyAdded = result.some(item => item.studentId === completion.studentId && item.lessonId === completion.lessonId);
            if (!alreadyAdded) result.push({ ...completion, courseId: mappedCourseId });
            addEnrollment(completion.studentId, mappedCourseId, null);
            return result;
        }, []);

        const migratedAssignments = previousAssignments.map(item => ({
            ...item,
            courseId: LEARNX_COURSES.some(course => course.id === item.courseId) ? item.courseId : "course-1"
        }));
        const migratedQuizzes = previousQuizzes.map(item => ({
            ...item,
            courseId: LEARNX_COURSES.some(course => course.id === item.courseId) ? item.courseId : "course-1"
        }));

        AppStorage.set(StorageKeys.COURSES, LEARNX_COURSES, false);
        AppStorage.set(StorageKeys.ENROLLMENTS, migratedEnrollments, false);
        AppStorage.set(StorageKeys.LESSON_COMPLETIONS, migratedCompletions, false);
        AppStorage.set(StorageKeys.ASSIGNMENTS, migratedAssignments, false);
        AppStorage.set(StorageKeys.QUIZZES, migratedQuizzes, false);
        AppStorage.set(catalogMigrationKey, "done", false);
        console.info("[LearnX] Migrated catalog to 12 syllabus-based courses.");
    }
}
