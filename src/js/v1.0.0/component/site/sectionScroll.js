export function initSectionStack() {
    const body = document.querySelector("#body");
    if (!body) return;

    const scrollContainer = body.parentElement;
    if (!scrollContainer) return;

    let panels = [];
    let targetScroll = scrollContainer.scrollTop;
    let currentScroll = scrollContainer.scrollTop;
    let animationFrame = null;

    let dragging = false;
    let lastPointerY = 0;

    const ease = 0.02;
    const minScale = 0.72;

    function getMaxScroll() {
        return Math.max(
            0,
            scrollContainer.scrollHeight -
            scrollContainer.clientHeight
        );
    }

    function clampScroll(value) {
        return Math.max(
            0,
            Math.min(
                value,
                getMaxScroll()
            )
        );
    }

    function collectPanels() {
        panels = [...body.children].slice(1);

        panels.forEach((panel) => {
            panel.style.transform = "none";

            if (
                panel.tagName === "SECTION" &&
                !panel.querySelector(
                    ":scope > .section-stack-content"
                )
            ) {
                const content =
                    document.createElement("div");

                content.className =
                    "section-stack-content";

                while (panel.firstChild) {
                    content.appendChild(
                        panel.firstChild
                    );
                }

                panel.appendChild(content);
            }
        });
    }

    function updateStack() {
        const viewportHeight =
            window.innerHeight;

        panels.forEach((panel, index) => {
            const panelHeight =
                panel.offsetHeight + 200;

            panel.style.transform =
                "none";

            panel.style.position =
                "sticky";

            panel.style.zIndex =
                `${index + 1}`;

            panel.style.top =
                panelHeight > viewportHeight
                    ? `${viewportHeight - panelHeight}px`
                    : "0px";
        });
    }

    function updateZoom() {
        panels.forEach((panel, index) => {
            const content =
                panel.querySelector(
                    ":scope > .section-stack-content"
                );

            if (!content) return;

            if (
                index ===
                panels.length - 1
            ) {
                content.style.transform =
                    "none";

                return;
            }

            const nextPanel =
                panels[index + 1];

            const nextRect =
                nextPanel.getBoundingClientRect();

            let progress =
                1 -
                nextRect.top /
                window.innerHeight;

            progress = Math.max(
                0,
                Math.min(
                    1,
                    progress
                )
            );

            const scale =
                1 -
                (1 - minScale) *
                progress;

            content.style.transform =
                `scale(${scale})`;

            content.style.transformOrigin =
                "center center";
        });
    }

    function animateScroll() {
        currentScroll +=
            (
                targetScroll -
                currentScroll
            ) * ease;

        if (
            Math.abs(
                targetScroll -
                currentScroll
            ) < 0.5
        ) {
            currentScroll =
                targetScroll;

            animationFrame = null;

            scrollContainer.scrollTop =
                currentScroll;

            updateZoom();

            return;
        }

        scrollContainer.scrollTop =
            currentScroll;

        updateZoom();

        animationFrame =
            requestAnimationFrame(
                animateScroll
            );
    }

    function startScroll() {
        if (animationFrame) return;

        animationFrame =
            requestAnimationFrame(
                animateScroll
            );
    }

    function handleWheel(event) {
        event.preventDefault();

        targetScroll +=
            event.deltaY;

        targetScroll =
            clampScroll(
                targetScroll
            );

        startScroll();
    }

    function handlePointerDown(event) {
        if (
            event.pointerType !==
            "touch"
        ) {
            return;
        }

        dragging = true;
        lastPointerY =
            event.clientY;

        scrollContainer.setPointerCapture(
            event.pointerId
        );
    }

    function handlePointerMove(event) {
        if (
            !dragging ||
            event.pointerType !==
            "touch"
        ) {
            return;
        }

        event.preventDefault();

        const deltaY =
            lastPointerY -
            event.clientY;

        lastPointerY =
            event.clientY;

        targetScroll +=
            deltaY;

        targetScroll =
            clampScroll(
                targetScroll
            );

        startScroll();
    }

    function endPointerDrag(event) {
        if (
            event.pointerType !==
            "touch"
        ) {
            return;
        }

        dragging = false;

        if (
            scrollContainer.hasPointerCapture(
                event.pointerId
            )
        ) {
            scrollContainer.releasePointerCapture(
                event.pointerId
            );
        }
    }

    collectPanels();
    updateStack();
    updateZoom();

    /*
     * This custom scroller owns touch dragging,
     * so prevent the browser from performing
     * native scrolling underneath it.
     */
    scrollContainer.style.touchAction =
        "none";

    scrollContainer.addEventListener(
        "wheel",
        handleWheel,
        {
            passive: false
        }
    );

    scrollContainer.addEventListener(
        "pointerdown",
        handlePointerDown,
        {
            passive: true
        }
    );

    scrollContainer.addEventListener(
        "pointermove",
        handlePointerMove,
        {
            passive: false
        }
    );

    scrollContainer.addEventListener(
        "pointerup",
        endPointerDrag,
        {
            passive: true
        }
    );

    scrollContainer.addEventListener(
        "pointercancel",
        endPointerDrag,
        {
            passive: true
        }
    );

    const resizeObserver =
        new ResizeObserver(() => {
            updateStack();
            updateZoom();

            targetScroll =
                clampScroll(
                    targetScroll
                );

            currentScroll =
                clampScroll(
                    currentScroll
                );
        });
        
    panels.forEach((panel) => {
        resizeObserver.observe(panel);
    });

    window.addEventListener(
        "resize",
        () => {
            updateStack();
            updateZoom();

            targetScroll =
                clampScroll(
                    targetScroll
                );

            currentScroll =
                clampScroll(
                    currentScroll
                );
        },
        {
            passive: true
        }
    );
}