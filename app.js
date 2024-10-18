const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const img = new Image();
img.src = "flappy-bird-set.png";

// General settings
let gamePlaying = false;
const gravity = 0.5;
const speed = 6.2;
const size = [50, 48];
const digitWidth = 29;
const digitHeight = 40;

const jump = -11.5;
const cTenth = (canvas.width / 10);
let autoMode = false;

let index = 0,
    bestScore = 0, 
    flight, 
    flyHeight, 
    currentScore, 
    pipes;

const pipeWidth = 78;
const pipeGap = 270;
const pipeLoc = () => (Math.random() * ((canvas.height - (pipeGap + pipeWidth)) - pipeWidth)) + pipeWidth;

function drawScoreCentered(score, y) {
    const scoreStr = score.toString();
    const totalWidth = scoreStr.length * digitWidth;
    const startX = (canvas.width - totalWidth) / 2;

    for (let i = 0; i < scoreStr.length; i++) {
        const digit = parseInt(scoreStr[i]);
        const spriteX = 648 + digit * digitWidth;
        ctx.drawImage(img, spriteX, 0, digitWidth, digitHeight, startX + (i * digitWidth), y, digitWidth, digitHeight);
    }
}

const setup = () => {
    currentScore = 0;
    flight = jump;
    flyHeight = (canvas.height / 2) - (size[1] / 2);
    pipes = Array(3).fill().map((a, i) => [canvas.width + (i * (pipeGap + pipeWidth)), pipeLoc()]);
}

// Optimize rendering by using requestAnimationFrame more efficiently
let lastTime = 0;
const targetFPS = 60;
const frameInterval = 1000 / targetFPS;

const render = (currentTime) => {
    window.requestAnimationFrame(render);

    const deltaTime = currentTime - lastTime;
    if (deltaTime < frameInterval) return;

    lastTime = currentTime - (deltaTime % frameInterval);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    index++;

    // Background
    const bgOffset = (index * (speed / 2)) % canvas.width;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height, -bgOffset + canvas.width, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height, -bgOffset, 0, canvas.width, canvas.height);
  
    if (gamePlaying) {
        pipes.forEach(pipe => {
            pipe[0] -= speed;

            ctx.drawImage(img, 432, 588 - pipe[1], pipeWidth, pipe[1], pipe[0], 0, pipeWidth, pipe[1]);
            ctx.drawImage(img, 432 + pipeWidth, 108, pipeWidth, canvas.height - pipe[1] + pipeGap, pipe[0], pipe[1] + pipeGap, pipeWidth, canvas.height - pipe[1] + pipeGap);

            if(pipe[0] <= -pipeWidth) {
                currentScore++;
                bestScore = Math.max(bestScore, currentScore);
                pipes = [...pipes.slice(1), [pipes[pipes.length-1][0] + pipeGap + pipeWidth, pipeLoc()]];
            }
        
            if ([pipe[0] <= cTenth + size[0], pipe[0] + pipeWidth >= cTenth, pipe[1] > flyHeight || pipe[1] + pipeGap < flyHeight + size[1]].every(elem => elem)) {
                const userId = window.Telegram.WebApp.initDataUnsafe.user.id;
                fetch('https://snowtalkchat.com/api/scores', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ user_id: userId, score: currentScore }),
                })
                .then(response => response.json())
                .then(data => console.log(data.message))
                .catch(error => console.error('Error:', error));
                gamePlaying = false;
                setup();
            }
        });

        if (autoMode) {
            const closestPipe = pipes.reduce((closest, pipe) => {
                const distance = pipe[0] - cTenth;
                return (distance > 0 && distance < closest.distance) 
                    ? { distance, gapTop: pipe[1], gapBottom: pipe[1] + pipeGap } 
                    : closest;
            }, { distance: Infinity });

            if (closestPipe.distance < 200) {
                const gapCenter = (closestPipe.gapTop + closestPipe.gapBottom) / 2;
                flyHeight += (gapCenter - flyHeight) * 0.1;
            }
        } else {
            flight += gravity;
            flyHeight = Math.min(flyHeight + flight, canvas.height - size[1]);
        }

        ctx.drawImage(img, 590, Math.floor((index % 9) / 3) * size[1], ...size, cTenth, flyHeight, ...size);
    } else {
        ctx.drawImage(img, 590, Math.floor((index % 9) / 3) * size[1], ...size, ((canvas.width / 2) - size[0] / 2), flyHeight, ...size);
        flyHeight = (canvas.height / 2) - (size[1] / 2);
        
        ctx.font = "bold 30px courier";
        ctx.fillText(`Best score : ${bestScore}`, 85, 245);
        ctx.fillText('Click to play', 90, 535);        
    }
    
    drawScoreCentered(currentScore, 60);
}

setup();
img.onload = () => window.requestAnimationFrame(render);

document.addEventListener('click', () => {
    gamePlaying = true;
    autoMode = false;
});

document.addEventListener('touchstart', (e) => {
    e.preventDefault();
    flight = jump;
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'VolumeUp') {
        autoMode = !autoMode;
        console.log('Auto mode:', autoMode);
    }
});
