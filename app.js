document.addEventListener('DOMContentLoaded', () => {
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.ready();

        const walletInfo = document.getElementById('walletInfo');

        // TON Connect UI'yi başlatın
        if (typeof TON_CONNECT_UI !== 'undefined' && typeof TON_CONNECT_UI.TonConnectUI !== 'undefined') {
            console.log("TonConnectUI loaded correctly.");

            const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
                manifestUrl: 'https://raw.githubusercontent.com/BedirhanAkkurt/randomchat/refs/heads/main/tonconnect-manifest.json',
                buttonRootId: 'ton-connect'
            });

            // Yönlendirme ayarları
            tonConnectUI.uiOptions = {
                twaReturnUrl: 'https://t.me/YOUR_APP_NAME'
            };

            // Cüzdan bağlantısı fonksiyonu
            async function connectToWallet() {
                try {
                    const connectedWallet = await tonConnectUI.connectWallet();
                    console.log('Connected Wallet:', connectedWallet);

                    // Kullanıcının ton_proof verisini backend'e POST etmek
                    const tonProof = await tonConnectUI.getWalletState(); // Bu aşamada ton_proof alınır
                    console.log('Ton Proof:', tonProof);

                    // ton_proof'u backend'e gönder
                    const response = await fetch('https://git.heroku.com/flakesrandomchat.git', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            wallet: {
                                address: connectedWallet.address,
                                walletStateInit: connectedWallet.walletStateInit,
                            },
                            proof: tonProof.proof
                        })
                    });

                    const result = await response.json();

                    if (response.ok) {
                        console.log('Verification successful:', result);
                        alert('Verification successful, token: ' + result.token);
                    } else {
                        console.error('Verification failed:', result);
                        alert('Verification failed: ' + result.message);
                    }

                } catch (error) {
                    console.error("Error connecting to wallet:", error);
                    alert("Error connecting to wallet: " + error.message);
                }
            }

            // İşlem gönderme fonksiyonu
            async function sendTransaction() {
                const transaction = {
                    messages: [
                        {
                            address: "UQAJLzGdXo1ux3E67PbeCZfKt1ZsIdkX_2iZNMU3JlwHbcYM", // Hedef adres
                            amount: "10000000" // Toncoin nanotons cinsinden
                        }
                    ]
                };

                try {
                    const result = await tonConnectUI.sendTransaction(transaction);
                    console.log(result);
                    alert("Transaction sent!");
                } catch (error) {
                    console.error("Error sending transaction:", error);
                    alert("Transaction failed: " + error.message); // Hata mesajını göster
                }
            }

            // Event listener ekleme
            const connectBtn = document.getElementById('connectBtn');
            if (connectBtn) {
                connectBtn.addEventListener('click', connectToWallet);
            } else {
                console.error("Connect button not found in DOM.");
            }

            const sendTransactionBtn = document.getElementById('sendTransaction');
            if (sendTransactionBtn) {
                sendTransactionBtn.addEventListener('click', sendTransaction);
            } else {
                console.error("Send Transaction button not found in DOM.");
            }

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
            console.error("TonConnectUI is not loaded.");
        }
    } else {
        console.error("Telegram WebApp is not defined.");
    }
});
