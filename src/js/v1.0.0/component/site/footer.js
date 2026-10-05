export function initFooter() {
    const $footerContainer = $("#footerContainer");
    if (!$footerContainer.length) return;

    const body = document.querySelector("#body");
    if (!body) return;

    $footerContainer.html(`
<section id="footer" class="relative w-full shrink-0 z-[999] pointer-events-none">
    <div class="footer-fixed fixed bottom-0 left-0 w-full h-screen opacity-80 pointer-events-none"></div>

    <div class="footer-scroll relative w-full">
        <div class="flex flex-col min-h-screen justify-between items-center page-container pt-8 lg:pt-12">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 w-full max-w-6xl mx-auto items-center">
                <div class="flex flex-col gap-10">
                    <div class="flex flex-col gap-4">
                        <span class="text-2xl lg:text-3xl font-bold">[ Socials ]</span>
                        <div id="footerSocials" class="flex flex-col gap-1 text-lg lg:text-xl font-bold"></div>
                    </div>
                </div>

                <div class="flex flex-col gap-10">
                    <div class="flex flex-col gap-4">
                        <span class="text-2xl lg:text-3xl font-bold">Site Index</span>
                        <div id="footerNavigation" class="flex flex-col gap-1 text-lg lg:text-xl font-bold"></div>
                    </div>
                </div>

                <div class="flex flex-col gap-10">
                    <div class="flex flex-col gap-4">
                        <span class="text-2xl lg:text-3xl font-bold">[ Contact ]</span>
                        <div class="flex flex-col gap-1 text-lg lg:text-xl font-bold">
                            <a href="mailto:hello@brdnwd.com" class="pointer-events-auto">hello@brdnwd.com</a>
                            <span>Arkansas, USA</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="overflow-hidden hidden md:block">
                <div class="font-qahiri font-bold leading-[0.65] opacity-20 whitespace-nowrap text-[50vw] text-center translate-y-[30%]">
                    <span>BRDNWD</span>
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
            <a
                href="${social.url}"
                class="pointer-events-auto w-full transition hover:text-theme"
            >
                ${social.name}
            </a>
        `);
    });

    $("#navbarLinks a").each(function () {
        const $link =
            $(this);

        const href =
            $link.attr("href");

        const text =
            $link.text().trim().replaceAll(' ', '').replaceAll('\n', '');

        if (!href || !text) return;

        $footerNavigation.append(`
            <a
                class="pointer-events-auto w-full transition hover:text-theme"
                href="${href}"
            >
                ${text}
            </a>
        `);
    });

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
         * The footer only needs one viewport of
         * reveal space.
         *
         * The footer itself may be taller than the
         * viewport, but that should not slow down
         * the reveal.
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
                        viewportHeight,
                        1
                    )
                )
            );

        /*
         * Keep the fixed footer layer synced with
         * the reveal.
         */
        footerFixed.style.clipPath =
            `inset(${(1 - reveal) * 100}% 0 0 0)`;

        /*
         * Once the footer reaches the viewport,
         * its background occupies everything from
         * the footer's reveal point downward.
         */
        const footerTop =
            viewportHeight -
            (
                reveal *
                viewportHeight
            );

        [...body.children].forEach((element) => {
            if (
                element === footerContainer ||
                element.tagName !== "SECTION"
            ) {
                return;
            }

            const rect =
                element.getBoundingClientRect();

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

    if (scrollContainer) {
        scrollContainer.addEventListener(
            "scroll",
            updateFooter,
            {
                passive: true
            }
        );
    }

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