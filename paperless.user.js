// ==UserScript==
// @name         Paperless Shortcuts
// @namespace    http://tampermonkey.net/
// @version      0.0.83
// @description  Add keyboard shortcuts to click on selectors
// @author       You
// @match        *://paper.thinlens.net/*
// @grant        none
// @require      file:///Users/aneben/repos/chrome_user_scripts/shortcuts_impl.js
// @require      file:///Users/aneben/repos/chrome_user_scripts/paperless.user.js
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    const { setupShortcuts } = window.keyboardShortcutCore;

    const SHORTCUTS = {
        // Document spread view
        "Meta+Shift+F17": "div.sidebar-sticky ul.nav a[routerlink=\"documents\"]",
        "Meta+Shift+F18": {selector: "pngx-filter-editor button", text: "Reset filters"},
        "Meta+Shift+F19": {selector: "pngx-filter-editor button", text: "Tags"},
        "Meta+Shift+F20": "pngx-filter-editor input",

        // Document actions
        "Meta+Shift+F6": { selector: "pngx-document-detail button", text: "Delete" },
        "Meta+Shift+F8": { selector: ".modal-dialog button", text: "Move to trash" },
        "Meta+Shift+F7": { selector: "pngx-document-detail a", text: "Download" },

        // Document detail panel
        "Meta+Shift+F9": { selector: "ul.nav a", text: "Details" },
        "Meta+Shift+F10": "pngx-input-tags[formcontrolname=\"tags\"] .ng-select-container input",
        "Meta+Shift+F11": "pngx-input-date[formcontrolname=\"created_date\"] .input-group input",
        "Meta+Shift+F13": "pngx-input-number[formcontrolname=\"archive_serial_number\"] .input-group input",
        "Meta+Shift+F14": "pngx-input-text[formcontrolname=\"title\"] input",

        // Document note panel
        "Meta+Shift+F15": { selector: "ul.nav a", text: "Notes" },
        "Meta+Shift+F16": "div.form-group textarea[formcontrolname=\"newNote\"]",

    }

    setupShortcuts(SHORTCUTS);
})();