const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const img = new Image();
img.src = "flappy-bird-set.png";

// General settings
let gamePlaying = false;
const gravity = 0.5;
const speed = 6.2;
const size = [50, 48];
// Her rakamın genişliği ve yüksekliği (örnek: 50x44)
const digitWidth = 29;
const digitHeight = 40;

const jump = -11.5;
const cTenth = (canvas.width / 10);
let autoMode = false; // Auto mode boolean

let index = 0,
    bestScore = 0, 
    flight, 
    flyHeight, 
    currentScore, 
    pipes;

// Pipe settings
const pipeWidth = 78;
const pipeGap = 270;
const pipeLoc = () => (Math.random() * ((canvas.height - (pipeGap + pipeWidth)) - pipeWidth)) + pipeWidth;

// Puanı ekranda ortalamak için bir fonksiyon
function drawScoreCentered(score, y) {
    const scoreStr = score.toString();  // Puanı string'e çevir
    const totalWidth = scoreStr.length * digitWidth;  // Puanın toplam genişliği (her rakam genişliği * rakam sayısı)
    const startX = (canvas.width - totalWidth) / 2;  // Ekranın ortasında başlamak için X pozisyonu

    // Her rakamı tek tek çiz
    for (let i = 0; i < scoreStr.length; i++) {
        const digit = parseInt(scoreStr[i]);  // Her rakamı al
        const spriteX = 648 + digit * digitWidth;   // Sprite sheet'teki x konumunu hesapla
        ctx.drawImage(img, spriteX, 0, digitWidth, digitHeight, startX + (i * digitWidth), y, digitWidth, digitHeight);
    }
}

const setup = () => {
    currentScore = 0;
    flight = jump;

    // Set initial flyHeight (middle of screen - size of the bird)
    flyHeight = (canvas.height / 2) - (size[1] / 2);

    // Setup first 3 pipes
    pipes = Array(3).fill().map((a, i) => [canvas.width + (i * (pipeGap + pipeWidth)), pipeLoc()]);
}

const render = () => {
    index++;

    // Background first part 
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height, -((index * (speed / 2)) % canvas.width) + canvas.width, 0, canvas.width, canvas.height);
    // Background second part
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height, -(index * (speed / 2)) % canvas.width, 0, canvas.width, canvas.height);
  
    // Pipe display
    if (gamePlaying){
        pipes.forEach(pipe => {
            pipe[0] -= speed;

            // Top pipe
            ctx.drawImage(img, 432, 588 - pipe[1], pipeWidth, pipe[1], pipe[0], 0, pipeWidth, pipe[1]);
            // Bottom pipe
            ctx.drawImage(img, 432 + pipeWidth, 108, pipeWidth, canvas.height - pipe[1] + pipeGap, pipe[0], pipe[1] + pipeGap, pipeWidth, canvas.height - pipe[1] + pipeGap);

            if(pipe[0] <= -pipeWidth){
                currentScore++;
                bestScore = Math.max(bestScore, currentScore);
                pipes = [...pipes.slice(1), [pipes[pipes.length-1][0] + pipeGap + pipeWidth, pipeLoc()]];
            }
        
            // If hit the pipe, end
            if ([pipe[0] <= cTenth + size[0], pipe[0] + pipeWidth >= cTenth, pipe[1] > flyHeight || pipe[1] + pipeGap < flyHeight + size[1]].every(elem => elem)) {
                const userId = window.Telegram.WebApp.initDataUnsafe.user.id; // Telegram'dan user_id'yi al
                fetch('https://snowtalkchat.com/api/scores', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ user_id: userId, score: currentScore }),
                })
                .then(response => response.json())
                .then(data => console.log(data.message))
                .catch(error => console.error('Error:', error));
                gamePlaying = false;
                setup();
            }
        });
    }

    // Draw bird
    if (gamePlaying) {
        if (autoMode) {
            // Auto mode: move towards the gap between the pipes
            const closestPipe = pipes.reduce((closest, pipe) => {
                const distance = pipe[0] - cTenth;
                return (distance > 0 && distance < closest.distance) 
                    ? { distance, gapTop: pipe[1], gapBottom: pipe[1] + pipeGap } 
                    : closest;
            }, { distance: Infinity });

            if (closestPipe.distance < 200) { // Adjust this value to control responsiveness
                const gapCenter = (closestPipe.gapTop + closestPipe.gapBottom) / 2;
                flyHeight += (gapCenter - flyHeight) * 0.1; // Move toward the gap center
            }
        } else {
            // Normal mode: update the flight dynamics
            flight += gravity;
            flyHeight = Math.min(flyHeight + flight, canvas.height - size[1]);
        }

        // Draw the bird only once
        ctx.drawImage(img, 590, Math.floor((index % 9) / 3) * size[1], ...size, cTenth, flyHeight, ...size);
    } else {
        ctx.drawImage(img, 590, Math.floor((index % 9) / 3) * size[1], ...size, ((canvas.width / 2) - size[0] / 2), flyHeight, ...size);
        flyHeight = (canvas.height / 2) - (size[1] / 2);
        
        ctx.font = "bold 30px courier";
        ctx.fillText(`Best score : ${bestScore}`, 85, 245);
        ctx.fillText('Click to play', 90, 535);        
    }
    
    drawScoreCentered(currentScore, 60);  // 60, Y pozisyonu (örneğin 60 piksel aşağıda göster)

    window.requestAnimationFrame(render);
}

// Launch setup
setup();
img.onload = render;

// Start game
document.addEventListener('click', () => {
    gamePlaying = true;
    autoMode = false; // Set auto mode to false when starting the game
});
document.addEventListener('touchstart', (e) => {
    e.preventDefault();
    flight = jump;
});

// Toggle auto mode with a key press (for example, the "A" key)
document.addEventListener('keydown', (e) => {
    if (e.key === 'a') {
        autoMode = !autoMode; // Toggle auto mode
    }
});
