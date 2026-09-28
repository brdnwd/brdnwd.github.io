/**
 * This file serves as the configuration file for tailwind.min.js
 */
(async function () {
    "use strict";

    /**
     * Manages the fonts that can be used via Tailwind.
     * Use: Add font, then use font-[Name Of Font] in html classings.
     */
    var fontFamilys = {
        rubik: ["Rubik", "sans-serif"],
        rubikBlack: ["RubikBlack", "sans-serif"],
        rubikBold: ["RubikBold", "sans-serif"],
        rubikMedium: ["RubikMedium", "sans-serif"],
        rubikSemiBold: ["RubikSemiBold", "sans-serif"],
        pamela: ["Pamela", "sans-serif"]
    }

    //unused
    var colorPalatte = {}

    //unused
    var extraOptions = {}

    tailwind.config = {
        theme: {
            extend: {
                fontFamily: fontFamilys,
                colors: colorPalatte,
                animation: {
                    shake: "shake 0.5s ease-in-out",
                },
                keyframes: {
                    shake: {
                        "0%": {
                            transform: "translateX(0)"
                        },
                        "25%": {
                            transform: "translateX(-4px)"
                        },
                        "50%": {
                            transform: "translateX(4px)"
                        },
                        "75%": {
                            transform: "translateX(-4px)"
                        },
                        "100%": {
                            transform: "translateX(4px)"
                        },
                    },
                },
            },
            extraOptions
        }
    }
})();