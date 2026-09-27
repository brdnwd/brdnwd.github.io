// Load website version
    $.getJSON("/src/res/json/github.json")
        .done(function (data) {
            const version = data?.version;

            if (!version?.shortSha) {
                return;
            }

            $siteVersion.find("div")
                .html(`
                  <span class="git-commit-icon w-[17px] h-[17px] mt-[0.5px] bg-current transition-colors"></span>
                  <span class="text-[17px]">${version.shortSha}</span>
                `).parent().attr("href", version.url || "#");
        })
        .fail(function () {
            $siteVersion.text("VERSION UNKNOWN");
        });


        /*

        <a id="siteVersion" class="transition hover:text-theme">
                    <div class="flex sm:w-min w-full flex-row justify-center items-center gap-1"></div>
                </a>


        */