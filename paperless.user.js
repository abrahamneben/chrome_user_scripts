// ==UserScript==
// @name         Paperless Shortcuts
// @namespace    http://tampermonkey.net/
// @version      0.0.82
// @description  Add keyboard shortcuts to click on  selectors
// @author       You
// @match        *://paper.thinlens.net/*
// @grant        GM_xmlhttpRequest
// @require      file:///Users/aneben/repos/chrome_user_scripts/shortcuts_impl.js
// @require      file:///Users/aneben/repos/chrome_user_scripts/paperless.user.js
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    const { setupShortcuts } = window.keyboardShortcutCore;

    // Define site-specific shortcuts
    const SHORTCUTS = {
        "Meta+Shift+F10": "pngx-input-tags[formcontrolname=\"tags\"] .ng-select-container input",
        "Meta+Shift+F11": "pngx-input-date[formcontrolname=\"created_date\"] .input-group input",
        "Meta+Shift+F12": "pngx-input-select[formcontrolname=\"document_type\"] .input-group input",
        "Meta+Shift+F13": "pngx-input-number[formcontrolname=\"archive_serial_number\"] .input-group input",
        "Meta+Shift+F14": "pngx-input-text[formcontrolname=\"title\"] input",
        "Meta+Shift+F6": "//pngx-document-detail//button[contains(text(), 'Delete')]",

        "Meta+Shift+F6": { selector: "pngx-document-detail button", text: "Delete" },
        "Meta+Shift+F7": { selector: "pngx-document-detail a", text: "Download" },
    }

    setupShortcuts(SHORTCUTS);
})();