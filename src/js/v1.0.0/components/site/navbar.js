export function initNavbar() {

  const navbarContainer =
    document.getElementById("navbarContainer");

  if (!navbarContainer) {
    return;
  }


  /*
   * Navbar HTML
   */

  navbarContainer.innerHTML = `
    <div id="navbar" class="flex flex-row justify-between items-center w-full h-full page-container">

      <div class="text-5xl font-medium font-qahiri">
        BW
      </div>


      <div class="text-lg font-bold flex-row gap-10 hidden md:flex">

        <a
          class="transition hover:text-theme"
          href="/"
        >
          HOME
        </a>

        <a
          class="transition hover:text-theme"
          href="/pages/about"
        >
          ABOUT
        </a>

        <a
          class="transition hover:text-theme"
          href="/pages/projects"
        >
          PROJECTS
        </a>

        <a
          class="transition hover:text-theme"
          href="/pages/blogs"
        >
          BLOGS
        </a>

        <a
          class="transition hover:text-theme"
          href="/pages/contact"
        >
          CONTACT
        </a>

      </div>


      <div class="flex flex-row items-center gap-5 font-bold">

        <a
          id="sidemenu"
          class="hamburger-menu-icon block md:hidden w-[3.4rem] h-[3.4rem] scale-x-[-1] mb-[5px] bg-current transition-colors"
        ></a>

        <a
          id="searchmenu"
          class="hidden md:flex flex hover:text-theme transition"
        >
          <span
            class="search-icon w-[2rem] h-[2rem] mb-[1px] bg-current transition-colors"
          ></span>
        </a>

      </div>

    </div>
  `;


  /*
   * Get the generated navbar
   */

  const navbar =
    document.getElementById("navbar");

  if (!navbar) {
    return;
  }


  let navbarIsDark = false;
  let ticking = false;


  //==================================================================================================


  function getBackgroundColor(element) {

    let current = element;


    while (
      current &&
      current !== document.documentElement
    ) {

      /*
       * Ignore images, videos, and canvases.
       * Continue checking their parent background.
       */

      if (
        current.tagName === "IMG" ||
        current.tagName === "VIDEO" ||
        current.tagName === "CANVAS"
      ) {

        current =
          current.parentElement;

        continue;
      }


      const background =
        getComputedStyle(current)
          .backgroundColor;


      if (
        background &&
        background !== "transparent" &&
        background !== "rgba(0, 0, 0, 0)"
      ) {

        return background;
      }


      current =
        current.parentElement;
    }


    return getComputedStyle(
      document.body
    ).backgroundColor;
  }


  //==================================================================================================


  function getLuminance(color) {

    const match =
      color.match(/[\d.]+/g);


    if (
      !match ||
      match.length < 3
    ) {

      return 255;
    }


    const r =
      Number(match[0]);

    const g =
      Number(match[1]);

    const b =
      Number(match[2]);


    return (
      0.299 * r +
      0.587 * g +
      0.114 * b
    );
  }


  //==================================================================================================


  function updateNavbarTheme() {

    ticking = false;


    const rect =
      navbar.getBoundingClientRect();


    /*
     * Sample several horizontal lines
     * directly underneath the navbar.
     */

    const sampleOffsets = [
      2,
      8,
      16,
      24
    ];


    /*
     * Number of points sampled
     * across each line.
     */

    const samplesPerLine = 100;


    let totalLuminance = 0;
    let totalSamples = 0;


    sampleOffsets.forEach((offset) => {

      const y =
        rect.bottom + offset;


      if (
        y >= window.innerHeight
      ) {

        return;
      }


      for (
        let i = 0;
        i < samplesPerLine;
        i++
      ) {

        const x =
          (
            window.innerWidth /
            (samplesPerLine - 1)
          ) * i;


        const element =
          document.elementFromPoint(
            x,
            y
          );


        if (!element) {
          continue;
        }


        const background =
          getBackgroundColor(element);


        const luminance =
          getLuminance(background);


        totalLuminance +=
          luminance;

        totalSamples++;
      }

    });


    if (
      totalSamples === 0
    ) {

      return;
    }


    /*
     * Average brightness across
     * the entire sampled area.
     */

    const averageLuminance =
      totalLuminance /
      totalSamples;


    /*
     * Lower = darker.
     * Higher = lighter.
     */

    const shouldBeDark =
      averageLuminance < 100;


    if (
      shouldBeDark !== navbarIsDark
    ) {

      navbarIsDark =
        shouldBeDark;


      navbar.classList.toggle(
        "text-white",
        shouldBeDark
      );


      navbar.classList.toggle(
        "text-black",
        !shouldBeDark
      );
    }

  }


  //==================================================================================================


  function requestNavbarUpdate() {

    if (ticking) {
      return;
    }


    ticking = true;


    requestAnimationFrame(
      updateNavbarTheme
    );
  }


  //==================================================================================================


  /*
   * Capture scrolling from the entire
   * document, including nested containers.
   */

  document.addEventListener(
    "scroll",
    requestNavbarUpdate,
    true
  );


  window.addEventListener(
    "resize",
    requestNavbarUpdate
  );


  requestNavbarUpdate();

}