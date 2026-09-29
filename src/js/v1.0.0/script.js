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

(async function ($, window, document) {
    "use strict";
    
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
    initYouTube();
    initLanguages();
    initProjects();
    await initVisitors();

    /*
     * Keep the loader promise alive.
     */
    await loaderPromise;
})(jQuery, window, document);


