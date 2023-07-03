window.addEventListener('resize', function() {
    window.location.reload();
}); //update size of game depending on size of screen

function pointerDownHandler(event) {
    playerObj.velocity.x += 1;
    keys.down.pressed = true;
}

//from HTML
const scoreText = document.getElementById('scoreText');
const livesText = document.getElementById('livesText');
const game = document.getElementById('game');
const startGame = document.getElementById('startGame');

//variables
var score = 0;
var lives = 1;
var scrollOffset = 5;
var playerGravity = .5;
var playerJump = -10
var player;
var starHeight = 30;
var starWidth = 30;

var minWidth = 30;
var maxWidth = 150;
var platformDist = Math.random() * (300 - 170) + 170;
var platforms = [];
var stars = [];
const numPlatforms = 10;
const pointsToWin = 50;     // won when pointsToWin
const collideWithStarPoint = 10;
var platformsJumpedOn = 0;
var onTheScreen = 30;

var lastStarHit = null;
var jumpedOn = false;
var containsStar = true;
var onGround = true;

//variables for array 
var scoreArr = [];          //save score 



var playerObj = {
    velocity: {
        x: 0,
        y: 0
    },
    position: {
        x: onTheScreen,
        y: 0
    },
    height: 30,
    width: 30,
    speed: 0.3
};

var platformObj = {
    x: 0,
    y: 500,
    width: 100,
    height: 30,
    jumpedOn: false,
    containsStar: true
};

var starObj = {
    x: 50,
    y: 0,
    height: starHeight,
    width: starWidth
}

const keys = {
    down: { pressed: false }
};

//set background
var gameWidth = window.innerWidth;
var gameHeight = window.innerHeight;
game.style.width = gameWidth + 'px';
game.style.height = gameHeight + 'px';

startGame.innerText = 'Start game';

function play() {

    startGame.style.display = 'none';
    scoreText.innerText = 'Score: ' + score;
    livesText.innerText = 'Lives: ' + lives;

    requestAnimationFrame(update);
    generatePlatforms();
    createPlayer();
}


function update() {
    // update player position
    playerObj.position.y += playerObj.velocity.y;
    playerObj.position.x += playerObj.velocity.x;
    player.style.top = playerObj.position.y + 'px';
    player.style.left = playerObj.position.x + 'px';

    if (playerObj.position.y + playerObj.height + playerObj.velocity.y <= gameHeight) {
        playerObj.velocity.y += playerGravity
    }

    // constrain player position within game boundaries
    if (playerObj.position.x < 0) {
        playerObj.position.x = 0;
    }

    //gör att spelaren stannar på toppen
    if (playerObj.position.y < 0) {
        playerObj.position.y = 0;
        playerObj.velocity.y = 0;
    }

    if (playerObj.position.y + player.offsetHeight > game.offsetHeight) {
        // To remove the event listener
        window.removeEventListener('pointerdown', pointerDownHandler);

        livesText.innerText = 'Lives: ' + (lives--);
        window.location.reload();
        playerObj.velocity.y = playerObj;
    }


    if (keys.down.pressed && playerObj.position.x < onTheScreen) {
        playerObj.velocity.x = playerObj.speed
    } else {
        playerObj.velocity.x = 0
    }

    //if press down then move player + background
    if (keys.down.pressed && lives > 0) {
        if (score >= pointsToWin) {
            scrollOffset = 0;
            return;
        }else{
            scrollOffset += playerObj.speed;
            platforms.forEach((platform, index) => {
                // Get the corresponding platform element
                const platformEl = document.getElementsByClassName('platform')[index];
    
                // Subtract the scrollOffset from the platform's x position
                platform.x -= scrollOffset;
                platformEl.style.left = platform.x + 'px';
            });
    
            stars.forEach((star, index) => {
                // Get the corresponding star element
                const starEl = document.getElementsByClassName('star')[index];
                star.x -= scrollOffset;
                starEl.style.left = star.x + 'px';
            });
        }
    }

    if (!keys.down.pressed) {
        scrollOffset = 0;
    }

    // call requestAnimationFrame again to loop the animation
    requestAnimationFrame(update);

    // Generate a new platform on the right side
    generatePlatforms();

    // detect collisions
    detectCollisions();
}

function createPlayer() {
    player = document.createElement('img');
    player.className = 'player';
    player.style.width = playerObj.width + 'px';
    player.style.height = playerObj.height + 'px';
    //player.style.backgroundColor = 'green';
    player.src = '/player.png';
    player.style.position = 'absolute';
    player.style.top = playerObj.position.y + 'px';
    player.style.left = playerObj.position.x + 'px';

    game.appendChild(player);

    return player;
}


function generatePlatforms() {
    // Generate a new platform only if the number of platforms is less than numPlatforms
    if (platforms.length < numPlatforms) {
        // Generate a new platform only if the last platform is inside the gameWidth
        const lastPlatform = platforms[platforms.length - 1];
        if (lastPlatform && lastPlatform.x + lastPlatform.width + platformDist >= gameWidth) {
            return;
        }

        const minY = gameHeight * 0.4;
        const maxY = gameHeight * 0.6;
        let newX = lastPlatform ? lastPlatform.x + platformDist : 0;

        newX = Math.min(newX, gameWidth); // new platform is inside the gameWidth

        let newY = Math.random() * (maxY - minY) + minY;

        // Determine whether the new platform should contain a star
        const containsStar = platforms.length % 2 === 0;

        // Ensure that the new platform is not stacked on top of the last platform
        while (lastPlatform && Math.abs(newY - lastPlatform.y) < platformObj.height) {
            newY = Math.random() * (maxY - minY) + minY;
        }

        const newPlatform = {
            ...platformObj,
            x: newX,
            y: newY,
            width: Math.random() * (maxWidth - minWidth) + minWidth,        // generate a new random width
            containsStar: containsStar,
            jumpedOn: false,
        };

        platforms.push(newPlatform);
        if (platforms.length > numPlatforms) {
            platforms.shift();
            game.removeChild(game.firstChild);
        }

        const platformEl = document.createElement('div');
        platformEl.className = 'platform';
        platformEl.style.width = newPlatform.width + 'px';
        platformEl.style.height = newPlatform.height + 'px';
        platformEl.style.backgroundColor = 'brown';
        platformEl.style.position = 'absolute';
        platformEl.style.top = newPlatform.y + 'px';
        platformEl.style.left = newPlatform.x + 'px';

        game.appendChild(platformEl);

        // Add a star to the platform if it should contain one
        if (containsStar) {
            const newStar = {
                ...starObj,
                x: Math.random() * ((newX) - (newX - 50)) + (newX),
                y: Math.random() * ((newY + 50) - (newY)) + (newY - 50),
                width: starWidth,
                height: starHeight
            };

            stars.push(newStar);

            const starEl = document.createElement('div');
            starEl.className = 'star';
            starEl.style.width = newStar.width + 'px';
            starEl.style.height = newStar.height + 'px';
            // starEl.style.backgroundColor = 'yellow';
            starEl.style.position = 'absolute';
            starEl.style.top = newStar.y - newStar.height * 2 + 'px';
            starEl.style.left = newStar.x + 'px';
            game.appendChild(starEl);

            const imgEl = document.createElement('img');
            imgEl.className = 'img';
            imgEl.src = '/star.png';
            imgEl.style.height = starHeight + 'px';
            imgEl.style.width = starWidth + 'px';

            starEl.appendChild(imgEl)


            var animationSpin = imgEl.animate(
                [
                    { transform: 'rotateY(0deg)' },
                    { transform: 'rotateY(360deg)' }
                ],
                {
                    duration: 2000, // You can set the duration to any value, as it won't affect the animation.
                    iterations: Infinity // This makes the animation repeat indefinitely.
                }
            );
            imgEl.style.transformOrigin = "center";
        }
    }
}


function detectCollisions(platformEl) {
    const playerTop = parseInt(playerObj.position.y);
    const playerBottom = playerTop + playerObj.height;
    const playerLeft = parseInt(playerObj.position.x);
    const playerRight = playerLeft + playerObj.width;

    platforms.forEach((platform) => {
        const platformTop = parseInt(platform.y);
        const platformBottom = platformTop - platformObj.height;
        const platformLeft = parseInt(platform.x);
        const platformRight = platformLeft + platform.width;


        if (playerBottom >= platformTop &&
            playerTop + playerObj.velocity.y >= platformBottom &&
            playerRight >= platformLeft &&
            playerLeft <= platformRight) {
            if (!platform.jumpedOn) {
                if (!onGround) {
                    return;                     // ignore click if not on ground
                } else if(onGround && playerBottom > platformTop + 20){
                    return;
                } else if (onGround) {
                    onGround = true;
                    playerObj.velocity.y = playerJump;
                    platform.jumpedOn = true;
                    platformsJumpedOn++;        // öka räknaren med 1
                    scoreText.innerText = 'Score: ' + (++score);
                    console.log(platformsJumpedOn)
                }


                if (platformsJumpedOn === numPlatforms && score >= pointsToWin) {
                    document.getElementById('cc-title').innerText = 'Congratulations! You got: ' + score + '! YOU WIN!';
                    //scoreArr.unshift(gameDone);
                    scoreArr.unshift(score);

                    playerObj.velocity.y = playerObj;
                    playerObj.velocity.x = playerObj;

                    // Check if player is on the final platform and set x-velocity to 0
                    if (platform === platforms[platforms.length - 1]) {
                        playerObj.velocity.x = 0;
                        console.log("sista")
                    }
                    //gameDone();
                }
                if (platformsJumpedOn === numPlatforms && score < pointsToWin) {
                    document.getElementById('cc-title').innerText = 'Game lost! You got: ' + score + '!!';
                    playerObj.velocity.y = playerObj;
                    playerObj.velocity.x = playerObj;

                    if (platforms.length > 0 && platform === platforms[platforms.length - 1]) {
                        playerObj.velocity.x = 0;
                        console.log("sista");
                    /* 
                        const goalFlag = document.createElement('img');
                        goalFlag.className = 'goalFlag';
                        goalFlag.src = '/goal.png';
                        goalFlag.style.height = starHeight + 'px';
                        goalFlag.style.width = starWidth + 'px';
                    
                        platformEl.appendChild(goalFlag);  */// Append to platformEl instead of platform
                    }
                }
            }
            else {
                playerObj.velocity.y = playerJump;
            }
        }
    });


    platforms.forEach((platform) => {
        if (platform.containsStar) {
            const starEl = document.querySelectorAll('.star');

            starEl[0].style.display = 'none';

            for (let i = 1; i < stars.length; i++) {
                const star = stars[i];

                if (playerObj.position.x < star.x + star.width &&
                    playerObj.position.x + playerObj.width > star.x &&
                    playerObj.position.y < star.y + star.height &&
                    playerObj.position.y + playerObj.height > star.y) {
                    if (star && lastStarHit !== star) {
                        lastStarHit = star;
                        platform.containsStar = false;
                        scoreText.innerText = 'Score: ' + (score += collideWithStarPoint);
                        starEl[i].innerText = '+ 10';
                        starEl[i].style.color = 'white';

                        // Animate the star element
                        starEl[i].animate(
                            [
                                { transform: 'translateY(0px)', opacity: 1 },
                                { transform: 'translateY(-100px)', opacity: 0 }
                            ],
                            {
                                duration: 1000,
                                easing: 'ease-out'
                            }
                        ).onfinish = () => {
                            starEl[i].style.display = 'none';
                        };
                    }
                }
            }
        }
    });
}



window.addEventListener('pointerdown', pointerDownHandler);

window.addEventListener('dblclick', function (event) {
    keys.down.pressed = false;
});

window.addEventListener('pointerup', function (event) {
    playerObj.velocity.x = 0;
    keys.down.pressed = false;
});

window.addEventListener('touchstart', function (event) {
    playerObj.velocity.x += 1;
    keys.down.pressed = true;
});

window.addEventListener('touchend', function (event) {
    playerObj.velocity.x = 0;
    keys.down.pressed = false;
});