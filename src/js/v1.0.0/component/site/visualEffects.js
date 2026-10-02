export function initGrainGradient() {
    const section = document.querySelector('#body > section:first-of-type');
    if (!section || section.querySelector('#grainGradientCanvas')) return;

    const colors = window.siteColors;
    if (!colors) return;

    function hexToRgb(hex) {
        const value = hex.replace('#', '');

        return [
            parseInt(value.substring(0, 2), 16) / 200,
            parseInt(value.substring(2, 4), 16) / 200,
            parseInt(value.substring(4, 6), 16) / 200
        ];
    }

    const color1 = hexToRgb(colors.theme);
    const color2 = hexToRgb(colors.accent);
    const color3 = hexToRgb(colors.white);

    const canvas = document.createElement('canvas');
    canvas.id = 'grainGradientCanvas';
    canvas.className = 'bg-white/0';

    Object.assign(canvas.style, {
        'position': 'absolute',
        'inset': '0',
        'z-index': '0',
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

        vec2 warp(vec2 p, float time) {
            vec2 q = p;

            q += vec2(
                fbm(p * 1.35 + time * 0.12),
                fbm(p * 1.35 - time * 0.10)
            ) * 1.5;

            q += vec2(
                sin(p.y * 2.2 + time * 0.22),
                cos(p.x * 2.0 - time * 0.18)
            ) * 0.28;

            return q;
        }

        void main() {
            vec2 uv = gl_FragCoord.xy / uResolution.xy;

            float aspect = uResolution.x / uResolution.y;

            vec2 p = uv - 0.5;
            p.x *= aspect;

            float time = uTime;

            vec2 warped = warp(p * 1.25, time);

            float field1 = fbm(
                warped * 1.05 +
                vec2(
                    time * 0.035,
                    -time * 0.025
                )
            );

            float field2 = fbm(
                warped * 1.8 -
                vec2(
                    time * 0.025,
                    time * 0.03
                )
            );

            float flow =
                field1 * 0.7 +
                field2 * 0.3;

            float band = sin(
                warped.x * 2.4 +
                warped.y * 1.5 +
                flow * 4.2 +
                time * 0.12
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

            float accentField =
                fbm(
                    warped * 1.45 +
                    vec2(
                        -time * 0.045,
                        time * 0.035
                    )
                );

            float accentField2 =
                noise(
                    warped * 2.2 +
                    vec2(
                        time * 0.025,
                        -time * 0.02
                    )
                );

            float accentAmount =
                0.22 +
                smoothstep(
                    0.28,
                    0.72,
                    accentField
                ) * 0.42 +
                smoothstep(
                    0.42,
                    0.78,
                    accentField2
                ) * 0.18;

            accentAmount =
                clamp(
                    accentAmount,
                    0.0,
                    0.78
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

            float glow =
                smoothstep(
                    0.15,
                    1.0,
                    band
                );

            color +=
                uColor3 *
                glow *
                0.16;

            float grain =
                hash21(
                    gl_FragCoord.xy +
                    floor(time * 18.0)
                );

            grain =
                (grain - 0.5) *
                0.055;

            color += grain;

            color =
                pow(
                    max(color, 0.0),
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
        const shader = gl.createShader(type);

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

    const program = gl.createProgram();

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

    const vertices = new Float32Array([
        -1, -1,
         1, -1,
        -1,  1,
        -1,  1,
         1, -1,
         1,  1
    ]);

    const buffer = gl.createBuffer();

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
    let startTime = performance.now();

    function resize() {
        const rect = section.getBoundingClientRect();
        const width = Math.max(rect.width, 1);
        const height = Math.max(rect.height, 1);

        const pixelRatio =
            Math.min(
                window.devicePixelRatio || 1,
                1.25
            );

        canvas.width =
            Math.floor(
                width * pixelRatio
            );

        canvas.height =
            Math.floor(
                height * pixelRatio
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

        gl.useProgram(
            program
        );

        gl.uniform1f(
            timeLocation,
            (time - startTime) *
            0.001
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

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            const element = entry.target;
            observer.unobserve(element);
            playPopup(element);
        });
    }, {
        'root': document.querySelector('#body')?.parentElement || null,
        'rootMargin': '0px',
        'threshold': 0.15
    });

    elements.forEach((element) => {
        preparePopup(element);
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
            element.style.transform = `translate3d(0, -${distance}px, 0)`;
            break;
        case 'left':
            element.style.transform = `translate3d(${distance}px, 0, 0)`;
            break;
        case 'right':
            element.style.transform = `translate3d(-${distance}px, 0, 0)`;
            break;
        case 'scale':
            element.style.transform = 'scale(0.88)';
            break;
        case 'blur':
            element.style.transform = 'translate3d(0, 12px, 0)';
            element.style.filter = 'blur(12px)';
            break;
        case 'up':
        default:
            element.style.transform = `translate3d(0, ${distance}px, 0)`;
            break;
    }
}

function playPopup(element) {
    const type = element.dataset.popup || 'up';
    const duration = parseInt(element.dataset.popupDuration || '700', 10);
    const delay = parseInt(element.dataset.popupDelay || '0', 10);
    const distance = parseFloat(element.dataset.popupDistance || '32');

    const animation = element.animate(getPopupKeyframes(type, distance), {
        'duration': duration,
        'delay': delay,
        'easing': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'fill': 'forwards'
    });

    animation.finished.then(() => {
        element.style.willChange = 'auto';
        element.style.transform = 'none';
        element.style.filter = 'none';
        element.style.opacity = '1';
    }).catch(() => {
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
                    'opacity': 0,
                    'transform': `translate3d(0, -${distance}px, 0)`
                },
                {
                    'opacity': 1,
                    'transform': 'translate3d(0, 0, 0)'
                }
            ];
        case 'left':
            return [
                {
                    'opacity': 0,
                    'transform': `translate3d(${distance}px, 0, 0)`
                },
                {
                    'opacity': 1,
                    'transform': 'translate3d(0, 0, 0)'
                }
            ];
        case 'right':
            return [
                {
                    'opacity': 0,
                    'transform': `translate3d(-${distance}px, 0, 0)`
                },
                {
                    'opacity': 1,
                    'transform': 'translate3d(0, 0, 0)'
                }
            ];
        case 'scale':
            return [
                {
                    'opacity': 0,
                    'transform': 'scale(0.88)'
                },
                {
                    'opacity': 1,
                    'transform': 'scale(1)'
                }
            ];
        case 'blur':
            return [
                {
                    'opacity': 0,
                    'transform': 'translate3d(0, 12px, 0)',
                    'filter': 'blur(12px)'
                },
                {
                    'opacity': 1,
                    'transform': 'translate3d(0, 0, 0)',
                    'filter': 'blur(0)'
                }
            ];
        case 'up':
        default:
            return [
                {
                    'opacity': 0,
                    'transform': `translate3d(0, ${distance}px, 0)`
                },
                {
                    'opacity': 1,
                    'transform': 'translate3d(0, 0, 0)'
                }
            ];
    }
}