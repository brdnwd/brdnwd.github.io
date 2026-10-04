export async function initLoader(callback, onError) {
    const $loader = $("[data-loader]");

    async function runCallback() {
        if (!callback) {
            return Promise.resolve();
        }

        try {
            return await callback();
        } catch (error) {
            if (typeof onError === "function") {
                onError(error);
            }

            return null;
        }
    }

    if (!$loader.length) {
        await runCallback();
        return;
    }

    const $name = $loader.find("[data-loader-name]");
    const letters = $loader.find("[data-loader-letter]").toArray();

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    const pageLoad = new Promise((resolve) => {
        if (document.readyState === "complete") {
            resolve();
            return;
        }

        $(window).one("load", resolve);
    });

    if (reduceMotion) {
        $loader.remove();

        await pageLoad;
        await runCallback();

        return;
    }

    const popupDuration = 250;
    const popupDelay = 10;
    const holdDuration = 400;
    const popScale = 0.9;

    /*
     * ---------------------------------------------------------
     * Mouse interaction
     * ---------------------------------------------------------
     */

    const mouse = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        active: false,
    };

    const letterStates = letters.map((letter, index) => ({
        element: letter,
        index,
        x: 0,
        y: 0,
        rotation: 0,
        targetX: 0,
        targetY: 0,
        targetRotation: 0,
    }));

    let mouseFrame = null;

    function updateMousePosition(event) {
        mouse.x = event.clientX;
        mouse.y = event.clientY;
        mouse.active = true;

        if (!mouseFrame) {
            mouseFrame = requestAnimationFrame(
                animateMouseInteraction
            );
        }
    }

    function resetMouseInteraction() {
        mouse.active = false;

        if (!mouseFrame) {
            mouseFrame = requestAnimationFrame(
                animateMouseInteraction
            );
        }
    }

    function animateMouseInteraction(time) {
        const influenceRadius = 300;
        const maxPush = 65;
        const maxRotation = 18;
        const spring = 0.12;

        let needsAnimation = false;

        for (const state of letterStates) {
            const rect = state.element.getBoundingClientRect();

            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            let targetX = 0;
            let targetY = 0;
            let targetRotation = 0;

            if (mouse.active) {
                const dx = centerX - mouse.x;
                const dy = centerY - mouse.y;

                const distance = Math.sqrt(
                    dx * dx + dy * dy
                );

                if (distance < influenceRadius) {
                    const normalized =
                        1 -
                        Math.min(
                            distance / influenceRadius,
                            1
                        );

                    const falloff =
                        normalized * normalized;

                    const angle = Math.atan2(dy, dx);

                    targetX =
                        Math.cos(angle) *
                        maxPush *
                        falloff;

                    targetY =
                        Math.sin(angle) *
                        maxPush *
                        falloff;

                    targetRotation =
                        Math.sin(
                            angle +
                            state.index * 0.7
                        ) *
                        maxRotation *
                        falloff;

                    const wave =
                        Math.sin(
                            time * 0.012 +
                            state.index * 1.2
                        ) *
                        10 *
                        falloff;

                    targetX +=
                        Math.cos(angle + Math.PI / 2) *
                        wave;

                    targetY +=
                        Math.sin(angle + Math.PI / 2) *
                        wave;
                }
            }

            state.targetX = targetX;
            state.targetY = targetY;
            state.targetRotation = targetRotation;

            state.x +=
                (state.targetX - state.x) *
                spring;

            state.y +=
                (state.targetY - state.y) *
                spring;

            state.rotation +=
                (state.targetRotation - state.rotation) *
                spring;

            state.element.style.translate =
                `${state.x}px ${state.y}px`;

            state.element.style.rotate =
                `${state.rotation}deg`;

            if (
                Math.abs(state.x - state.targetX) > 0.01 ||
                Math.abs(state.y - state.targetY) > 0.01 ||
                Math.abs(
                    state.rotation -
                    state.targetRotation
                ) > 0.01 ||
                mouse.active
            ) {
                needsAnimation = true;
            }
        }

        if (needsAnimation) {
            mouseFrame = requestAnimationFrame(
                animateMouseInteraction
            );
        } else {
            mouseFrame = null;
        }
    }

    $loader.on("mousemove", updateMousePosition);
    $loader.on("mouseleave", resetMouseInteraction);

    /*
     * ---------------------------------------------------------
     * Letter animation
     * ---------------------------------------------------------
     */

    function resetLetters() {
        $(letters).each(function () {
            $(this).css({
                opacity: "0",
                transform: `scale(${popScale}) translateY(10px)`,
                willChange: "transform, translate, rotate",
            });
        });

        $name.css("transform", "scale(1)");
    }

    function animateLetter(letter, direction) {
        const keyframes =
            direction === "in"
                ? [
                    {
                        opacity: 0,
                        transform: `scale(${popScale}) translateY(10px)`,
                    },
                    {
                        opacity: 1,
                        transform: "scale(1.08) translateY(0)",
                        offset: 0.75,
                    },
                    {
                        opacity: 1,
                        transform: "scale(1) translateY(0)",
                    },
                ]
                : [
                    {
                        opacity: 1,
                        transform: "scale(1) translateY(0)",
                    },
                    {
                        opacity: 1,
                        transform: "scale(1.08) translateY(0)",
                        offset: 0.25,
                    },
                    {
                        opacity: 0,
                        transform: `scale(${popScale}) translateY(10px)`,
                    },
                ];

        return letter.animate(keyframes, {
            duration: popupDuration,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
            fill: "forwards",
        }).finished;
    }

    async function popIn() {
        for (const letter of letters) {
            await animateLetter(letter, "in");

            await new Promise((resolve) => {
                setTimeout(resolve, popupDelay);
            });
        }
    }

    async function popOut() {
        for (let i = letters.length - 1; i >= 0; i--) {
            await animateLetter(letters[i], "out");

            await new Promise((resolve) => {
                setTimeout(resolve, popupDelay);
            });
        }
    }

    /*
     * ---------------------------------------------------------
     * Loader dissolve
     * ---------------------------------------------------------
     */

    async function dissolveLoader() {
        await new Promise((resolve) => {
            setTimeout(resolve, holdDuration);
        });

        const duration = 1100;
        const startTime = performance.now();
        const points = 40;

        function getWave(progress) {
            const width = window.innerWidth;
            const height = window.innerHeight;
            const boundary =
                progress * (width + 600) - 300;

            const wavePoints = [];

            for (let i = 0; i <= points; i++) {
                const y = (height / points) * i;

                const wave =
                    Math.sin(
                        (y / height) * Math.PI * 3 +
                        progress * 8
                    ) * 35 +
                    Math.sin(
                        (y / height) * Math.PI * 7 -
                        progress * 12
                    ) * 18 +
                    Math.sin(
                        (y / height) * Math.PI * 13 +
                        progress * 5
                    ) * 8;

                const x = boundary + wave;

                wavePoints.push(`${x}px ${y}px`);
            }

            return [
                `${width}px 0px`,
                `${width}px ${height}px`,
                ...wavePoints.reverse(),
            ].join(", ");
        }

        function animate(time) {
            const elapsed = time - startTime;

            const rawProgress =
                Math.min(elapsed / duration, 1);

            const progress =
                rawProgress *
                rawProgress *
                (3 - 2 * rawProgress);

            $loader.css(
                "clip-path",
                `polygon(${getWave(progress)})`
            );

            if (rawProgress < 1) {
                requestAnimationFrame(animate);
            }
        }

        $loader.css(
            "clip-path",
            "polygon(0 0, 100% 0, 100% 100%, 0 100%)"
        );

        requestAnimationFrame(animate);

        await new Promise((resolve) => {
            setTimeout(resolve, duration + 50);
        });

        if (mouseFrame) {
            cancelAnimationFrame(mouseFrame);
            mouseFrame = null;
        }

        $loader.off("mousemove", updateMousePosition);
        $loader.off("mouseleave", resetMouseInteraction);

        $loader.remove();
    }

    /*
     * ---------------------------------------------------------
     * Start
     * ---------------------------------------------------------
     */

    resetLetters();

    const siteReady = runCallback();

    await popIn();

    await pageLoad;

    await siteReady;

    await popOut();
    await popIn();
    await dissolveLoader();
}