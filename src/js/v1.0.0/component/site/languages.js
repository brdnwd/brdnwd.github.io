const languageColors = {
    "HTML": "#e34c26",
    "CSS": "#563d7c",
    "Tailwind": "#06b6d4",
    "JS": "#f1e05a",
    "jQuery": "#0769ad",
    "PHP": "#4F5D95",
    "C++": "#f34b7d",
    "React": "#61dafb",
    "Node.js": "#339933",
    "Git": "#F05032",
    "Lua": "#000080",
    "Python": "#3572A5",
    "SQL": "#dad8d8",
    "Unity": "#222c37",
    "VSCode": "#007ACC",
    "Visual Studio": "#5C2D91"
};

const languageAliases = {
    "JavaScript": ["JavaScript", "JS"],
    "HTML": ["HTML"],
    "CSS": ["CSS"],
    "C++": ["C++"],
    "Python": ["Python"],
    "PHP": ["PHP"],
    "Lua": ["Lua"],
    "SQL": ["SQL"]
};

function findGitHubLanguage(
    skillName,
    languageBreakdown
) {
    const normalizedName =
        skillName.trim().toLowerCase();

    for (
        const [githubName, aliases]
        of Object.entries(languageAliases)
    ) {
        if (
            !aliases.some(
                alias =>
                    alias.toLowerCase() ===
                    normalizedName
            )
        ) {
            continue;
        }

        return (
            languageBreakdown.find(
                language =>
                    language.name.toLowerCase() ===
                    githubName.toLowerCase()
            ) || null
        );
    }

    return null;
}

export async function initLanguages() {
    const $container =
        $("[data-github-languages]");

    if (!$container.length) {
        return;
    }

    try {
        const githubData =
            await $.getJSON(
                "/src/res/json/github.json"
            );

        const languageBreakdown =
            Array.isArray(
                githubData.languageBreakdown
            )
                ? githubData.languageBreakdown
                : [];

        const matchedSkills = [];
        const unmatchedSkills = [];

        $container
            .find(".language-pill")
            .each(function (originalIndex) {
                const $element =
                    $(this);

                const skillName =
                    $element.data(
                        "language"
                    );

                if (!skillName) {
                    unmatchedSkills.push({
                        element: $element,
                        originalIndex
                    });

                    return;
                }

                /*
                 * Color is independent from
                 * GitHub data.
                 */
                const color =
                    languageColors[
                    skillName
                    ];

                const $bar =
                    $element.find(
                        ".language-bar"
                    );

                if (
                    color &&
                    $bar.length
                ) {
                    $bar.css(
                        "background-color",
                        color
                    );
                }

                /*
                 * GitHub data only determines
                 * the ordering.
                 */
                const githubLanguage =
                    findGitHubLanguage(
                        skillName,
                        languageBreakdown
                    );

                if (githubLanguage) {
                    matchedSkills.push({
                        element: $element,
                        language:
                            githubLanguage,
                        originalIndex
                    });
                } else {
                    unmatchedSkills.push({
                        element: $element,
                        originalIndex
                    });
                }
            });

        /*
         * Most-used GitHub languages first.
         */
        matchedSkills.sort(
            (a, b) =>
                (b.language.bytes || 0) -
                (a.language.bytes || 0)
        );

        /*
         * GitHub languages first,
         * everything else after them.
         */
        const orderedSkills = [
            ...matchedSkills,
            ...unmatchedSkills
        ];

        orderedSkills.forEach(
            (skill, index) => {
                skill.element.css(
                    "order",
                    index + 1
                );
            }
        );

    } catch (error) {
        console.error(
            "GitHub language error:",
            error
        );
        //TODO: Error modal
    }
}