function Collision({rect1, rect2}) {
    return (
        rect1.attackBox.position.x + rect1.attackBox.width >= rect2.position.x && 
        rect1.attackBox.position.x <= rect2.position.x + rect2.width && 
        rect1.attackBox.position.y + rect1.attackBox.height >= rect2.position.y &&
        rect1.attackBox.position.y <= rect2.position.y + rect2.height
    )
}

function determinWinner({player,enemy, timerId}) {
    clearTimeout(timerId);
    if (player.health === enemy.health) {
        document.getElementById('display-text').innerHTML = 'Tie';
    } else if (player.health > enemy.health) {
        document.getElementById('display-text').innerHTML = 'Player 1 Wins';
    } else if (enemy.health > player.health) {
        document.getElementById('display-text').innerHTML = 'Player 2 Wins';
    }
}

let timer = 60;
let timerId; 
function decreaseTimer() {
    if (timer > 0) {
        timerId = setTimeout(decreaseTimer,1000);
        timer--;
        document.getElementById('timer').innerHTML = timer;
    } 

    if (timer == 0) {
        document.getElementById('display-text').style.display = 'flex';
        determinWinner({player,enemy, timerId});
    }
}