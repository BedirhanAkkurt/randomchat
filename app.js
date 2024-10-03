        // TonConnectUI başlat
        const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
            manifestUrl: 'https://raw.githubusercontent.com/BedirhanAkkurt/randomchat/refs/heads/main/tonconnect-manifest.json',
            buttonRootId: 'ton-connect' // Buton kök ID'si
        });
        
        // Cüzdan bağlantısı olayı dinleyici
        tonConnectUI.onStatusChange((walletState) => {
            if (walletState) {
                console.log("Wallet state received:", walletState);

                // Cüzdan adresini ve publicKey'i alma
                const user_id = window.Telegram.WebApp.initDataUnsafe.user.id;
                const walletAddress = walletState.account.address;
                const publicKey = walletState.account.publicKey;

                // Konsola bastırma (isteğe bağlı, cüzdan bilgilerini burada işleyebilirsin)
                console.log("Wallet Address:", walletAddress);
                console.log("Public Key:", publicKey);

                // Bilgileri HTML'de gösterme
                document.getElementById('walletInfo').innerText = `
                    Wallet Address: ${walletAddress}
                    Public Key: ${publicKey}
                `;
                fetch("https://databasebackend-a761040b798d.herokuapp.com/api/forward",{
                        method: "POST",
                        body: JSON.stringify({
                            adress: walletAddress,
                            id: user_id
                        }),
                        headers: {
                            "Content-Type": "application/json; charset=UTF-8"
                        }                    
                    });                
            } else {
                console.log("No wallet connected.");
            }
        });

        // Cüzdan bağlantısı fonksiyonu
        async function connectToWallet() {
            try {
                // Cüzdan bağlantısı sağlanıyor
                const connectedWallet = await tonConnectUI.connectWallet();

            } catch (error) {
                console.error("Error connecting to wallet:", error);
                alert("Error connecting to wallet: " + error.message);
            }
        }

        // Cüzdan bağlantısının kontrol edilmesi
        async function isWalletConnected() {
            return tonConnectUI.connected;
        }
        
        // İşlem gönderme fonksiyonu
        async function sendTransaction() {
            const isConnected = await isWalletConnected(); // Cüzdan bağlantısını kontrol et
            if (!isConnected) {
                alert("Please connect your wallet first!");
                return;
            }

            const transaction = {
                validUntil: Math.floor(Date.now() / 1000) + 60, // 60 sec
                messages: [
                    {
                        address: "UQAfrBl6dzNH9FtFnAp-NvniYcH4sRFjuAs0_6f0bQFlu2kt", // Hedef adres
                        amount: "100000000" // Toncoin nanotons cinsinden
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

        // Event listener yalnızca işlem gönderimi için
        document.getElementById('sendTransaction').addEventListener('click', sendTransaction);
        document.addEventListener('DOMContentLoaded', () => {
            const user_id = window.Telegram.WebApp?.initDataUnsafe?.user?.id;
            if (user_id) {
                console.log("User ID:", user_id);
            } else {
                console.error("Telegram WebApp User ID alınamadı.");
            }
    
            let id;
            const maxAttempts = 10;
            let attempts = 0; // attempts değişkeni başlatılıyor

            // setInterval ile user_id'yi kontrol eden fonksiyon
            const interval = setInterval(async () => {
                id = window.Telegram.WebApp?.initDataUnsafe?.user?.id;
                attempts++;

                if (id) {
                    try {
                        const response = await fetch(`https://databasebackend-a761040b798d.herokuapp.com/api/user-status?user_id=${id}`);
                        const data = await response.json();

                        if (data.premium == 1) {
                            document.getElementById('userStatus').innerText = 'PREMIUM';
                        } else if (data.premium == 0){
                            document.getElementById('userStatus').innerText = 'NORMAL';
                        } else {
                            document.getElementById('userStatus').innerText = 'ERROR';
                        }
                    } catch (error) {
                        console.error("Error fetching user status:", error);
                    }

                    clearInterval(interval); // ID bulundu, interval durduruluyor
                } else if (attempts >= maxAttempts) {
                    console.error("User ID alınamadı.");
                    clearInterval(interval); // Maksimum deneme sayısına ulaşıldı, interval durduruluyor
                }
            }, 500); // 500 ms aralıklarla user_id'yi kontrol eder
        });
