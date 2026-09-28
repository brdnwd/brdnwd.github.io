const site = await import("../src/lib/site.js");
const confetti = await import("../src/lib/canvas_confetti/config.js");

/**
 * Contacts portion of the site
 */
export async function run() {
    if (site.ElementsManager.contact.contact == undefined) return;

    site.ElementsManager.contact.message.on("input", function () {
        if ($(this).val() != "") {
            site.ElementsManager.contact.message.parent().removeClass("border-red-600 animate-shake");
            site.ElementsManager.contact.message.parent().parent().find(".error").text("");
        }
    })

    site.ElementsManager.contact.email.on("input", function () {
        if ($(this).val() != "") {
            site.ElementsManager.contact.email.parent().removeClass("border-red-600 animate-shake");
            site.ElementsManager.contact.email.parent().parent().find(".error").text("");
        }
    })

    site.ElementsManager.contact.subject.on("input", function () {
        if ($(this).val() != "") {
            site.ElementsManager.contact.subject.parent().removeClass("border-red-600 animate-shake");
            site.ElementsManager.contact.subject.parent().parent().find(".error").text("");
        }
    })


    // The meat of the contact script
    if (site.ElementsManager.contact.message && site.ElementsManager.contact.email) {
        await site.ElementsManager.contact.submit.click(async function () {
            // Check if each input meets the requirements
            if (site.ElementsManager.contact.email.val() != "" && site.ElementsManager.contact.email.val().split("@")[0].length != 0 && site.ElementsManager.contact.email.val().includes("@") && /@[^@]+\./.test(site.ElementsManager.contact.email.val()) && site.ElementsManager.contact.subject.val() != "" && site.ElementsManager.contact.message.val() != "" && site.ElementsManager.contact.message.val().length <= 8000 && site.ElementsManager.contact.subject.val().length <= 200 && site.ElementsManager.contact.email.val().length <= 200) {
                /**
                 * This will clean any text given to it and return it.
                 */
                function cleanString(text) {
                    if (!text) return "";
                    return text.trim().replace(/["'<>&]/g, function (match) {
                        return `&#${match.charCodeAt(0)};`;
                    })
                }

                const email = cleanString(site.ElementsManager.contact.email.val());
                const subject = cleanString(site.ElementsManager.contact.subject.val());
                const message = cleanString(site.ElementsManager.contact.message.val());

                site.loader("show");

                async function sendEmail(email, subject/* its really "name" but idc */, message) {
                    // Init EmailJS
                    await emailjs.init({publicKey: site.EmailJSOptions.key});

                    const emailForm = {
                        name: subject, // It should be SUBJECT, needs to be changed in EmailJS soon. TODO:
                        email: email,
                        message: message
                    }

                    // Send the email
                    await emailjs.send(site.EmailJSOptions.service, site.EmailJSOptions.form, emailForm).then(function () {
                        // Reset values
                        site.ElementsManager.contact.email.val("");
                        site.ElementsManager.contact.subject.val("");
                        site.ElementsManager.contact.message.val("");
                    })
                }

                // We send the email to EmailJS. This sends your message to an email.
                site.ErrorManager(async () => {
                    await sendEmail(email, subject, message);

                    site.loader("hide");

                    // Send a bunch of confetti out to indicate that it was sent
                    confetti.confetti_hooray();
                });
            } else {
                /**
                 * Yea look at the dumb checks I gotta do because we know someone is going to try something.
                 */

                if (site.ElementsManager.contact.message.val() == "") {
                    site.ElementsManager.contact.message.parent().addClass("border-red-600 animate-shake");
                    site.ElementsManager.contact.message.parent().parent().find(".error").text("* This box cannot empty");
                }

                if (site.ElementsManager.contact.message.val().length > 8000) {
                    site.ElementsManager.contact.message.parent().addClass("border-red-600 animate-shake");
                    site.ElementsManager.contact.message.parent().parent().find(".error").text("* This currently exceeds the 200 character limit");
                }

                if (site.ElementsManager.contact.email.val() == "") {
                    site.ElementsManager.contact.email.parent().addClass("border-red-600 animate-shake");
                }

                if (site.ElementsManager.contact.email.val().length > 200) {
                    site.ElementsManager.contact.email.parent().addClass("border-red-600 animate-shake");
                    site.ElementsManager.contact.email.parent().parent().find(".error").text("* This currently exceeds the 200 character limit");
                }

                if (!site.ElementsManager.contact.email.val().includes("@") || site.ElementsManager.contact.email.val().split("@")[0].length == 0 || !/@[^@]+\./.test(site.ElementsManager.contact.email.val())) {
                    site.ElementsManager.contact.email.parent().addClass("border-red-600 animate-shake");
                    site.ElementsManager.contact.email.parent().parent().find(".error").text("* Enter in the format: name@example.com");
                }
                    
                if (site.ElementsManager.contact.subject.val() == "") {
                    site.ElementsManager.contact.subject.parent().addClass("border-red-600 animate-shake")
                    site.ElementsManager.contact.subject.parent().parent().find(".error").text("* This box cannot empty");
                }

                if (site.ElementsManager.contact.subject.val().length > 200) {
                    site.ElementsManager.contact.subject.parent().addClass("border-red-600 animate-shake");
                    site.ElementsManager.contact.subject.parent().parent().find(".error").text("* This currently exceeds the 8000 character limit");
                }
            }
        })
    }

}