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
