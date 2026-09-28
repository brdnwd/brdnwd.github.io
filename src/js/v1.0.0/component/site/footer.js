export function initFooter() {
    const $footerContainer = $("#footerContainer");
    if (!$footerContainer.length) return;

    //FIX SPACING ISSUE ON BOTTOM
    $footerContainer.html(`
        <div id="footer" class="w-full bg-white text-black transition-all select-none">
            <div class="flex w-full justify-between items-center line-height-[3] gap-2 sm:gap-3 flex-col-reverse sm:flex-row page-container py-5 lg:text-1xl 2xl:text-2xl font-bold whitespace-nowrap">
                <div class="flex flex-col-reverse justify-start flex-wrap gap-1">
                    <span>&copy; 2026 Braden Wood</span>
                    <div class="flex flex-col-reverse sm:flex-col">
                        <a id="siteVersion" class="transition hover:text-theme" href="#">
                            <div class="flex sm:w-min w-full flex-row justify-center items-center gap-1"></div>
                        </a>
                    </div>
                </div>
                <div class="flex sm:justify-end items-center flex-col-reverse sm:flex-row flex-wrap">
                    <div class="flex flex-row justify-between items-center gap-2">
                        <a class="flex sm:w-min w-full flex-row justify-center items-center gap-1 transition hover:text-theme" href="https://github.com/brdnwd">
                            <span class="github-icon w-[30px] h-[30px] lg:w-[40px] lg:h-[40px] mt-[0.5px] bg-current transition-colors"></span>
                        </a>
                        <a class="flex sm:w-min w-full flex-row justify-center items-center gap-1 transition hover:text-theme" href="https://www.linkedin.com/in/brdnwd/">
                            <span class="linkedin-icon w-[30px] h-[30px] lg:w-[40px] lg:h-[40px] mt-[0.5px] bg-current transition-colors"></span>
                        </a>
                        <a class="flex sm:w-min w-full flex-row justify-center items-center gap-1 transition hover:text-theme" href="https://www.facebook.com/brdnwd/">
                            <span class="facebook-icon w-[32px] h-[32px] lg:w-[42px] lg:h-[42px] mt-[0.5px] bg-current transition-colors"></span>
                        </a>
                        <a class="flex sm:w-min w-full flex-row justify-center items-center gap-1 transition hover:text-theme" href="https://dev.to/brdnwd">
                            <span class="dev-to-icon w-[29px] h-[29px] lg:w-[39px] lg:h-[39px] mt-[0.5px] bg-current transition-colors"></span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `);

    const $siteVersion = $footerContainer.find("#siteVersion");

    // Load website version
    $.getJSON("/src/res/json/github.json")
        .done(function (data) {
            const version = data?.version;
            if (!version?.shortSha) return;
            $siteVersion.find("div").html(`
                <span class="git-commit-icon w-[17px] h-[17px] lg:w-[20px] lg:h-[20px] 2xl:w-[25px] 2xl:h-[25px] mt-[0.5px] bg-current transition-colors"></span>
                <span>${version.shortSha}</span>
            `).parent().attr("href", version.url || "#");
        })
        .fail(function () {
            $siteVersion.find("div").text("VERSION UNKNOWN");
        });
}
