document.addEventListener('DOMContentLoaded', () => {
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.ready();

        const walletInfo = document.getElementById('walletInfo');

        document.getElementById('ton-connect').addEventListener('click', async () => {
            const user = window.Telegram.WebApp.initDataUnsafe?.user;

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
});
