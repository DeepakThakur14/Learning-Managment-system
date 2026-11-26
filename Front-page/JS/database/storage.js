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
    LESSONS: "learnx_lessons",
    LESSON_COMPLETIONS: "learnx_lesson_completions",
    ASSIGNMENTS: "learnx_assignments",
    SUBMISSIONS: "learnx_submissions",
    QUIZZES: "learnx_quizzes",
    QUIZ_ATTEMPTS: "learnx_quiz_attempts",
    ACTIVITY_LOGS: "learnx_activity_logs",
    NOTIFICATIONS: "learnx_notifications",
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
        if (typeof window === "undefined") return () => {};
        
        const handler = (e) => callback(e.detail);
        window.addEventListener("learnx:data-changed", handler);
        
        // Also listen for cross-tab storage events
        const storageHandler = (e) => {
            if (e.key && e.key.startsWith("learnx_")) {
                let parsed = null;
                try { parsed = JSON.parse(e.newValue); } catch (err) {}
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
