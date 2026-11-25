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
