const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gridSize = 80; // Kare boyutu 40x40 piksel
const playerSize = gridSize - 8; // Karakter boyutu 36x36 piksel
let playerX = 80; // Başlangıç pozisyonu
let playerY = 240;
let moveX = 0;
let moveY = 0;
let isMoving = false; // Karakter hareket halinde mi?

let score = 0;
let level = 1;

const stars = [];
const starCount = 100;

// Yıldızların bilgilerini tutan bir obje oluşturalım
class Star {
    constructor(x, y, radius, alpha, fadeSpeed) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.alpha = alpha;
        this.fadeSpeed = fadeSpeed; // Ne kadar hızlı fade in ve fade out olacak
        this.fadeDirection = 1; // 1 = fade in, -1 = fade out
    }

    // Yıldızın opaklığını güncelle
    update() {
        this.alpha += this.fadeSpeed * this.fadeDirection;
        if (this.alpha >= 1) { // Tamamen opak olursa geri fade out yap
            this.fadeDirection = -1;
        } else if (this.alpha <= 0) { // Tamamen şeffaf olursa tekrar fade in yap
            this.fadeDirection = 1;
        }
    }

    // Yıldızı canvas'a çiz
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(250, 218, 193, ${this.alpha})`; // Yıldızın rengi, alpha ile transparanlığı ayarla
        ctx.fill();
        ctx.closePath();
    }
}



// Farklı haritalar
const maps = [
    [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 0, 2, 0, 0, 0, 0, 0, 0],
        [0, 1, 0, 1, 1, 1, 0, 0, 0, 0],
        [0, 1, 0, 0, 0, 1, 0, 1, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ],
    [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 2, 1, 1, 1, 0, 1, 1, 0],
        [0, 0, 0, 1, 0, 1, 0, 0, 1, 0],
        [0, 1, 1, 1, 0, 1, 1, 1, 1, 0],
        [0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 0, 1, 0],
        [0, 0, 0, 0, 0, 0, 1, 0, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 0, 0, 1, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ],
];

// Rastgele harita seç
let currentMap = maps[Math.floor(Math.random() * maps.length)];

const finishPoint = { x: 80, y: 800 }; // Bitirme noktası

// Tuş kontrolü
document.addEventListener('keydown', (e) => {
    if (!isMoving) { // Hareket etmiyorsa bir yön seç
        if (e.key === 'ArrowUp') {
            moveX = 0;
            moveY = -1;
            isMoving = true;
        } else if (e.key === 'ArrowDown') {
            moveX = 0;
            moveY = 1;
            isMoving = true;
        } else if (e.key === 'ArrowLeft') {
            moveX = -1;
            moveY = 0;
            isMoving = true;
        } else if (e.key === 'ArrowRight') {
            moveX = 1;
            moveY = 0;
            isMoving = true;
        }
    }
});

// Başlangıç fonksiyonu: Sayfa ilk açıldığında çağrılır
function initializeCanvas() {
    // Rastgele yıldızlar oluştur
    for (let i = 0; i < starCount; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const radius = Math.random() * 2 + 1;
        const alpha = Math.random(); // Rastgele başlangıç opaklığı
        const fadeSpeed = Math.random() * 0.02 + 0.01; // Rastgele fade hızı (0.01 - 0.03 arasında)

        stars.push(new Star(x, y, radius, alpha, fadeSpeed));
    }
    setStartAndFinishPoints();
}
// Başlangıç ve bitiş noktalarını ayarla
function setStartAndFinishPoints() {
    for (let row = 0; row < currentMap.length; row++) {
        for (let col = 0; col < currentMap[row].length; col++) {
            if (currentMap[row][col] === 2) {
                playerX = col * gridSize; // Başlangıç pozisyonu
                playerY = row * gridSize;
            } else if (currentMap[row][col] === 3) {
                finishPoint.x = col * gridSize; // Bitiş noktası
                finishPoint.y = row * gridSize;
            }
        }
    }
}
// Yıldız Animasyonu başlat
function animate() {
    // Canvas'ı temizle
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Arka planı çiz
    ctx.fillStyle = '#fadac1';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Ortadaki kutuyu çiz (#1d313c renkli, 500x500px, border-radius 25px)
    const boxWidth = 720;
    const boxHeight = 1000;
    const boxX = (canvas.width - boxWidth) / 2;
    const boxY = (canvas.height - boxHeight) / 2;

    ctx.fillStyle = '#1d313c';
    ctx.beginPath();
    ctx.moveTo(boxX + 25, boxY);
    ctx.lineTo(boxX + boxWidth - 25, boxY);
    ctx.quadraticCurveTo(boxX + boxWidth, boxY, boxX + boxWidth, boxY + 25);
    ctx.lineTo(boxX + boxWidth, boxY + boxHeight - 25);
    ctx.quadraticCurveTo(boxX + boxWidth, boxY + boxHeight, boxX + boxWidth - 25, boxY + boxHeight);
    ctx.lineTo(boxX + 25, boxY + boxHeight);
    ctx.quadraticCurveTo(boxX, boxY + boxHeight, boxX, boxY + boxHeight - 25);
    ctx.lineTo(boxX, boxY + 25);
    ctx.quadraticCurveTo(boxX, boxY, boxX + 25, boxY);
    ctx.closePath();
    ctx.fill();

    // Yıldız animasyonunu çiz
    stars.forEach(star => {
        star.update();
        star.draw();
    });


    // Create gradient 
    const gradient = ctx.createLinearGradient(0, 175, 0, 0);
    gradient.addColorStop("0", "#c53b39");
    gradient.addColorStop("0.3", "#c53b39");
    gradient.addColorStop("0.3", "#f8733a"); //sarı başlama
    gradient.addColorStop("0.325", "#f8733a"); //sarı bitme
    gradient.addColorStop("0.325", "#c53b39"); 
    gradient.addColorStop("0.375", "#c53b39"); 
    gradient.addColorStop("0.375", "#f8733a");//sarı başlama
    gradient.addColorStop("0.415", "#f8733a");//sarı bitme
    gradient.addColorStop("0.415", "#c53b39"); 
    gradient.addColorStop("0.445", "#c53b39"); 
    gradient.addColorStop("0.445", "#f8733a");//sarı başlama
    gradient.addColorStop("0.495", "#f8733a");//sarı bitme
    gradient.addColorStop("0.495", "#c53b39"); 
    gradient.addColorStop("0.515", "#c53b39"); 
    gradient.addColorStop("0.515", "#f8733a");//sarı başlama    
    gradient.addColorStop("1.0", "#f8733a");
    ctx.fillStyle = gradient;
    ctx.font = "120pt 'Squada One'";
    ctx.fillText('ASTROPATH', 75, 140);



    ctx.strokeStyle = '#fadac1';
    ctx.lineWidth = 3;
    ctx.strokeText('ASTROPATH', 75, 140);
    ctx.fill();
    ctx.stroke();


    // Animasyonun devam etmesi için requestAnimationFrame çağrısı yap
    requestAnimationFrame(animate);
}

// Oyun döngüsü
function gameLoop() {

    // Haritayı çiz
    for (let row = 0; row < currentMap.length; row++) {
        for (let col = 0; col < currentMap[row].length; col++) {
            if (currentMap[row][col] !== 0) {
                ctx.fillStyle = '#f8733a'; // Hafif şeffaf beyaz
                ctx.fillRect(col * gridSize, row * gridSize, gridSize, gridSize);

                // Duvarların kenarlarını çiz
                ctx.strokeStyle = '#fadac1'; // Açık gri kenar
                ctx.lineWidth = 8;
                ctx.strokeRect(col * gridSize, row * gridSize, gridSize, gridSize);
            }
        }
    }

    // Eğer hareket ediyorsa duvara kadar git
    if (isMoving) {
        const newPlayerX = playerX + moveX * gridSize;
        const newPlayerY = playerY + moveY * gridSize;

        const newCol = Math.floor(newPlayerX / gridSize);
        const newRow = Math.floor(newPlayerY / gridSize);

        // Yeni pozisyonda duvar yoksa (1 ise) hareket etmeye devam et
        if (currentMap[newRow] && currentMap[newRow][newCol] !== 0) {
            playerX = newPlayerX;
            playerY = newPlayerY;
        } else {
            // Duvara çarptıysa dur
            isMoving = false;
        }
    }


    // Karakteri çiz
    ctx.fillStyle = '#c53b39';
    ctx.fillRect(playerX + 4, playerY + 4, playerSize, playerSize);

    // Bitirme noktasını çiz
    ctx.fillStyle = '#50a3ab';
    ctx.fillRect(finishPoint.x + 4, finishPoint.y + 4, gridSize - 8, gridSize - 8);

    // Eğer oyuncu bitiş noktasına ulaştıysa
    if (playerX === finishPoint.x && playerY === finishPoint.y) {
        alert("Bölümü tamamladın!");
        resetGame(); // Yeni bölümü başlat
    }

    requestAnimationFrame(gameLoop);
}

// Oyunu sıfırla (yeni harita)
function resetGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    currentMap = maps[Math.floor(Math.random() * maps.length)]; // Yeni rastgele harita seç
    setStartAndFinishPoints();
    isMoving = false; // Hareketi durdur

    score += 100; // Her bölüm tamamlandığında 100 puan ekle
    level++; // Bölüm sayısını arttır
    //updateScoreDisplay(); // Skoru ekrana güncelle
}

function updateScoreDisplay() {
    document.getElementById('scoreDisplay').textContent = `Skor: ${score} | Bölüm: ${level}`;
}

let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

document.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
});

document.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleSwipeGesture();
});

function handleSwipeGesture() {
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    if (!isMoving) {
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // Yatay hareket (sol-sağ)
            if (deltaX > 0) {
                // Sağ kaydırma
                moveX = 1;
                moveY = 0;
                isMoving = true;
            } else {
                // Sol kaydırma
                moveX = -1;
                moveY = 0;
                isMoving = true;
            }
        } else {
            // Dikey hareket (yukarı-aşağı)
            if (deltaY > 0) {
                // Aşağı kaydırma
                moveX = 0;
                moveY = 1;
                isMoving = true;
            } else {
                // Yukarı kaydırma
                moveX = 0;
                moveY = -1;
                isMoving = true;
            }
        }
    }
}

function findPath(start, end) {
    const openSet = [start]; // Keşfedilecek noktalar
    const cameFrom = new Map(); // Hangi noktadan gelindiğini saklar

    const gScore = new Map(); // Başlangıçtan şu ana kadar olan maliyet
    const fScore = new Map(); // Başlangıçtan hedefe olan tahmini maliyet

    gScore.set(`${start.x},${start.y}`, 0);
    fScore.set(`${start.x},${start.y}`, heuristic(start, end));

    while (openSet.length > 0) {
        // En düşük fScore'ya sahip noktayı bul
        let current = openSet.reduce((prev, curr) => 
            (fScore.get(`${curr.x},${curr.y}`) < fScore.get(`${prev.x},${prev.y}`) ? curr : prev)
        );

        // Eğer hedefe ulaştıysak, yolu geri döndür
        if (current.x === end.x && current.y === end.y) {
            return reconstructPath(cameFrom, current);
        }

        // Aktif noktayı açık kümeden çıkar
        openSet.splice(openSet.indexOf(current), 1);

        // Komşu noktaları kontrol et
        for (let direction of [{x: 0, y: -1}, {x: 0, y: 1}, {x: -1, y: 0}, {x: 1, y: 0}]) {
            let neighbor = {x: current.x + direction.x, y: current.y + direction.y};

            // Haritada geçerli mi kontrol et
            if (currentMap[neighbor.y] && currentMap[neighbor.y][neighbor.x] !== 0) {
                let tentativeGScore = gScore.get(`${current.x},${current.y}`) + 1;

                if (!gScore.has(`${neighbor.x},${neighbor.y}`) || tentativeGScore < gScore.get(`${neighbor.x},${neighbor.y}`)) {
                    // Bu yoldan geldiği noktayı sakla
                    cameFrom.set(`${neighbor.x},${neighbor.y}`, current);

                    gScore.set(`${neighbor.x},${neighbor.y}`, tentativeGScore);
                    fScore.set(`${neighbor.x},${neighbor.y}`, tentativeGScore + heuristic(neighbor, end));

                    if (!openSet.includes(neighbor)) {
                        openSet.push(neighbor);
                    }
                }
            }
        }
    }

    return []; // Yol bulunamadı
}

function heuristic(a, b) {
    // Manhattan mesafesi
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function reconstructPath(cameFrom, current) {
    const totalPath = [current];
    while (cameFrom.has(`${current.x},${current.y}`)) {
        current = cameFrom.get(`${current.x},${current.y}`);
        totalPath.unshift(current);
    }
    return totalPath;
}

function autoPlay() {
    const start = {x: playerX / gridSize, y: playerY / gridSize};
    const end = {x: finishPoint.x / gridSize, y: finishPoint.y / gridSize};

    const path = findPath(start, end);

    if (path.length > 0) {
        // İlk adıma git
        const nextStep = path[1]; // İlk adım, ikinci eleman
        playerX = nextStep.x * gridSize;
        playerY = nextStep.y * gridSize;
        setTimeout(autoPlay, 100); // Her adımda 200ms bekleyerek tekrar çağır
    }
}

//autoPlay();

document.fonts.ready.then(initializeCanvas);
animate();
gameLoop(); // Oyun döngüsünü başlat
