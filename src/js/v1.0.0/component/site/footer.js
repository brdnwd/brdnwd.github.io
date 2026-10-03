export function initFooter() {
    const $footerContainer = $("#footerContainer");
    if (!$footerContainer.length) return;

    const body = document.querySelector("#body");
    if (!body) return;

    const scrollContainer = body.parentElement;
    if (!scrollContainer) return;

    //TODO
    $footerContainer.html(`
        <div
            id="footer"
            class="relative w-full h-[100vh] opacity-80"
            data-navbar-theme="dark"
        >
            <div class="footer-scroll relative w-full h-full overflow-y-auto overflow-x-hidden">
                <div class="flex min-h-full flex-col justify-between">
                    <div class="flex flex-1 flex-row page-container justify-between">
                        <div class="flex flex-col gap-4">
                            <div id="footerNavigation" class="flex flex-col gap-2 text-xl"></div>
                        </div>

                        <div class="flex flex-col gap-4">
                            <div id="footerSocials" class="flex flex-col gap-2 text-xl"></div>
                        </div>

                        <div class="flex flex-col gap-4 max-w-sm">
                            <p class="text-xl leading-tight">
                                Building things, breaking things, and figuring out how to make them better.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `);

    const $footerSocials =
        $footerContainer.find("#footerSocials");

    const socials = [
        { name: "GitHub", url: "https://github.com/brdnwd" },
        { name: "LinkedIn", url: "https://www.linkedin.com/in/brdnwd" },
        { name: "Facebook", url: "https://www.facebook.com/brdnwd" },
        { name: "DEV", url: "https://dev.to/brdnwd" },
        { name: "YouTube", url: "https://www.youtube.com/channel/UC1eVpwYmIxLqi84OroyZo6w" }
    ];

    socials.forEach((social) => {
        $footerSocials.append(`
            <a
                href="${social.url}"
                class="pointer-events-auto w-full py-4 text-center transition hover:text-theme"
            >
                ${social.name}
            </a>
        `);
    });

    const footerContainer =
        $footerContainer[0];

    const footer =
        $footerContainer.find("#footer")[0];

    const footerScroll =
        $footerContainer.find(".footer-scroll")[0];

    const $siteVersion =
        $footerContainer.find("#siteVersion");

    const $footerNavigation =
        $footerContainer.find("#footerNavigation");

    /*
     * Build footer navigation.
     */
    $("#navbarLinks a").each(function () {
        const $link = $(this);

        const href =
            $link.attr("href");

        const text =
            $link.text().trim();

        if (!href || !text) return;

        $footerNavigation.append(`
            <a
                class="pointer-events-auto w-full py-4 text-center transition hover:text-theme"
                href="${href}"
            >
                ${text}
            </a>
        `);
    });

    /*
     * Footer lives outside #body.
     */
    if (
        footerContainer.parentElement !==
        scrollContainer
    ) {
        scrollContainer.appendChild(
            footerContainer
        );
    }

    /*
     * Footer is visually above the page,
     * but does not capture pointer input until
     * it is actually revealed.
     */
    Object.assign(
        footerContainer.style,
        {
            position: "fixed",
            left: "0",
            right: "0",
            bottom: "0",
            width: "100%",
            height: "100vh",
            zIndex: "200",
            clipPath: "inset(100% 0 0 0)",
            pointerEvents: "none"
        }
    );

    /*
     * Main page remains underneath.
     */
    Object.assign(
        body.style,
        {
            position: "relative",
            zIndex: "10"
        }
    );

    /*
     * Reserve the footer's height as scroll space.
     */
    function updateFooterSpace() {
        const footerHeight =
            footer.getBoundingClientRect().height;

        body.style.paddingBottom =
            `${footerHeight}px`;
    }

    /*
     * Reveal footer based entirely on native
     * page scroll position.
     */
    function updateFooterReveal() {
        const footerHeight =
            footer.getBoundingClientRect().height;

        const maxScroll =
            scrollContainer.scrollHeight -
            scrollContainer.clientHeight;

        if (maxScroll <= 0) {
            footerContainer.style.clipPath =
                "inset(100% 0 0 0)";

            footerContainer.style.pointerEvents =
                "none";

            return;
        }

        const scrollTop =
            scrollContainer.scrollTop;

        const revealStart =
            maxScroll - footerHeight;

        const progress =
            Math.max(
                0,
                Math.min(
                    1,
                    (
                        scrollTop -
                        revealStart
                    ) / footerHeight
                )
            );

        const hiddenAmount =
            (1 - progress) * 100;

        footerContainer.style.clipPath =
            `inset(${hiddenAmount}% 0 0 0)`;

        /*
         * Only allow interaction once the footer
         * has been completely revealed.
         */
        footerContainer.style.pointerEvents =
            progress >= 1
                ? "auto"
                : "none";
    }

    /*
     * Main page scrolling.
     */
    scrollContainer.addEventListener(
        "scroll",
        updateFooterReveal,
        {
            passive: true
        }
    );

    /*
     * Footer's own scrolling.
     */
    footerScroll.addEventListener(
        "wheel",
        (event) => {
            if (
                footerContainer.style.pointerEvents !==
                "auto"
            ) {
                return;
            }

            const canScrollDown =
                footerScroll.scrollTop <
                footerScroll.scrollHeight -
                footerScroll.clientHeight;

            const canScrollUp =
                footerScroll.scrollTop > 0;

            if (
                (event.deltaY > 0 && canScrollDown) ||
                (event.deltaY < 0 && canScrollUp)
            ) {
                event.stopPropagation();
            }
        },
        {
            passive: true
        }
    );

    /*
     * Initial state.
     */
    updateFooterSpace();
    updateFooterReveal();

    /*
     * Resize handling.
     */
    const resizeObserver =
        new ResizeObserver(() => {
            updateFooterSpace();
            updateFooterReveal();
        });

    resizeObserver.observe(footer);

    window.addEventListener(
        "resize",
        updateFooterReveal,
        {
            passive: true
        }
    );

    /*
     * Load website version.
     */
    $.getJSON(
        "/src/res/json/github.json"
    )
        .done(function (data) {
            const version =
                data?.version;

            if (!version?.shortSha) return;

            $siteVersion.find("div").html(`
                <span class="git-commit-icon w-[17px] h-[17px] mt-[0.5px] bg-current transition-colors"></span>
                <span class="text-[17px]">
                    ${version.shortSha}
                </span>
            `);

            $siteVersion.attr(
                "href",
                version.url || "#"
            );
        })
        .fail(function () {
            $siteVersion.find("div").text(
                "VERSION UNKNOWN"
            );
        });
}