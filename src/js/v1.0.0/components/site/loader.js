export async function initLoader() {
  const loader = document.getElementById("loader");

  if (!loader) {
    return;
  }

  const name = loader.querySelector(".loader-name");

  const letters = Array.from(loader.querySelectorAll(".loader-letter"));

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (reduceMotion) {
    loader.remove();

    return;
  }

  let pageLoaded = document.readyState === "complete";

  window.addEventListener("load", () => {
    pageLoaded = true;
  });

  const popupDuration = 250;
  const popupDelay = 10;

  const holdDuration = 400;

  const popScale = 0.9;

  function resetLetters() {
    letters.forEach((letter) => {
      letter.style.opacity = "0";

      letter.style.transform = `scale(${popScale}) translateY(10px)`;
    });

    name.style.transform = "scale(1)";
  }
  //==================================================================================================



  function animateLetter(letter, direction) {
    const keyframes =
      direction === "in"
        ? [
            {
              opacity: 0,
              transform: `scale(${popScale}) translateY(10px)`,
            },
            {
              opacity: 1,
              transform: "scale(1.08) translateY(0)",
              offset: 0.75,
            },
            {
              opacity: 1,
              transform: "scale(1) translateY(0)",
            },
          ]
        : [
            {
              opacity: 1,
              transform: "scale(1) translateY(0)",
            },
            {
              opacity: 1,
              transform: "scale(1.08) translateY(0)",
              offset: 0.25,
            },
            {
              opacity: 0,
              transform: `scale(${popScale}) translateY(10px)`,
            },
          ];

    return letter.animate(keyframes, {
      duration: popupDuration,
      easing: "cubic-bezier(0.22, 1, 0.36, 1)",
      fill: "forwards",
    }).finished;
  }
  //==================================================================================================



  async function popIn() {
    for (const letter of letters) {
      await animateLetter(letter, "in");

      await new Promise((resolve) => {
        setTimeout(resolve, popupDelay);
      });
    }
  }
  //==================================================================================================



  async function popOut() {
    for (let i = letters.length - 1; i >= 0; i--) {
      await animateLetter(letters[i], "out");

      await new Promise((resolve) => {
        setTimeout(resolve, popupDelay);
      });
    }
  }
  //==================================================================================================



  async function dissolveLoader() {
    await new Promise((resolve) => {
      setTimeout(resolve, holdDuration);
    });

    const dissolve = loader.animate(
      [
        {
          opacity: 1,
          filter: "blur(0px)",
        },
        {
          opacity: 0.8,
          filter: "blur(1px)",
          offset: 0.25,
        },
        {
          opacity: 0.35,
          filter: "blur(4px)",
          offset: 0.65,
        },
        {
          opacity: 0,
          filter: "blur(10px)",
        },
      ],
      {
        duration: 200,
        easing: "ease-out",
        fill: "forwards",
      },
    );

    await dissolve.finished.catch(() => {});

    loader.remove();
  }
  //==================================================================================================

  

  resetLetters();

  while (!pageLoaded) {
    // b → r → d → n → w → d
    await popIn();

    await new Promise((resolve) => {
      setTimeout(resolve, holdDuration);
    });

    if (pageLoaded) {
      break;
    }

    // d → w → n → d → r → b
    await popOut();

    await new Promise((resolve) => {
      setTimeout(resolve, 150);
    });
  }

  // Page is ready.
  // Dissolve the loader
  // to reveal the page underneath.

  await dissolveLoader();
}
