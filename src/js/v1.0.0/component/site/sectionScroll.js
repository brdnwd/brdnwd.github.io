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

    function collectPanels() {
        panels = [...body.children].slice(1);
    }

    function updateStack() {
        const viewportHeight = window.innerHeight;

        panels.forEach((panel, index) => {
            const panelHeight = panel.offsetHeight + 200;

            panel.style.position = "sticky";
            panel.style.zIndex = `${index + 1}`;

            panel.style.top =
                panelHeight > viewportHeight
                    ? `${viewportHeight - panelHeight}px`
                    : "0px";
        });
    }

    function animateScroll() {
        currentScroll +=
            (targetScroll - currentScroll) * ease;

        if (Math.abs(targetScroll - currentScroll) < 0.5) {
            currentScroll = targetScroll;
            animationFrame = null;
            scrollContainer.scrollTop = currentScroll;
            return;
        }

        scrollContainer.scrollTop = currentScroll;

        animationFrame =
            requestAnimationFrame(animateScroll);
    }

    function startScroll() {
        if (animationFrame) return;

        animationFrame =
            requestAnimationFrame(animateScroll);
    }

    function handleWheel(event) {
        event.preventDefault();

        targetScroll += event.deltaY;

        const maxScroll =
            scrollContainer.scrollHeight -
            scrollContainer.clientHeight;

        targetScroll = Math.max(
            0,
            Math.min(targetScroll, maxScroll)
        );

        startScroll();
    }

    collectPanels();
    updateStack();

    scrollContainer.addEventListener(
        "wheel",
        handleWheel,
        { passive: false }
    );

    const resizeObserver =
        new ResizeObserver(() => {
            updateStack();

            const maxScroll =
                scrollContainer.scrollHeight -
                scrollContainer.clientHeight;

            targetScroll = Math.max(
                0,
                Math.min(targetScroll, maxScroll)
            );
        });

    panels.forEach((panel) => {
        resizeObserver.observe(panel);
    });

    window.addEventListener(
        "resize",
        updateStack,
        { passive: true }
    );
}