window.addEventListener('resize', () => {
    window.location.reload()
}); //update size of game depending on size of screen



const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
var gameHeight = window.innerHeight;
var gameWidth = window.innerWidth;
var playerGravity = .5;
var playerJump = -15



canvas.width = gameWidth;
canvas.height = gameHeight;

const scaledCanvas = {
    width: canvas.width / 2,
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

class Sprite {
    constructor({ position, imageSrc }) {
        this.position = position
        this.image = new Image()
        this.image.src = imageSrc
    }
    draw() {
        if (!this.image) {
            return
        }
        c.drawImage(this.image, this.position.x, this.position.y)
    }
    update() {
        this.draw()
    }
}
const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './uploads/bg.jpg'
})

class Player {
    constructor(position) {
        this.position = position
        this.velocity = {
            x: 0,
            y: 0
        }
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
        } else {
            this.velocity.y = 0
        }
    }
}

const player = new Player({
    x: 50,
    y: 0
})
const keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    },
}

var scrollOffset = 0;

const platforms = [new Platform({x: 0, y: 500, imageSrc: '/uploads/grass.png'}), new Platform({x: 300, y: 300, imageSrc: '/uploads/grass.png'})]

function animate() {
    window.requestAnimationFrame(animate)
    c.clearRect(0, 0, canvas.width, canvas.height)

    c.fillStyle = "lightblue"
    c.fillRect(0, 0, canvas.width, canvas.height)

    c.save()
    c.scale(1, 2)
    c.translate(0, - background.image.height + scaledCanvas.height)
    background.update()
    c.restore()
    player.update()
    platforms.forEach(platform => {
        platform.draw()
    })





    if (keys.right.pressed && player.position.x < 200) {
        player.velocity.x = 5
    } else if (keys.left.pressed && player.position.x > 100) {
        player.velocity.x = -5
    }
    else {
        player.velocity.x = 0
    }

    if (keys.right.pressed) {
        scrollOffset += 5
        platforms.forEach(platform => {
            platform.position.x -= 5
        })
    } else if (keys.left.pressed) {
        scrollOffset -= 5
        platforms.forEach(platform => {
            platform.position.x += 5
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
            player.velocity.y = 0
        }
    })

    if(scrollOffset > 2000){
        console.log('YOU WINNNNN')
    }
}

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