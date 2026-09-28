const site = await import("../src/lib/site.js");

/**
 * Runs the projects portion of the site.
 */
export async function run() {
    if (site.ElementsManager.projects.projects == undefined) return;
    
    // If the user has visited again on the same day; We ensure they see local data so they can't spam Github API.
    if (!site.DayManager.isNewDay() && site.StorageManager.projects.projects != undefined) {
        site.ElementsManager.projects.featuredProjects.html(await site.StorageManager.projects.featuredProjects);
        site.ElementsManager.projects.projects.html(await site.StorageManager.projects.projects);
        site.ElementsManager.projects.projectsCount.text(await site.StorageManager.projects.totalProjects);

        site.UpdateManager.UpdateElements();
        site.InitGotoAttributes();
    
    // If they have not then fetch the data then cache it.
    } else {
        let repos = [];
        let totalRepos = 0;
        let totalFollowers = 0;
    
        // Get all the required data from github once
        await Promise.all(site.githubAccounts.map(async (username) => {
            const [repoData, userData] = await Promise.all([
                site.get(site.githubAPI(username, "/repos?per_page=100")),
                site.get(site.githubAPI(username))
            ]);
    
            if (repoData) repos = repos.concat(repoData);
            if (userData?.followers) totalFollowers += userData.followers;
        }));

        // Sort so we always get the same result
        repos.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
        const featuredRepos = [];
        const otherRepos = [];
    
        // Find the featured repos and split them from the rest.
        for (const repo of repos) {
            const name = repo.name;
            const fullName = repo.full_name;
    
            if (site.excludedRepositorys.includes(name) || site.excludedRepositorys.includes(fullName)) continue;
    
            if (site.featuredRepositorys.includes(name) || site.featuredRepositorys.includes(fullName)) {
                featuredRepos.push(repo);
            } else {
                otherRepos.push(repo);
            }
    
            totalRepos++;
        }

        // Since I know my repos exist we can just check if they have data or not on the first object
        if (featuredRepos.length == 0 || otherRepos.length == 0) {
            throw new Error("Github API failed to respond with a status 200."); 
        }
    
        const repoCard = (repo) => {
            return `
                <div goto="${repo.html_url}" class="flex flex-col cursor-pointer">
                    <div class="flex flex-row items-center mb-2 text-sm text-zinc-400">
                        <span class="searchable">${new Date(repo.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</span>
                        <div class="bg-zinc-400 h-[4px] w-[4px] rounded-full mx-2"></div>
                        <span class="searchable">Updated ${site.dateToReadable(repo.updated_at).toLowerCase()}</span>
                    </div>
                    <h2 class="searchable text-3xl font-rubikMedium">${repo.name}</h2>
                    <span class="searchable mt-2 line-clamp-2">${repo.description || "No description provided."}</span>
                </div>
            `;
        };
    
        const featuredHTML = featuredRepos.map(repoCard).join('');
        const otherHTML = otherRepos.map(repoCard).join('');    
    
        // Cache all the data we fetched so that we dont always access the github api
        site.UpdateManager.UpdateStorage(site.StorageManager.projects.raw.projects, otherHTML);
        site.UpdateManager.UpdateStorage(site.StorageManager.projects.raw.featuredProjects, featuredHTML);
        site.UpdateManager.UpdateStorage(site.StorageManager.projects.raw.totalProjects, totalRepos);
        site.DayManager.Update();
    
        site.ElementsManager.projects.featuredProjects.html(featuredHTML);
        site.ElementsManager.projects.projects.html(otherHTML);
        site.ElementsManager.projects.projectsCount.text(totalRepos);
        
        site.UpdateManager.UpdateElements();
        site.InitGotoAttributes();
    }

    /**
     * Port from Blogs.js
     */
    site.ElementsManager.projects.search.on("input", function () {
        var search = $(this).val().trim().toLowerCase();
        var anyVisible = false;

        site.ElementsManager.projects.projects.find(".cursor-pointer").each(function () {
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
            if (site.ElementsManager.projects.projects.parent().find("span.text-zinc-400").length == 0) {
                site.ElementsManager.projects.projects.parent().append(`<span class="break-all text-zinc-400 mt-14">Your search for "<span></span>" has no results.</span>`);
            }
            site.ElementsManager.projects.projects.parent().find("span.text-zinc-400").find("span").text(search);
        } else {
            // Used meerly hide the info at the bottom (no need for ElementsManager)
            $("u[goto]").parent().show()
            site.ElementsManager.projects.projects.parent().find("span.text-zinc-400").remove();
        }
    });
}