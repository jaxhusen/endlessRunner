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




scoreText.innerText = 'Score: ' + score;
livesText.innerText = 'Lives: ' + lives;

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
        this.jumpedOn = false;  // new property to track if platform has been touched
/*         this.stars = [];  // array to store star positions
        for (let i = 0; i < 1; i++) {
            this.stars.push({
                x: this.position.x + Math.random() * this.width,
                y: this.position.y - 30 - Math.random() * 20
            });
        } */
    }
    draw() {
        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
/*         for (let i = 0; i < this.stars.length; i++) {
            c.fillStyle = 'yellow';
            c.beginPath();
            c.arc(this.stars[i].x, this.stars[i].y, 10, 0, Math.PI * 2);
            c.fill(); 
            
        }*/
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
//platforms = [];

function init() {
    platforms.push(new Platform({
        x: 0,
        y: 500,
        imageSrc: '/uploads/grass.png'
    }));

    for (var i = 1; i < platformsWinNum; i++) {
        platforms.push(new Platform({
            x: i * 300,
            y: Math.random() * (500 - 300) + 300,
            imageSrc: '/uploads/grass.png'
        }))
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

platforms.forEach(platform => {
  platform.draw();

  // Update position of stars
  stars.forEach(star => {
    star.position.x =0;
    star.draw();
  });
});

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
                score++; // increase score
                scoreText.innerText = 'Score: ' + score;
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