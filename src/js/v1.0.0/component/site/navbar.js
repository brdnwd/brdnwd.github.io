export function initNavbar() {
    const $navbarContainer = $("#navbarContainer");
    if (!$navbarContainer.length) return;

    $navbarContainer.html(`
        <div id="navbarBackground" class="select-none py-4 bg-black/0 text-black">
            <div id="navbar" class="flex flex-row justify-between items-center w-full h-full page-container">
                <div class="text-5xl font-medium font-qahiri">BW</div>

                <div id="navbarLinks" class="text-lg font-bold items-center flex-row gap-5 xl:gap-10 hidden md:flex">
                    <a class="transition hover:text-theme flex flex-row" href="/">
                        <span class="inline-block" data-physics>H</span>
                        <span class="inline-block" data-physics>O</span>
                        <span class="inline-block" data-physics>M</span>
                        <span class="inline-block" data-physics>E</span>
                    </a>
                    <a class="transition hover:text-theme flex flex-row" href="/page/about">
                        <span class="inline-block" data-physics>A</span>
                        <span class="inline-block" data-physics>B</span>
                        <span class="inline-block" data-physics>O</span>
                        <span class="inline-block" data-physics>U</span>
                        <span class="inline-block" data-physics>T</span>
                    </a>
                    <a class="transition hover:text-theme flex flex-row" href="/page/projects">
                        <span class="inline-block" data-physics>P</span>
                        <span class="inline-block" data-physics>R</span>
                        <span class="inline-block" data-physics>O</span>
                        <span class="inline-block" data-physics>J</span>
                        <span class="inline-block" data-physics>E</span>
                        <span class="inline-block" data-physics>C</span>
                        <span class="inline-block" data-physics>T</span>
                        <span class="inline-block" data-physics>S</span>
                    </a>
                    <a class="transition hover:text-theme flex flex-row" href="/page/blogs">
                        <span class="inline-block" data-physics>B</span>
                        <span class="inline-block" data-physics>L</span>
                        <span class="inline-block" data-physics>O</span>
                        <span class="inline-block" data-physics>G</span>
                        <span class="inline-block" data-physics>S</span>
                    </a>
                    <a class="transition hover:text-theme flex flex-row" href="/page/contact">
                        <span class="inline-block" data-physics>C</span>
                        <span class="inline-block" data-physics>O</span>
                        <span class="inline-block" data-physics>N</span>
                        <span class="inline-block" data-physics>T</span>
                        <span class="inline-block" data-physics>A</span>
                        <span class="inline-block" data-physics>C</span>
                        <span class="inline-block" data-physics>T</span>
                    </a>
                    <a class="transition hover:text-theme flex flex-row" href="/res/file/resume.pdf">
                        <span class="inline-block" data-physics>R</span>
                        <span class="inline-block" data-physics>E</span>
                        <span class="inline-block" data-physics>S</span>
                        <span class="inline-block" data-physics>U</span>
                        <span class="inline-block" data-physics>M</span>
                        <span class="inline-block" data-physics>E</span>
                    </a>
                </div>

                <div class="flex md:hidden flex-row items-center gap-5 font-bold">
                    <a
                        id="sidemenu"
                        class="hamburger-menu-icon block md:hidden w-[3.4rem] h-[3.4rem] scale-x-[-1] mb-[5px] bg-current transition-colors"
                        href="#"
                        aria-label="Open menu"
                        aria-expanded="false"
                    ></a>
                </div>
            </div>
        </div>
    `);

    const $navbar = $("#navbar");
    const $navbarBackground = $("#navbarBackground");
    const $sidemenu = $("#sidemenu");
    const scrollContainer = $("#body").parent()[0];

    if (!$navbar.length || !$sidemenu.length || !scrollContainer) return;

    let navbarIsDark = false;
    let ticking = false;
    let menuOpen = false;
    let menuAnimating = false;

    /*
     * Navbar scroll state.
     */
    let lastScrollTop = scrollContainer.scrollTop;
    let navbarHidden = false;

    const NAVBAR_HIDE_THRESHOLD = 400;
    const NAVBAR_BOTTOM_THRESHOLD = 600;

    /*
     * Navbar transition.
     */
    $navbarContainer.css({
        "transition": "transform 0.85s cubic-bezier(0.22, 1, 0.36, 1)",
        "will-change": "transform"
    });

    function showNavbar() {
        if (!navbarHidden) return;

        navbarHidden = false;

        $navbarContainer.css(
            "transform",
            "translateY(0)"
        );
    }

    function hideNavbar() {
        if (navbarHidden) return;

        navbarHidden = true;

        $navbarContainer.css(
            "transform",
            "translateY(-100%)"
        );
    }

    function updateNavbarVisibility() {
        const currentScrollTop = scrollContainer.scrollTop;
        const maxScrollTop = scrollContainer.scrollHeight - scrollContainer.clientHeight;
        const distanceFromBottom = maxScrollTop - currentScrollTop;
        const scrollDifference = currentScrollTop - lastScrollTop;

        // Hide and keep hidden near the bottom
        if (distanceFromBottom <= NAVBAR_BOTTOM_THRESHOLD) {
            hideNavbar();
            lastScrollTop = currentScrollTop;
            return;
        }

        // Show near the top
        if (currentScrollTop <= NAVBAR_HIDE_THRESHOLD) {
            showNavbar();
            lastScrollTop = currentScrollTop;
            return;
        }

        // Hide when scrolling down
        if (scrollDifference > 0) {
            hideNavbar();
        }

        // Show when scrolling up
        else if (scrollDifference < 0) {
            showNavbar();
        }

        lastScrollTop = currentScrollTop;
    }

    function getNavbarTheme() {
        const rect = $navbarContainer[0].getBoundingClientRect();

        // Detect exactly at the bottom edge of the navbar.
        // Clamp it so it remains inside the viewport when the navbar is hidden.
        const detectionY = Math.max(
            0,
            Math.min(window.innerHeight - 1, rect.bottom - 1)
        );

        const elements = document.elementsFromPoint(
            window.innerWidth / 2,
            detectionY
        );

        for (const element of elements) {
            // Ignore anything belonging to the navbar.
            if ($navbarContainer[0].contains(element)) continue;

            const $section = $(element).closest("[data-navbar-theme]");

            if ($section.length) {
                return $section.data("navbar-theme");
            }
        }

        return null;
    }

    function updateNavbarTheme() {
        ticking = false;

        const theme =
            getNavbarTheme();

        if (!theme) return;

        const shouldBeDark =
            theme === "dark";

        if (shouldBeDark === navbarIsDark) {
            return;
        }

        navbarIsDark =
            shouldBeDark;

        $navbar.toggleClass(
            "text-white",
            shouldBeDark
        );

        $navbar.toggleClass(
            "text-black",
            !shouldBeDark
        );
    }

    function updateNavbarBlur() {
        if (!$navbarBackground.length) return;

        $navbarBackground.toggleClass(
            "backdrop-blur-md",
            scrollContainer.scrollTop > 10
        );
    }

    function requestNavbarUpdate() {
        if (ticking) return;

        ticking = true;

        requestAnimationFrame(() => {
            updateNavbarTheme();
            updateNavbarVisibility();
        });
    }

    /*
     * Side menu.
     */
    const $mobileMenu = $(`
        <div id="mobileMenu" class="fixed inset-0 z-[1000] bg-accent text-black pointer-events-none md:hidden">

            <div class="absolute top-[1.37rem] z-[1001] left-0 right-0">
                <div class="flex flex-row justify-between items-center w-full h-full page-container">
                    <div class="font-qahiri text-5xl">BW</div>

                    <a
                        id="closemenu"
                        class="close-icon block w-[2.3rem] h-[2.3rem] mr-[5px] bg-current transition-colors"
                        href="#"
                        aria-label="Close menu"
                    ></a>
                </div>
            </div>

            <div class="absolute top-0 bottom-[9rem] sm:bottom-[6rem] overflow-y-scroll scrollbar-hidden left-0 right-0">
                <div class="flex flex-col w-full min-h-full py-8">
                    <div id="mobileMenuContent" class="flex flex-col w-full mt-10">

                        <div class="w-full">
                            <h2 class="w-full py-3 text-sm font-bold tracking-widest text-center">
                                NAVIGATION
                            </h2>

                            <nav
                                id="mobileNavigation"
                                class="flex flex-col items-center text-2xl min-[305px]:text-4xl min-[535px]:text-6xl font-bold"
                            ></nav>
                        </div>

                        <div class="w-full mt-10">
                            <h2 class="w-full py-3 text-sm font-bold tracking-widest text-center">
                                MORE
                            </h2>

                            <div class="flex flex-col items-center text-2xl min-[305px]:text-4xl min-[535px]:text-6xl font-bold">
                                <a
                                    class="w-full py-4 text-center transition hover:text-theme"
                                    href="/res/file/resume.pdf"
                                >
                                    RESUME
                                </a>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <div class="absolute bottom-[23px] left-2 right-2 sm:bottom-[23px] sm:left-[32px] sm:right-[32px] flex flex-col-reverse sm:flex-row justify-center sm:justify-between items-center gap-2 sm:gap-3 font-bold">

                <div class="flex flex-col-reverse md:flex-col">
                    <span>&copy; 2026 Braden Wood</span>

                    <a
                        id="siteVersion"
                        class="transition hover:text-theme"
                        href="#"
                    >
                        <div class="flex sm:w-min w-full flex-row justify-center items-center gap-1"></div>
                    </a>
                </div>

                <div class="flex flex-row justify-between items-center gap-2">

                    <a
                        class="flex sm:w-min w-full flex-row justify-center items-center gap-1 transition hover:text-theme"
                        href="https://github.com/brdnwd"
                    >
                        <span class="github-icon w-[30px] h-[30px] lg:w-[40px] lg:h-[40px] mt-[0.5px] bg-current transition-colors"></span>
                    </a>

                    <a
                        class="flex sm:w-min w-full flex-row justify-center items-center gap-1 transition hover:text-theme"
                        href="https://www.linkedin.com/in/brdnwd/"
                    >
                        <span class="linkedin-icon w-[30px] h-[30px] lg:w-[40px] lg:h-[40px] mt-[0.5px] bg-current transition-colors"></span>
                    </a>

                    <a
                        class="flex sm:w-min w-full flex-row justify-center items-center gap-1 transition hover:text-theme"
                        href="https://www.facebook.com/brdnwd/"
                    >
                        <span class="facebook-icon w-[32px] h-[32px] lg:w-[42px] lg:h-[42px] mt-[0.5px] bg-current transition-colors"></span>
                    </a>

                    <a
                        class="flex sm:w-min w-full flex-row justify-center items-center gap-1 transition hover:text-theme"
                        href="https://dev.to/brdnwd"
                    >
                        <span class="dev-to-icon w-[29px] h-[29px] lg:w-[39px] lg:h-[39px] mt-[0.5px] bg-current transition-colors"></span>
                    </a>

                </div>
            </div>

            <div class="grain"></div>
        </div>
    `);

    $mobileMenu.css(
        "clip-path",
        "polygon(100% 0%, 100% 100%, 100% 100%, 100% 0%)"
    );

    $("body").append($mobileMenu);

    const $closemenu =
        $mobileMenu.find("#closemenu");

    const $siteVersion =
        $mobileMenu.find("#siteVersion");

    const $mobileNavigation =
        $mobileMenu.find("#mobileNavigation");

    /*
     * Populate mobile navigation.
     */
    function populateMobileNavigation() {
        $mobileNavigation.empty();

        $("#navbarLinks a").each(function () {
            const $link = $(this);

            const href =
                $link.attr("href");

            const text =
                $link.text().trim();

            if (
                !href ||
                !text ||
                text.includes("RESUME")
            ) {
                return;
            }

            $mobileNavigation.append(`
                <a
                    class="w-full py-4 text-center transition hover:text-theme"
                    href="${href}"
                >
                    ${text}
                </a>
            `);
        });
    }

    populateMobileNavigation();

    /*
     * Load website version.
     */
    $.getJSON("/src/res/json/github.json")
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

            $siteVersion
                .parent()
                .attr(
                    "href",
                    version.url || "#"
                );
        })
        .fail(function () {
            $siteVersion
                .find("div")
                .text("VERSION UNKNOWN");
        });

    /*
     * Wave.
     */
    function getWave(progress, direction) {
        const width =
            window.innerWidth;

        const height =
            window.innerHeight;

        const points = 40;

        const boundary =
            direction === "open"
                ? width + 300 -
                progress * (width + 600)
                : -300 +
                progress * (width + 600);

        const wavePoints = [];

        for (let i = 0; i <= points; i++) {
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

            wavePoints.push(
                `${boundary + wave}px ${y}px`
            );
        }

        return [
            `${width}px 0px`,
            `${width}px ${height}px`,
            ...wavePoints.reverse()
        ].join(", ");
    }

    function setMenuWave(progress, direction) {
        $mobileMenu.css(
            "clip-path",
            `polygon(${getWave(progress, direction)})`
        );
    }

    function animateMenu(direction) {
        return new Promise(resolve => {
            const duration = 1100;

            const startTime =
                performance.now();

            function animate(time) {
                const rawProgress =
                    Math.min(
                        (time - startTime) /
                        duration,
                        1
                    );

                const progress =
                    rawProgress *
                    rawProgress *
                    (3 - 2 * rawProgress);

                setMenuWave(
                    progress,
                    direction
                );

                if (rawProgress < 1) {
                    requestAnimationFrame(
                        animate
                    );

                    return;
                }

                resolve();
            }

            requestAnimationFrame(
                animate
            );
        });
    }

    async function openMenu() {
        if (
            menuOpen ||
            menuAnimating ||
            window.innerWidth >= 768
        ) {
            return;
        }

        $mobileMenu.show();

        populateMobileNavigation();

        menuAnimating = true;
        menuOpen = true;

        $mobileMenu
            .css("pointer-events", "auto")
            .attr("aria-hidden", "false");

        $sidemenu
            .attr("aria-expanded", "true")
            .attr("aria-label", "Close menu");

        setMenuWave(
            0,
            "open"
        );

        await animateMenu(
            "open"
        );

        menuAnimating = false;
    }

    async function closeMenu() {
        if (
            !menuOpen ||
            menuAnimating
        ) {
            return;
        }

        menuAnimating = true;

        await animateMenu(
            "close"
        );

        $mobileMenu
            .css("pointer-events", "none")
            .attr("aria-hidden", "true");

        $sidemenu
            .attr("aria-expanded", "false")
            .attr("aria-label", "Open menu");

        menuOpen = false;
        menuAnimating = false;

        $mobileMenu.hide();
    }

    $sidemenu.on(
        "click",
        function (event) {
            event.preventDefault();

            if (menuOpen) {
                closeMenu();
            } else {
                openMenu();
            }
        }
    );

    $closemenu.on(
        "click",
        function (event) {
            event.preventDefault();

            closeMenu();
        }
    );

    $(document).on(
        "keydown",
        function (event) {
            if (
                event.key === "Escape" &&
                menuOpen
            ) {
                closeMenu();
            }
        }
    );

    /*
     * Resize.
     */
    $(window).on(
        "resize",
        function () {
            requestNavbarUpdate();
            updateNavbarBlur();

            if (window.innerWidth >= 768) {
                $mobileMenu.css({
                    "pointer-events": "none",
                    "clip-path":
                        "polygon(100% 0%, 100% 100%, 100% 100%, 100% 0%)"
                })
                    .attr(
                        "aria-hidden",
                        "true"
                    )
                    .hide();

                $sidemenu
                    .attr(
                        "aria-expanded",
                        "false"
                    )
                    .attr(
                        "aria-label",
                        "Open menu"
                    );

                menuOpen = false;
                menuAnimating = false;

                return;
            }

            if (
                menuOpen &&
                !menuAnimating
            ) {
                setMenuWave(
                    1,
                    "open"
                );
            }
        }
    );

    /*
     * Artificial scroll container.
     *
     * This is intentionally listening to
     * the actual scroll container instead
     * of window.scrollY.
     */
    scrollContainer.addEventListener(
        "scroll",
        function () {
            requestNavbarUpdate();
            updateNavbarBlur();
        },
        {
            passive: true
        }
    );

    $(window).on(
        "resize",
        function () {
            requestNavbarUpdate();
            updateNavbarBlur();
        }
    );

    /*
     * Initial state.
     */
    updateNavbarBlur();
    requestNavbarUpdate();
}