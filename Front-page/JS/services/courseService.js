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
