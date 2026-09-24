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
        valley: ["Valley Sans", "sans-serif"],
        cilantro: ["Cilantro Code Mono", "monospace"],
        qahiri: ["Qahiri", "sans-serif"]
    }

    /**
     * Add custom color attributes
     * Use: name-of-color: color HEX,
     */
    var colors = {
        "white": "#fff9f4",
        "black": "#111117",
        "theme": "#5a5a7e",
        "accent": "#dbdd2a"
    }

    /**
     * Creates all custom classes and initalize font-sets.
     */
    var plugins = [
        function ({ addBase, addUtilities }) {
            // Font-sets
            addBase({
                //cursor
                'html': {
                    'cursor': 'url("/src/res/images/cursor/pointer.cur"), auto',
                },
                '*': {
                    'cursor': 'inherit',
                },
                'a, button, [role="button"], input[type="button"], input[type="submit"], input[type="reset"]': {
                    'cursor': 'url("/src/res/images/cursor/link.cur"), pointer',
                },
                'a:hover, button:hover, [role="button"]:hover, input[type="button"]:hover, input[type="submit"]:hover, input[type="reset"]:hover': {
                    'cursor': 'url("/src/res/images/cursor/link.cur"), pointer',
                },
                //bold
                'b': {
                  'color': colors.theme,  
                },
                //valley
                '@font-face': {
                    'font-family': 'Valley Sans',
                    'src': 'url("/src/res/fonts/ValleySans/static/ValleySans-VariableFont_wght.ttf") format("truetype")',
                    'font-weight': '400',
                    'font-style': 'normal',
                    'font-display': 'swap',
                },
                //cilantro
                '@font-face': {
                    'font-family': 'Cilantro Code Mono',
                    'src': 'url("/src/res/fonts/Cilantro/static/CilantroCodeMono-Regular.ttf") format("truetype")',
                    'font-weight': '400',
                    'font-style': 'normal',
                    'font-display': 'swap',
                },
                //libre
                '@font-face': {
                    'font-family': 'Qahiri',
                    'src': 'url("/src/res/fonts/Qahiri/static/Qahiri-Regular.ttf") format("truetype")',
                    'font-weight': '400',
                    'font-style': 'normal',
                    'font-display': 'swap',
                },
            });
            // CSS Classes
            addUtilities({
                //icons
                '.github-icon': {
                    'mask': 'url("./src/res/svgs/social-media/github.svg") center / contain no-repeat;',
                    '-webkit-mask': 'url("./src/res/svgs/social-media/github.svg") center / contain no-repeat;'
                },
                '.linkedin-icon': {
                    'mask': 'url("./src/res/svgs/social-media/linkedin.svg") center / contain no-repeat;',
                    '-webkit-mask': 'url("./src/res/svgs/social-media/linkedin.svg") center / contain no-repeat;'
                },
                '.facebook-icon': {
                    'mask': 'url("./src/res/svgs/social-media/facebook.svg") center / contain no-repeat;',
                    '-webkit-mask': 'url("./src/res/svgs/social-media/facebook.svg") center / contain no-repeat;'
                },
                '.arrow-right-icon': {
                    'mask': 'url("./src/res/svgs/arrow-right.svg") center / contain no-repeat;',
                    '-webkit-mask': 'url("./src/res/svgs/arrow-right.svg") center / contain no-repeat;'
                },
                '.hamburger-menu-icon': {
                    'mask': 'url("./src/res/svgs/hamburger-menu.svg") center / contain no-repeat;',
                    '-webkit-mask': 'url("./src/res/svgs/hamburger-menu.svg") center / contain no-repeat;'
                },
                // scrollbar
                '.scrollbar-hidden': {
                    'scrollbar-width': 'none',
                    '-ms-overflow-style': 'none',
                },
                '.scrollbar-hidden::-webkit-scrollbar': {
                    'width': '0px',
                    'height': '0px',
                },
                '.scrollbar-hidden::-webkit-scrollbar-track': {
                    'background': 'transparent',
                },
                '.scrollbar-hidden::-webkit-scrollbar-thumb': {
                    'background': 'transparent',
                },
                // selection
                '.selection': {
                    '&::selection': {
                        'background': colors.theme,
                        'color': colors.white,
                    },
                },
                // container
                '.page-container': {
                    'padding-left': '1rem',
                    'padding-right': '1rem',
                },
                '@media (min-width: 640px)': {
                    '.page-container': {
                        'padding-left': '2rem',
                        'padding-right': '2rem',
                    },
                },
                '@media (min-width: 768px)': {
                    '.page-container': {
                        'padding-left': '3rem',
                        'padding-right': '3rem',
                    },
                },
                '@media (min-width: 1024px)': {
                    '.page-container': {
                        'padding-left': '5rem',
                        'padding-right': '5rem',
                    },
                },
                '@media (min-width: 1280px)': {
                    '.page-container': {
                        'padding-left': '7rem',
                        'padding-right': '7rem',
                    },
                },
                // loader
                '.loader': {
                    'position': 'fixed',
                    'inset': '0',
                    'z-index': '9999',
                    'display': 'flex',
                    'align-items': 'center',
                    'justify-content': 'center',
                    'background': colors.white,
                    'color': colors.black,
                    'overflow': 'hidden',
                },
                '.loader-name': {
                    'display': 'flex',
                    'align-items': 'center',
                    'font-family': 'Valley Sans, sans-serif',
                    'font-size': 'clamp(3rem, 8vw, 8rem)',
                    'font-weight': '500',
                    'white-space': 'nowrap',
                    'transform-origin': 'center',
                },
                '.loader-letter': {
                    'display': 'inline-block',
                    'opacity': '0',
                    'transform': 'scale(0.6) translateY(10px)',
                    'transform-origin': 'center',
                },
                //grain
                '.grain': {
                    'position': 'fixed',
                    'inset': '0',
                    'z-index': '9990',
                    'pointer-events': 'none',
                    'opacity': '0.28',
                    'background-image': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3.75' numOctaves='6' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
                    'background-repeat': 'repeat',
                    'background-size': '160px 160px',
                    'mix-blend-mode': 'multiply',
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
                animation: {
                    marquee: "marquee 30s linear infinite",
                },
                keyframes: {
                    marquee: {
                        "0%": {
                            transform: "translateX(0)",
                        },

                        "100%": {
                            transform: "translateX(-50%)",
                        },
                    },
                },
            },

            extras
        }
    }
})();