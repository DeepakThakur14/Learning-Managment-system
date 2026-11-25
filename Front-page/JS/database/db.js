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
