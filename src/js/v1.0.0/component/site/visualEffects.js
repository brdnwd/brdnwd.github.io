export function initJelloLinks() {
    const elements = document.querySelectorAll("[data-physics]");
    if (!elements.length) return;

    const mediaQuery = window.matchMedia("(min-width: 768px) and (pointer: fine)");
    let enabled = mediaQuery.matches;

    const mouse = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        active: false,
    };

    const elementStates = [...elements].map((element, index) => ({
        element,
        index,
        x: 0,
        y: 0,
        rotation: 0,
        targetX: 0,
        targetY: 0,
        targetRotation: 0,
    }));

    let mouseFrame = null;

    function updateMousePosition(event) {
        if (!enabled) return;

        mouse.x = event.clientX;
        mouse.y = event.clientY;
        mouse.active = true;

        if (!mouseFrame) {
            mouseFrame = requestAnimationFrame(
                animateMouseInteraction
            );
        }
    }

    function resetMouseInteraction() {
        mouse.active = false;

        if (!mouseFrame) {
            mouseFrame = requestAnimationFrame(
                animateMouseInteraction
            );
        }
    }

    function animateMouseInteraction(time) {
        if (!enabled) {
            mouseFrame = null;
            return;
        }

        const influenceRadius = 30;
        const maxPush = 5;
        const maxRotation = 18;
        const spring = 0.12;

        let needsAnimation = false;

        for (const state of elementStates) {
            const rect = state.element.getBoundingClientRect();

            const centerX =
                rect.left +
                rect.width / 2;

            const centerY =
                rect.top +
                rect.height / 2;

            let targetX = 0;
            let targetY = 0;
            let targetRotation = 0;

            if (mouse.active) {
                const dx = centerX - mouse.x;
                const dy = centerY - mouse.y;

                const distance = Math.sqrt(
                    dx * dx +
                    dy * dy
                );

                if (distance < influenceRadius) {
                    const normalized =
                        1 -
                        Math.min(
                            distance / influenceRadius,
                            1
                        );

                    const falloff =
                        normalized * normalized;

                    const angle =
                        Math.atan2(dy, dx);

                    targetX =
                        Math.cos(angle) *
                        maxPush *
                        falloff;

                    targetY =
                        Math.sin(angle) *
                        maxPush *
                        falloff;

                    targetRotation =
                        Math.sin(
                            angle +
                            state.index * 0.7
                        ) *
                        maxRotation *
                        falloff;

                    const wave =
                        Math.sin(
                            time * 0.012 +
                            state.index * 1.2
                        ) *
                        10 *
                        falloff;

                    targetX +=
                        Math.cos(
                            angle +
                            Math.PI / 2
                        ) *
                        wave;

                    targetY +=
                        Math.sin(
                            angle +
                            Math.PI / 2
                        ) *
                        wave;
                }
            }

            state.targetX = targetX;
            state.targetY = targetY;
            state.targetRotation = targetRotation;

            state.x +=
                (state.targetX - state.x) *
                spring;

            state.y +=
                (state.targetY - state.y) *
                spring;

            state.rotation +=
                (state.targetRotation - state.rotation) *
                spring;

            state.element.style.translate =
                `${state.x}px ${state.y}px`;

            state.element.style.rotate =
                `${state.rotation}deg`;

            if (
                Math.abs(
                    state.x -
                    state.targetX
                ) > 0.01 ||
                Math.abs(
                    state.y -
                    state.targetY
                ) > 0.01 ||
                Math.abs(
                    state.rotation -
                    state.targetRotation
                ) > 0.01 ||
                mouse.active
            ) {
                needsAnimation = true;
            }
        }

        if (needsAnimation) {
            mouseFrame =
                requestAnimationFrame(
                    animateMouseInteraction
                );
        } else {
            mouseFrame = null;
        }
    }

    function updateState() {
        enabled = mediaQuery.matches;

        if (!enabled) {
            mouse.active = false;

            elementStates.forEach((state) => {
                state.x = 0;
                state.y = 0;
                state.rotation = 0;
                state.targetX = 0;
                state.targetY = 0;
                state.targetRotation = 0;

                state.element.style.translate = "";
                state.element.style.rotate = "";
            });

            if (mouseFrame) {
                cancelAnimationFrame(
                    mouseFrame
                );

                mouseFrame = null;
            }

            return;
        }

        if (!mouseFrame) {
            mouseFrame =
                requestAnimationFrame(
                    animateMouseInteraction
                );
        }
    }

    elements.forEach((element) => {
        element.addEventListener(
            "mouseenter",
            () => {
                mouse.active = true;
            }
        );

        element.addEventListener(
            "mouseleave",
            resetMouseInteraction
        );
    });

    window.addEventListener(
        "pointermove",
        updateMousePosition,
        { passive: true }
    );

    window.addEventListener(
        "blur",
        resetMouseInteraction
    );

    window.addEventListener(
        "resize",
        updateState
    );

    mediaQuery.addEventListener(
        "change",
        updateState
    );
}
//========================================================================================



export function initGrainGradient() {
    const section = document.querySelector('#content');
    if (!section || section.querySelector('#grainGradientCanvas')) return;

    const colors = window.siteColors;
    if (!colors) return;

    const body = document.querySelector('#body');
    if (!body) return;

    const scrollContainer = body.parentElement;
    if (!scrollContainer) return;

    const navbar = document.querySelector('#navbarContainer');
    const navbarHeight = navbar
        ? navbar.getBoundingClientRect().height
        : 0;

    function hexToRgb(hex) {
        const value = hex.replace('#', '');

        return [
            parseInt(value.substring(0, 2), 16) / 240,
            parseInt(value.substring(2, 4), 16) / 240,
            parseInt(value.substring(4, 6), 16) / 240
        ];
    }

    const color1 = hexToRgb(colors.accent);
    const color2 = hexToRgb(colors.theme);
    const color3 = hexToRgb(colors.white);

    const canvas = document.createElement('canvas');

    canvas.id = 'grainGradientCanvas';
    canvas.className = 'bg-white/0';

    Object.assign(canvas.style, {
        'position': 'absolute',
        'inset': '0',
        'z-index': '0',
        'width': '100%',
        'display': 'block',
        'pointer-events': 'none',
        'filter': 'blur(12px)'
    });

    section.prepend(canvas);

    const gl = canvas.getContext('webgl2', {
        'alpha': true,
        'antialias': false,
        'premultipliedAlpha': false
    });

    if (!gl) {
        canvas.remove();
        return;
    }

    const vertexSource = `#version 300 es
        in vec2 position;

        void main() {
            gl_Position = vec4(position, 0.0, 1.0);
        }
    `;

    const fragmentSource = `#version 300 es
        precision highp float;

        uniform vec2 uResolution;
        uniform float uTime;
        uniform float uScroll;

        uniform vec3 uColor1;
        uniform vec3 uColor2;
        uniform vec3 uColor3;

        out vec4 fragColor;

        float hash21(vec2 p) {
            p = fract(p * vec2(123.34, 345.45));
            p += dot(p, p + 34.345);

            return fract(p.x * p.y);
        }

        float noise(vec2 p) {
            vec2 i = floor(p);
            vec2 f = fract(p);

            f = f * f * (3.0 - 2.0 * f);

            float a = hash21(i);
            float b = hash21(i + vec2(1.0, 0.0));
            float c = hash21(i + vec2(0.0, 1.0));
            float d = hash21(i + vec2(1.0, 1.0));

            return mix(
                mix(a, b, f.x),
                mix(c, d, f.x),
                f.y
            );
        }

        float fbm(vec2 p) {
            float value = 0.0;
            float amplitude = 0.5;

            value += noise(p) * amplitude;

            p = p * 2.0 + 13.17;
            amplitude *= 0.5;

            value += noise(p) * amplitude;

            p = p * 2.0 + 13.17;
            amplitude *= 0.5;

            value += noise(p) * amplitude;

            return value;
        }

        vec2 warp(
            vec2 p,
            float time,
            float scroll
        ) {
            vec2 q = p;

            float warpStrength =
                1.5 +
                scroll * 2.8;

            float scale =
                1.35 +
                scroll * 0.35;

            q += vec2(
                fbm(
                    p * scale +
                    time * 0.12
                ),

                fbm(
                    p * scale -
                    time * 0.10
                )
            ) * warpStrength;

            q += vec2(
                sin(
                    p.y *
                    (2.2 + scroll * 3.0) +
                    time * 0.22
                ),

                cos(
                    p.x *
                    (2.0 + scroll * 2.5) -
                    time * 0.18
                )
            ) *
            (
                0.28 +
                scroll * 0.45
            );

            return q;
        }

        void main() {
            vec2 uv =
                gl_FragCoord.xy /
                uResolution.xy;

            float aspect =
                uResolution.x /
                uResolution.y;

            vec2 p = uv - 0.5;

            p.x *= aspect;

            /*
             * Move the background progressively
             * as the artificial page scrolls.
             */
            p.y += uScroll * 0.85;

            float time = uTime;

            /*
             * Scroll changes the scale and distortion.
             */
            vec2 warped =
                warp(
                    p *
                    (1.25 + uScroll * 0.55),

                    time,

                    uScroll
                );

            float field1 =
                fbm(
                    warped *
                    (1.05 + uScroll * 0.5) +

                    vec2(
                        time * 0.035 +
                        uScroll * 0.35,

                        -time * 0.025 +
                        uScroll * 0.8
                    )
                );

            float field2 =
                fbm(
                    warped *
                    (1.8 + uScroll * 0.75) -

                    vec2(
                        time * 0.025,

                        time * 0.03 +
                        uScroll * 0.65
                    )
                );

            float flow =
                field1 * 0.7 +
                field2 * 0.3;

            /*
             * Flowing bands become more pronounced
             * further down the page.
             */
            float band =
                sin(
                    warped.x *
                    (2.4 + uScroll * 2.5) +

                    warped.y *
                    (1.5 + uScroll * 1.5) +

                    flow *
                    (4.2 + uScroll * 4.0) +

                    time * 0.12 +

                    uScroll * 5.0
                );

            band =
                smoothstep(
                    -0.35,
                    0.8,
                    band
                );

            float mix1 =
                smoothstep(
                    0.12,
                    0.62,
                    flow
                );

            /*
             * Gradually introduce more of the
             * second theme color.
             */
            mix1 =
                clamp(
                    mix1 +
                    uScroll * 0.25,

                    0.0,
                    1.0
                );

            float accentField =
                fbm(
                    warped *
                    (1.45 + uScroll * 0.8) +

                    vec2(
                        -time * 0.045 +
                        uScroll * 0.5,

                        time * 0.035 -
                        uScroll * 0.35
                    )
                );

            float accentField2 =
                noise(
                    warped *
                    (2.2 + uScroll * 1.2) +

                    vec2(
                        time * 0.025,

                        -time * 0.02 +
                        uScroll * 0.5
                    )
                );

            /*
             * Accent becomes stronger as the user
             * moves further down the page.
             */
            float accentAmount =
                0.22 +

                smoothstep(
                    0.28,
                    0.72,
                    accentField
                ) *
                (
                    0.42 +
                    uScroll * 0.25
                ) +

                smoothstep(
                    0.42,
                    0.78,
                    accentField2
                ) *
                (
                    0.18 +
                    uScroll * 0.15
                );

            accentAmount =
                clamp(
                    accentAmount,
                    0.0,
                    0.95
                );

            vec3 color =
                mix(
                    uColor1,
                    uColor2,
                    mix1
                );

            color =
                mix(
                    color,
                    uColor3,
                    accentAmount
                );

            /*
             * Glow progressively increases.
             */
            float glow =
                smoothstep(
                    0.15,
                    1.0,
                    band
                );

            color +=
                uColor3 *
                glow *
                (
                    0.16 +
                    uScroll * 0.20
                );

            /*
             * Grain.
             */
            float grain =
                hash21(
                    gl_FragCoord.xy +
                    floor(time * 18.0)
                );

            grain =
                (
                    grain -
                    0.5
                ) *
                (
                    0.055 +
                    uScroll * 0.025
                );

            color += grain;

            color =
                pow(
                    max(
                        color,
                        0.0
                    ),
                    vec3(0.92)
                );

            fragColor =
                vec4(
                    color,
                    1.0
                );
        }
    `;

    function createShader(type, source) {
        const shader =
            gl.createShader(type);

        gl.shaderSource(
            shader,
            source
        );

        gl.compileShader(shader);

        if (!gl.getShaderParameter(
            shader,
            gl.COMPILE_STATUS
        )) {
            console.error(
                gl.getShaderInfoLog(shader)
            );

            gl.deleteShader(shader);

            return null;
        }

        return shader;
    }

    const vertexShader =
        createShader(
            gl.VERTEX_SHADER,
            vertexSource
        );

    const fragmentShader =
        createShader(
            gl.FRAGMENT_SHADER,
            fragmentSource
        );

    if (!vertexShader || !fragmentShader) {
        canvas.remove();
        return;
    }

    const program =
        gl.createProgram();

    gl.attachShader(
        program,
        vertexShader
    );

    gl.attachShader(
        program,
        fragmentShader
    );

    gl.linkProgram(program);

    if (!gl.getProgramParameter(
        program,
        gl.LINK_STATUS
    )) {
        console.error(
            gl.getProgramInfoLog(program)
        );

        canvas.remove();
        return;
    }

    const vertices =
        new Float32Array([
            -1, -1,
            1, -1,
            -1, 1,

            -1, 1,
            1, -1,
            1, 1
        ]);

    const buffer =
        gl.createBuffer();

    gl.bindBuffer(
        gl.ARRAY_BUFFER,
        buffer
    );

    gl.bufferData(
        gl.ARRAY_BUFFER,
        vertices,
        gl.STATIC_DRAW
    );

    const positionLocation =
        gl.getAttribLocation(
            program,
            'position'
        );

    gl.enableVertexAttribArray(
        positionLocation
    );

    gl.vertexAttribPointer(
        positionLocation,
        2,
        gl.FLOAT,
        false,
        0,
        0
    );

    const timeLocation =
        gl.getUniformLocation(
            program,
            'uTime'
        );

    const scrollLocation =
        gl.getUniformLocation(
            program,
            'uScroll'
        );

    const resolutionLocation =
        gl.getUniformLocation(
            program,
            'uResolution'
        );

    const color1Location =
        gl.getUniformLocation(
            program,
            'uColor1'
        );

    const color2Location =
        gl.getUniformLocation(
            program,
            'uColor2'
        );

    const color3Location =
        gl.getUniformLocation(
            program,
            'uColor3'
        );

    let animationFrame = null;
    let resizeTimeout = null;
    let scrollFrame = null;

    let startTime = performance.now();

    /*
     * Artificial scroll progress.
     *
     * targetScroll follows the actual scroll
     * container while currentScroll smoothly
     * follows targetScroll.
     */
    let currentScroll = 0;
    let targetScroll = 0;

    function updateScrollProgress() {
        const maxScroll =
            scrollContainer.scrollHeight -
            scrollContainer.clientHeight;

        const minScroll =
            -navbarHeight;

        const extendedMax =
            maxScroll +
            navbarHeight;

        const range =
            extendedMax -
            minScroll;

        if (range <= 0) {
            targetScroll = 0;
            return;
        }

        targetScroll =
            (
                scrollContainer.scrollTop -
                minScroll
            ) / range;

        targetScroll =
            Math.max(
                0,
                Math.min(
                    1,
                    targetScroll
                )
            );
    }

    function handleScroll() {
        if (scrollFrame !== null) return;

        scrollFrame =
            requestAnimationFrame(() => {
                updateScrollProgress();

                scrollFrame = null;
            });
    }

    function resize() {
        const rect =
            section.getBoundingClientRect();

        const width =
            Math.max(
                rect.width,
                1
            );

        const height =
            Math.max(
                rect.height,
                1
            );

        const pixelRatio =
            Math.min(
                window.devicePixelRatio || 1,
                1.25
            );

        canvas.width =
            Math.floor(
                width *
                pixelRatio
            );

        canvas.height =
            Math.floor(
                height *
                pixelRatio
            );

        gl.viewport(
            0,
            0,
            canvas.width,
            canvas.height
        );

        gl.useProgram(program);

        gl.uniform2f(
            resolutionLocation,
            canvas.width,
            canvas.height
        );

        gl.uniform3fv(
            color1Location,
            color1
        );

        gl.uniform3fv(
            color2Location,
            color2
        );

        gl.uniform3fv(
            color3Location,
            color3
        );
    }

    function animate(time) {
        animationFrame =
            requestAnimationFrame(
                animate
            );

        /*
         * Follow the artificial scroll.
         *
         * The artificial scroll already has its
         * own smoothing, so this is intentionally
         * fairly responsive.
         */
        currentScroll +=
            (
                targetScroll -
                currentScroll
            ) *
            0.12;

        gl.useProgram(program);

        gl.uniform1f(
            timeLocation,
            (
                time -
                startTime
            ) *
            0.001
        );

        gl.uniform1f(
            scrollLocation,
            currentScroll
        );

        gl.drawArrays(
            gl.TRIANGLES,
            0,
            6
        );
    }

    function startRendering() {
        if (animationFrame !== null) return;

        canvas.style.display =
            'block';

        resize();
        updateScrollProgress();

        animationFrame =
            requestAnimationFrame(
                animate
            );
    }

    function stopRendering() {
        if (animationFrame !== null) {
            cancelAnimationFrame(
                animationFrame
            );

            animationFrame = null;
        }

        gl.clearColor(
            0,
            0,
            0,
            0
        );

        gl.clear(
            gl.COLOR_BUFFER_BIT
        );

        canvas.style.display =
            'none';
    }

    function handleBreakpointChange() {
        startRendering();
    }

    const resizeObserver =
        new ResizeObserver(
            resize
        );

    resizeObserver.observe(
        section
    );

    /*
     * IMPORTANT:
     * Listen to the artificial scroll container,
     * not window.
     */
    scrollContainer.addEventListener(
        'scroll',
        handleScroll,
        {
            passive: true
        }
    );

    window.addEventListener(
        'resize',
        () => {
            clearTimeout(
                resizeTimeout
            );

            resizeTimeout =
                setTimeout(
                    () => {
                        resize();
                        updateScrollProgress();
                    },
                    100
                );
        }
    );

    startRendering();
}
//========================================================================================



export function initPopupAnimations() {
    const elements = document.querySelectorAll('[data-popup]');
    if (!elements.length) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) {
        elements.forEach((element) => {
            element.style.opacity = '1';
            element.style.transform = 'none';
            element.style.filter = 'none';
        });
        return;
    }

    const scrollContainer =
        document.querySelector('#body')?.parentElement || null;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            const element = entry.target;

            observer.unobserve(element);
            playPopup(element);
        });
    }, {
        root: scrollContainer,
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0
    });

    elements.forEach((element) => {
        preparePopup(element);

        const firstSection =
            document.querySelector('#body > section:first-of-type');

        if (firstSection?.contains(element)) {
            playPopup(element);
            return;
        }

        observer.observe(element);
    });
}

function preparePopup(element) {
    const type = element.dataset.popup || 'up';
    const distance = parseFloat(element.dataset.popupDistance || '32');

    element.style.opacity = '0';
    element.style.willChange = 'opacity, transform, filter';

    switch (type) {
        case 'down':
            element.style.transform =
                `translate3d(0, -${distance}px, 0)`;
            break;

        case 'left':
            element.style.transform =
                `translate3d(${distance}px, 0, 0)`;
            break;

        case 'right':
            element.style.transform =
                `translate3d(-${distance}px, 0, 0)`;
            break;

        case 'scale':
            element.style.transform =
                'scale(0.88)';
            break;

        case 'blur':
            element.style.transform =
                'translate3d(0, 12px, 0)';
            element.style.filter =
                'blur(12px)';
            break;

        case 'up':
        default:
            element.style.transform =
                `translate3d(0, ${distance}px, 0)`;
            break;
    }
}

function playPopup(element) {
    const type = element.dataset.popup || 'up';
    const duration =
        parseInt(
            element.dataset.popupDuration || '700',
            10
        );

    const delay =
        parseInt(
            element.dataset.popupDelay || '0',
            10
        );

    const distance =
        parseFloat(
            element.dataset.popupDistance || '32'
        );

    const animation = element.animate(
        getPopupKeyframes(type, distance),
        {
            duration: duration,
            delay: delay,
            easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
            fill: 'forwards'
        }
    );

    animation.finished
        .then(() => {
            element.style.willChange = 'auto';
            element.style.transform = 'none';
            element.style.filter = 'none';
            element.style.opacity = '1';
        })
        .catch(() => {
            element.style.opacity = '1';
            element.style.transform = 'none';
            element.style.filter = 'none';
        });
}

function getPopupKeyframes(type, distance) {
    switch (type) {
        case 'down':
            return [
                {
                    opacity: 0,
                    transform:
                        `translate3d(0, -${distance}px, 0)`
                },
                {
                    opacity: 1,
                    transform:
                        'translate3d(0, 0, 0)'
                }
            ];

        case 'left':
            return [
                {
                    opacity: 0,
                    transform:
                        `translate3d(${distance}px, 0, 0)`
                },
                {
                    opacity: 1,
                    transform:
                        'translate3d(0, 0, 0)'
                }
            ];

        case 'right':
            return [
                {
                    opacity: 0,
                    transform:
                        `translate3d(-${distance}px, 0, 0)`
                },
                {
                    opacity: 1,
                    transform:
                        'translate3d(0, 0, 0)'
                }
            ];

        case 'scale':
            return [
                {
                    opacity: 0,
                    transform: 'scale(0.88)'
                },
                {
                    opacity: 1,
                    transform: 'scale(1)'
                }
            ];

        case 'blur':
            return [
                {
                    opacity: 0,
                    transform:
                        'translate3d(0, 12px, 0)',
                    filter: 'blur(12px)'
                },
                {
                    opacity: 1,
                    transform:
                        'translate3d(0, 0, 0)',
                    filter: 'blur(0)'
                }
            ];

        case 'up':
        default:
            return [
                {
                    opacity: 0,
                    transform:
                        `translate3d(0, ${distance}px, 0)`
                },
                {
                    opacity: 1,
                    transform:
                        'translate3d(0, 0, 0)'
                }
            ];
    }
}