// Implementation of a set of functions to find and click on elements
// referred to using CSS selectors and optional contained text.

(function() {
    'use strict';

    let DEBUG = true;

    // ========== Helper Functions ==========

    // Helper function to log debug messages
    function debug(message, ...args) {
        if (DEBUG) {
            console.log(`%c[KeyboardShortcut] ${message}`, "color: #4CAF50; font-weight: bold;", ...args);
        }
    }

    // ========== Element Finders ==========

    // Find element by CSS selector and optional text content
    function findElement(selectorConfig) {
        // Handle both string selectors and object configurations
        let selector, textContent;

        if (typeof selectorConfig === 'object' && selectorConfig !== null) {
            selector = selectorConfig.selector;
            textContent = selectorConfig.text;
        } else {
            selector = selectorConfig;
        }

        // If no text content is specified, just use querySelector
        if (!textContent) {
            return document.querySelector(selector);
        }

        // Otherwise, find all elements matching the selector and filter by text content
        const elements = document.querySelectorAll(selector);
        return Array.from(elements).find(el =>
            el.textContent.includes(textContent)
        );
    }

    // ========== Element Interaction ==========

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
                // view: window,
                bubbles: true,
                cancelable: true,
                buttons: 1
            });
            const mousedownResult = element.dispatchEvent(mousedownEvent);
            debug("Mousedown dispatched, result:", mousedownResult);

            // Create and dispatch mouseup event
            const mouseupEvent = new MouseEvent('mouseup', {
                // view: window,
                bubbles: true,
                cancelable: true,
                buttons: 1
            });
            const mouseupResult = element.dispatchEvent(mouseupEvent);
            debug("Mouseup dispatched, result:", mouseupResult);

            // Create and dispatch click event
            const clickEvent = new MouseEvent('click', {
                // view: window,
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

    // Find and click an element based on a selector configuration
    function findAndClick(selectorConfig) {
        const element = findElement(selectorConfig);
        if (element) {
            return simulateClick(element);
        }
        debug("No element found for selector:", selectorConfig);
        return false;
    }

    // ========== Keyboard Shortcut Handling ==========

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

    // ========== Shortcut Setup ==========

    // Setup keyboard shortcuts with the provided configuration
    function setupShortcuts(shortcuts) {
        // Function to handle keydown events
        function handleKeydown(event) {
            // Check each configured shortcut
            for (const [shortcutStr, selectorConfig] of Object.entries(shortcuts)) {
                if (matchesShortcut(event, shortcutStr)) {
                    // Log shortcut detection
                    if (typeof selectorConfig === 'object' && selectorConfig !== null) {
                        debug(`Shortcut detected: ${shortcutStr} for selector: ${selectorConfig.selector} containing text: "${selectorConfig.text}"`);
                    } else {
                        debug(`Shortcut detected: ${shortcutStr} for selector: ${selectorConfig}`);
                    }

                    // Prevent default browser action for this key combination
                    event.preventDefault();

                    // Find and click the element
                    findAndClick(selectorConfig);

                    // Break after handling a matching shortcut
                    break;
                }
            }
        }

        // Register the keydown event listener
        document.addEventListener('keydown', handleKeydown, true);
        debug("Event listener registered");

        // Report configured shortcuts on startup
        debug("Configured shortcuts:");
        for (const [shortcut, selectorConfig] of Object.entries(shortcuts)) {
            if (typeof selectorConfig === 'object' && selectorConfig !== null) {
                debug(`  ${shortcut} → ${selectorConfig.selector} (containing text: "${selectorConfig.text}")`);
            } else {
                debug(`  ${shortcut} → ${selectorConfig}`);
            }
        }
    }

    // ========== Export Module ==========

    // Expose functions to window for other scripts to use
    window.keyboardShortcutCore = {
        // debug,
        // findElement,
        // simulateClick,
        // findAndClick,
        setupShortcuts
    };

    debug("Keyboard Shortcut Core Module loaded");


})();