// ==UserScript==
// @name         Keyboard Shortcut Script
// @namespace    http://tampermonkey.net/
// @version      0.0.7
// @description  Add keyboard shortcuts to click on CSS selectors
// @author       You
// @match        https://paper.thinlens.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=thinlens.net
// @require      file:///Users/aneben/repos/chrome_user_scripts/paperless.user.js
// @grant        none
// ==/UserScript==



(function() {
    'use strict';

    // Configuration: Map keyboard shortcuts to CSS selectors
    // Format: { shortcut: "css-selector" }
    // Shortcut format examples: "F1", "Control+s", "Alt+Shift+f", "Meta+F10" (Meta is cmd on Mac)
    const SHORTCUTS = {
        "Meta+Shift+F10": "pngx-input-tags[formcontrolname=\"tags\"] .ng-select-container input",
        "Meta+Shift+F11": "pngx-input-date[formcontrolname=\"created_date\"] .input-group input",
        "Meta+Shift+F12": "pngx-input-select[formcontrolname=\"document_type\"] .input-group input",

        "Control+b": "#back-button",
        "Alt+n": ".notification-icon",
        // Add more shortcuts as needed
    };

    const DEBUG = true;

    function debug(message, ...args) {
        if (DEBUG) {
            console.log(`%c[Shortcut Clicker] ${message}`, "color: #4CAF50; font-weight: bold;", ...args);
        }
    }

    debug("Script loaded");

    // Parse a shortcut string into modifier keys and key
    function parseShortcut(shortcut) {
        const parts = shortcut.split('+');
        const key = parts.pop().toLowerCase();
        const modifiers = {
            alt: parts.includes('Alt'),
            control: parts.includes('Control') || parts.includes('Ctrl'),
            meta: parts.includes('Meta') || parts.includes('Command') || parts.includes('Cmd'),
            shift: parts.includes('Shift')
        };

        return { key, modifiers };
    }

    // Check if the event matches the shortcut
    function matchesShortcut(event, shortcutStr) {
        const shortcut = parseShortcut(shortcutStr);

        // Match key (handle function keys and regular keys)
        let keyMatches = false;
        if (shortcut.key.startsWith('f') && /^f([1-9]|1[0-2])$/.test(shortcut.key)) {
            // Function key (F1-F12)
            const fnNumber = parseInt(shortcut.key.substring(1), 10);
            keyMatches = event.key === 'F' + fnNumber;
        } else {
            // Regular key
            keyMatches = event.key.toLowerCase() === shortcut.key;
        }

        // Match modifiers
        const modifiersMatch = (
            event.altKey === shortcut.modifiers.alt &&
            event.ctrlKey === shortcut.modifiers.control &&
            event.metaKey === shortcut.modifiers.meta &&
            event.shiftKey === shortcut.modifiers.shift
        );

        return keyMatches && modifiersMatch;
    }

    // Simulate a full click (mousedown + mouseup) on the element
    function simulateClick(element) {
        if (!element) return false;

        debug("Simulating click on:", element);

        try {

            // Try to focus the element if it's focusable
            const isFocusable = (
                element.tagName === 'INPUT' ||
                element.tagName === 'TEXTAREA' ||
                element.tagName === 'SELECT' ||
                element.tagName === 'BUTTON' ||
                element.tagName === 'A' ||
                element.contentEditable === 'true' ||
                element.tabIndex >= 0
            );

            if (isFocusable) {
                debug("Element is focusable, attempting to focus");
                element.focus();
                debug("Focus state:", document.activeElement === element ? "Successfully focused" : "Focus failed");
            }


            // Create and dispatch mousedown event
            const mousedownEvent = new MouseEvent('mousedown', {
                view: window,
                bubbles: true,
                cancelable: true,
                buttons: 1
            });
            const mousedownResult = element.dispatchEvent(mousedownEvent);
            debug("Mousedown dispatched, result:", mousedownResult);

            // Create and dispatch mouseup event
            const mouseupEvent = new MouseEvent('mouseup', {
                view: window,
                bubbles: true,
                cancelable: true,
                buttons: 1
            });
            const mouseupResult = element.dispatchEvent(mouseupEvent);
            debug("Mouseup dispatched, result:", mouseupResult);

            // Create and dispatch click event
            const clickEvent = new MouseEvent('click', {
                view: window,
                bubbles: true,
                cancelable: true,
                buttons: 1
            });
            const clickResult = element.dispatchEvent(clickEvent);
            debug("Click dispatched, result:", clickResult);

            return true;
        } catch (error) {
            debug("Error simulating click:", error);
            return false;
        }
    }

    // Handle keydown events
    function handleKeydown(event) {
        // Check each configured shortcut
        for (const [shortcutStr, selector] of Object.entries(SHORTCUTS)) {
            if (matchesShortcut(event, shortcutStr)) {
                debug(`Shortcut detected: ${shortcutStr} for selector: ${selector}`);

                // Find the element matching the selector
                const element = document.querySelector(selector);

                if (element) {
                    // Prevent default browser action for this key combination
                    event.preventDefault();

                    // Simulate click on the element
                    simulateClick(element);
                    debug("Click simulation completed");
                } else {
                    debug(`No element found for selector: ${selector}`);
                }

                // Break after handling a matching shortcut
                break;
            }
        }
    }

    // Register the keydown event listener
    document.addEventListener('keydown', handleKeydown, true);
    debug("Event listener registered");

    // Optional: Report configured shortcuts on startup
    debug("Configured shortcuts:");
    for (const [shortcut, selector] of Object.entries(SHORTCUTS)) {
        debug(`  ${shortcut} → ${selector}`);
    }
})();