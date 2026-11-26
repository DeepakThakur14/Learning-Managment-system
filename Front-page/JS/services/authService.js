/* LearnX frontend-only authentication service. Passwords are PBKDF2-SHA256 hashed. */
"use strict";
// The canonical AuthService is bundled in ../data.js so legacy pages keep one source of truth.
// This module intentionally exports the same global when loaded after data.js.
if (typeof window !== "undefined" && window.AuthService) window.LearnXAuthService = window.AuthService;
if (typeof module !== "undefined" && module.exports) module.exports = { note: "Load JS/data.js for the canonical browser AuthService." };
