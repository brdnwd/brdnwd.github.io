export async function initProjects() {
    const $projects = $("#projects");
    if (!$projects.length) return;

    try {
        const response = await fetch("/src/res/json/projects.json");

        if (!response.ok) {
            throw new Error(`Failed to load projects.json: ${response.status}`);
        }

        const projects = await response.json();

        $projects.html(
            projects.map((project) => `
                <a href="${project.href}">
                    <div class="grid grid-cols-1 rounded-lg bg-white/10 border-2 overflow-hidden transition-colors hover:border-theme">
                        <div class="flex flex-col gap-2 w-full">
                            <div class="w-full select-none overflow-hidden shrink-0">
                                <img src="${project.image}" loading="lazy" class="w-full aspect-video object-cover bg-black">
                            </div>
                            <div class="flex flex-col justify-between h-full gap-3 min-h-0 px-5 py-5">
                                <h3 class="text-2xl line-clamp-1">${project.title}</h3>
                                <div class="text-lg scrollbar-theme text-white/60 line-clamp-2">${project.description}</div>
                                <div class="flex flex-row flex-wrap gap-2 overflow-hidden max-h-8 font-cilantro font-bold select-none text-white/30">
                                    <span class="tag-icon w-[30px] h-[30px] mt-[1px] bg-current transition-colors"></span>
                                    ${project.tags.map((tag) => `
                                        <span class="rounded-md p-1 bg-white/5">${tag}</span>
                                    `).join("")}
                                </div>
                            </div>
                        </div>
                    </div>
                </a>
            `).join("")
        );
    } catch (error) {
        console.error("Projects error:", error);
    }
}