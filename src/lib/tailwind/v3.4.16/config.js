/**
 * Purpose: Tailwind configuration file.
 */

(async function () {
    "use strict";

    function hexToRgba(hex, alpha) {
        var value = hex.replace('#', '');

        return `rgba(
            ${parseInt(value.substring(0, 2), 16)},
            ${parseInt(value.substring(2, 4), 16)},
            ${parseInt(value.substring(4, 6), 16)},
            ${alpha}
        )`;
    }

    /**
     * Apply theme data to the runtime colors
     */
    var colors = {
        "white": "#fff9f4", 
        "black": "#06040e", 
        "theme": "#2626e4", 
        "accent": "#f4f80e",
    }

    // For visualEffects.js
    window.siteColors = colors;
    //==================================================================================================



    /**
     * Manages the fonts that can be used via Tailwind.
     * Use: Add font, then use font-[Name Of Font] in html classings.
     */
    var fonts = {
        valley: ["Valley Sans", "sans-serif"],
        nunito: ["Nunito", "sans-serif"],
        cilantro: ["Cilantro Code Mono", "monospace"],
        qahiri: ["Qahiri", "sans-serif"]
    }

    /**
     * Creates all custom classes and initalize font-sets.
     */
    var plugins = [
        function ({ addBase, addUtilities }) {
            // Font-sets
            addBase({
                '@font-face': [
                    //valley
                    {
                        'font-family': 'Valley Sans, sans-serif',
                        'src': 'url("/src/res/font/ValleySans/static/ValleySans-VariableFont_wght.ttf") format("truetype")',
                        'font-weight': '400',
                        'font-style': 'normal',
                        'font-display': 'swap',
                    },
                    //cilantro
                    {
                        'font-family': 'Cilantro Code Mono, monospace',
                        'src': 'url("/src/res/font/Cilantro/static/CilantroCodeMono-Regular.ttf") format("truetype")',
                        'font-weight': '400',
                        'font-style': 'normal',
                        'font-display': 'swap',
                    },
                    //qahiri
                    {
                        'font-family': 'Qahiri',
                        'src': 'url("/src/res/font/Qahiri/static/Qahiri-Regular.ttf") format("truetype")',
                        'font-weight': '400',
                        'font-style': 'normal',
                        'font-display': 'swap',
                    },
                    //nuntio
                    {
                        'font-family': 'Nunito',
                        'src': 'url("/src/res/font/Nunito/static/Nunito-VariableFont_wght.ttf") format("truetype")',
                        'font-weight': '400',
                        'font-style': 'normal',
                        'font-display': 'swap',
                    },
                ],
                //cursor
                'html': {
                    'cursor': 'url("/src/res/cursor/pointer.cur"), auto',
                },
                '*': {
                    'cursor': 'inherit',
                },
                'a, button, [role="button"], input[type="button"], input[type="submit"], input[type="reset"]': {
                    'cursor': 'url("/src/res/cursor/link.cur"), pointer',
                },
                'a *, button *, [role="button"] *': {
                    'cursor': 'inherit',
                },
                'a:hover, button:hover, [role="button"]:hover, input[type="button"]:hover, input[type="submit"]:hover, input[type="reset"]:hover': {
                    'cursor': 'url("/src/res/cursor/link.cur"), pointer',
                },
                '::-webkit-scrollbar': {
                    'cursor': 'url("/src/res/cursor/pointer.cur"), auto',
                },
                '::-webkit-scrollbar-track': {
                    'cursor': 'url("/src/res/cursor/pointer.cur"), auto',
                },
                '::-webkit-scrollbar-thumb': {
                    'cursor': 'url("/src/res/cursor/link.cur"), pointer',
                },
                //bold
                'b': {
                  'color': colors.theme,  
                },
            });
            // CSS Classes
            addUtilities({
                //portrait
                '.portrait': {
                    'filter': 'hue-rotate(var(--portrait-hue));'
                },
                //icons
                '.github-icon': {
                    'mask': 'url("./src/res/svg/social-media/github.svg") center / contain no-repeat;',
                    '-webkit-mask': 'url("./src/res/svg/social-media/github.svg") center / contain no-repeat;'
                },
                '.linkedin-icon': {
                    'mask': 'url("./src/res/svg/social-media/linkedin.svg") center / contain no-repeat;',
                    '-webkit-mask': 'url("./src/res/svg/social-media/linkedin.svg") center / contain no-repeat;'
                },
                '.facebook-icon': {
                    'mask': 'url("./src/res/svg/social-media/facebook.svg") center / contain no-repeat;',
                    '-webkit-mask': 'url("./src/res/svg/social-media/facebook.svg") center / contain no-repeat;'
                },
                '.arrow-right-icon': {
                    'mask': 'url("./src/res/svg/arrow-right.svg") center / contain no-repeat;',
                    '-webkit-mask': 'url("./src/res/svg/arrow-right.svg") center / contain no-repeat;'
                },
                '.arrow-up-right-icon': {
                    'mask': 'url("./src/res/svg/arrow-up-right.svg") center / contain no-repeat;',
                    '-webkit-mask': 'url("./src/res/svg/arrow-up-right.svg") center / contain no-repeat;'
                },
                '.hamburger-menu-icon': {
                    'mask': 'url("./src/res/svg/hamburger-menu.svg") center / contain no-repeat;',
                    '-webkit-mask': 'url("./src/res/svg/hamburger-menu.svg") center / contain no-repeat;'
                },
                '.email-icon': {
                    'mask': 'url("./src/res/svg/email.svg") center / contain no-repeat;',
                    '-webkit-mask': 'url("./src/res/svg/email.svg") center / contain no-repeat;'
                },
                '.search-icon': {
                    'mask': 'url("./src/res/svg/search.svg") center / contain no-repeat;',
                    '-webkit-mask': 'url("./src/res/svg/search.svg") center / contain no-repeat;'
                },
                '.close-icon': {
                    'mask': 'url("./src/res/svg/close.svg") center / contain no-repeat;',
                    '-webkit-mask': 'url("./src/res/svg/close.svg") center / contain no-repeat;'
                },
                '.git-commit-icon': {
                    'mask': 'url("./src/res/svg/git-commit.svg") center / contain no-repeat;',
                    '-webkit-mask': 'url("./src/res/svg/git-commit.svg") center / contain no-repeat;'
                },
                '.dev-to-icon': {
                    'mask': 'url("./src/res/svg/social-media/dev-to.svg") center / contain no-repeat;',
                    '-webkit-mask': 'url("./src/res/svg/social-media/dev-to.svg") center / contain no-repeat;'
                },
                '.external-link-icon': {
                    'mask': 'url("./src/res/svg/external-link.svg") center / contain no-repeat;',
                    '-webkit-mask': 'url("./src/res/svg/external-link.svg") center / contain no-repeat;'
                },
                '.tag-icon': {
                    'mask': 'url("./src/res/svg/tag.svg") center / contain no-repeat;',
                    '-webkit-mask': 'url("./src/res/svg/tag.svg") center / contain no-repeat;'
                },
                '.location-icon': {
                    'mask': 'url("./src/res/svg/location-pin.svg") center / contain no-repeat;',
                    '-webkit-mask': 'url("./src/res/svg/location-pin.svg") center / contain no-repeat;'
                },
                '.time-icon': {
                    'mask': 'url("./src/res/svg/time.svg") center / contain no-repeat;',
                    '-webkit-mask': 'url("./src/res/svg/time.svg") center / contain no-repeat;'
                },
                '.view-icon': {
                    'mask': 'url("./src/res/svg/view.svg") center / contain no-repeat;',
                    '-webkit-mask': 'url("./src/res/svg/view.svg") center / contain no-repeat;'
                },
                '.error-icon': {
                    'mask': 'url("./src/res/svg/error.svg") center / contain no-repeat;',
                    '-webkit-mask': 'url("./src/res/svg/error.svg") center / contain no-repeat;'
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
                // scrollbar theme
                '.scrollbar-theme': {
                    'scrollbar-width': 'thin',
                    'scrollbar-color': `${colors.theme} transparent`,
                },
                '.scrollbar-theme::-webkit-scrollbar': {
                    'width': '4px',
                    'height': '4px',
                },
                '.scrollbar-theme::-webkit-scrollbar-track': {
                    'background': 'transparent',
                },
                '.scrollbar-theme::-webkit-scrollbar-thumb': {
                    'background': colors.theme,
                    'border-radius': '9999px',
                    'transition': 'background 200ms ease, opacity 200ms ease',
                },
                '.scrollbar-theme::-webkit-scrollbar-thumb:hover': {
                    'background': colors.themeDark,
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
                ".loader": {
                    "position": "fixed",
                    "inset": "0",
                    "z-index": "9999",
                    "background": colors.white,
                    "display": "flex",
                    "align-items": "center",
                    "justify-content": "center",
                    "overflow": "hidden",
                },
                ".loader-name": {
                    "position": "relative",
                    "z-index": "1",
                    "display": "flex",
                    "align-items": "center",
                    "transform-origin": "center",
                },
                ".loader-letter": {
                    "display": "inline-block",
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
                //popup
                '[data-popup]': {
                    'opacity': '0'
                },
                //gradient background animations
                '.section-gradient': {
                    'position': 'absolute',
                    'inset': '-20%',
                    'pointer-events': 'none',
                    'filter': 'blur(70px)',
                    'transform': 'translate3d(0, 0, 0) scale(1.05)',
                    'will-change': 'transform, background-position'
                },
                '.section-gradient-01': {
                    'opacity': '0.55',
                    'background': `radial-gradient(circle at 18% 28%, ${hexToRgba(colors.theme, 0.9)} 0%, transparent 34%), radial-gradient(circle at 78% 24%, ${hexToRgba(colors.accent, 0.5)} 0%, transparent 28%), radial-gradient(circle at 62% 78%, ${hexToRgba(colors.theme, 0.7)} 0%, transparent 36%), radial-gradient(circle at 15% 88%, ${hexToRgba(colors.accent, 0.25)} 0%, transparent 28%)`,
                    'background-size': '140% 140%, 160% 160%, 150% 150%, 180% 180%',
                    'animation': 'gradient01 16s ease-in-out infinite alternate'
                },
                '.section-gradient-02': {
                    'opacity': '0.34',
                    'background': `radial-gradient(circle at 20% 70%, ${hexToRgba(colors.theme, 0.55)} 0%, transparent 32%), radial-gradient(circle at 75% 20%, ${hexToRgba(colors.accent, 0.4)} 0%, transparent 26%), radial-gradient(circle at 45% 45%, ${hexToRgba(colors.theme, 0.3)} 0%, transparent 34%), conic-gradient(from 120deg at 70% 60%, ${hexToRgba(colors.accent, 0.12)}, transparent 30%, ${hexToRgba(colors.theme, 0.2)}, transparent 65%)`,
                    'background-size': '160% 160%, 150% 150%, 180% 180%, 140% 140%',
                    'animation': 'gradient02 20s ease-in-out infinite alternate',
                    'mix-blend-mode': 'multiply'
                },
                '.section-gradient-03': {
                    'opacity': '0.5',
                    'background': `radial-gradient(ellipse at 15% 20%, ${hexToRgba(colors.theme, 0.8)} 0%, transparent 30%), radial-gradient(ellipse at 85% 75%, ${hexToRgba(colors.accent, 0.38)} 0%, transparent 28%), radial-gradient(ellipse at 50% 50%, ${hexToRgba(colors.theme, 0.45)} 0%, transparent 35%)`,
                    'background-size': '180% 130%, 160% 150%, 140% 180%',
                    'animation': 'gradient03 13s ease-in-out infinite alternate'
                },
                '@keyframes gradient01': {
                    '0%': {
                        'transform': 'translate3d(-5%, -3%, 0) scale(1.05) rotate(0deg)',
                        'background-position': '0% 0%, 100% 0%, 50% 100%, 0% 100%'
                    },
                    '50%': {
                        'transform': 'translate3d(4%, 2%, 0) scale(1.12) rotate(1deg)',
                        'background-position': '45% 55%, 55% 35%, 70% 35%, 30% 60%'
                    },
                    '100%': {
                        'transform': 'translate3d(-2%, 5%, 0) scale(1.08) rotate(-1deg)',
                        'background-position': '100% 100%, 0% 100%, 20% 0%, 80% 20%'
                    }
                },
                '@keyframes gradient02': {
                    '0%': {
                        'transform': 'translate3d(4%, -4%, 0) scale(1.05) rotate(0deg)',
                        'background-position': '0% 100%, 100% 0%, 0% 50%, 100% 50%'
                    },
                    '50%': {
                        'transform': 'translate3d(-3%, 4%, 0) scale(1.13) rotate(-2deg)',
                        'background-position': '55% 30%, 25% 65%, 80% 20%, 30% 80%'
                    },
                    '100%': {
                        'transform': 'translate3d(5%, 0%, 0) scale(1.08) rotate(2deg)',
                        'background-position': '100% 0%, 0% 100%, 40% 100%, 0% 20%'
                    }
                },
                '@keyframes gradient03': {
                    '0%': {
                        'transform': 'translate3d(-4%, 2%, 0) scale(1.05) rotate(-1deg)',
                        'background-position': '0% 0%, 100% 100%, 50% 50%'
                    },
                    '50%': {
                        'transform': 'translate3d(5%, -3%, 0) scale(1.15) rotate(2deg)',
                        'background-position': '70% 40%, 20% 60%, 80% 20%'
                    },
                    '100%': {
                        'transform': 'translate3d(-1%, 5%, 0) scale(1.08) rotate(-2deg)',
                        'background-position': '100% 100%, 0% 0%, 20% 80%'
                    }
                },
                '@media (prefers-reduced-motion: reduce)': {
                    '.section-gradient': {
                        'animation': 'none'
                    }
                }
            })
        },
    ]
    //==================================================================================================

    

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