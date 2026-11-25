/**
 * LearnX LMS - Authentication Service
 * File: JS/services/authService.js
 */

"use strict";

const AuthService = {
    /**
     * Get active logged-in user
     * @returns {Object|null}
     */
    getCurrentUser: function () {
        if (typeof AppStorage !== "undefined") {
            return AppStorage.get(StorageKeys.AUTH_USER, null);
        }
        try {
            return JSON.parse(localStorage.getItem("learnx_auth_user"));
        } catch (e) {
            return null;
        }
    },

    /**
     * Set active user session
     * @param {Object} user 
     */
    setCurrentUser: function (user) {
        if (typeof AppStorage !== "undefined") {
            AppStorage.set(StorageKeys.AUTH_USER, user);
        } else {
            localStorage.setItem("learnx_auth_user", JSON.stringify(user));
        }
    },

    /**
     * Check if user is authenticated
     * @returns {boolean}
     */
    isAuthenticated: function () {
        return this.getCurrentUser() !== null;
    },

    /**
     * Log out current user
     */
    logout: function () {
        const user = this.getCurrentUser();
        if (user && typeof AppDB !== "undefined") {
            AppDB.logActivity(user.id, user.role, "logout", "Logged out of platform");
        }
        if (typeof AppStorage !== "undefined") {
            AppStorage.remove(StorageKeys.AUTH_USER);
        } else {
            localStorage.removeItem("learnx_auth_user");
        }
    },

    /**
     * Authenticate user with credentials
     * @param {string} email 
     * @param {string} password 
     * @param {string} role 
     * @returns {Promise<{success: boolean, user?: Object, message?: string}>}
     */
    login: async function (email, password, role = "student") {
        email = (email || "").trim().toLowerCase();
        if (!email || !password) {
            return { success: false, message: "Please provide both email and password." };
        }

        const users = typeof AppDB !== "undefined"
            ? AppDB.findAll(StorageKeys.USERS)
            : JSON.parse(localStorage.getItem("learnx_users") || "[]");

        let user = users.find(u => u.email.toLowerCase() === email);

        // Check if demo credentials alias used (e.g. student@learnx.edu or instructor@learnx.edu)
        if (!user) {
            if (email === "student@learnx.edu") {
                user = users.find(u => u.id === "stu-1");
            } else if (email === "instructor@learnx.edu") {
                user = users.find(u => u.id === "inst-1");
            } else if (email === "admin@learnx.edu") {
                user = users.find(u => u.id === "admin-1");
            }
        }

        if (user) {
            if (role && user.role !== role) {
                return { success: false, message: `Account exists but role is ${user.role}, not ${role}.` };
            }
            if (user.password && user.password !== password) {
                return { success: false, message: "Invalid password. Try 'password123'." };
            }
        } else {
            // Register user dynamically for demo flexibility
            const nameFromEmail = email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, l => l.toUpperCase());
            user = {
                id: (role === "admin" ? "admin-" : (role === "instructor" ? "inst-" : "stu-")) + Date.now().toString().slice(-4),
                name: nameFromEmail || "LearnX User",
                email: email,
                password: password,
                role: role,
                avatar: role === "instructor"
                    ? "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80"
                    : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80",
                title: role === "instructor" ? "Educator" : "Student",
                createdAt: new Date().toISOString()
            };
            if (typeof AppDB !== "undefined") {
                AppDB.insert(StorageKeys.USERS, user);
                if (role === "student") {
                    AppDB.insert(StorageKeys.STUDENTS, {
                        id: user.id,
                        userId: user.id,
                        name: user.name,
                        email: user.email,
                        avatar: user.avatar,
                        status: "Active",
                        createdAt: user.createdAt
                    });
                }
            }
        }

        this.setCurrentUser(user);
        if (typeof AppDB !== "undefined") {
            AppDB.logActivity(user.id, user.role, "login", `Logged in as ${user.role}`);
        }
        return { success: true, user: user };
    },

    /**
     * Register a new user
     * @param {Object} data 
     * @returns {Promise<{success: boolean, user?: Object, message?: string}>}
     */
    register: async function (data) {
        const name = (data.name || "").trim();
        const email = (data.email || "").trim().toLowerCase();
        const password = data.password || "";
        const role = data.role || "student";

        if (!name || !email || !password) {
            return { success: false, message: "Please fill in all required fields." };
        }

        const users = typeof AppDB !== "undefined"
            ? AppDB.findAll(StorageKeys.USERS)
            : JSON.parse(localStorage.getItem("learnx_users") || "[]");

        if (users.some(u => u.email.toLowerCase() === email)) {
            return { success: false, message: "An account with this email already exists." };
        }

        const newUser = {
            id: (role === "admin" ? "admin-" : (role === "instructor" ? "inst-" : "stu-")) + Date.now().toString().slice(-4),
            name: name,
            email: email,
            password: password,
            role: role,
            avatar: role === "instructor"
                ? "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80"
                : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80",
            title: role === "instructor" ? "Course Instructor" : "Enrolled Student",
            createdAt: new Date().toISOString()
        };

        if (typeof AppDB !== "undefined") {
            AppDB.insert(StorageKeys.USERS, newUser);
            if (role === "student") {
                AppDB.insert(StorageKeys.STUDENTS, {
                    id: newUser.id,
                    userId: newUser.id,
                    name: newUser.name,
                    email: newUser.email,
                    avatar: newUser.avatar,
                    status: "Active",
                    createdAt: newUser.createdAt
                });
            } else if (role === "instructor") {
                AppDB.insert(StorageKeys.INSTRUCTORS, {
                    id: newUser.id,
                    userId: newUser.id,
                    name: newUser.name,
                    email: newUser.email,
                    title: "Educator",
                    bio: "Experienced instructor at LearnX.",
                    avatar: newUser.avatar,
                    rating: 5.0,
                    reviewsCount: 0
                });
            }
            AppDB.logActivity(newUser.id, newUser.role, "registered", `Created new ${newUser.role} account`);
        }

        return { success: true, user: newUser };
    },

    /**
     * Bootstrap platform admin
     */
    bootstrapAdmin: async function (data) {
        return this.register({ ...data, role: "admin" });
    },

    /**
     * Reset admin password
     */
    resetAdminPassword: async function (data) {
        const users = typeof AppDB !== "undefined"
            ? AppDB.findAll(StorageKeys.USERS)
            : [];
        const admin = users.find(u => u.email.toLowerCase() === data.email.toLowerCase() && u.role === "admin");
        if (!admin) return { success: false, message: "Admin account not found." };
        if (typeof AppDB !== "undefined") {
            AppDB.update(StorageKeys.USERS, admin.id, { password: data.password });
        }
        return { success: true };
    },

    /**
     * Replace local administrator
     */
    replaceLocalAdmin: async function (data) {
        if (typeof AppDB !== "undefined") {
            const users = AppDB.findAll(StorageKeys.USERS);
            const oldAdmins = users.filter(u => u.role === "admin");
            oldAdmins.forEach(a => AppDB.delete(StorageKeys.USERS, a.id));
        }
        return this.register({ ...data, role: "admin" });
    }
};

// Global export
if (typeof window !== "undefined") {
    window.AuthService = AuthService;
}
if (typeof module !== "undefined" && module.exports) {
    module.exports = { AuthService };
}
