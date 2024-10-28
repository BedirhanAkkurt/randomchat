document.addEventListener('DOMContentLoaded', () => {
    window.Telegram.WebApp.ready();
    window.Telegram.WebApp.expand();
    window.Telegram.WebApp.disableVerticalSwipes();
    window.Telegram.WebApp.setHeaderColor("#000000");
})

const scrollContainer = document.getElementById('ScrollableContainer');
const dots = document.querySelectorAll('.dot');
const contentItems = document.querySelectorAll('.ContentItem');

function updateScrollDots() {
    const scrollLeft = scrollContainer.scrollLeft;
    const containerWidth = scrollContainer.clientWidth;
    const totalWidth = scrollContainer.scrollWidth;
    const activeIndex = Math.round(scrollLeft / containerWidth);

    dots.forEach((dot, index) => {
        dot.classList.remove('active'); // Önce tüm noktaların aktifliğini kaldır
        if (index === activeIndex) {
            dot.classList.add('active'); // Aktif olanı yeniden ayarla
        }
    });
}

scrollContainer.addEventListener('scroll', updateScrollDots);

function updateMaxWidth() {
    const coverImage = document.getElementById('coverImage');
    const coverImageWidth = coverImage.clientWidth; // Kapak resminin genişliğini alır
    const otherElements = document.querySelectorAll('#ContentItem, .tasks-header, .tasks-area, .tasks-subheader, .altmenu');
    
    // Diğer elemanların max-width değerini kapak resmine göre ayarlar
    otherElements.forEach(element => {
        element.style.maxWidth = `${coverImageWidth}px`;
    });
}

// Sayfa yüklendiğinde ve pencere boyutu değiştiğinde çalıştır
window.addEventListener('load', updateMaxWidth);
window.addEventListener('resize', updateMaxWidth);

const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
    manifestUrl: 'https://raw.githubusercontent.com/BedirhanAkkurt/randomchat/refs/heads/main/tonconnect-manifest.json',
    buttonRootId: 'ton-connect'
});

document.querySelectorAll('.altmenu button').forEach((button) => {
    button.addEventListener('click', () => {
        // İlk olarak tüm butonların resmini varsayılan haline döndür
        document.querySelectorAll('.altmenu button img').forEach((img) => {
            const originalSrc = img.src.replace('_Selected', ''); // Seçili durumu kaldır
            img.src = originalSrc;
        });

        // Tıklanan butonun resmini seçili hale getir
        const img = button.querySelector('img');
        if (!img.src.includes('_Selected')) {
            img.src = img.src.replace(/(\.\w+)$/, '_Selected$1'); // Dosya adının sonuna _Selected ekle
        }
    });
});
