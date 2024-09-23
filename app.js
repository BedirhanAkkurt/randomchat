// Telegram Web App SDK kullanımı
window.Telegram.WebApp.ready();

// Bağlantı durumu ve mesaj gönderme
const connectBtn = document.getElementById('connectBtn');
const walletInfo = document.getElementById('walletInfo');

// Wallet butonuna tıklama işlemi
connectBtn.addEventListener('click', () => {
    // Telegram kullanıcı bilgilerini al
    const user = window.Telegram.WebApp.initDataUnsafe?.user;

    // Kullanıcı bilgilerini göster
    if (user) {
        walletInfo.innerHTML = `
            <p>Connected as: ${user.first_name} ${user.last_name || ''}</p>
            <p>Username: ${user.username || 'N/A'}</p>
        `;
    } else {
        walletInfo.innerHTML = `<p>No user information found.</p>`;
    }
});
