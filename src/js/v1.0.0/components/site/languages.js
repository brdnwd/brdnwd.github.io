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

function findGitHubLanguage(skillName, languageBreakdown) {
    const normalizedName = skillName.trim().toLowerCase();

    for (const [githubName, aliases] of Object.entries(languageAliases)) {
        if (!aliases.some(alias => alias.toLowerCase() === normalizedName)) {
            continue;
        }

        return languageBreakdown.find(
            language => language.name.toLowerCase() === githubName.toLowerCase()
        ) || null;
    }

    return null;
}

export async function initLanguages() {
    const container = document.querySelector("[data-github-languages]");

    if (!container) return;

    try {
        const response = await fetch("/src/res/json/github.json");

        if (!response.ok) {
            throw new Error(
                `Failed to load github.json: ${response.status}`
            );
        }

        const githubData = await response.json();

        const languageBreakdown = Array.isArray(githubData.languageBreakdown)
            ? githubData.languageBreakdown
            : [];

        const skills = [
            ...container.querySelectorAll(".language-pill")
        ];

        const matchedSkills = [];
        const unmatchedSkills = [];

        skills.forEach((element, originalIndex) => {
            const skillName = element.dataset.language;

            if (!skillName) {
                unmatchedSkills.push({
                    element,
                    originalIndex
                });

                return;
            }

            /*
             * The color is completely independent from GitHub data.
             * It simply uses the predefined color for this skill.
             */
            const color = languageColors[skillName];
            const bar = element.querySelector(".language-bar");

            if (color && bar) {
                bar.style.backgroundColor = color;
            }

            /*
             * GitHub data is only used to determine ordering.
             */
            const githubLanguage = findGitHubLanguage(
                skillName,
                languageBreakdown
            );

            if (githubLanguage) {
                matchedSkills.push({
                    element,
                    language: githubLanguage,
                    originalIndex
                });
            } else {
                unmatchedSkills.push({
                    element,
                    originalIndex
                });
            }
        });

        /*
         * Most-used GitHub languages first.
         */
        matchedSkills.sort((a, b) => {
            return (b.language.bytes || 0) - (a.language.bytes || 0);
        });

        /*
         * Put GitHub-recognized languages first,
         * followed by everything else in its original order.
         */
        const orderedSkills = [
            ...matchedSkills,
            ...unmatchedSkills
        ];

        orderedSkills.forEach((skill, index) => {
            skill.element.style.order = index + 1;
        });

    } catch (error) {
        console.error("GitHub language error:", error);
    }
}