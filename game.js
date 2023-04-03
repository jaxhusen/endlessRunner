window.addEventListener('resize', () => {
    window.location.reload()
}); //update size of game depending on size of screen

const scoreText = document.getElementById('scoreText');
const livesText = document.getElementById('livesText');

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

var playerGravity = .5;
var playerJump = -15

var gameHeight = window.innerHeight;
var gameWidth = window.innerWidth;
canvas.width = gameWidth;
canvas.height = gameHeight;

var score = 0;
var lives = 3;

var scoreToWin = 1000;

scoreText.innerText = 'Score: ' + score;
livesText.innerText = 'Lives: ' + lives;

const scaledCanvas = {
    width: canvas.width / 1,
    height: canvas.height / 2
}

class Platform {
    constructor({ x, y, imageSrc }) {
        this.position = {
            x: x,
            y: y
        }
        this.width = 200,
            this.height = 50
        this.image = new Image()
        this.image.src = imageSrc
    }
    draw() {
        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
    }
}


class Player {
    constructor(position) {
        this.position = position
        this.velocity = {
            x: 0,
            y: 0
        }
        this.speed = 5
        this.height = 50
        this.width = 50
    }
    draw() {
        c.fillStyle = 'green'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
    update() {
        this.draw()
        this.position.y += this.velocity.y
        this.position.x += this.velocity.x;

        if (this.position.y + this.height + this.velocity.y <= canvas.height) {
            this.velocity.y += playerGravity
        }
    }
}

var platforms = [];

var player = new Player({
    x: 50,
    y: 0
});

const keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    },
};
var scrollOffset = 0;

function init() {
    platforms = [new Platform({
        x: 0,
        y: 500,
        imageSrc: '/uploads/grass.png'
    }),
    new Platform({
        x: 300,
        y: 600,
        imageSrc: '/uploads/grass.png'
    }),
    new Platform({
        x: 600,
        y: 700,
        imageSrc: '/uploads/grass.png'
    }),
    new Platform({
        x: 900,
        y: 700,
        imageSrc: '/uploads/grass.png'
    }),
    new Platform({
        x: 1200,
        y: 500,
        imageSrc: '/uploads/grass.png'
    })];

    player = new Player({
        x: 50,
        y: 0
    });
    scrollOffset = 0;
}

function animate() {
    window.requestAnimationFrame(animate)
    // Clear canvas
    c.clearRect(0, 0, gameWidth, gameHeight);

    c.fillStyle = "lightblue"
    c.fillRect(0, 0, canvas.width, gameHeight.height)

    c.restore()
    player.update()
    platforms.forEach(platform => {
        platform.draw()
    })

    if (keys.right.pressed && player.position.x < 200) {
        player.velocity.x = player.speed
    } else if ((keys.left.pressed && player.position.x > 100) ||
        keys.left.pressed && scrollOffset == 0 &&
        player.position.x > 0) {
        player.velocity.x = -player.speed
    }
    else {
        player.velocity.x = 0
    }

    if (keys.right.pressed) {
        scrollOffset += player.speed
        platforms.forEach(platform => {
            platform.position.x -= player.speed
        })
    } else if (keys.left.pressed && scrollOffset > 0) {
        scrollOffset -= 5
        platforms.forEach(platform => {
            platform.position.x += player.speed
        })
    }

    //platform collision detection
    platforms.forEach(platform => {
        if (player.position.y + player.height <=
            platform.position.y &&
            player.position.y + player.height +
            player.velocity.y >= platform.position.y &&
            player.position.x + player.width >=
            platform.position.x && player.position.x <=
            platform.position.x + platform.width) {
            player.velocity.y = -15
        }
    })
    score = scrollOffset;
    scoreText.innerText = 'Score: ' + score;

    if (score > scoreToWin) {
        console.log('YOU WINNNNN')
    }
    if (player.position.y > canvas.height) {
        lives--;
        livesText.innerText = 'Lives: ' + lives;
        if (lives > 0) {
            init()
        }else{
            livesText.innerText = 'Lives: ' + 0;
        }
    }
}

init()
animate()

window.addEventListener('keydown', ({ keyCode }) => {
    switch (keyCode) {
        case 65:
            player.velocity.x -= 1
            keys.left.pressed = true;
            console.log('left')
            break
        case 68:
            player.velocity.x += 1
            keys.right.pressed = true;
            console.log('right')
            break
        case 87:
            player.velocity.y = playerJump
            break
    }
})

window.addEventListener('keyup', ({ keyCode }) => {
    switch (keyCode) {
        case 65:
            player.velocity.x = 0
            keys.left.pressed = false;
            break
        case 68:
            player.velocity.x = 0;
            keys.right.pressed = false;
            break
        case 87:
            player.velocity.y = playerJump
            break
    }
})

window.addEventListener('pointerdown', (event) => {
    player.velocity.y = playerJump
    console.log(event)
})

window.addEventListener('touch', (event) => {
    player.velocity.y = playerJump
    console.log(event)
})