const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('scoreDisplay');
const gameOverScreen = document.getElementById('gameOverScreen');

canvas.width = window.innerWidth * 0.9;
canvas.height = window.innerHeight * 0.9;

let player = {
    x: canvas.width / 2,
    y: canvas.height - 50,
    width: 40,
    height: 60,
    speedX: 0,
    speedY: 0,
    lives: 3,
};

let enemies = [];
const maxEnemies = 10;

function createEnemy() {
    const enemy = {
        x: Math.random() * (canvas.width - 50),
        y: 0,
        width: 40,
        height: 60,
        speedX: Math.random() * 2 + 1,
        speedY: 0,
    };
    enemies.push(enemy);
}

function update() {
    // Move players
    player.x += player.speedX;
    player.y += player.speedY;

    // Keep player on screen
    if (player.x < 0) player.x = canvas.width;
    else if (player.x > canvas.width) player.x = 0;
    if (player.y < 0) player.y = canvas.height;
    else if (player.y > canvas.height) player.y = 0;

    // Move enemies
    enemies.forEach((enemy, index) => {
        enemy.x -= enemy.speedX;
        
        if (enemy.x < 0) {
            enemy.x = canvas.width;
            enemy.y = Math.random() * (canvas.height - enemy.height);
        }
    });

    // Check collisions
    enemies.forEach((enemy, index) => {
        if (checkCollision(player, enemy)) {
            // Collision detected
            player.lives--;
            console.log(`Player hit! Remaining lives: ${player.lives}`);
            removeEnemy(index);
        }
    });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    ctx.drawImage(new Image(), 0, 0, canvas.width, canvas.height);

    // Draw player
    ctx.drawImage(new Image(), player.x, player.y, player.width, player.height);

    // Draw enemies
    enemies.forEach(enemy => {
        ctx.drawImage(new Image(), enemy.x, enemy.y, enemy.width, enemy.height);
    });

    // Update game state
    update();

    requestAnimationFrame(draw);
}

function checkCollision(obj1, obj2) {
    const xOverlap = obj1.x < obj2.x + obj2.width &&
                    obj1.x + obj1.width > obj2.x;
    const yOverlap = obj1.y < obj2.y + obj2.height &&
                    obj1.y + obj1.height > obj2.y;
    
    return xOverlap && yOverlap;
}

function removeEnemy(index) {
    enemies.splice(index, 1);
}

document.addEventListener('keydown', (event) => {
    switch(event.key) {
        case 'ArrowLeft':
            player.speedX = -5;
            break;
        case 'ArrowRight':
            player.speedX = 5;
            break;
        case 'ArrowUp':
            player.speedY = -5;
            break;
        case 'ArrowDown':
            player.speedY = 5;
            break;
    }
});

document.addEventListener('keyup', (event) => {
    switch(event.key) {
        case 'ArrowLeft':
        case 'ArrowRight':
            player.speedX = 0;
            break;
        case 'ArrowUp':
        case 'ArrowDown':
            player.speedY = 0;
            break;
    }
});

// Initial setup
for (let i = 0; i < maxEnemies; i++) {
    createEnemy();
}

draw();

// Update score display every frame
setInterval(() => {
    scoreDisplay.textContent = `Lives: ${player.lives}`;
}, 16);

// Game over logic
if (player.lives === 0) {
    gameOverScreen.style.display = 'block';
}
