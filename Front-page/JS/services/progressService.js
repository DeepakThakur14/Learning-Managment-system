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
