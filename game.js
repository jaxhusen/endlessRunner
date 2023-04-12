window.addEventListener('resize', () => {
    window.location.reload()
}); //update size of game depending on size of screen

const scoreText = document.getElementById('scoreText');
const livesText = document.getElementById('livesText');

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

var playerGravity = .5;
var playerJump = -10
var starHeight = 40;
var starWidth = 40;
var platformWidth = Math.floor(Math.random() * 200) + 100;
var platformHeight = 50;
var playerWidth = 50;
var playerHeight = 50;

var gameHeight = window.innerHeight;
var gameWidth = window.innerWidth;
canvas.width = gameWidth;
canvas.height = gameHeight;

var score = 0;
var lives = 1;

var scrollOffset = 0;
var scoreToWin = 1000;          //point to win if we use scrollOffset insted of platforms
var platforms = [];
var stars = [];                 // array to store star positions
var platformsNum = 11;       //total number of platforms and points to win
var winNum = platformsNum - 1;

scoreText.innerText = 'Score: ' + score;
livesText.innerText = 'Lives: ' + lives;

class Platform {
    constructor({ x, y, imageSrc, width, containsStar }) {
        this.position = {
            x: x,
            y: y
        };
        this.width = width;
        this.height = platformHeight;
        this.image = new Image();
        this.image.src = imageSrc;
        this.jumpedOn = false;
        this.containsStar = containsStar;
        this.starPosition = {
            x: this.position.x,
            y: this.position.y - starHeight
        };
        this.starImage = new Image();
        this.starImage.src = "/uploads/star.png";
        if (this.containsStar) {
            stars.push({
                position: this.starPosition,
                image: this.starImage,
                height: starHeight,
                width: starWidth
            });
        }
    }
    draw() {
        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
        if (this.containsStar) {
            c.drawImage(this.starImage, this.position.x + this.width / 2 - starWidth, this.position.y - starHeight * 2, starWidth, starHeight);
        }
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
        this.height = playerHeight
        this.width = playerWidth
    }
    draw() {
        c.fillStyle = 'green'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    update() {
        this.draw()

        // Update the player's position
        this.position.y += this.velocity.y
        this.position.x += this.velocity.x;

        if (this.position.x + this.velocity.x > 0 && this.position.x + this.velocity.x + playerWidth < gameWidth) {
            // Update the stars' positions
            stars.forEach(star => {
                star.position.x -= this.velocity.x;
            });
        }

        // Update the stars' positions
        stars.forEach((star, index) => {
            star.position.x -= this.velocity.x;
            console.log(`Position of star ${index}: (${star.position.x})`);
            console.log(`player ${player.position.x}`)
          });


        // Apply gravity to the player
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



function init() {
    platforms.push(new Platform({
        x: 0,
        y: 500,
        imageSrc: '/uploads/grass.png',
        width: 200,
        containsStar: false, // don't contain star
    }));

    for (var i = 1; i < platformsNum; i++) {
        platforms.push(new Platform({
            x: 0,
            y: 500,
            imageSrc: '/uploads/grass.png',
            width: 200,
            containsStar: false, // don't contain star
        }));

        platforms.push(new Platform({
            x: i * 400,
            y: Math.random() * (500 - 300) + 300,
            imageSrc: '/uploads/grass.png',
            width: Math.floor(Math.random() * 250) + 100,
            containsStar: true,
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


    if (keys.down.pressed && player.position.x < 200) {
        player.velocity.x = player.speed;

    } else {
        player.velocity.x = 0;
    }

/*     player.update()
 */

    if (keys.down.pressed && lives > 0) {
        scrollOffset += player.speed
        platforms.forEach(platform => {
            platform.position.x -= player.speed
        })
    }



    platforms.forEach(platform => {
        platform.draw();
        if (player.position.y + player.height <= platform.position.y
            && player.position.y + player.height + player.velocity.y >= platform.position.y &&
            player.position.x + player.width >= platform.position.x && player.position.x <=
            platform.position.x + platform.width) {

            if (!platform.jumpedOn) {
                player.velocity.y = -15;                    //bounce when player hits platform
                platform.jumpedOn = true;                   // mark platform as touched

                if (platform.containsStar) {                //add if statement for player colliding with star
                    // Check for collision between player and star
                    console.log(player.position.x)
                    console.log(platform.starPosition)

                    // Remove the star from the platform and the array, and increase the score
                    platform.containsStar = false;
                    stars.splice(stars.indexOf(star => star.position === platform.starPosition), 1);
                    score++;
                    scoreText.innerText = 'Score: ' + score;
                }
            } else {
                player.velocity.y = -15;                    //bounce when player hits platform
            }
        }
    });
}





function gameWon() {
    if (score >= winNum) {
        console.log("congratttssss")
    }
}




function gameLost() {
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