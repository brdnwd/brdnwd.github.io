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
(async function ($, window, document) {


})(jQuery, window, document);

const loader = document.getElementById("loader");

if (loader) {

    const name = loader.querySelector(".loader-name");
    const letters = Array.from(
        loader.querySelectorAll(".loader-letter")
    );

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion) {

        loader.remove();

    } else {

        let pageLoaded = document.readyState === "complete";

        window.addEventListener("load", () => {
            pageLoaded = true;
        });

        const popupDuration = 550;
        const popupDelay = 10;

        const holdDuration = 100;

        const popScale = 0.9;

        function resetLetters() {

            letters.forEach(letter => {

                letter.style.opacity = "0";

                letter.style.transform =
                    `scale(${popScale}) translateY(10px)`;
            });

            name.style.transform = "scale(1)";
        }

        function animateLetter(letter, direction) {

            const keyframes = direction === "in"
                ? [
                    {
                        opacity: 0,
                        transform:
                            `scale(${popScale}) translateY(10px)`
                    },
                    {
                        opacity: 1,
                        transform:
                            "scale(1.08) translateY(0)",
                        offset: 0.75
                    },
                    {
                        opacity: 1,
                        transform:
                            "scale(1) translateY(0)"
                    }
                ]
                : [
                    {
                        opacity: 1,
                        transform:
                            "scale(1) translateY(0)"
                    },
                    {
                        opacity: 1,
                        transform:
                            "scale(1.08) translateY(0)",
                        offset: 0.25
                    },
                    {
                        opacity: 0,
                        transform:
                            `scale(${popScale}) translateY(10px)`
                    }
                ];

            return letter.animate(
                keyframes,
                {
                    duration: popupDuration,
                    easing: "cubic-bezier(0.22, 1, 0.36, 1)",
                    fill: "forwards"
                }
            ).finished;
        }

        async function popIn() {

            for (const letter of letters) {

                await animateLetter(letter, "in");

                await new Promise(resolve => {
                    setTimeout(resolve, popupDelay);
                });
            }
        }

        async function popOut() {

            for (
                let i = letters.length - 1;
                i >= 0;
                i--
            ) {

                await animateLetter(
                    letters[i],
                    "out"
                );

                await new Promise(resolve => {
                    setTimeout(resolve, popupDelay);
                });
            }
        }

        async function zoomIntoPage() {

            await new Promise(resolve => {
                setTimeout(resolve, holdDuration);
            });

            const zoom = name.animate(
                [
                    {
                        transform: "scale(1)"
                    },
                    {
                        transform: "scale(500)",
                        offset: 0.08
                    },
                    {
                        transform: "scale(1000)"
                    }
                ],
                {
                    duration: 1600,
                    easing: "cubic-bezier(0.67, 0, 0.20, 1)",
                    fill: "forwards"
                }
            );

            await zoom.finished.catch(() => {});

            loader.animate(
                [
                    { opacity: 1 },
                    { opacity: 0 }
                ],
                {
                    duration: 300,
                    easing: "ease-out",
                    fill: "forwards"
                }
            ).finished.then(() => {

                loader.remove();

            });
        }

        async function loaderLoop() {

            resetLetters();

            while (!pageLoaded) {

                // b → r → d → n → w → d
                await popIn();

                // Give the page a chance to finish.
                await new Promise(resolve => {
                    setTimeout(resolve, holdDuration);
                });

                // If the page loaded while the name
                // was visible, go straight to the zoom.
                if (pageLoaded) {
                    break;
                }

                // d → w → n → d → r → b
                await popOut();

                // Small pause before starting again.
                await new Promise(resolve => {
                    setTimeout(resolve, 150);
                });
            }

            // Page is ready.
            // The entire username is visible,
            // so zoom into it.
            await zoomIntoPage();
        }

        loaderLoop();
    }
}

const navbar = document.getElementById("navbar");

if (navbar) {
    let navbarIsDark = false;
    let ticking = false;

    function getBackgroundColor(element) {
        let current = element;

        while (current && current !== document.documentElement) {
            const background = getComputedStyle(current).backgroundColor;

            if (
                background &&
                background !== "transparent" &&
                background !== "rgba(0, 0, 0, 0)"
            ) {
                return background;
            }

            current = current.parentElement;
        }

        return getComputedStyle(document.body).backgroundColor;
    }

    function getLuminance(color) {
        const match = color.match(/[\d.]+/g);

        if (!match || match.length < 3) {
            return 255;
        }

        const r = Number(match[0]);
        const g = Number(match[1]);
        const b = Number(match[2]);

        return (
            (0.299 * r) +
            (0.587 * g) +
            (0.114 * b)
        );
    }

    function updateNavbarTheme() {
        ticking = false;

        const rect = navbar.getBoundingClientRect();

        /*
         * Sample several horizontal lines directly underneath
         * the navbar.
         */
        const sampleOffsets = [2, 8, 16, 24];

        /*
         * Number of points sampled across each line.
         */
        const samplesPerLine = 100;

        let totalLuminance = 0;
        let totalSamples = 0;

        sampleOffsets.forEach(offset => {
            const y = rect.bottom + offset;

            if (y >= window.innerHeight) {
                return;
            }

            for (let i = 0; i < samplesPerLine; i++) {
                const x =
                    (window.innerWidth / (samplesPerLine - 1)) * i;

                const element = document.elementFromPoint(x, y);

                if (!element) {
                    continue;
                }

                const background = getBackgroundColor(element);
                const luminance = getLuminance(background);

                totalLuminance += luminance;
                totalSamples++;
            }
        });

        if (totalSamples === 0) {
            return;
        }

        /*
         * Average brightness across the entire sampled area.
         */
        const averageLuminance =
            totalLuminance / totalSamples;

        /*
         * Lower = darker.
         * Higher = lighter.
         */
        const shouldBeDark = averageLuminance < 100;

        if (shouldBeDark !== navbarIsDark) {
            navbarIsDark = shouldBeDark;

            navbar.classList.toggle(
                "text-white",
                shouldBeDark
            );

            navbar.classList.toggle(
                "text-black",
                !shouldBeDark
            );
        }
    }

    function requestNavbarUpdate() {
        if (ticking) {
            return;
        }

        ticking = true;

        requestAnimationFrame(updateNavbarTheme);
    }

    /*
     * Capture scrolling from the entire document,
     * including nested scrolling containers.
     */
    document.addEventListener(
        "scroll",
        requestNavbarUpdate,
        true
    );

    window.addEventListener(
        "resize",
        requestNavbarUpdate
    );

    requestNavbarUpdate();
}