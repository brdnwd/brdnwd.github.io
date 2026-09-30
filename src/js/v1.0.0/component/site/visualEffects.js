import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export function initThreeFloat() {
    const media = window.matchMedia('(min-width: 1024px)');
    if (!media.matches) return;

    const container = document.querySelector('#threeFloatBackground');
    if (!container) return;

    const renderer = new THREE.WebGLRenderer({
        'alpha': true,
        'antialias': true,
        'powerPreference': 'high-performance'
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.inset = '0';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    renderer.domElement.setAttribute('aria-hidden', 'true');
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 1000);
    camera.position.set(0, 0, 100);
    camera.lookAt(0, 0, 0);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const environment = new RoomEnvironment(renderer);
    scene.environment = pmremGenerator.fromScene(environment, 0.04).texture;
    environment.dispose();
    pmremGenerator.dispose();

    scene.add(new THREE.AmbientLight(0xffffff, 1.2));

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2.5);
    directionalLight.position.set(3, 5, 8);
    scene.add(directionalLight);

    const modelRoot = new THREE.Group();
    scene.add(modelRoot);

    const mouse = {
        'target': new THREE.Vector2(),
        'current': new THREE.Vector2()
    };

    const meshes = [];
    let model;
    let loaded = false;
    let modelSize = new THREE.Vector3();
    let animationFrame = null;
    let resizeTimeout = null;

    function resize() {
        if (!media.matches) return;

        const width = Math.max(container.getBoundingClientRect().width, 1);
        const height = Math.max(container.getBoundingClientRect().height, 1);
        const aspect = width / height;
        const viewHeight = 10;
        const viewWidth = viewHeight * aspect;

        camera.left = -viewWidth / 2;
        camera.right = viewWidth / 2;
        camera.top = viewHeight / 2;
        camera.bottom = -viewHeight / 2;
        camera.updateProjectionMatrix();

        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        renderer.setSize(width, height, false);

        if (!model) return;

        const maxWidth = viewWidth;
        const maxHeight = viewHeight * 0.9;

        const widthScale = maxWidth / Math.max(modelSize.x, 0.001);
        const heightScale = maxHeight / Math.max(modelSize.y, 0.001);

        modelRoot.scale.setScalar(Math.min(widthScale, heightScale));
    }

    function setupModel(gltf) {
        model = gltf.scene;
        model.updateMatrixWorld(true);

        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());

        modelSize = box.getSize(new THREE.Vector3());
        model.position.sub(center);

        model.traverse((node) => {
            if (!node.isMesh) return;

            const material = Array.isArray(node.material)
                ? node.material.map((material) => {
                    const clone = material.clone();
                    clone.color.set(window.siteColors.accent);
                    return clone;
                })
                : node.material.clone();

            if (!Array.isArray(material)) {
                material.color.set(window.siteColors.accent);
            }

            node.material = material;

            meshes.push({
                'mesh': node,
                'position': node.position.clone(),
                'rotation': node.rotation.clone(),
                'offset': new THREE.Vector3(),
                'velocity': new THREE.Vector3(),
                'rotationOffset': new THREE.Vector3(),
                'rotationVelocity': new THREE.Vector3()
            });
        });

        modelRoot.add(model);
        loaded = true;
        resize();
    }

    function updateMeshes(time) {
        mouse.current.x += (mouse.target.x - mouse.current.x) * 0.05;
        mouse.current.y += (mouse.target.y - mouse.current.y) * 0.05;

        meshes.forEach((data) => {
            const mesh = data.mesh;

            const offsetX = mouse.current.x * 0.35;
            const offsetY = mouse.current.y * 0.35;

            mesh.position.x =
                data.position.x +
                offsetX +
                Math.sin(time * 0.8) * 0.025;

            mesh.position.y =
                data.position.y -
                offsetY +
                Math.sin(time * 0.9) * 0.08;

            mesh.rotation.x =
                data.rotation.x +
                mouse.current.y * 0.12;

            mesh.rotation.y =
                data.rotation.y +
                mouse.current.x * 0.12;

            mesh.rotation.z =
                data.rotation.z +
                Math.sin(time * 0.6) * 0.025;
        });
    }

    function animate(time) {
        if (!media.matches) {
            animationFrame = null;
            return;
        }

        animationFrame = requestAnimationFrame(animate);

        if (!loaded) return;

        updateMeshes(time * 0.001);
        renderer.render(scene, camera);
    }

    function startRendering() {
        if (!media.matches || animationFrame !== null) return;
        animationFrame = requestAnimationFrame(animate);
        resize();
    }

    function stopRendering() {
        if (animationFrame !== null) {
            cancelAnimationFrame(animationFrame);
            animationFrame = null;
        }

        renderer.clear();
        renderer.domElement.style.display = 'none';
    }

    function handleBreakpointChange() {
        if (media.matches) {
            renderer.domElement.style.display = 'block';
            startRendering();
        } else {
            stopRendering();
        }
    }

    container.parentElement.addEventListener('pointermove', (event) => {
        if (!media.matches) return;

        const rect = container.getBoundingClientRect();

        mouse.target.x =
            ((event.clientX - rect.left) / rect.width - 0.5) * 2;

        mouse.target.y =
            ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    });

    container.parentElement.addEventListener('pointerleave', () => {
        mouse.target.set(0, 0);
    });

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (media.matches) {
                resize();
            }
        }, 100);
    });

    media.addEventListener('change', handleBreakpointChange);

    const loader = new GLTFLoader();

    loader.load(
        '/src/res/3d/trumpet.glb',
        (gltf) => {
            setupModel(gltf);
        },
        undefined,
        (error) => {
            console.error('Three.js GLB failed to load:', error);
        }
    );

    resize();
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
        'threshold': 0.01
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