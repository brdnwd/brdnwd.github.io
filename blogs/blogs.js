const site = await import("../src/lib/site.js")

/**
 * Fetches the latest blogs from the list and returns an array containing those blogs.
 * @param {Number} max 
 * @returns {Promise<Array>}
 */
export async function fetch_latest_blogs(max) {
    var blogs = await site.json(site.blogsPath)
    blogs = blogs.sort((a, b) => new Date(b.created) - new Date(a.created))
    blogs = blogs.filter(blog => blog.attributes.locked !== true);
    return blogs.slice(0, max)
}

/**
 * Fetches a random set of items from the array till the max number is reached
 * @param {Number} max 
 * @returns {Promise<Array>}
 */
export async function fetch_random_blogs(max) {
    var blogs = await site.json(site.blogsPath)
    blogs = blogs.filter(blog => blog.attributes.locked !== true);

    // Shuffle the array using Fisher-Yates algorithm
    for (let i = blogs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [blogs[i], blogs[j]] = [blogs[j], blogs[i]];
    }

    return blogs.slice(0, max);
}

/**
 * Runs the blogs portion of the site.
 */
export async function run() {
    if (site.ElementsManager.blogs.blogs == undefined) return;

    // Since I'm manually making each blog, I might aswell have a console log for the current date in the correct format.
    if (site.isDev) console.log("Current Date:", new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }));

    await site.json(site.blogsPath, function (blogs) {
        // Sort the blist by most recent to least recent.
        blogs.sort((a, b) => new Date(b.created) - new Date(a.created))

        // Remove any items from the list that are locked for the blog count
        const blogCount = blogs.filter(blog => blog.attributes.locked !== true);

        // Apply the number of blogs in blist to our counter
        if (site.ElementsManager.blogs.blogsCount != undefined) site.ElementsManager.blogs.blogsCount.html(blogCount.length)

        site.each(blogs, function (i, blog) {
            var status = "";

            // Is the current blog have attributes? And if so what?
            if (blog.attributes.length != 0) {
                // Apply custom status if the current blog is external.
                if (blog.attributes.external != undefined && blog.attributes.external == true) {
                    status = `
                        <div class="bg-zinc-400 h-[4px] w-[4px] rounded-full mx-2"></div>
                        <div class="searchable text-sm text-zinc-400">External</div>
                    `;
                }
                // Sends info about why its locked.
                if (blog.attributes.consoleInfo != undefined) console.log(blog.attributes.consoleInfo)
                // Locked attribute.
                if (blog.attributes.locked == true) return;
                //...
            }

            site.ElementsManager.blogs.blogs.append(`
                <div goto="${blog.PATH}" class="flex flex-col cursor-pointer">
                    <div class="flex flex-row items-center mb-2">
                        <div class="searchable text-sm text-zinc-400">${blog.created}</div>
                        ${status}
                    </div>
                    <h2 class="searchable text-3xl font-rubikMedium">${blog.info.title}</h2>
                    <span class="searchable mt-2 line-clamp-2">${blog.info.description}</span>
                </div>
            `)
        })
    })

    site.UpdateManager.UpdateElements();
    await site.InitGotoAttributes();

    /**
     * My plan was to make this a universal function but this got way too complicated for something meant to just search for text.
     */
    site.ElementsManager.blogs.search.on("input", function () {
        var search = $(this).val().trim().toLowerCase();
        var anyVisible = false;

        site.ElementsManager.blogs.blogs.find(".cursor-pointer").each(function () {
            var block = $(this);
            var hasMatch = false;

            block.find(".searchable").each(function () {
                var text = $(this).text();
                var originalText = text;

                if (search.length === 0) {
                    $(this).html(originalText);
                    hasMatch = true;
                } else if (text.toLowerCase().includes(search)) {
                    var highlighted = text.replace(
                        new RegExp(`(${search})`, "gi"),
                        site.textHighlight
                    );
                    $(this).html(highlighted);
                    hasMatch = true;
                } else {
                    $(this).html(originalText);
                }
            });

            if (hasMatch) {
                block.stop(true, true).fadeIn(200);
                anyVisible = true;
            } else {
                block.stop(true, true).fadeOut(200);
            }
        });

        // This manages if the user ends up typing something that doesn't match anything in the list.
        if (!anyVisible) {
            // Used meerly hide the info at the bottom (no need for ElementsManager)
            $("u[goto]").parent().hide()
            if (site.ElementsManager.blogs.blogs.parent().find("span.text-zinc-400").length == 0) {
                site.ElementsManager.blogs.blogs.parent().append(`<span class="break-all text-zinc-400 mt-14">Your search for "<span></span>" has no results.</span>`);
            }
            site.ElementsManager.blogs.blogs.parent().find("span.text-zinc-400").find("span").text(search);
        } else {
            // Used meerly hide the info at the bottom (no need for ElementsManager)
            $("u[goto]").parent().show()
            site.ElementsManager.blogs.blogs.parent().find("span.text-zinc-400").remove();
        }
    });
}