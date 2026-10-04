export function initFooter() {
    const $footerContainer = $("#footerContainer");
    if (!$footerContainer.length) return;

    const body = document.querySelector("#body");
    if (!body) return;

    $footerContainer.html(`
        <section id="footer" class="relative w-full h-screen shrink-0 z-[200] pointer-events-none" data-navbar-theme="dark">
            <div class="footer-fixed fixed bottom-0 left-0 w-full h-screen opacity-80">
                <div class="footer-scroll relative w-full h-full">
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
        </section>
    `);

    const footerContainer =
        $footerContainer[0];

    const footer =
        $footerContainer.find("#footer")[0];

    const footerFixed =
        $footerContainer.find(".footer-fixed")[0];

    const $footerSocials =
        $footerContainer.find("#footerSocials");

    const $footerNavigation =
        $footerContainer.find("#footerNavigation");

    const $siteVersion =
        $footerContainer.find("#siteVersion");

    const socials = [
        {
            name: "GitHub",
            url: "https://github.com/brdnwd"
        },
        {
            name: "LinkedIn",
            url: "https://www.linkedin.com/in/brdnwd"
        },
        {
            name: "Facebook",
            url: "https://www.facebook.com/brdnwd"
        },
        {
            name: "DEV",
            url: "https://dev.to/brdnwd"
        },
        {
            name: "YouTube",
            url: "https://www.youtube.com/channel/UC1eVpwYmIxLqi84OroyZo6w"
        }
    ];

    socials.forEach((social) => {
        $footerSocials.append(`
            <a href="${social.url}" class="pointer-events-auto w-full py-4 text-center transition hover:text-theme">
                ${social.name}
            </a>
        `);
    });

    /*
     * Build footer navigation.
     */
    $("#navbarLinks a").each(function () {
        const $link =
            $(this);

        const href =
            $link.attr("href");

        const text =
            $link.text().trim();

        if (!href || !text) return;

        $footerNavigation.append(`
            <a class="pointer-events-auto w-full py-4 text-center transition hover:text-theme" href="${href}">
                ${text}
            </a>
        `);
    });

    /*
     * Footer remains a normal section in #body.
     *
     * The actual footer content is fixed to the viewport
     * so it does not move with the section stack.
     */
    if (
        footerContainer.parentElement !==
        body
    ) {
        body.appendChild(
            footerContainer
        );
    }

    function updateFooter() {
        const footerRect =
            footer.getBoundingClientRect();

        const viewportHeight =
            window.innerHeight;

        /*
         * Footer's stack position relative to
         * the bottom of the viewport.
         *
         * 0 = footer has not reached the viewport.
         * 1 = footer is fully revealed.
         */
        const reveal =
            Math.max(
                0,
                Math.min(
                    1,
                    (
                        viewportHeight -
                        footerRect.top
                    ) /
                    Math.max(
                        footerRect.height,
                        1
                    )
                )
            );

        /*
         * Reveal the fixed footer upward from
         * the bottom as the footer section reaches it.
         */
        footerFixed.style.clipPath =
            `inset(${(1 - reveal) * 100}% 0 0 0)`;

        /*
         * Hide the portion of the preceding sections
         * that sits over the revealed footer.
         */
        [...body.children].forEach((element) => {
            if (
                element === footerContainer ||
                element.tagName !== "SECTION"
            ) {
                return;
            }

            const rect =
                element.getBoundingClientRect();

            const footerTop =
                viewportHeight -
                (
                    reveal *
                    viewportHeight
                );

            const overlapTop =
                Math.max(
                    rect.top,
                    footerTop
                );

            const overlapBottom =
                Math.min(
                    rect.bottom,
                    viewportHeight
                );

            if (
                overlapBottom <=
                overlapTop
            ) {
                element.style.maskImage = "";
                element.style.webkitMaskImage = "";
                return;
            }

            const topPercent =
                Math.max(
                    0,
                    Math.min(
                        100,
                        (
                            (
                                overlapTop -
                                rect.top
                            ) /
                            Math.max(
                                rect.height,
                                1
                            )
                        ) *
                        100
                    )
                );

            const bottomPercent =
                Math.max(
                    0,
                    Math.min(
                        100,
                        (
                            (
                                overlapBottom -
                                rect.top
                            ) /
                            Math.max(
                                rect.height,
                                1
                            )
                        ) *
                        100
                    )
                );

            const mask =
                `linear-gradient(
                    to bottom,
                    black 0%,
                    black ${topPercent}%,
                    transparent ${topPercent}%,
                    transparent ${bottomPercent}%,
                    black ${bottomPercent}%,
                    black 100%
                )`;

            element.style.maskImage =
                mask;

            element.style.webkitMaskImage =
                mask;
        });
    }

    const scrollContainer =
        body.parentElement;

    scrollContainer.addEventListener(
        "scroll",
        updateFooter,
        {
            passive: true
        }
    );

    updateFooter();

    const resizeObserver =
        new ResizeObserver(
            updateFooter
        );

    resizeObserver.observe(
        footer
    );

    window.addEventListener(
        "resize",
        updateFooter,
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

            if (
                !version?.shortSha
            ) {
                return;
            }

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