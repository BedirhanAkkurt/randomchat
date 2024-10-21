
window.addEventListener('load', adjustLayout);
window.addEventListener('resize', adjustLayout);
function adjustLayout() {
    const altmenu = document.querySelector('.altmenu-container');
    const mainPage = document.querySelector('.main-page');
    // Menü yüksekliğini hesapla
    const altmenuHeight = altmenu.offsetHeight;
    // Ana sayfa yüksekliğini ayarla
    mainPage.style.height = `calc(100vh - ${altmenuHeight}px)`;
}