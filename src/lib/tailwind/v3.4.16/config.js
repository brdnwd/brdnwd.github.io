/**
 * This file serves as the configuration file for tailwind.min.js
 */
(async function () {
    "use strict";

    /**
     * Manages the fonts that can be used via Tailwind.
     * Use: Add font, then use font-[Name Of Font] in html classings.
     */
    var fonts = {
        ubuntu: ["Ubuntu", "sans-serif"],
    }

    /**
     * Add custom color attributes
     * Use: name-of-color: color HEX,
     */
    var colors = {}

    /**
     * Creates all custom classes and initalize font-sets.
     */
    var plugins = [
        function ({ addBase, addUtilities }) {
            // Font-sets
            addBase({
                //ubuntu
                '@font-face': {
                    'font-family': 'Ubuntu',
                    'src': 'url("/src/res/fonts/Ubuntu/static/Ubuntu-Regular.ttf") format("truetype")',
                    'font-weight': '400',
                    'font-style': 'normal',
                    'font-display': 'swap',
                },
            });
            // CSS Classes
            addUtilities({
                // scrollbar
                '.scrollbar-hidden': {
                    'scrollbar-width': 'none',
                    '-ms-overflow-style': 'none',
                },
                '.scrollbar-hidden::-webkit-scrollbar': {
                    width: '0px',
                    height: '0px',
                },
                '.scrollbar-hidden::-webkit-scrollbar-track': {
                    background: 'transparent',
                },
                '.scrollbar-hidden::-webkit-scrollbar-thumb': {
                    background: 'transparent',
                },
                // selection
                '.selection': {
                    '&::selection': {
                        background: '#9ff0f3ca',
                        color: 'black',
                    },
                },
            })
        },
    ]

    //unused
    var extras = {}

    tailwind.config = {
        plugins: plugins,
        
        theme: {
            extend: {
                fontFamily: fonts,
                colors: colors,
                animation: {},
                keyframes: {},
            },

            extras
        }
    }
})();