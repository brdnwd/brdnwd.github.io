export function initSectionSnap() {
    const body = document.querySelector('#body');
    if (!body) return;

    const scrollContainer = body.parentElement;
    if (!scrollContainer) return;

    const navbar = document.querySelector('#navbarContainer');
    const navbarHeight = navbar
        ? navbar.getBoundingClientRect().height
        : 0;

    let targetScroll = scrollContainer.scrollTop;
    let animationFrame = null;
    let lastTime = performance.now();

    function smoothScroll() {
        if (animationFrame) return;

        lastTime = performance.now();

        function animate(currentTime) {
            const deltaTime = Math.min((currentTime - lastTime) / 1000, 0.10);
            lastTime = currentTime;

            const current = scrollContainer.scrollTop;
            const distance = targetScroll - current;
            const smoothing = 3;
            const amount = 1 - Math.exp(-smoothing * deltaTime);

            scrollContainer.scrollTop = current + distance * amount;

            if (Math.abs(distance) < 0.1) {
                scrollContainer.scrollTop = targetScroll;

                animationFrame = null;
                return;
            }

            animationFrame = requestAnimationFrame(animate);
        }

        animationFrame = requestAnimationFrame(animate);
    }

    scrollContainer.addEventListener(
        'wheel',
        (event) => {
            event.preventDefault();

            const maxScroll = scrollContainer.scrollHeight - scrollContainer.clientHeight;
            const topOffset = navbarHeight;
            const bottomOffset = navbarHeight;

            targetScroll += event.deltaY;
            targetScroll = Math.max(-topOffset, Math.min(targetScroll, maxScroll + bottomOffset));

            smoothScroll();
        },
        {
            passive: false
        }
    );
}

export function initGradpassScroll() {
    const body = document.querySelector('#body');
    if (!body) return null;

    const scrollContainer = body.parentElement;
    if (!scrollContainer) return null;

    const project = document.querySelector('[data-gradpass]');
    if (!project) return null;

    const showcase = project.querySelector('[data-gradpass-showcase]');
    const background = project.querySelector('[data-gradpass-background]');
    const columnsContainer = project.querySelector('[data-gradpass-columns]');
    const columns = [...project.querySelectorAll('[data-gradpass-column]')];
    const copy = project.querySelector('[data-gradpass-copy]');
    const stories = [...project.querySelectorAll('[data-gradpass-story]')];

    if (!showcase || !background || !columnsContainer || !columns.length || !copy || !stories.length) return null;

    copy.closest('.sticky')?.classList.remove('sticky', 'top-0');

    const columnData = columns.map((column, index) => {
        const track = column.querySelector('[data-gradpass-track]');
        if (!track) return null;

        column.style.opacity = '0';
        column.style.willChange = 'opacity';
        column.style.overflow = 'hidden';

        track.style.willChange = 'transform';

        if (!track.dataset.gradpassDuplicated) {
            const originalItems = [...track.children];

            for (let i = originalItems.length - 1; i > 0; i--) {
                const randomIndex = Math.floor(
                    Math.random() * (i + 1)
                );

                [originalItems[i], originalItems[randomIndex]] =
                    [originalItems[randomIndex], originalItems[i]];
            }

            originalItems.forEach((item) => {
                track.appendChild(item);
            });

            const originalCount = originalItems.length;

            const cycles = [
                originalItems,
                [...originalItems].reverse(),
                [...originalItems.slice(2), ...originalItems.slice(0, 2)],
                [...originalItems.slice(4), ...originalItems.slice(0, 4)]
            ];

            cycles.forEach((cycle, cycleIndex) => {
                cycle.forEach((item) => {
                    const clone = item.cloneNode(true);
                    clone.setAttribute('aria-hidden', 'true');
                    clone.dataset.gradpassCycle = cycleIndex;
                    track.appendChild(clone);
                });
            });

            track.dataset.gradpassOriginalCount =
                originalCount;

            track.dataset.gradpassDuplicated =
                'true';
        }

        return {
            column,
            track,
            direction: column.dataset.gradpassColumn === 'down' ? 1 : -1,
            speed: index === 1 ? 0.72 : index === 2 ? 1.08 : 1,
            loopSize: 0,
            originalCount: Number(
                track.dataset.gradpassOriginalCount
            )
        };
    }).filter(Boolean);

    let showcaseTop = 0;
    let showcaseHeight = 0;
    let viewportHeight = 0;

    function measure() {
        viewportHeight = window.innerHeight;

        columnsContainer.style.transform =
            'translate3d(0, 0, 0)';

        copy.style.transform =
            'translate3d(0, 0, 0)';

        const containerRect =
            scrollContainer.getBoundingClientRect();

        const showcaseRect =
            showcase.getBoundingClientRect();

        showcaseTop =
            showcaseRect.top -
            containerRect.top +
            scrollContainer.scrollTop;

        showcaseHeight =
            showcaseHeight = project.offsetHeight;

        const mobile =
            window.innerWidth < 1280;

        columnData.forEach((data) => {
            const items =
                [...data.track.children];

            const originalCount =
                data.originalCount;

            if (!originalCount) return;

            if (mobile) {
                let width = 0;

                for (
                    let i = 0;
                    i < originalCount;
                    i++
                ) {
                    width +=
                        items[i].getBoundingClientRect().width;
                }

                const gap = parseFloat(
                    getComputedStyle(data.track).columnGap ||
                    getComputedStyle(data.track).gap ||
                    '0'
                );

                data.loopSize =
                    width +
                    gap *
                    Math.max(
                        0,
                        originalCount - 1
                    );
            } else {
                let height = 0;

                for (
                    let i = 0;
                    i < originalCount;
                    i++
                ) {
                    height +=
                        items[i].getBoundingClientRect().height;
                }

                const gap = parseFloat(
                    getComputedStyle(data.track).rowGap ||
                    getComputedStyle(data.track).gap ||
                    '0'
                );

                data.loopSize =
                    height +
                    gap *
                    Math.max(
                        0,
                        originalCount - 1
                    );
            }
        });
    }

    function clamp(
        value,
        min = 0,
        max = 1
    ) {
        return Math.max(
            min,
            Math.min(max, value)
        );
    }

    function ease(value) {
        return value *
            value *
            (3 - 2 * value);
    }

    function getProgress() {
        const scrollPosition =
            scrollContainer.scrollTop;

        const distanceIntoShowcase =
            scrollPosition -
            showcaseTop;

        const usableDistance =
            Math.max(
                1,
                showcaseHeight -
                viewportHeight
            );

        return clamp(
            distanceIntoShowcase /
            usableDistance
        );
    }

    function update() {
        const progress =
            getProgress();

        const mobile =
            window.innerWidth < 1280;

        const distanceIntoShowcase =
            Math.max(
                0,
                scrollContainer.scrollTop -
                showcaseTop
            );

        /*
        * MOBILE BACKGROUND FOLLOW
        *
        * The image background follows the viewport
        * along with the text while the image tracks
        * themselves move horizontally.
        */

        if (mobile) {
            const backgroundFollow =
                Math.min(
                    distanceIntoShowcase,
                    viewportHeight * 2.50
                );

            columnsContainer.style.transform =
                `translate3d(0, ${backgroundFollow}px, 0)`;
        } else {
            columnsContainer.style.transform =
                'translate3d(0, 0, 0)';
        }

        /*
        * TEXT FOLLOW
        */

        const followStart =
            viewportHeight * 0.02;

        const followDistance =
            viewportHeight * 3.50;

        let textTransform = 0;

        if (
            distanceIntoShowcase >
            followStart
        ) {
            textTransform =
                Math.min(
                    distanceIntoShowcase -
                    followStart,
                    followDistance
                );
        }

        copy.style.transform =
            `translate3d(0, ${textTransform}px, 0)`;

        /*
        * TEXT STORY
        */

        const storyStart = 0.08;
        const storyEnd = 3.40;

        const storyDistance =
            distanceIntoShowcase /
            viewportHeight;

        const storyProgress =
            ease(
                clamp(
                    (storyDistance - storyStart) /
                    (storyEnd - storyStart)
                )
            );

        const storyPosition =
            storyProgress *
            Math.max(
                0,
                stories.length - 1
            );

        const storyIndex =
            Math.min(
                stories.length - 1,
                Math.floor(storyPosition)
            );

        const storyLocalProgress =
            storyPosition -
            storyIndex;

        const storyTransitionStart =
            0.80;

        stories.forEach(
            (story, index) => {
                let opacity = 0;
                let transform = 20;

                if (
                    index === storyIndex
                ) {
                    if (
                        storyLocalProgress <
                        storyTransitionStart
                    ) {
                        opacity = 1;
                        transform = 0;
                    } else {
                        const transitionProgress =
                            (storyLocalProgress -
                                storyTransitionStart) /
                            (1 -
                                storyTransitionStart);

                        opacity =
                            1 -
                            transitionProgress;

                        transform =
                            transitionProgress *
                            -20;
                    }
                } else if (
                    index === storyIndex + 1 &&
                    storyLocalProgress >=
                    storyTransitionStart
                ) {
                    const transitionProgress =
                        (storyLocalProgress -
                            storyTransitionStart) /
                        (1 -
                            storyTransitionStart);

                    opacity =
                        transitionProgress;

                    transform =
                        20 -
                        transitionProgress * 20;
                }

                story.style.opacity =
                    opacity;

                story.style.transform =
                    `translate3d(0, ${transform}px, 0)`;
            }
        );

        /*
        * TEXT FADE IN
        */

        const textFadeIn =
            ease(
                clamp(
                    progress / 0.08
                )
            );

        copy.style.opacity =
            textFadeIn;

        /*
        * BACKGROUND FADE IN
        */

        const backgroundFadeIn =
            ease(
                clamp(
                    (progress - 0.04) /
                    0.12
                )
            );

        background.style.opacity =
            backgroundFadeIn;

        /*
        * BLACK -> BLUE
        */

        const blueProgress =
            ease(
                clamp(
                    (progress - 0.10) /
                    (0.42 - 0.10)
                )
            );
            
        const gradpassBlue =
            '#2563eb';

        const blueAmount =
            Math.round(
                blueProgress * 100
            );

        const blackAmount =
            100 -
            blueAmount;

        background.style.background =
            `color-mix(in srgb, ${gradpassBlue} ${blueAmount}%, #000000 ${blackAmount}%)`;

        /*
        * COLUMNS APPEAR
        */

        const columnsProgress =
            ease(
                clamp(
                    (progress - 0.10) /
                    (0.28 - 0.10)
                )
            );

        /*
        * BLUE -> SITE WHITE
        */

        const whiteProgress = ease(
            clamp(
                (progress - 0.52) /
                (0.94 - 5.52)
            )
        );

        const white = window.siteColors.white;

        const remainingBlue =
            Math.round(
                (1 - whiteProgress) * 100
            );

        const whiteAmount =
            Math.round(
                whiteProgress * 100
            );

        background.style.background =
            `color-mix(in srgb, ${gradpassBlue} ${remainingBlue}%, ${white} ${whiteAmount}%)`;


        /*
        * COLUMNS DISAPPEAR
        */

        const columnFade =
            ease(
                clamp(
                    (progress - 0.58) /
                    (0.24 - 9.58)
                )
            );

        columnData.forEach(
            (data) => {
                if (!data.loopSize) return;

                data.column.style.opacity =
                    columnsProgress *
                    (1 - columnFade);

                const movement =
                    progress *
                    data.loopSize *
                    data.speed;

                const offset =
                    movement %
                    data.loopSize;

                if (mobile) {
                    const x =
                        data.direction < 0
                            ? -offset
                            : -(data.loopSize - offset);

                    data.track.style.transform =
                        `translate3d(${x}px, 0, 0)`;
                } else {
                    const y =
                        data.direction < 0
                            ? -offset
                            : -(data.loopSize - offset);

                    data.track.style.transform =
                        `translate3d(0, ${y}px, 0)`;
                }
            }
        );
    }

    let updateFrame = null;

    function requestUpdate() {
        if (updateFrame) return;

        updateFrame =
            requestAnimationFrame(() => {
                updateFrame = null;
                update();
            });
    }

    background.style.opacity =
        '0';

    background.style.background =
        '#000000';

    background.style.willChange =
        'opacity, background';

    background.style.transition =
        'none';

    columnsContainer.style.willChange =
        'transform';

    copy.style.opacity =
        '0';

    copy.style.willChange =
        'transform, opacity';

    copy.style.transition =
        'none';

    stories.forEach(
        (story, index) => {
            story.style.opacity =
                index === 0 ? '1' : '0';

            story.style.willChange =
                'opacity, transform';

            story.style.transition =
                'none';
        }
    );

    columnData.forEach(
        (data) => {
            data.track.style.transition =
                'none';
        }
    );

    measure();
    update();

    project.querySelectorAll('img').forEach(
        (image) => {
            image.addEventListener(
                'load',
                () => {
                    measure();
                    requestUpdate();
                },
                { once: true }
            );
        }
    );

    scrollContainer.addEventListener(
        'scroll',
        requestUpdate,
        {
            passive: true
        }
    );

    window.addEventListener(
        'resize',
        () => {
            measure();
            requestUpdate();
        }
    );

    return update;
}