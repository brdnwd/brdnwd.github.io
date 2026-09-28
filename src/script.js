/*
 * Copyright © 2019-2025 Wo-r (https://github.com/wo-r)
 * 
 * Dependencys: 
 *  - jQuery v3.7.1 (https://jquery.com/)
 *  - Tailwind v3.4.16 (https://tailwindcss.com/)
 *  - EmailJS (https://www.emailjs.com/)
 *  - Canvas Confetti (https://www.kirilv.com/canvas-confetti/)
 * 
 * Website: https://wo-r.github.io
 * Built: 2025-04-04
 */
(async function ($, window, document) {

    // Used to throw exceptions when non-strict code accesses strict mode (https://javascript.info/strict-mode)
    "use strict";


    // Instead of having one gigantic script file handling all code from the website
    // we spread it out between each page and what they need allowing a very nice seemless
    // integration between all the script files within the website.
    //====================================================================================
    const site = await import("./lib/site.js");
    const blogs = await import("../blogs/blogs.js");
    const changelog = await import("../changelog/changelog.js");
    const contact = await import("../contact/contact.js");
    const projects = await import("../projects/projects.js");
    //====================================================================================


    /**
     * Loads elements that often change.
     */
    async function LoadDynamicElements() {
        if (site.ElementsManager.navbar.navbar == undefined || site.ElementsManager.footer == undefined)   
            return;

        // Navbar
        site.ElementsManager.navbar.navbar.append(site.LargeStringBuffers.navbar);
        // Footer
        site.ElementsManager.footer.append(site.LargeStringBuffers.footer);
    }

    /**
     * Manages dropdown toggle via Navbar
     */
    async function NavbarDropdownToggle() {
        site.ElementsManager.navbar.navbarToggle.click(function () {
            const dropdown = site.ElementsManager.navbar.navbarDropdown;
            const iconPath = site.ElementsManager.navbar.navbarToggleIcon.find("svg path");
            const closePath = "M480-385 302-207q-20 20-48 20t-47-20q-20-20-20-47.5t20-47.5l178-178-178-179q-20-20-20-47.5t20-47.5q19-20 47-20t48 20l178 178 178-178q20-20 48-20t47 20q20 20 20 47.5T753-659L575-480l178 178q20 20 20 47.5T753-207q-19 20-47 20t-48-20L480-385Z";
            const defaultPath = "M140-159q-27.45 0-46.73-20Q74-199 74-227.32q0-28.31 18.77-47.5Q111.55-294 140-294h172q27.45 0 46.73 19.93Q378-254.14 378-225.82q0 28.31-18.77 47.57Q340.45-159 312-159H140Zm0-255q-27.45 0-46.73-19.5Q74-453 74-482.32q0-28.31 18.77-47Q111.55-548 140-548h425q28.45 0 47.72 19.43Q632-509.14 632-480.82q0 29.31-18.78 48.07Q594.45-414 565-414H140Zm0-254q-27.45 0-46.73-20Q74-708 74-736.32q0-29.31 19.5-48Q113-803 142-803h678q27.45 0 46.72 19.43Q886-764.14 886-734.82q0 28.31-19.5 47.57Q847-668 818-668H140Z"; // example hamburger
    
            if (dropdown.is(":visible")) {
                dropdown.stop(true, true).slideUp(300).fadeOut(200, function () {
                    dropdown.addClass("hidden");
                });
                iconPath.attr("d", defaultPath);
            } else {
                dropdown.stop(true, true).hide().removeClass("hidden").slideDown(300).fadeIn(200);
                iconPath.attr("d", closePath);
            }
        });
    }

    /**
     * If a page has "#moreBlogs" then we add random blogs to it.
     * Note: This is automatic just add an element with the id and it does the rest.
     */
    async function AddMoreBlogs() {
        if (site.ElementsManager.blogs.moreBlogs == undefined) return;

        var random_blogs = "";

        await site.each(await blogs.fetch_random_blogs(8), function (i, blog) {
            var status = "";

            console.log(blog.PATH, window.location.pathname)

            // The one thing we don't want is seeing the same article your reading on this.
            if (blog.PATH == window.location.pathname) return;

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

            random_blogs += `
                <div goto="${blog.PATH}" class="rounded-md bg-zinc-100 border-[2px] border-zinc-200 flex flex-col w-[300px] min-w-[300px] max-w-[300px] px-5 py-2 cursor-pointer">
                    <div>
                        <div class="text-md font-rubikSemiBold mb-2 line-clamp-1">${blog.info.title}</div>
                    </div>
                    <div class="flex flex-row items-center text-[15px]">
                        <div class="text-sm text-zinc-400">${site.dateToReadable(blog.created)}</div>
                        ${status}
                    </div>
                    <div class="text-sm line-clamp-3">${blog.info.description}</div>
                </div>
            `;
        })

        await site.ElementsManager.blogs.moreBlogs.append(`
            <h1 class="text-sm text-zinc-400 mb-3">ALSO ON <span class="text-black font-rubikMedium">WO-R</span></h1>
            <div class="overflow-x-auto overflow-y-visible">
                <div class="flex flex-row gap-2">
                    ${random_blogs}
                </div>
            </div>
        `)

        site.UpdateManager.UpdateElements();
        await site.InitGotoAttributes();
    }

    
    await site.windowLoaded(async function () {
        var tasks = [
            LoadDynamicElements,
            () => site.UpdateManager.UpdateElements(),
            NavbarDropdownToggle,
            site.InitGotoAttributes,
            //============================================
            changelog.run,
            blogs.run,
            contact.run,
            projects.run,
            AddMoreBlogs,
            //============================================
            () => {
                // Since its literally a one time called class I'm willing to just
                // leave it here instead of putting it into the ElementsManager.
                $(".progress-bar").css('width', '0');
                site.AnimationObserver(".progress-bar", 0.1, function (element, observer) {
                    if (!element.hasClass("animated")) {
                        element.addClass("animated");
                        element.animate({
                            width: element.data("width")
                        }, 1000)
                        observer.unobserve(element[0]);
                    }
                })
            }
            //============================================
        ]

        // Function to handle all tasks and ensure they run sequentially
        async function runTasks() {
            for ( let task of tasks ) {
                await site.ErrorManager(async () => {
                    await task();
                }); // Ensure each task finishes before continuing
            }
        }

        // Run all tasks and wait until completion
        await runTasks();

        // Wait till fonts load
        await document.fonts.ready;

        // Website loader
        await site.loader("hide");

        // ONLY RUN when loader is hidden
        site.AnimationObserver("[data-fade]", 0.1, function (element, observer) {
            const fadeClass = element.data("fade");
            if (!element.hasClass(fadeClass)) {
                element.addClass(fadeClass);
                observer.unobserve(element[0]);
            }
        });
        
        // Since we use Github API via "projects/" we need some sort of warning for 
        // users who are less experienced about why they possibly get nothing in the
        // projects portion of the website.
        site.userOffline(() => {
            throw new Error("You are currently offline. Some features may not function correctly until you are back online.")
        })
        
        site.userOnline(() => {
            if (!site.elementExists("#error")) return;
            $("#error").remove();
        })

        // Same goes for this; It's only called once.
        $("#year").text(new Date().getFullYear())
    })

})(jQuery, window, document);