window.addEventListener('resize', () => {
    window.location.reload()
}); //update size of game depending on size of screen

const scoreText = document.getElementById('scoreText');
const livesText = document.getElementById('livesText');

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

var playerGravity = .5;
var playerJump = -10

var gameHeight = window.innerHeight;
var gameWidth = window.innerWidth;
canvas.width = gameWidth;
canvas.height = gameHeight;

var score = 0;
var lives = 1;

var scoreToWin = 1000;          //point to win if we use scrollOffset insted of platforms
var platforms = [];
var stars = [];                 // array to store star positions
var platformsWinNum = 10;       //total number of platforms and points to win


const starImage = new Image();
starImage.src = '/uploads/star.png';

scoreText.innerText = 'Score: ' + score;
livesText.innerText = 'Lives: ' + lives;

class Platform {
    constructor({ x, y, imageSrc }) {
        this.position = {
            x: x,
            y: y
        }
        this.width = 200;
        this.height = 50;
        this.image = new Image();
        this.image.src = imageSrc;
        this.jumpedOn = false;
        this.collected = false;
        this.starPosition = {
            x: this.position.x + this.width / 2,
            y: this.position.y - 30
        }
        this.starRadius = 10;
        stars.push(this.starPosition);
    }
    draw() {
        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
        c.drawImage(starImage, this.position.x + this.width / 2 - 10, this.position.y - 30, 20, 20);
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
    down: {
        pressed: false
    }
};

var scrollOffset = 0;

function init() {
    platforms.push(new Platform({
        x: 0,
        y: 500,
        imageSrc: '/uploads/grass.png',
    }));

    for (var i = 1; i < platformsWinNum; i++) {
        platforms.push(new Platform({
            x: i * 300,
            y: Math.random() * (500 - 300) + 300,
            imageSrc: '/uploads/grass.png',
        }));
    }

    player = new Player({
        x: 50,
        y: 0
    });
    scrollOffset = 0;
    keys.down.pressed = false;
}




function animate() {
    window.requestAnimationFrame(animate)
    c.clearRect(0, 0, gameWidth, gameHeight);       // Clear canvas
    c.fillStyle = "lightblue"

    player.update()
    if (keys.right.pressed && player.position.x < 200) {
        player.velocity.x = player.speed
    } else {
        player.velocity.x = 0
    }

    if (keys.down.pressed && lives > 0) {
        scrollOffset += player.speed
        platforms.forEach(platform => {
            platform.position.x -= player.speed
        })
    }

    platforms.forEach(platform => {
        platform.draw();
        if (player.position.y + player.height <=
            platform.position.y &&
            player.position.y + player.height +
            player.velocity.y >= platform.position.y &&
            player.position.x + player.width >=
            platform.position.x && player.position.x <=
            platform.position.x + platform.width) {
    
            if (!platform.jumpedOn) {
                player.velocity.y = -15; //bounce when player hits platform
                platform.jumpedOn = true; // mark platform as touched
                if (!platform.collected && platform.checkStarCollision(player.position.x, player.position.y, player.width, player.height)) {
                    platform.collected = true;
                    stars = stars.filter(star => star !== platform.starPosition);
                }
            } else {
                player.velocity.y = -15; //bounce when player hits platform
            }
        }
    });

    if (score == platformsWinNum) {
        console.log("congratttssss")
    }


    if (player.position.y > canvas.height) {
        lives--;
        livesText.innerText = 'Lives: ' + lives;
        keys.down.pressed = false;
        player.velocity.x = 0
        if (lives > 0) {
            init()
        } else {
            livesText.innerText = 'Lives: ' + 0;
            console.log("G A M E O V E R, u scored " + score + ' points')
        }
    }
}

init()
animate()

window.addEventListener('pointerdown', (event) => {
    player.velocity.x += 1
    keys.down.pressed = true;
})

window.addEventListener('pointerup', (event) => {
    player.velocity.x = 0
    keys.down.pressed = false;
})

window.addEventListener('touch', (event) => {
    player.velocity.x += 1
    keys.down.pressed = true;
})