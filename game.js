const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
canvas.width = 1024;
canvas.height = 576;
c.fillRect(0,0,canvas.width,canvas.height);
const gravity = 0.7;
const speed = 5; 
const jump = 15;

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imgSrc: './img/background.png'
});

const shop = new Sprite({
    position: {
        x: 600,
        y: 130
    },
    imgSrc: './img/shop.png',
    scale: 2.75,
    maxFrames: 6
});


const player = new Fighter({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 10
    },
    offset: {
        x: 0,
        y: 0
    },
    imgSrc: './img/samuraiMack/Idle.png',
    maxFrames: 8,
    scale: 2.5,
    offset: {
        x: 215,
        y: 157
    },
    sprites: {
        idle: {
            imgSrc: './img/samuraiMack/Idle.png',
            maxFrames: 8 
        }, 
        run: {
            imgSrc: './img/samuraiMack/Run.png',
            maxFrames: 8
        },
        jump: {
            imgSrc: './img/samuraiMack/Jump.png',
            maxFrames: 2
        },
        fall: {
            imgSrc: './img/samuraiMack/Fall.png',
            maxFrames: 2
        },
        attack1: {
            imgSrc: './img/samuraiMack/Attack1.png',
            maxFrames: 6
        }, 
        takeHit: {
            imgSrc: './img/samuraiMack/Take Hit - white silhouette.png',
            maxFrames: 4
        },
        death: {
            imgSrc: './img/samuraiMack/Death.png',
            maxFrames: 6
        }
    },
    attackBox: {
        offset: {
            x: 100,
            y: 50
        }, 
        width: 160,
        height: 50
    }
});

const enemy = new Fighter({
    position: {
        x: 400,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'blue',
    offset: {
        x: -50,
        y: 0
    },
    imgSrc: './img/kenji/Idle.png',
    maxFrames: 4,
    scale: 2.5,
    offset: {
        x: 215,
        y: 157
    },
    sprites: {
        idle: {
            imgSrc: './img/kenji/Idle.png',
            maxFrames: 4 
        }, 
        run: {
            imgSrc: './img/kenji/Run.png',
            maxFrames: 8
        },
        jump: {
            imgSrc: './img/kenji/Jump.png',
            maxFrames: 2
        },
        fall: {
            imgSrc: './img/kenji/Fall.png',
            maxFrames: 2
        },
        attack1: {
            imgSrc: './img/kenji/Attack1.png',
            maxFrames: 4
        },
        takeHit: {
            imgSrc: './img/kenji/Take hit.png',
            maxFrames: 3
        },
        death: {
            imgSrc: './img/kenji/Death.png',
            maxFrames: 7
        }
    },
    attackBox: {
        offset: {
            x: -170,
            y: 50
        }, 
        width: 170,
        height: 50
    }
});

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }
};

decreaseTimer();

function animate() {
    window.requestAnimationFrame(animate);
    // c.fillStyle = 'black';
    // c.fillRect(0,0,canvas.width,canvas.height);
    background.update();
    shop.update();
    c.fillStyle = "rgba(255,255,255,0.15)";
    c.fillRect(0,0,canvas.width,canvas.height);
    player.update();
    enemy.update();
    
    player.velocity.x = 0;
    if (keys.a.pressed == true && player.lastKey == 'a') {
        player.velocity.x = -speed;
        player.switchSprite('run');
    } else if (keys.d.pressed == true && player.lastKey == 'd') {
        player.switchSprite('run');
        player.velocity.x = speed;
    } else {
        player.switchSprite('idle');
    }
    
    if (player.velocity.y < 0) {
        player.switchSprite('jump');
    } else if (player.velocity.y > 0) {
        player.switchSprite('fall');
    }
    
    enemy.velocity.x = 0;
    if (keys.ArrowLeft.pressed == true && enemy.lastKey == 'ArrowLeft') {
        enemy.velocity.x = -speed;
        enemy.switchSprite('run');
    } else if (keys.ArrowRight.pressed == true && enemy.lastKey == 'ArrowRight') {
        enemy.switchSprite('run');
        enemy.velocity.x = speed;
    } else {
        enemy.switchSprite('idle');
    }

    if (enemy.velocity.y < 0) {
        enemy.switchSprite('jump');
    } else if (enemy.velocity.y > 0) {
        enemy.switchSprite('fall');
    }

    if (Collision({rect1:player,rect2:enemy}) && 
    player.isAttacking && player.currentFrame === 4) {
        enemy.takeHit();
        player.isAttacking = false;
        gsap.to('#enemy-health', {
            width: enemy.health + '%'
        });
    }
    
    if (player.isAttacking && player.currentFrame === 4) {
        player.isAttacking = false;
    }
    
    if (Collision({rect1:enemy,rect2:player}) &&
    enemy.isAttacking && enemy.currentFrame === 2) {
        player.takeHit();
        enemy.isAttacking = false;
        gsap.to('#player-health', {
            width: player.health + '%'
        });
    }

    if (enemy.isAttacking && enemy.currentFrame === 2) {
        enemy.isAttacking = false;
    }

    if (enemy.health <= 0 || player.health <= 0) {
        document.getElementById('display-text').style.display = 'flex';
        determinWinner({player,enemy,timerId});
    }
}

animate();

window.addEventListener('keydown', (event) => {

    if (!player.dead) {
        switch (event.key) {
            case 'd': {
                keys.d.pressed = true;
                player.lastKey = 'd';
                break;
            }
            case 'a': {
                keys.a.pressed = true;
                player.lastKey = 'a';
                break;
            }
            case 'w': {
                player.velocity.y = -jump;
                break;
            }
            case ' ': {
                player.attack();
                break;
            }
        }
    }

    if (!enemy.dead) {
        switch (event.key) {
            case 'ArrowRight': {
                keys.ArrowRight.pressed = true;
                enemy.lastKey = 'ArrowRight';
                break;
            }
            case 'ArrowLeft': {
                keys.ArrowLeft.pressed = true;
                enemy.lastKey = 'ArrowLeft';
                break;
            }
            case 'ArrowUp': {
                enemy.velocity.y = -jump;
                break;
            }
            case 'ArrowDown': {
                enemy.attack();
                break;
            }
        }
    }
});
window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd': {
            keys.d.pressed = false;
            break;
        }
        case 'a': {
            keys.a.pressed = false;
            break;
        }

        case 'ArrowRight': {
            keys.ArrowRight.pressed = false;
            break;
        }
        case 'ArrowLeft': {
            keys.ArrowLeft.pressed = false;
            break;
        }
    }
});