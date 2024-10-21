    // Canvas ve konteks ayarları
    const canvas = document.getElementById('perspectiveCanvas');
    const ctx = canvas.getContext('2d');

    ctx.imageSmoothingEnabled = false;
    // Sprite'ı yükle
    const sprite = new Image();
    sprite.src = 'floating.png'; // Doğru dosya yolunu buraya ekleyin

    // Kare bilgileri
    const frameWidth = 160; // Her bir frame'in genişliği sabit (160px)
    const frameHeight = 40; // Her bir frame'in yüksekliği sabit (40px)
    const totalFrames = 4; // Toplam 4 frame var
    let currentFrame = 0; // Animasyonun başladığı kare

    // Frame'ler arası hız (ms cinsinden)
    const frameDuration = 100; // Her karede 200ms kalacak
    let lastUpdateTime = 0;

    // Hata ayıklama için sprite yüklendi mi kontrolü
    sprite.onload = function() {
        console.log("Sprite başarıyla yüklendi.");
        requestAnimationFrame(animate); // Animasyonu başlat
    };

    sprite.onerror = function() {
        console.log("Sprite yüklenemedi. Lütfen yolun doğru olduğundan emin olun.");
    };

    // Animasyon fonksiyonu
    function animate(time) {
        // Zamanı kontrol et (her frameDuration ms'de bir frame değiştir)
        if (time - lastUpdateTime > frameDuration) {
            lastUpdateTime = time;

            // Canvas'ı temizle
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Şu anki kareyi sprite'tan çiz
            ctx.drawImage(
                sprite, 
                0, // X koordinatı sabit kalacak
                currentFrame * frameHeight, // Frame'lerin Y koordinatını ayarla (alt alta)
                frameWidth, 
                frameHeight, 
                0, 
                0, 
                frameWidth, 
                frameHeight
            );

            // Frame'i değiştir
            currentFrame = (currentFrame + 1) % totalFrames;
        }

        // Bir sonraki animasyon karesi için tekrar çağır
        requestAnimationFrame(animate);
    }