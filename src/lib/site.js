/**
 * Large file consisting of site level variables used throughout the website.
 * Note: This is in /lib because it only contains variables and functions that are used else where.
 */


/**
 * Site version (relative to Github commits)
 */
export const version = "0.9.8";
//====================================================================================


/**
 * Branch version:
 * 1. Stable
 * 2. Debug
 * 2. Experimental
*/
export const branch = () => {
    if (isDev)
        return "Debug";
    else if (!isDev)
        return "Stable";
    // Experimental will only happen if the user meets certain criteria, 
    // e.g: they live outside the u.s., or have some sort of different os or 
    // device that requires expermental versions of the site to function correctly.
    //else if ()
}
//====================================================================================


/**
 * Centeral naming schema in the event I get an actual domain.
 */
export const baseName = "wo-r.github.io";
//====================================================================================


/**
 * All centeral Github accounts listed by priority.
 */
export const githubAccounts = [
    "wo-r",
    "wo-r-professional",
    "gradpass"
];
//====================================================================================


/**
 * Best github repositorys listed via "githubAccounts".
 */
export const featuredRepositorys = [
    "act-workkeys-answers",
    "echo-plus",
];
//====================================================================================


/**
 * Excluded repos for projects page.
 */
export const excludedRepositorys = [
    ".github",
    "wo-r.github.io",
    "wo-r",
    "emulating-the-nintendo-switch", //apart-of-blogs
    "understanding-human-behavior", //apart-of-blogs
    "arturo-sandoval-project", //apart-of-blogs
    "gradpass.github.io", //portfolio
];
//====================================================================================


/**
 * Simple function that returns a string (Basically shortens the process a little bit).
 */
export const githubAPI = (username, data = "") => {
    return `https://api.github.com/users/${username}${data}`;
}
//====================================================================================


/**
 * Determines if the user is viewing the site via Mobile.
 */
export const isMobile = ("ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0) ? true : false;
//====================================================================================


/**
 * Public key info for EmailJS services.
 */
export const EmailJSOptions = {
    key: "9ac5poQVMm8gyPC01",
    service: "gmail_sender_98wERH34",
    form: "feedback_form_98yuadsf9u",
}
//====================================================================================


/**
 * This is used via the search function; Placed here for ease-of-edit sakes.
 */
export const textHighlight = `<span class="bg-[#9ff0f3ca] text-black">$&</span>`;
//====================================================================================


/**
 * Dedicated variable for the path to the blogs json file.
 */
export const blogsPath = "/blogs/blist.json";
//====================================================================================


/**
 * Much more understandble version of jQuery's ready function.
 */
export const windowLoaded = $(window).ready;
//====================================================================================


/**
 * Determines if user is offline.
 */
export const userOffline = (fn) => { $(window).on("offline", () => {
    ErrorManager(fn)
}) };
//====================================================================================


/**
 * Determines if user is online.
 */
export const userOnline = (fn) => { $(window).on("online", () => {
    ErrorManager(fn)
}) };
//====================================================================================


/**
 * Centeral error checking function
 * 
 * @param {Function} fn
 * @returns {Function}
 */
export const ErrorManager = async function (fn) {
    try {
        return await fn();
    } catch (error) {
        if (elementExists("#error") != undefined) $("#error").remove();

        // If loader is showing
        if (ElementsManager.loader.attr("style") != "")
            loader("hide");

        console.error(error)
        await ElementsManager.outerBody.prepend(`
            <div id="error" class="flex flex-col sticky top-0 left-0 w-full transition-all">
                <div class="bg-red-600">
                    <div class="text-white text-center py-8 flex flex-col justify-center items-center w-full h-full select-none px-4">
                        <h1 class="text-2xl">You have experienced an error!</h1>
                        <span>This is not your fault! Report the issue <a goto="https://github.com/wo-r/wo-r.github.io/issues" class="underline cursor-pointer">here</a> for reparing.
                        <details open class="mt-4 w-full max-w-2xl bg-red-700/30 rounded-lg p-4">
                            <summary class="cursor-pointer select-none">View error</summary>
                            <pre class="mt-2 text-left whitespace-pre-wrap break-all text-sm bg-red-800/30 rounded p-2 select-text">${error.stack}</pre>
                        </details>
                        <div id="close" class="cursor-pointer underline mt-4">Close Error</div>
                    </div>
                </div>
            </div>
        `)

        $("#close").click(function () {
            $("#error").remove();
        })

        UpdateManager.UpdateElements();
        InitGotoAttributes();
    }
}
//====================================================================================


/**
 * Very simple variable; Checks if you are a developer, and applys developer only things for debugging, like logs and such.
 */
export const isDev = window.location.href.includes("127.0.0.1") ? true : false;
//====================================================================================


/**
 * Fetches stuff from a url, returns undefined if no data or an error occurs.
 * 
 * @param {String} url
 * @returns {any}
 */
export const get = async (url) => {
    return await ErrorManager(async function () {
        const response = await $.get(url);
        return response;
    })
}
//====================================================================================


/**
 * Shortcut to $.getJSON with error handling.
 *
 * @param {String} path - The JSON file path.
 * @param {Function|null} fn - Optional callback.
 * @returns {Promise<*>}
 */
export const json = (path, fn = null) =>
    ErrorManager(() => fn ? $.getJSON(path, fn) : $.getJSON(path));
//====================================================================================


/**
 * Goes through each iteration of an array.
 * 
 * @param {Array} array
 * @param {Function} fn
 * @returns {{Array}}
 */
export const each = async (array, fn) => {
    await ErrorManager(async function () {
        await $.each(array, fn);
    })
}
//====================================================================================


/**
 * Runs my signature [goto] logic.
 * Note: This is called often to reinitalize new goto attributes, so its here.
 */
export async function InitGotoAttributes() {
    ElementsManager.goto.click(function () {
        ErrorManager(async () => {
            const goto = $(this).attr("goto");
            if (goto === "#" || goto === "") return;

            if (goto.startsWith("https://")) {
                window.open(goto, "_blank");
            } else if (goto.startsWith("#")) {
                const target = $($(this).attr("goto"));
                ElementsManager.body.parent().stop().animate({
                    scrollTop: target.offset().top - ElementsManager.body.offset().top - 200,
                }, 300);
            } else if (goto.startsWith("/")) {
                const response = await fetch(goto, { method: "HEAD" });
                if (!response.ok) throw new Error(`Page not found: ${goto} (Status ${response.status})`);

                await loader("show");
                setTimeout(() => {
                    window.location.href = goto;
                }, 300);
            } else if (goto.startsWith("mailto:")) {
                window.location.href = goto;
            }
        });
    });
}
//====================================================================================


/**
 * Converts a date string to a readable relative time like "3 years ago" or "1 week ago"
 * @param {string|Date} date 
 * @returns {string}
 */
export function dateToReadable(date) {
    const units = [
        { label: 'year', ms: 1000 * 60 * 60 * 24 * 365 },
        { label: 'month', ms: 1000 * 60 * 60 * 24 * 30 },
        { label: 'week', ms: 1000 * 60 * 60 * 24 * 7 },
        { label: 'day', ms: 1000 * 60 * 60 * 24 },
        { label: 'hour', ms: 1000 * 60 * 60 },
        { label: 'minute', ms: 1000 * 60 },
        { label: 'second', ms: 1000 },
    ];

    const parsed = new Date(date);
    const now = new Date();
    const diff = Math.max(0, now - parsed);

    for (const unit of units) {
        const value = Math.floor(diff / unit.ms);
        if (value >= 1) {
            const plural = value === 1 ? '' : 's';
            return `${value} ${unit.label}${plural} ago`;
        }
    }

    return 'Just now';
}
//====================================================================================


/**
 * An observer function made to detect when an element is in view and executes somthing.
 * Note: This one is designed specifically to iterate through multiples of a single class.
 * 
 * @param {String} selector 
 * @param {Number} threshold 
 * @param {Function} onIntersect 
 */
export const AnimationObserver = (selector, threshold, onIntersect) => {
    const observer = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
            const element = $(entry.target);
            if (entry.isIntersecting) {
                onIntersect(element, observer);
            }
        });
    }, { threshold });

    each($(selector), function () {
        observer.observe(this);
    });
}
//====================================================================================


/**
 * Determines if an element exists.
 * 
 * @param {String} element
 * @returns {Element}
 */
export const elementExists = function (element) {
    return $(element).length == 0 ? undefined : $(element);
}
//====================================================================================


/**
 * Determines if a storage object exists.
 * 
 * @param {String} element
 * @returns {any}
 */
export const storageExists = function (storage) {
    return localStorage.getItem(storage) == null ? undefined : localStorage.getItem(storage);
}
//====================================================================================


/**
 * Manages every dynamic element used within the website.
 * Note: Requires updates when dynamic changes occur.
 */
export const ElementsManager = {
    outerBody: elementExists("#content"),
    body: elementExists("#main"),
    navbar: {
        navbar: elementExists("#navbarContainer"),
        navbarDropdown: elementExists("#navbarDropdown"),
        navbarToggle: elementExists("#navbarToggle"),
        navbarToggleIcon: elementExists("#navbarToggle"),
    },
    footer: elementExists("#footer"),
    loader: elementExists("#loader"),
    //======================================================
    goto: elementExists("[goto]"),
    //======================================================
    blogs: {
        blogs: elementExists("#blogs"),
        blogsCount: elementExists("#blogsCount"),
        search: elementExists("#search"), // #1
        moreBlogs: elementExists("#moreBlogs"),
    },
    //======================================================
    changelog: elementExists("#changelog"),
    //======================================================
    contact: {
        contact: elementExists("#contact"), // unused
        email: elementExists("#email"),
        subject: elementExists("#subject"),
        message: elementExists("#message"),
        submit: elementExists("#submit"),
    },
    //======================================================
    projects: {
        projects: elementExists("#projects"),
        featuredProjects: elementExists("#featuredProjects"),
        projectsCount: elementExists("#projectsCount"),
        search: elementExists("#search"), // #2
    },

}
//====================================================================================


/**
 * Manages every storage item on the website
 */
export const StorageManager = {
    projects: {
        projects: storageExists("projects"),
        featuredProjects: storageExists("featuredProjects"),
        totalProjects: storageExists("totalProjects"),
        raw: {
            projects: "projects",
            featuredProjects: "featuredProjects",
            totalProjects: "totalProjects",
        }
    },
    lastUpdated: {
        lastUpdated: storageExists("lastUpdated"),
        raw: {
            lastUpdated: "lastUpdated",
        }
    }
}
//====================================================================================


/**
 * Manages when the current day has past or not
 */
export const DayManager = {
    isNewDay: () => {
        return StorageManager.lastUpdated.lastUpdated !== new Date().toISOString().split("T")[0];
    },
    Update: () => {
        UpdateManager.UpdateStorage(StorageManager.lastUpdated.raw.lastUpdated, new Date().toISOString().split("T")[0])
    }
}
//====================================================================================


/**
 * Manages the loader when loading pages
 */
export const loader = async (type) => {
    if (ElementsManager.loader == undefined) {
        console.error("It appears this page doesn't have #loader? It should be a default addition to any page on this site.")
        return;
    }

    if (type == "show")
        await ElementsManager.loader.fadeIn(300)
    else if (type == "hide")
        await ElementsManager.loader.fadeOut(300)
}
//====================================================================================


/**
 * An extension to both "ElementsManager" and "StorageManager", this simply iterates through each object and updates it.
 */
export const UpdateManager = {
    UpdateElements: () => {
        ElementsManager.outerBody = elementExists("#content");
        ElementsManager.body = elementExists("#main");
        ElementsManager.navbar.navbar = elementExists("#navbarContainer");
        ElementsManager.navbar.navbarDropdown = elementExists("#navbarDropdown");
        ElementsManager.navbar.navbarToggle = elementExists("#navbarToggle");
        ElementsManager.navbar.navbarToggleIcon = elementExists("#navbarToggle");
        ElementsManager.footer = elementExists("#footer");
        ElementsManager.loader = elementExists("#loader");
        //======================================================
        ElementsManager.goto = elementExists("[goto]");
        //======================================================
        ElementsManager.blogs.blogs = elementExists("#blogs");
        ElementsManager.blogs.blogsCount = elementExists("#blogsCount");
        ElementsManager.blogs.search = elementExists("#search");
        ElementsManager.blogs.moreBlogs = elementExists("#moreBlogs");
        //======================================================
        ElementsManager.changelog = elementExists("#changelog");
        //======================================================
        ElementsManager.contact.contact = elementExists("#contact");
        ElementsManager.contact.email = elementExists("#email");
        ElementsManager.contact.subject = elementExists("#subject");
        ElementsManager.contact.message = elementExists("#message");
        ElementsManager.contact.submit = elementExists("#submit");
        //======================================================
        ElementsManager.projects.projects = elementExists("#projects");
        ElementsManager.projects.featuredProjects = elementExists("#featuredProjects");
        ElementsManager.projects.projectsCount = elementExists("#projectsCount");
        ElementsManager.projects.search = elementExists("#search");
    },
    UpdateStorage: (storage, val) => {
        if (typeof storage !== "string") return;

        // Unknown/Doesn't exist
        if (storageExists(storage) == undefined) localStorage.setItem(storage, "");

        if (storageExists(storage) != undefined) localStorage.setItem(storage, val);
    }
}
//====================================================================================


/**
 * Large string objects that often change; Put here for ease-of-use.
 */
export const LargeStringBuffers = {
    navbar: `
        <div class="border-b-[2px] border-black">
            <div id="navbar" class="py-8 flex flex-row justify-between items-center w-full h-full select-none px-4 lg:px-[130px] xl:px-[179px]">
                <div class="flex flex-row gap-5 justify-between md:justify-start items-center w-full md:w-fit">
                    <a id="navbarToggle" class="z-20 cursor-pointer">
                        <svg class="p-2 pt-[8px] -ml-[10px]" viewBox="0 -960 960 960" width="50px" height="50px">    
                            <path class="fill-black pointer-events-none" d="M140-159q-27.45 0-46.73-20Q74-199 74-227.32q0-28.31 18.77-47.5Q111.55-294 140-294h172q27.45 0 46.73 19.93Q378-254.14 378-225.82q0 28.31-18.77 47.57Q340.45-159 312-159H140Zm0-255q-27.45 0-46.73-19.5Q74-453 74-482.32q0-28.31 18.77-47Q111.55-548 140-548h425q28.45 0 47.72 19.43Q632-509.14 632-480.82q0 29.31-18.78 48.07Q594.45-414 565-414H140Zm0-254q-27.45 0-46.73-20Q74-708 74-736.32q0-29.31 19.5-48Q113-803 142-803h678q27.45 0 46.72 19.43Q886-764.14 886-734.82q0 28.31-19.5 47.57Q847-668 818-668H140Z"></path>
                        </svg>
                    </a>
                    <div class="md:text-left md:w-fit md:-ml-0 text-center w-full -ml-[80px]">
                        <a goto="/" class="font-pamela text-5xl cursor-pointer" tooltip="View my github page">
                            Wo-r
                        </a>
                    </div>
                </div>
                <div class="flex flex-row gap-5 xl:gap-7 font-black tracking-wide text-[23px] hidden md:flex transition duration-700 ease-in-out">
                    <a goto="/" class="hover:font-rubikMedium cursor-pointer">
                        Home
                    </a>
                    <a goto="/blogs/" class="hover:font-rubikMedium cursor-pointer">
                        Blogs
                    </a>
                    <a goto="/projects/" class="hover:font-rubikMedium cursor-pointer">
                        Projects
                    </a>
                    <a goto="/about/" class="hover:font-rubikMedium cursor-pointer">
                        About me
                    </a>
                    <a goto="/contact/" class="hover:font-rubikMedium cursor-pointer">
                        Contact
                    </a>
                </div>
            </div>
        </div>
        <div id="navbarDropdown" class="relative py-8 flex flex-col hidden select-none px-4 lg:px-[130px] xl:px-[179px] bg-black text-white">
            <div class="flex flex-col md:flex-row justify-between md:items-start w-full h-min gap-10 z-[9999]">
                <div class="flex flex-col">
                    <h1 class="text-4xl font-rubikBlack pb-5 uppercase">Overview</h1>
                    <a goto="/" class="font-rubikMedium hover:font-rubikBold cursor-pointer text-2xl">
                        Home
                    </a>
                    <a goto="/blogs/" class="font-rubikMedium hover:font-rubikBold cursor-pointer text-2xl">
                        Blogs
                    </a>
                    <a goto="/projects/" class="font-rubikMedium hover:font-rubikBold cursor-pointer text-2xl">
                        Projects
                    </a>
                </div>
                <div class="bg-white p-[0.5px] h-full"></div>
                <div class="flex flex-col">
                    <h1 class="text-4xl font-rubikBlack pb-5 uppercase">For Business</h1>
                    <a goto="/about/" class="font-rubikMedium hover:font-rubikBold cursor-pointer text-2xl">
                        About me
                    </a>
                    <a goto="/resume/" class="font-rubikMedium hover:font-rubikBold cursor-pointer text-2xl">
                        Resume
                    </a>
                    <a goto="/portfolio/" class="font-rubikMedium hover:font-rubikBold cursor-pointer text-2xl">
                        Portfolio
                    </a>
                    <a goto="/contact/" class="font-rubikMedium hover:font-rubikBold cursor-pointer text-2xl">
                        Contact
                    </a>
                </div>
                <div class="bg-white p-[0.5px] h-full"></div>
                <div class="flex flex-col">
                    <h1 class="text-4xl font-rubikBlack pb-5 uppercase">Socials</h1>
                    <a class="font-rubikMedium hover:font-rubikBold cursor-pointer text-2xl">
                        LinkedIn
                    </a>
                    <a goto="https://www.youtube.com/@thatguywoods" class="font-rubikMedium hover:font-rubikBold cursor-pointer text-2xl">
                        Youtube
                    </a>
                </div>
            </div>
            <div class="absolute inset-0 z-[999] bg-black md:hidden h-[100vh]"></div>
        </div>
    `,
    footer: `
        <div class="flex flex-col gap-5 justify-center items-center py-5 px-4 lg:px-[130px] xl:px-[179px]">
            <div class="flex flex-col lg:flex-row gap-5 lg:gap-0 justify-between w-full items-center">
                <div class="flex flex-col lg:flex-row gap-0 lg:gap-5 items-center">
                    <span class="font-pamela mt-[-5px] text-4xl">Wo-r</span>
                    <span class="font-rubikMedium text-center">My personal website where I share who I am and what I do.</span>
                </div>
                <div class="flex flex-row items-center gap-5">
                    <a goto="https://github.com/wo-r/wo-r.github.io" class="cursor-pointer font-rubikMedium hover:underline">Source</a>
                    <a goto="https://en.wikipedia.org/wiki/All_rights_reserved" class="cursor-pointer font-rubikMedium hover:underline">License</a>
                    <a goto="/changelog/" class="cursor-pointer font-rubikMedium hover:underline">Changelog</a>
                </div>
            </div>
            <div class="flex flex-col-reverse lg:flex-row gap-5 lg:gap-0 justify-between items-center w-full">
                <div class="flex flex-col">                                    
                    <span class="font-rubikMedium">Copyright &copy; Wo-r 2019-<span id="year"></span>. All rights reserved.</span>
                    <span class="text-[12px] w-full text-gray-400 text-center lg:text-left">v${version} ${branch()}</span>
                </div>
                <div class="flex flex-row gap-2 h-full">
                    <a goto="https://github.com/wo-r" class="cursor-pointer">
                        <svg class="p-[5px] mt-[1px]" viewBox="0 0 496 512" width="40px" height="50px">    
                            <path class="fill-white pointer-events-none" d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"></path>
                        </svg>
                    </a>
                    <a class="cursor-pointer">
                        <svg class="p-1 pt-[3px] -mt-[1.5px]" viewBox="0 0 30 25" width="50px" height="50px">    
                            <path class="fill-white pointer-events-none" d="M24,4H6C4.895,4,4,4.895,4,6v18c0,1.105,0.895,2,2,2h18c1.105,0,2-0.895,2-2V6C26,4.895,25.105,4,24,4z M10.954,22h-2.95 v-9.492h2.95V22z M9.449,11.151c-0.951,0-1.72-0.771-1.72-1.72c0-0.949,0.77-1.719,1.72-1.719c0.948,0,1.719,0.771,1.719,1.719 C11.168,10.38,10.397,11.151,9.449,11.151z M22.004,22h-2.948v-4.616c0-1.101-0.02-2.517-1.533-2.517 c-1.535,0-1.771,1.199-1.771,2.437V22h-2.948v-9.492h2.83v1.297h0.04c0.394-0.746,1.356-1.533,2.791-1.533 c2.987,0,3.539,1.966,3.539,4.522V22z"></path>
                        </svg>
                    </a>
                    <a goto="https://www.youtube.com/@thatguywoods" class="cursor-pointer">
                        <svg class="p-1 pt-[3px]" viewBox="0 0 50 45" width="50px" height="50px">    
                            <path class="fill-white pointer-events-none" d="M 44.898438 14.5 C 44.5 12.300781 42.601563 10.699219 40.398438 10.199219 C 37.101563 9.5 31 9 24.398438 9 C 17.800781 9 11.601563 9.5 8.300781 10.199219 C 6.101563 10.699219 4.199219 12.199219 3.800781 14.5 C 3.398438 17 3 20.5 3 25 C 3 29.5 3.398438 33 3.898438 35.5 C 4.300781 37.699219 6.199219 39.300781 8.398438 39.800781 C 11.898438 40.5 17.898438 41 24.5 41 C 31.101563 41 37.101563 40.5 40.601563 39.800781 C 42.800781 39.300781 44.699219 37.800781 45.101563 35.5 C 45.5 33 46 29.398438 46.101563 25 C 45.898438 20.5 45.398438 17 44.898438 14.5 Z M 19 32 L 19 18 L 31.199219 25 Z"></path>
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    `,
}
//====================================================================================