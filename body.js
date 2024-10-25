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
    const otherElements = document.querySelectorAll('#ContentItem, .tasks-header, .tasks-area, .tasks-subheader');
    
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

