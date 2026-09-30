/*
 * Copyright © 2019 Braden (https://github.com/brdenwd)
 * 
 * Dependencys: 
 *  - jQuery v3.7.1 (https://jquery.com/)
 *  - Tailwind v3.4.16 (https://tailwindcss.com/)
 *  - EmailJS (https://www.emailjs.com/)
 *  - Canvas Confetti (https://www.kirilv.com/canvas-confetti/)
 * Deprecated Dependencys:
 *  - asciiLib
 * 
 * Website: https://brdnwd.github.io
 * Built: 2025-04-04
 */

import { initLoader } from "./component/site/loader.js";
import { initNavbar } from "./component/site/navbar.js";
import { initYouTube } from "./component/site/youtube.js";
import { initLanguages } from "./component/site/languages.js";
import { initVisitors } from "./component/firebase/vistors.js";
import { initFooter } from "./component/site/footer.js";
import { initProjects } from "./component/site/projects.js";
import { initPosts } from "./component/site/post.js";
import { initSectionSnap } from "./component/site/sectionScroll.js";
import { initPopupAnimations, initGrainGradient } from "./component/site/visualEffects.js";

(async function ($, window, document) {
    'use strict';

    await document.fonts.ready;

    /*
     * Start the loader immediately.
     *
     * Do NOT await this.
     * The loader itself waits for the page
     * to finish loading.
     */
    const loaderPromise = initLoader();

    /*
     * Initialize the rest of the site.
     */
    initNavbar();
    initFooter();
    initSectionSnap();
    initYouTube();
    initLanguages();
    initProjects();
    initPosts();
    initGrainGradient();
    await initVisitors();

    /*
     * Wait for the loader to completely finish
     * before starting visual effects.
     */
    await loaderPromise;
    initPopupAnimations();
})(jQuery, window, document);


