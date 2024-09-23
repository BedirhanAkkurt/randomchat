document.addEventListener('DOMContentLoaded', () => {
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.ready();

        const walletInfo = document.getElementById('walletInfo');

        // TON Connect UI'yi burada başlatın
        const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
            manifestUrl: 'https://raw.githubusercontent.com/BedirhanAkkurt/randomchat/refs/heads/main/tonconnect-manifest.json',
            buttonRootId: 'ton-connect'
        });

        // Yönlendirme ayarları
        tonConnectUI.uiOptions = {
            twaReturnUrl: 'https://t.me/YOUR_APP_NAME'
        };

        // Cüzdanı bağlama fonksiyonu
        async function connectToWallet() {
            try {
                const connectedWallet = await tonConnectUI.connectWallet();
                console.log(connectedWallet);
                walletInfo.innerHTML = `
                    <p>Wallet connected!</p>
                    <p>Address: ${connectedWallet.address}</p>
                `;
                // Kullanıcı cüzdanı bağlandıktan sonra yönlendir
                window.location.href = tonConnectUI.uiOptions.twaReturnUrl;
            } catch (error) {
                console.error("Error connecting to wallet:", error);
            }
        }

        // İşlem gönderme fonksiyonu
        async function sendTransaction() {
            const transaction = {
                messages: [
                    {
                        address: "UQAJLzGdXo1ux3E67PbeCZfKt1ZsIdkX_2iZNMU3JlwHbcYM", // Hedef adres
                        amount: "20000000" // Toncoin nanotons cinsinden
                    }
                ]
            };

            try {
                const result = await tonConnectUI.sendTransaction(transaction);
                console.log(result);
                alert("Transaction sent!");
            } catch (error) {
                console.error("Error sending transaction:", error);
            }
        }

        // Event listener ekleme
        document.getElementById('ton-connect').addEventListener('click', connectToWallet);
        document.getElementById('sendTransaction').addEventListener('click', sendTransaction);
        
        // Telegram kullanıcı bilgilerini alma
        const user = window.Telegram.WebApp.initDataUnsafe?.user;
        if (user) {
            walletInfo.innerHTML = `
                <p>Connected as: ${user.first_name} ${user.last_name || ''}</p>
                <p>Username: ${user.username || 'N/A'}</p>
            `;
        } else {
            walletInfo.innerHTML = `<p>No user information found.</p>`;
        }

    } else {
        console.error("Telegram WebApp is not defined.");
    }
});
