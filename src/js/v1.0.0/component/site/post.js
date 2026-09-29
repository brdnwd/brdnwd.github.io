export async function initPosts() {
    const $posts = $("#posts");
    if (!$posts.length) return;

    try {
        const response = await fetch("/src/res/json/posts.json");

        if (!response.ok) {
            throw new Error(`Failed to load posts.json: ${response.status}`);
        }

        const data = await response.json();
        const posts = data.posts?.public?.slice(0, 4) || [];

        if (!posts.length) {
            $posts.html(`
                <div class="py-10 text-black/40">
                    No posts yet.
                </div>
            `);

            return;
        }

        //TODO: redo format
        $posts.html(
            posts.map((post) => `
            <a href="${post.url}" target="_blank" rel="noopener noreferrer" class="group block h-full">
                <div class="flex flex-col h-full rounded-lg bg-black/5 border-2 border-black/15 overflow-hidden transition-colors hover:border-theme">
                    <div class="flex flex-col justify-between h-full gap-8 px-6 py-6 xl:px-7 xl:py-7">
                        <div class="flex flex-col gap-3">
                            <h3 class="text-2xl xl:text-3xl font-bold line-clamp-2">
                                ${escapeHTML(post.title)}
                            </h3>

                            ${
                                post.description
                                    ? `
                                        <div class="text-base xl:text-lg text-black/60 line-clamp-4">
                                            ${escapeHTML(post.description)}
                                        </div>
                                    `
                                    : ""
                            }
                        </div>

                        <div class="flex flex-col gap-4">
                            ${
                                post.tags?.length
                                    ? `
                                        <div class="flex flex-row flex-wrap items-center gap-2 font-cilantro font-bold text-black/30">
                                            <span class="tag-icon w-[30px] h-[30px] mt-[1px] bg-current transition-colors"></span>

                                            ${post.tags
                                                .slice(0, 4)
                                                .map(
                                                    (tag) => `
                                                        <span class="rounded-md p-1 bg-black/5 transition-colors group-hover:bg-black/10">
                                                            ${escapeHTML(tag)}
                                                        </span>
                                                    `
                                                )
                                                .join("")}
                                        </div>
                                    `
                                    : ""
                            }

                            <div class="flex flex-row justify-between items-center gap-3 font-cilantro font-bold text-black/30">
                                <span>
                                    ${escapeHTML(post.readablePublishDate || "")}
                                    ${
                                        post.readingTimeMinutes
                                            ? ` · ${post.readingTimeMinutes} min read`
                                            : ""
                                    }
                                </span>

                            </div>
                        </div>
                    </div>
                </div>
            </a>
        `)
        );
    } catch (error) {
        console.error("Posts error:", error);

        $posts.html(`
            <div class="py-10 text-black/40">
                Unable to load posts.
            </div>
        `);
    }
}

function escapeHTML(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}