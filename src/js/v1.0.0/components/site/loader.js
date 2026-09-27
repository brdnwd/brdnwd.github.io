export async function initLoader() {
    const loader = document.getElementById("loader");

    if (!loader) {
        return;
    }

    const name = loader.querySelector(".loader-name");
    const letters = Array.from(
        loader.querySelectorAll(".loader-letter")
    );

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion) {
        loader.remove();
        return;
    }

    let pageLoaded =
        document.readyState === "complete";

    window.addEventListener(
        "load",
        () => {
            pageLoaded = true;
        }
    );

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
        const keyframes =
            direction === "in"
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

        const duration = 1100;
        const startTime = performance.now();
        const points = 40;

        function getWave(progress) {
            const width =
                window.innerWidth;

            const height =
                window.innerHeight;

            const boundary =
                progress *
                (width + 200) -
                100;

            const wavePoints = [];

            for (
                let i = 0;
                i <= points;
                i++
            ) {
                const y =
                    (height / points) * i;

                const wave =
                    Math.sin(
                        (y / height) *
                        Math.PI *
                        3 +
                        progress * 8
                    ) * 35 +
                    Math.sin(
                        (y / height) *
                        Math.PI *
                        7 -
                        progress * 12
                    ) * 18 +
                    Math.sin(
                        (y / height) *
                        Math.PI *
                        13 +
                        progress * 5
                    ) * 8;

                const x =
                    boundary + wave;

                wavePoints.push(
                    `${x}px ${y}px`
                );
            }

            return [
                `${width}px 0px`,
                `${width}px ${height}px`,
                ...wavePoints.reverse()
            ].join(", ");
        }

        function animate(time) {
            const elapsed =
                time - startTime;

            const rawProgress =
                Math.min(
                    elapsed / duration,
                    1
                );

            const progress =
                rawProgress *
                rawProgress *
                (3 -
                    2 *
                    rawProgress);

            loader.style.clipPath =
                `polygon(${getWave(progress)})`;

            if (
                rawProgress <
                1
            ) {
                requestAnimationFrame(
                    animate
                );
            }
        }

        loader.style.clipPath =
            "polygon(0 0, 100% 0, 100% 100%, 0 100%)";

        requestAnimationFrame(
            animate
        );

        await new Promise(resolve => {
            setTimeout(
                resolve,
                duration + 50
            );
        });

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

        await dissolveLoader();
    }

    loaderLoop();
}