/*
 * Copyright © 2019 Braden (https://github.com/brdenwd)
 * 
 * Dependencys: 
 *  - jQuery v3.7.1 (https://jquery.com/)
 *  - Tailwind v3.4.16 (https://tailwindcss.com/)
 *  - EmailJS (https://www.emailjs.com/)
 *  - Canvas Confetti (https://www.kirilv.com/canvas-confetti/)
 *  - Firebase (https://firebase.google.com/docs/reference)
 * Deprecated Dependencys:
 *  - asciiLib
 * 
 * Website: https://brdnwd.github.io
 * Built: 2025-04-04
 */

import * as m from "./component/modules.js"
import * as v from "./component/variables.js"

(async function ($, window, document) {
    'use strict';

    await document.fonts.load('10rem "Qahiri"');

    /**
     * Anything that needs to happen before the user sees the website.
     */
    await m.initLoader(async () => {
        await m.initNavbar();
        await m.initFooter();

        m.initJelloLinks();

        m.initGrainGradient();
        m.initSectionStack();

        m.initYouTube();
        m.initLanguages();
        m.initProjects();
        m.initPosts();

        await m.initVisitors();
    });
    
    m.initPopupAnimations();
})(jQuery, window, document);