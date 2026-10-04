export function initSectionStack() {
    const body = document.querySelector("#body");
    if (!body) return;

    const scrollContainer = body.parentElement;
    if (!scrollContainer) return;

    let panels = [];
    let targetScroll = scrollContainer.scrollTop;
    let currentScroll = scrollContainer.scrollTop;
    let animationFrame = null;

    const ease = 0.02;
    const minScale = 0.72;

    function collectPanels() {
        panels = [...body.children].slice(1);

        panels.forEach((panel) => {
            panel.style.transform = "none";

            if (
                panel.tagName === "SECTION" &&
                !panel.querySelector(":scope > .section-stack-content")
            ) {
                const content =
                    document.createElement("div");

                content.className =
                    "section-stack-content";

                while (panel.firstChild) {
                    content.appendChild(panel.firstChild);
                }

                panel.appendChild(content);
            }
        });
    }

    function updateStack() {
        const viewportHeight = window.innerHeight;

        panels.forEach((panel, index) => {
            const panelHeight =
                panel.offsetHeight + 200;

            // The section itself NEVER gets transformed.
            panel.style.transform = "none";

            panel.style.position = "sticky";
            panel.style.zIndex = `${index + 1}`;

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

            if (index === panels.length - 1) {
                content.style.transform = "none";
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
                Math.min(1, progress)
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
            (targetScroll - currentScroll) * ease;

        if (
            Math.abs(
                targetScroll - currentScroll
            ) < 0.5
        ) {
            currentScroll = targetScroll;
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

        targetScroll += event.deltaY;

        const maxScroll =
            scrollContainer.scrollHeight -
            scrollContainer.clientHeight;

        targetScroll = Math.max(
            0,
            Math.min(
                targetScroll,
                maxScroll
            )
        );

        startScroll();
    }

    collectPanels();
    updateStack();
    updateZoom();

    scrollContainer.addEventListener(
        "wheel",
        handleWheel,
        { passive: false }
    );

    const resizeObserver =
        new ResizeObserver(() => {
            updateStack();
            updateZoom();

            const maxScroll =
                scrollContainer.scrollHeight -
                scrollContainer.clientHeight;

            targetScroll = Math.max(
                0,
                Math.min(
                    targetScroll,
                    maxScroll
                )
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
        },
        { passive: true }
    );
}