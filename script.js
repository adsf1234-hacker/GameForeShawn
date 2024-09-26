const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('scoreDisplay');

canvas.width = window.innerWidth * 0.9;
canvas.height = window.innerHeight * 0.9;

let player = {
    x: 50,
    y: canvas.height - 50,
    width: 30,
    height: 40,
    speed: 5,
    lives: 3,
};

let enemies = [];
const maxEnemies = 10;

function createEnemy() {
    const enemy = {
        x: Math.random() * (canvas.width - 50),
        y: 0,
        width: 30,
        height: 40,
        speed: Math.random() * 3 + 1,
    };
    enemies.push(enemy);
}

function update() {
    // Move enemies
    enemies.forEach((enemy, index) => {
        enemy.y += enemy.speed;
        
        if (enemy.y > canvas.height) {
            enemy.y = 0;
            enemy.x = Math.random() * (canvas.width - 50);
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

    // Draw player
    ctx.fillStyle = 'blue';
    ctx.fillRect(player.x, player.y, player.width, player.height);
    ctx.fillStyle = 'white';
    ctx.fillText(`Lives: ${player.lives}`, 10, 30);

    // Draw enemies
    ctx.fillStyle = 'red';
    enemies.forEach(enemy => {
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
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
            player.x -= player.speed;
            break;
        case 'ArrowRight':
            player.x += player.speed;
            break;
    }

    // Check if player goes off-screen
    if (player.x < 0) {
        player.x = canvas.width;
    } else if (player.x > canvas.width) {
        player.x = 0;
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
