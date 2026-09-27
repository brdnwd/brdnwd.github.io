export function initYouTube() {
  const $youtubeContainer = $("#ytVideos");

  if (!$youtubeContainer.length) {
    return;
  }

  function formatDescription(description) {
    const urlRegex = /(https?:\/\/[^\s<]+)/gi;

    return description.replace(urlRegex, (url) => {
      let cleanUrl = url;

      let trailing = "";

      // Remove punctuation attached to the URL

      while (/[.,!?;:)\]}]$/.test(cleanUrl)) {
        trailing = cleanUrl.slice(-1) + trailing;

        cleanUrl = cleanUrl.slice(0, -1);
      }

      let displayUrl;

      try {
        const parsedUrl = new URL(cleanUrl);

        // Remove www.

        displayUrl = parsedUrl.hostname.replace(/^www\./, "");

        // Add the path

        if (parsedUrl.pathname && parsedUrl.pathname !== "/") {
          displayUrl += parsedUrl.pathname;
        }

        // Add query parameters

        if (parsedUrl.search) {
          displayUrl += parsedUrl.search;
        }
      } catch {
        displayUrl = cleanUrl;
      }

      return `
                    <a
                        href="${cleanUrl}"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-white transition text-wrap break-all hover:text-theme hover:decoration-theme"
                    >${displayUrl}</a>${trailing}
                `;
    });
  }
  //==================================================================================================



  async function loadYouTubeVideos() {
    try {
      const response = await fetch("/src/res/json/youtube.json");

      if (!response.ok) {
        throw new Error(`Failed to load YouTube data: ${response.status}`);
      }

      const data = await response.json();

      if (!data.videos || data.videos.length < 4) {
        throw new Error("Not enough YouTube videos available.");
      }

      $youtubeContainer.empty();

      data.videos.slice(0, 2).forEach((video) => {
        const formattedDescription = formatDescription(video.description || "");

        const videoTemplate = `
            <div class="grid grid-cols-1 rounded-lg bg-white/10">
                <div class="flex flex-col gap-2 w-full">
                    <div class="w-full select-none overflow-hidden shrink-0">
                        <img src="${video.thumbnail}" loading="lazy" class="w-full aspect-video object-cover rounded-t-lg bg-black">
                    </div>
                    <div class="flex flex-col justify-between h-full gap-3 min-h-0 px-5 py-5">
                        <h3 class="text-2xl line-clamp-1">${video.title}</h3>
                        <div class="text-lg scrollbar-theme text-white/60 line-clamp-4">${formattedDescription}</div>
                        <a class="flex sm:w-fit w-full select-none flex-row justify-center items-center gap-2 hover:gap-3 transition-all hover:text-theme px-2 p-1 rounded-lg border-1 border bg-[#fff] sm:border-none sm:rounded-0 sm:px-0 sm:p-0 sm:bg-transparent text-black sm:text-white" href="${video.url}">
                            <span class="text-[17px]">Watch On Youtube</span>
                            <span class="arrow-right-icon w-[20px] h-[20px] mb-[1px] bg-current transition-colors hidden sm:flex"></span>
                        </a>
                    </div>
                </div>
            </div>
        `;

        $youtubeContainer.append(videoTemplate);
      });
    } catch (error) {
      console.error("YouTube error:", error);

      //TODO: Error popup
    }
  }
  //==================================================================================================

  

  loadYouTubeVideos();
}
