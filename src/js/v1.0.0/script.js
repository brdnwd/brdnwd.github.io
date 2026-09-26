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

        const popupDuration = 250;
        const popupDelay = 10;

        const holdDuration = 400;

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
                    easing:
                        "cubic-bezier(0.22, 1, 0.36, 1)",
                    fill: "forwards"
                }
            ).finished;
        }


        async function popIn() {

            for (const letter of letters) {

                await animateLetter(
                    letter,
                    "in"
                );

                await new Promise(resolve => {
                    setTimeout(
                        resolve,
                        popupDelay
                    );
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
                    setTimeout(
                        resolve,
                        popupDelay
                    );
                });
            }
        }


        async function dissolveLoader() {

            await new Promise(resolve => {
                setTimeout(
                    resolve,
                    holdDuration
                );
            });


            const dissolve = loader.animate(
                [
                    {
                        opacity: 1,
                        filter: "blur(0px)"
                    },
                    {
                        opacity: 0.8,
                        filter: "blur(1px)",
                        offset: 0.25
                    },
                    {
                        opacity: 0.35,
                        filter: "blur(4px)",
                        offset: 0.65
                    },
                    {
                        opacity: 0,
                        filter: "blur(10px)"
                    }
                ],
                {
                    duration: 200,
                    easing: "ease-out",
                    fill: "forwards"
                }
            );


            await dissolve.finished.catch(() => {});


            loader.remove();
        }


        async function loaderLoop() {

            resetLetters();


            while (!pageLoaded) {

                // b → r → d → n → w → d
                await popIn();


                await new Promise(resolve => {
                    setTimeout(
                        resolve,
                        holdDuration
                    );
                });


                if (pageLoaded) {
                    break;
                }


                // d → w → n → d → r → b
                await popOut();


                await new Promise(resolve => {
                    setTimeout(
                        resolve,
                        150
                    );
                });
            }


            // Page is ready.
            // Dissolve the loader
            // to reveal the page underneath.

            await dissolveLoader();
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

const $youtubeContainer = $("#ytVideos");

if ($youtubeContainer.length) {

    function formatDescription(description) {

        const urlRegex = /(https?:\/\/[^\s<]+)/gi;

        return description.replace(urlRegex, (url) => {

            let cleanUrl = url;
            let trailing = "";

            // Remove punctuation attached to the URL
            while (/[.,!?;:)\]}]$/.test(cleanUrl)) {
                trailing = cleanUrl.slice(-1) + trailing;
                cleanUrl = cleanUrl.slice(0, -1);
            }

            let displayUrl;

            try {
                const parsedUrl = new URL(cleanUrl);

                // Remove www.
                displayUrl = parsedUrl.hostname.replace(/^www\./, "");

                // Add the path
                if (parsedUrl.pathname && parsedUrl.pathname !== "/") {
                    displayUrl += parsedUrl.pathname;
                }

                // Add query parameters
                if (parsedUrl.search) {
                    displayUrl += parsedUrl.search;
                }
            } catch {
                displayUrl = cleanUrl;
            }

            return `
                <a
                    href="${cleanUrl}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-white transition text-wrap break-all hover:text-theme hover:decoration-theme"
                >${displayUrl}</a>${trailing}
            `;

        });

    }

    async function loadYouTubeVideos() {

        try {

            const response = await fetch(
                "/src/res/json/youtube.json"
            );

            if (!response.ok) {
                throw new Error(
                    `Failed to load YouTube data: ${response.status}`
                );
            }

            const data = await response.json();

            if (!data.videos || data.videos.length < 4) {
                throw new Error(
                    "Not enough YouTube videos available."
                );
            }

            $youtubeContainer.empty();

            data.videos.slice(0, 2).forEach(video => {

                const formattedDescription =
                    formatDescription(
                        video.description || ""
                    );

                const videoTemplate = `
                    <div class="grid grid-cols-1 rounded-lg bg-white/5">

                        <div class="flex flex-col gap-2 w-full">

                            <div class="w-full select-none overflow-hidden shrink-0">
                                <img
                                    src="${video.thumbnail}"
                                    loading="lazy"
                                    class="w-full aspect-video object-cover rounded-t-lg bg-black"
                                >
                            </div>

                            <div class="flex flex-col justify-between h-full gap-3 min-h-0 px-5 py-5">

                                <h3 class="text-2xl line-clamp-1">
                                    ${video.title}
                                </h3>

                                <div class="text-lg scrollbar-theme text-white/60 line-clamp-4">
                                    ${formattedDescription}
                                </div>

                                <a
                                    class="flex sm:w-fit w-full select-none flex-row justify-center items-center gap-2 hover:gap-3 transition-all hover:text-theme px-2 p-1 rounded-lg border-1 border bg-[#fff] sm:border-none sm:rounded-0 sm:px-0 sm:p-0 sm:bg-transparent text-black sm:text-white"
                                    href="${video.url}"
                                >
                                    <span class="text-[17px]">
                                        Watch On Youtube
                                    </span>

                                    <span class="arrow-right-icon w-[20px] h-[20px] mb-[1px] bg-current transition-colors hidden sm:flex"></span>
                                </a>

                            </div>

                        </div>

                    </div>
                `;

                $youtubeContainer.append(videoTemplate);

            });

        } catch (error) {

            console.error(
                "YouTube error:",
                error
            );

            $youtubeContainer.html(`
                <p class="text-white/50">
                    Unable to load videos right now.
                </p>
            `);

        }

    }

    loadYouTubeVideos();

}