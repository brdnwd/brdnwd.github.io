//TODO: this is still janky rework
export function initSectionSnap() {
    const body = document.querySelector('#body');
    if (!body) return;

    const scrollContainer = body.parentElement;
    const sections = [...body.querySelectorAll('section')];
    const footer = body.querySelector('#footerContainer');

    const items = footer
        ? [...sections, footer]
        : [...sections];

    if (items.length < 2) return;

    let isScrolling = false;
    let smoothScrollFrame = null;
    let smoothScrollTarget = scrollContainer.scrollTop;
    let lastFrameTime = performance.now();
    let currentIndex = 0;
    let boundaryBuffer = 0;
    let boundaryDirection = 0;

    const sectionBuffer = 180;
    const maxBufferStep = 60;

    function getItemTop(item) {
        const containerRect =
            scrollContainer.getBoundingClientRect();

        const itemRect =
            item.getBoundingClientRect();

        return (
            itemRect.top -
            containerRect.top +
            scrollContainer.scrollTop
        );
    }

    function getItemRange(index) {
        const item = items[index];
        const top = getItemTop(item);
        const height = item.getBoundingClientRect().height;
        const bottom = top + height;

        if (index === items.length - 1) {
            return {
                'top': top,
                'maxScroll': Math.max(
                    top,
                    scrollContainer.scrollHeight -
                        scrollContainer.clientHeight
                )
            };
        }

        return {
            'top': top,
            'maxScroll': Math.max(
                top,
                bottom -
                    scrollContainer.clientHeight
            )
        };
    }

    function getPageBottom() {
        return Math.max(
            0,
            scrollContainer.scrollHeight -
                scrollContainer.clientHeight
        );
    }

    function updateCurrentSection() {
        const scrollTop =
            scrollContainer.scrollTop;

        for (let i = items.length - 1; i >= 0; i--) {
            if (
                scrollTop >=
                getItemTop(items[i]) - 1
            ) {
                currentIndex = i;
                return;
            }
        }

        currentIndex = 0;
    }

    function resetBoundaryBuffer() {
        boundaryBuffer = 0;
        boundaryDirection = 0;
    }

    function addBoundaryBuffer(direction, delta) {
        if (boundaryDirection !== direction) {
            boundaryBuffer = 0;
            boundaryDirection = direction;
        }

        boundaryBuffer += Math.min(
            Math.abs(delta),
            maxBufferStep
        );

        return boundaryBuffer >= sectionBuffer;
    }

    function animateScroll(
        target,
        duration,
        easing,
        onComplete
    ) {
        const start =
            scrollContainer.scrollTop;

        const distance =
            target - start;

        const startTime =
            performance.now();

        function step(currentTime) {
            const progress =
                Math.min(
                    (currentTime - startTime) /
                        duration,
                    1
                );

            const eased =
                easing(progress);

            scrollContainer.scrollTop =
                start +
                distance *
                eased;

            if (progress < 1) {
                requestAnimationFrame(
                    step
                );

                return;
            }

            scrollContainer.scrollTop =
                target;

            smoothScrollTarget =
                target;

            if (onComplete) {
                onComplete();
            }
        }

        requestAnimationFrame(step);
    }

    function easeOut(progress) {
        return 1 -
            Math.pow(
                1 - progress,
                4
            );
    }

    function easeInOut(progress) {
        return progress < 0.5
            ? 8 *
                progress *
                progress *
                progress *
                progress
            : 1 -
                Math.pow(
                    -2 * progress + 2,
                    4
                ) / 2;
    }

    function moveDown(index) {
        const range =
            getItemRange(index);

        const targetTop =
            range.top;

        const distance =
            Math.abs(
                targetTop -
                    scrollContainer.scrollTop
            );

        const duration =
            Math.max(
                850,
                distance * 1.65
            );

        animateScroll(
            targetTop,
            duration,
            easeInOut,
            () => {
                currentIndex = index;
                isScrolling = false;
                resetBoundaryBuffer();
            }
        );
    }

    function moveUp(index) {
        const range =
            getItemRange(index);

        const targetTop =
            index === 0
                ? 0
                : range.top;

        const distance =
            Math.abs(
                targetTop -
                    scrollContainer.scrollTop
            );

        const duration =
            Math.max(
                800,
                distance * 1.5
            );

        animateScroll(
            targetTop,
            duration,
            easeOut,
            () => {
                currentIndex = index;
                isScrolling = false;
                resetBoundaryBuffer();
            }
        );
    }

    function smoothScroll(target) {
        smoothScrollTarget =
            target;

        if (smoothScrollFrame) return;

        lastFrameTime =
            performance.now();

        function step(currentTime) {
            const deltaTime =
                Math.min(
                    (currentTime -
                        lastFrameTime) /
                        1000,
                    0.05
                );

            lastFrameTime =
                currentTime;

            const current =
                scrollContainer.scrollTop;

            const distance =
                smoothScrollTarget -
                current;

            const smoothing = 4.2;

            const amount =
                1 -
                Math.exp(
                    -smoothing *
                        deltaTime
                );

            scrollContainer.scrollTop =
                current +
                distance *
                amount;

            if (
                Math.abs(distance) <
                0.5
            ) {
                scrollContainer.scrollTop =
                    smoothScrollTarget;

                smoothScrollFrame =
                    null;

                return;
            }

            smoothScrollFrame =
                requestAnimationFrame(
                    step
                );
        }

        smoothScrollFrame =
            requestAnimationFrame(
                step
            );
    }

    updateCurrentSection();

    scrollContainer.addEventListener(
        'scroll',
        () => {
            if (!isScrolling) {
                updateCurrentSection();
            }
        },
        {
            'passive': true
        }
    );

    scrollContainer.addEventListener(
        'wheel',
        (event) => {
            if (isScrolling) {
                event.preventDefault();
                return;
            }

            const delta =
                event.deltaY;

            if (delta === 0) {
                return;
            }

            const lastIndex =
                items.length - 1;

            event.preventDefault();

            const scrollTop =
                scrollContainer.scrollTop;

            if (!smoothScrollFrame) {
                smoothScrollTarget =
                    scrollTop;
            }

            const currentRange =
                getItemRange(
                    currentIndex
                );

            /*
             * DOWN
             */
            if (delta > 0) {
                const nextTarget =
                    smoothScrollTarget +
                    delta;

                /*
                 * Reached the bottom of
                 * the current item.
                 */
                if (
                    nextTarget >=
                    currentRange.maxScroll
                ) {
                    smoothScrollTarget =
                        currentRange.maxScroll;

                    /*
                     * There is another item
                     * after this one.
                     */
                    if (
                        currentIndex <
                        lastIndex
                    ) {
                        const ready =
                            addBoundaryBuffer(
                                1,
                                delta
                            );

                        if (ready) {
                            isScrolling =
                                true;

                            if (
                                smoothScrollFrame
                            ) {
                                cancelAnimationFrame(
                                    smoothScrollFrame
                                );

                                smoothScrollFrame =
                                    null;
                            }

                            moveDown(
                                currentIndex + 1
                            );

                            return;
                        }
                    } else {
                        /*
                         * Final footer:
                         * stay at the absolute
                         * bottom of the page.
                         */
                        resetBoundaryBuffer();

                        smoothScrollTarget =
                            getPageBottom();

                        smoothScroll(
                            smoothScrollTarget
                        );

                        return;
                    }

                    smoothScroll(
                        smoothScrollTarget
                    );

                    return;
                }

                resetBoundaryBuffer();

                smoothScrollTarget =
                    Math.min(
                        nextTarget,
                        currentRange.maxScroll
                    );

                smoothScroll(
                    smoothScrollTarget
                );

                return;
            }

            /*
             * UP
             */
            const nextTarget =
                smoothScrollTarget +
                delta;

            if (
                currentIndex > 0 &&
                nextTarget <=
                    currentRange.top
            ) {
                const ready =
                    addBoundaryBuffer(
                        -1,
                        delta
                    );

                smoothScrollTarget =
                    currentRange.top;

                if (ready) {
                    isScrolling =
                        true;

                    if (
                        smoothScrollFrame
                    ) {
                        cancelAnimationFrame(
                            smoothScrollFrame
                        );

                        smoothScrollFrame =
                            null;
                    }

                    moveUp(
                        currentIndex - 1
                    );

                    return;
                }

                smoothScroll(
                    currentRange.top
                );

                return;
            }

            if (
                currentIndex === 0 &&
                nextTarget <= 0
            ) {
                resetBoundaryBuffer();

                smoothScrollTarget =
                    0;

                smoothScroll(0);

                return;
            }

            resetBoundaryBuffer();

            smoothScrollTarget =
                Math.max(
                    nextTarget,
                    currentRange.top
                );

            smoothScroll(
                smoothScrollTarget
            );
        },
        {
            'passive': false
        }
    );
}