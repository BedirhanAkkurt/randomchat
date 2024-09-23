// Telegram Web App SDK kullanımı
window.onload = () => {
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.ready();

        // Bağlantı durumu ve mesaj gönderme
        const walletInfo = document.getElementById('walletInfo');

        // Wallet butonuna tıklama işlemi
        document.getElementById('ton-connect').addEventListener('click', async () => {
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
    } else {
        console.error("Telegram WebApp is not defined.");
    }
};
