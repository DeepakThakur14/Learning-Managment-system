/* =========================================================
   LEARNX LMS - COMPLETE THEME SYSTEM
   File: JS/themes.js
========================================================= */

"use strict";

document.addEventListener("DOMContentLoaded", function () {

    // -----------------------------------------------------
    // 1. SELECT HTML ELEMENTS
    // -----------------------------------------------------

    const body = document.body;

    const themeToggleBtn = document.getElementById("themeToggleBtn");
    const themePanel = document.getElementById("themePanel");
    const closeThemePanel = document.getElementById("closeThemePanel");
    const themeOverlay = document.getElementById("themeOverlay");

    const accentColor = document.getElementById("accentColor");
    const textSize = document.getElementById("textSize");
    const layoutMode = document.getElementById("layoutMode");
    const resetTheme = document.getElementById("resetTheme");

    const themeButtons = document.querySelectorAll(
        "[data-theme-choice]"
    );

    // -----------------------------------------------------
    // 2. DEFAULT SETTINGS
    // -----------------------------------------------------

    const DEFAULT_THEME = "light";
    const DEFAULT_ACCENT = "#6366f1";
    const DEFAULT_TEXT_SIZE = "medium";
    const DEFAULT_LAYOUT = "comfortable";

    const STORAGE_KEYS = {
        theme: "learnx-theme",
        accent: "learnx-accent",
        textSize: "learnx-text-size",
        layout: "learnx-layout"
    };

    // Available themes
    const validThemes = [
        "light",
        "dark",
        "purple",
        "ocean",
        "forest",
        "rose",
        "sunset",
        "midnight",
        "lavender",
        "mint",
        "gold",
        "neon"
    ];

    // -----------------------------------------------------
    // 3. LOCAL STORAGE HELPERS
    // -----------------------------------------------------

    function saveSetting(key, value) {
        try {
            localStorage.setItem(key, value);
        } catch (error) {
            console.warn("Unable to save setting:", error);
        }
    }

    function getSetting(key, defaultValue) {
        try {
            return localStorage.getItem(key) || defaultValue;
        } catch (error) {
            console.warn("Unable to load setting:", error);
            return defaultValue;
        }
    }

    // -----------------------------------------------------
    // 4. OPEN THEME PANEL
    // -----------------------------------------------------

    function openThemePanel() {
        if (!themePanel || !themeOverlay) {
            console.error(
                "Theme panel or theme overlay is missing from HTML."
            );
            return;
        }

        themePanel.classList.add("active");
        themeOverlay.classList.add("active");

        themePanel.setAttribute("aria-hidden", "false");

        body.classList.add("theme-panel-open");

        if (themeToggleBtn) {
            themeToggleBtn.setAttribute("aria-expanded", "true");
        }
    }

    // -----------------------------------------------------
    // 5. CLOSE THEME PANEL
    // -----------------------------------------------------

    function closeThemePanelFunction() {
        if (themePanel) {
            themePanel.classList.remove("active");
            themePanel.setAttribute("aria-hidden", "true");
        }

        if (themeOverlay) {
            themeOverlay.classList.remove("active");
        }

        body.classList.remove("theme-panel-open");

        if (themeToggleBtn) {
            themeToggleBtn.setAttribute("aria-expanded", "false");
            themeToggleBtn.focus();
        }
    }

    // Open panel button
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", function () {
            if (themePanel && themePanel.classList.contains("active")) {
                closeThemePanelFunction();
            } else {
                openThemePanel();
            }
        });
    }

    // Close button
    if (closeThemePanel) {
        closeThemePanel.addEventListener(
            "click",
            closeThemePanelFunction
        );
    }

    // Close by clicking outside
    if (themeOverlay) {
        themeOverlay.addEventListener(
            "click",
            closeThemePanelFunction
        );
    }

    // Close using Escape key
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            closeThemePanelFunction();
        }
    });

    // -----------------------------------------------------
    // 6. APPLY THEME
    // -----------------------------------------------------

    function applyTheme(themeName, shouldSave = true) {

        if (!validThemes.includes(themeName)) {
            themeName = DEFAULT_THEME;
        }

        // Apply theme to body
        body.setAttribute("data-theme", themeName);

        // Update active theme button
        themeButtons.forEach(function (button) {
            const isActive =
                button.getAttribute("data-theme-choice") === themeName;

            button.classList.toggle("active", isActive);

            button.setAttribute(
                "aria-pressed",
                String(isActive)
            );
        });

        // Save theme
        if (shouldSave) {
            saveSetting(STORAGE_KEYS.theme, themeName);
        }

        // Update theme color metadata, if present
        const themeColors = {
            light: "#ffffff",
            dark: "#111827",
            purple: "#f5f3ff",
            ocean: "#eff6ff",
            forest: "#f0fdf4",
            rose: "#fff1f2",
            sunset: "#fff7ed",
            midnight: "#0f172a",
            lavender: "#faf5ff",
            mint: "#ecfdf5",
            gold: "#fffbeb",
            neon: "#09090b"
        };

        let themeColorMeta = document.querySelector(
            'meta[name="theme-color"]'
        );

        if (themeColorMeta) {
            themeColorMeta.setAttribute(
                "content",
                themeColors[themeName] || "#ffffff"
            );
        }

        console.log("LearnX theme applied:", themeName);
    }

    // Theme buttons click event
    themeButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const selectedTheme = this.getAttribute(
                "data-theme-choice"
            );

            applyTheme(selectedTheme);
        });

    });

    // -----------------------------------------------------
    // 7. CUSTOM ACCENT COLOR
    // -----------------------------------------------------

    function applyAccentColor(color, shouldSave = true) {

        // Only accept a valid hexadecimal color.
        if (!/^#[0-9a-fA-F]{6}$/.test(color)) {
            color = DEFAULT_ACCENT;
        }

        body.style.setProperty("--theme-primary", color);
        body.style.setProperty("--theme-accent", color);

        // Set lighter accent color
        body.style.setProperty(
            "--theme-secondary",
            color + "20"
        );

        if (accentColor) {
            accentColor.value = color;
        }

        if (shouldSave) {
            saveSetting(STORAGE_KEYS.accent, color);
        }
    }

    if (accentColor) {
        accentColor.addEventListener("input", function () {
            applyAccentColor(this.value);
        });

        accentColor.addEventListener("change", function () {
            applyAccentColor(this.value);
        });
    }

    // -----------------------------------------------------
    // 8. TEXT SIZE
    // -----------------------------------------------------

    function applyTextSize(size, shouldSave = true) {

        const validSizes = [
            "small",
            "medium",
            "normal",
            "large"
        ];

        if (!validSizes.includes(size)) {
            size = DEFAULT_TEXT_SIZE;
        }

        // Support both "normal" and "medium".
        if (size === "normal") {
            size = "medium";
        }

        body.setAttribute("data-text-size", size);

        // Update select box
        if (textSize) {
            textSize.value = size;
        }

        // Apply font size directly
        const fontSizes = {
            small: "14px",
            medium: "16px",
            large: "18px"
        };

        body.style.fontSize = fontSizes[size];

        if (shouldSave) {
            saveSetting(STORAGE_KEYS.textSize, size);
        }
    }

    if (textSize) {
        textSize.addEventListener("change", function () {
            applyTextSize(this.value);
        });
    }

    // -----------------------------------------------------
    // 9. LAYOUT MODE
    // -----------------------------------------------------

    function applyLayout(layout, shouldSave = true) {

        const validLayouts = [
            "comfortable",
            "compact",
            "wide"
        ];

        if (!validLayouts.includes(layout)) {
            layout = DEFAULT_LAYOUT;
        }

        body.setAttribute("data-layout", layout);

        if (layoutMode) {
            layoutMode.value = layout;
        }

        if (shouldSave) {
            saveSetting(STORAGE_KEYS.layout, layout);
        }
    }

    if (layoutMode) {
        layoutMode.addEventListener("change", function () {
            applyLayout(this.value);
        });
    }

    // -----------------------------------------------------
    // 10. RESET ALL THEME SETTINGS
    // -----------------------------------------------------

    function resetAllSettings() {

        // Restore default theme
        applyTheme(DEFAULT_THEME);

        // Restore default accent color
        applyAccentColor(DEFAULT_ACCENT);

        // Restore default text size
        applyTextSize(DEFAULT_TEXT_SIZE);

        // Restore default layout
        applyLayout(DEFAULT_LAYOUT);

        // Clear custom theme-related inline styles
        body.style.removeProperty("--theme-primary");
        body.style.removeProperty("--theme-accent");
        body.style.removeProperty("--theme-secondary");
        body.style.removeProperty("font-size");

        // Reapply the default accent after clearing styles
        applyAccentColor(DEFAULT_ACCENT);

        console.log("LearnX theme settings reset.");
    }

    if (resetTheme) {
        resetTheme.addEventListener("click", function () {

            resetAllSettings();

        });
    }

    // -----------------------------------------------------
    // 11. LOAD SAVED SETTINGS
    // -----------------------------------------------------

    function loadSavedSettings() {

        const savedTheme = getSetting(
            STORAGE_KEYS.theme,
            DEFAULT_THEME
        );

        const savedAccent = getSetting(
            STORAGE_KEYS.accent,
            DEFAULT_ACCENT
        );

        const savedTextSize = getSetting(
            STORAGE_KEYS.textSize,
            DEFAULT_TEXT_SIZE
        );

        const savedLayout = getSetting(
            STORAGE_KEYS.layout,
            DEFAULT_LAYOUT
        );

        applyTheme(savedTheme, false);
        applyAccentColor(savedAccent, false);
        applyTextSize(savedTextSize, false);
        applyLayout(savedLayout, false);
    }

    // -----------------------------------------------------
    // 12. INITIALIZE THEME SYSTEM
    // -----------------------------------------------------

    loadSavedSettings();

    // Set initial panel accessibility state
    if (themePanel) {
        themePanel.setAttribute("aria-hidden", "true");
    }

    if (themeToggleBtn) {
        themeToggleBtn.setAttribute("aria-expanded", "false");
    }

    console.log("LearnX Theme System initialized successfully.");

});