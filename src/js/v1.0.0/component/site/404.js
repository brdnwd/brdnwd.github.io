export function init404Game() {
    const game = document.getElementById("offlineGame");

    if (!game) return;

    game.innerHTML = `
        <div class="hidden xl:flex flex-col w-[600px]">

            <div class="flex flex-row justify-between items-center pb-2 text-xs font-black">
                <span>
                    SCORE:
                    <span data-snake-score-value>0</span>
                </span>

                <span class="opacity-50">
                    HIGH:
                    <span data-snake-high-score>0</span>
                </span>
            </div>

            <div data-snake-game
                class="relative w-[600px] h-[300px] overflow-hidden border border-white/20 bg-theme text-white">

                <div data-snake-board class="relative w-full h-full">
                </div>

                <div data-snake-message
                    class="absolute inset-0 bg-theme flex items-center justify-center pointer-events-none">

                    <span class="text-sm font-black opacity-60 text-center px-4">
                        CLICK TO PLAY
                    </span>

                </div>

            </div>

        </div>
    `;

    const container = game.querySelector("[data-snake-game]");
    const board = game.querySelector("[data-snake-board]");
    const message = game.querySelector("[data-snake-message]");

    const scoreElement =
        game.querySelector("[data-snake-score-value]");

    const highScoreElement =
        game.querySelector("[data-snake-high-score]");

    const gridSize = 25;
    const speed = 110;

    const highScoreKey = "brdnwd_snake_high_score";

    let snake;
    let food;
    let direction;
    let nextDirection;
    let running = false;
    let gameLoop;
    let cells = [];

    let score = 0;

    let highScore =
        Number(localStorage.getItem(highScoreKey)) || 0;

    highScoreElement.textContent = highScore;

    function createBoard() {
        board.innerHTML = "";
        cells = [];

        for (let y = 0; y < gridSize; y++) {
            cells[y] = [];

            for (let x = 0; x < gridSize; x++) {
                const cell = document.createElement("div");

                cell.className =
                    "absolute bg-white/0 transition-colors duration-75";

                cell.style.width =
                    `${100 / gridSize}%`;

                cell.style.height =
                    `${100 / gridSize}%`;

                cell.style.left =
                    `${x * (100 / gridSize)}%`;

                cell.style.top =
                    `${y * (100 / gridSize)}%`;

                board.appendChild(cell);
                cells[y][x] = cell;
            }
        }
    }

    function reset() {
        snake = [
            { x: 10, y: 10 },
            { x: 9, y: 10 },
            { x: 8, y: 10 }
        ];

        direction = {
            x: 1,
            y: 0
        };

        nextDirection = {
            x: 1,
            y: 0
        };

        score = 0;

        scoreElement.textContent = score;

        spawnFood();
        draw();
    }

    function spawnFood() {
        let position;

        do {
            position = {
                x: Math.floor(
                    Math.random() * gridSize
                ),

                y: Math.floor(
                    Math.random() * gridSize
                )
            };
        } while (
            snake.some(
                part =>
                    part.x === position.x &&
                    part.y === position.y
            )
        );

        food = position;
    }

    function draw() {
        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {
                cells[y][x].className =
                    "absolute bg-white/0 transition-colors duration-75";
            }
        }

        snake.forEach((part, index) => {
            const cell =
                cells[part.y]?.[part.x];

            if (!cell) return;

            cell.className =
                index === 0
                    ? "absolute bg-white transition-colors duration-75"
                    : "absolute bg-white/80 transition-colors duration-75";
        });

        if (food) {
            cells[food.y][food.x].className =
                "absolute bg-accent transition-colors duration-75";
        }
    }

    function update() {
        direction = nextDirection;

        const head = snake[0];

        const newHead = {
            x: head.x + direction.x,
            y: head.y + direction.y
        };

        const hitWall =
            newHead.x < 0 ||
            newHead.x >= gridSize ||
            newHead.y < 0 ||
            newHead.y >= gridSize;

        const hitSelf = snake.some(
            part =>
                part.x === newHead.x &&
                part.y === newHead.y
        );

        if (hitWall || hitSelf) {
            stop();

            message.querySelector("span").textContent =
                `GAME OVER · SCORE ${score} · CLICK TO RESTART`;

            message.classList.remove("hidden");

            return;
        }

        snake.unshift(newHead);

        if (
            newHead.x === food.x &&
            newHead.y === food.y
        ) {
            score++;

            scoreElement.textContent = score;

            if (score > highScore) {
                highScore = score;

                localStorage.setItem(
                    highScoreKey,
                    highScore
                );

                highScoreElement.textContent =
                    highScore;
            }

            spawnFood();
        } else {
            snake.pop();
        }

        draw();
    }

    function start() {
        if (running) return;

        reset();

        running = true;

        message.classList.add("hidden");

        clearInterval(gameLoop);

        gameLoop =
            setInterval(update, speed);
    }

    function stop() {
        running = false;

        clearInterval(gameLoop);
        gameLoop = null;
    }

    function setDirection(x, y) {
        if (!running) return;

        if (
            direction.x === -x &&
            direction.y === -y
        ) {
            return;
        }

        nextDirection = {
            x,
            y
        };
    }

    container.addEventListener("click", () => {
        if (!running) {
            start();
        }
    });

    document.addEventListener("keydown", event => {
        if (
            !running &&
            (
                event.key === "ArrowUp" ||
                event.key === "ArrowDown" ||
                event.key === "ArrowLeft" ||
                event.key === "ArrowRight" ||
                event.key.toLowerCase() === "w" ||
                event.key.toLowerCase() === "a" ||
                event.key.toLowerCase() === "s" ||
                event.key.toLowerCase() === "d"
            )
        ) {
            start();
        }

        switch (event.key) {
            case "ArrowUp":
            case "w":
            case "W":
                event.preventDefault();
                setDirection(0, -1);
                break;

            case "ArrowDown":
            case "s":
            case "S":
                event.preventDefault();
                setDirection(0, 1);
                break;

            case "ArrowLeft":
            case "a":
            case "A":
                event.preventDefault();
                setDirection(-1, 0);
                break;

            case "ArrowRight":
            case "d":
            case "D":
                event.preventDefault();
                setDirection(1, 0);
                break;
        }
    });

    let touchStartX = 0;
    let touchStartY = 0;

    container.addEventListener(
        "touchstart",
        event => {
            const touch =
                event.changedTouches[0];

            touchStartX =
                touch.clientX;

            touchStartY =
                touch.clientY;
        },
        { passive: true }
    );

    container.addEventListener(
        "touchend",
        event => {
            if (!running) {
                start();
                return;
            }

            const touch =
                event.changedTouches[0];

            const deltaX =
                touch.clientX -
                touchStartX;

            const deltaY =
                touch.clientY -
                touchStartY;

            if (
                Math.abs(deltaX) <
                Math.abs(deltaY)
            ) {
                setDirection(
                    0,
                    deltaY > 0 ? 1 : -1
                );
            } else {
                setDirection(
                    deltaX > 0 ? 1 : -1,
                    0
                );
            }
        },
        { passive: true }
    );

    createBoard();
    reset();
}