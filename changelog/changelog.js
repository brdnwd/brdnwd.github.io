const site = await import("../src/lib/site.js")

/**
 * Runs the changelog portion of the site.
 */
export async function run() {
    if (site.ElementsManager.changelog == undefined) return;

    const clist = await site.get("clist.log")
    const changes = clist.split("~").map(item => {
        const title = item.match(/TITLE:\s*"([^"]*)"/);
        const content = item.match(/CONTENT:\s*`([\s\S]*?)`/);
        const date = item.match(/DATE:\s*"([^"]*)"/);

        return {
            title: title ? title[1].trim() : "",
            date: date ? date[1].trim() : "",
            content: content ? content[1].trim() : ""
        }
    })

    changes.sort((a, b) => new Date(b.date) - new Date(a.date))

    
    // Format
    site.each(changes, function (i, {title, date, content}) {
        site.ElementsManager.changelog.append(`
            <div class="flex flex-col gap-5">
                <h1 class="text-4xl font-rubikMedium tracking-tight">${title}</h1>
                <span class="text-lg">${date}</span>
                <div>
                    ${content}
                </div>
            </div> 
        `)
    })
}