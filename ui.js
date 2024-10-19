const uiCanvas = document.getElementById("uiCanvas");
const uiCtx = uiCanvas.getContext("2d");

const buttonWidth = 120; // Her bir butonun genişliği
const buttonHeight = 120; // Her bir butonun yüksekliği
const buttonMargin = 48; // Butonlar arası boşluk

const starsUI = [];
// Yıldızların bilgilerini tutan bir obje oluşturalım
class UIStar {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
    }

    // Yıldızı canvas'a çiz
    draw() {
        uiCtx.beginPath();
        uiCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        uiCtx.fillStyle = `rgba(250, 218, 193, 1)`;
        uiCtx.fill();
        uiCtx.closePath();
    }
}

function animate() {
    // Canvas'ı temizle
    uiCtx.clearRect(0, 0, uiCanvas.width, uiCanvas.height);

    // Arkaplanı çiz
    uiCtx.fillStyle = '#fadac1';
    uiCtx.fillRect(0, 0, uiCanvas.width, uiCanvas.height);

    const boxWidth = 720;
    const boxHeight = 200;
    const boxX = (uiCanvas.width - boxWidth) / 2;
    const boxY = (uiCanvas.height - boxHeight) / 2;

    // Çerçeve çizimi
    uiCtx.fillStyle = '#1d313c';
    uiCtx.beginPath();
    uiCtx.moveTo(boxX + 25, boxY);
    uiCtx.lineTo(boxX + boxWidth - 25, boxY);
    uiCtx.quadraticCurveTo(boxX + boxWidth, boxY, boxX + boxWidth, boxY + 25);
    uiCtx.lineTo(boxX + boxWidth, boxY + boxHeight - 25);
    uiCtx.quadraticCurveTo(boxX + boxWidth, boxY + boxHeight, boxX + boxWidth - 25, boxY + boxHeight);
    uiCtx.lineTo(boxX + 25, boxY + boxHeight);
    uiCtx.quadraticCurveTo(boxX, boxY + boxHeight, boxX, boxY + boxHeight - 25);
    uiCtx.lineTo(boxX, boxY + 25);
    uiCtx.quadraticCurveTo(boxX, boxY, boxX + 25, boxY);
    uiCtx.closePath();
    uiCtx.fill();

    for (let i = 0; i < 20; i++) {
        const x = Math.random() * uiCanvas.width;
        const y = Math.random() * uiCanvas.height;
        const radius = Math.random() * 2 + 1;

        starsUI.push(new UIStar(x, y, radius));
    }

    // Tüm yıldızları çiz
    for (const star of starsUI) {
        star.draw();
    }

    // Tuşları çiz
    const buttonY = boxY + (boxHeight - buttonHeight) / 2; // Tuşların Y konumu
    for (let i = 0; i < 4; i++) {
        const buttonX = boxX + (buttonWidth + buttonMargin) * i + buttonMargin; // Tuşun X konumu
    
        // Daire butonun içi
        const centerX = buttonX + buttonWidth / 2; // Daire merkezinin X konumu
        const centerY = buttonY + buttonHeight / 2; // Daire merkezinin Y konumu
        const radius = buttonWidth / 2; // Dairenin yarıçapı
    
        uiCtx.fillStyle = '#c53b39'; // Buton rengi
        uiCtx.beginPath();
        uiCtx.arc(centerX, centerY, radius, 0, Math.PI * 2); // Daireyi çiz
        uiCtx.fill();
        uiCtx.closePath();
    
        // Butonun yazısı
        uiCtx.fillStyle = '#ffffff'; // Yazı rengi
        uiCtx.font = '30pt Squada One';
        uiCtx.textAlign = 'center';
        uiCtx.textBaseline = 'middle';
        uiCtx.fillText(`MENU ${i + 1}`, centerX, centerY); // Daire merkezinde yazıyı çiz
    }
}

document.fonts.ready.then(animate);
