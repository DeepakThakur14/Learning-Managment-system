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
