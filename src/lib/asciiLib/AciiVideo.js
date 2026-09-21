/**
 * Simple library function to create a bg out of ASCII from a video link.
 */
export function createASCIIVideo(container, videoSrc, options = {}) {
    const pre = typeof container === "string" ? document.querySelector(container) : container;
    if(!pre) throw new Error("Container not found");

    const ramp = options.ramp || " .:-=_".split('');
    const fps = options.fps || 10; // ASCII frame rate
    const negative = !!options.negative;
    const playbackRate = options.playbackRate || 0.2;

    // --------------------
    // Video setup
    // --------------------
    const video = document.createElement('video');
    video.src = videoSrc;
    video.autoplay = true;
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.crossOrigin = "anonymous";
    video.playbackRate = playbackRate;

    // keep "visible" but tiny
    video.style.width = "0px";
    video.style.height = "0px";
    video.style.visibility = "hidden"
    document.body.appendChild(video);

    // --------------------
    // Offscreen canvas
    // --------------------
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // --------------------
    // Compute ASCII grid
    // --------------------
    function computeGrid() {
        // get container size in pixels
        const rect = pre.parentElement.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        // choose desired resolution of ASCII grid
        // for example, 1 ASCII character per 8x14 pixels (tweakable)
        const charW = 8; 
        const charH = 14; 

        const cols = Math.max(1, Math.floor(width / charW));
        const rows = Math.max(1, Math.floor(height / charH));

        return {cols, rows};
    }

    // --------------------
    // Draw ASCII
    // --------------------
    function drawASCIIFromCanvas() {
        const {cols, rows} = computeGrid();
        const imageData = ctx.getImageData(0, 0, cols, rows).data;
        let ascii = '';
        for(let y=0;y<rows;y++){
            let line='';
            for(let x=0;x<cols;x++){
                const i = (y*cols + x)*4;
                const r = imageData[i];
                const g = imageData[i+1];
                const b = imageData[i+2];
                let brightness = (0.299*r + 0.587*g + 0.114*b)/255;
                if(options.negative) brightness = 1 - brightness;
                const idx = Math.floor(brightness * (ramp.length-1) + 0.0001);
                line += ramp[idx];
            }
            ascii += line+'\n';
        }
        pre.textContent = ascii;
    }

    // --------------------
    // Animation loop
    // --------------------
    let lastTime = 0;
    function tick(timestamp){
        if(!lastTime) lastTime = timestamp;
        const interval = 1000 / fps;
        if(timestamp - lastTime > interval){
            const {cols, rows} = computeGrid();
            canvas.width = cols;
            canvas.height = rows;
            if(video.readyState >= 2){
                ctx.drawImage(video, 0, 0, cols, rows);
                drawASCIIFromCanvas();
            }
            lastTime = timestamp;
        }
        requestAnimationFrame(tick);
    }

    // --------------------
    // Start when video ready
    // --------------------
    video.addEventListener('canplay', () => {
        requestAnimationFrame(tick);
    });

    // --------------------
    // Return control
    // --------------------
    return {
        videoElement: video,
        updateOptions: (newOpts) => Object.assign(options, newOpts)
    };
}


/**
 * 
 * <script type="module">
                import { createASCIIVideo } from "./src/lib/asciiLib/AciiVideo.js";

                const asciiPlayer = createASCIIVideo('#ascii', '', {
                    ramp: " .:-=_*[]".split(''),
                    fps: 400,
                    negative: false,
                    playbackRate: 1
                });
                </script>


                <div id="container" class="w-full h-full relative bg-black text-white border border-white">
                            
                            <!-- ASCII Background -->
                            <pre id="ascii" class="absolute top-0 left-0 w-full h-full font-mono text-zinc-800 select-none whitespace-pre overflow-hidden p-0 pointer-events-none z-0">
                            </pre>

                            <!-- Foreground content -->
                            <div class="relative z-10 p-4">
                                <h1 class="text-2xl font-bold">Text on top of ASCII background</h1>
                                <p class="mt-2">This content sits above the animated ASCII video.</p>
                            </div>

                        </div>
 */