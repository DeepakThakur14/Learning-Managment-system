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

    enrollStudent: function (studentId, courseId) {
        return this.enroll(studentId, courseId);
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
