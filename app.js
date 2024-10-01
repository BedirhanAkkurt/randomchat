document.addEventListener('DOMContentLoaded', async () => {
    const connectBtn = document.getElementById('connectBtn');
    const disconnectBtn = document.getElementById('disconnectBtn');
    const statusElem = document.getElementById('status');

    // TonConnect SDK ile bağlantıyı başlat
    const connector = new TonConnectSDK.TonConnect();

    // Cüzdan bağlantı durumu değişikliklerine abone ol
    const unsubscribe = connector.onStatusChange(async (walletInfo) => {
        if (walletInfo) {
            statusElem.innerText = `Bağlı: ${walletInfo.account.address}`;

            // TonProof ile bağlantı doğrulaması
            const tonProof = walletInfo.connectItems?.tonProof;
            if (tonProof && 'proof' in tonProof) {
                // Backend'e tonProof'u gönder
                const response = await fetch('https://your-backend-url.com/verify-tonproof', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        proof: tonProof.proof,
                        walletAddress: walletInfo.account.address
                    })
                });

                const result = await response.json();
                if (result.success) {
                    alert('Doğrulama başarılı!');
                } else {
                    alert('Doğrulama başarısız.');
                }
            }

            connectBtn.style.display = 'none';
            disconnectBtn.style.display = 'inline-block';
        } else {
            statusElem.innerText = 'Bağlı değil';
            connectBtn.style.display = 'inline-block';
            disconnectBtn.style.display = 'none';
        }
    });

    // Cüzdanı bağla
    connectBtn.addEventListener('click', async () => {
        try {
            const payloadResponse = await fetch('https://your-backend-url.com/get-auth-payload');
            const { payload } = await payloadResponse.json();

            const walletsList = await connector.getWallets();
            const selectedWallet = walletsList.find(wallet => !wallet.injected); // Kullanıcının seçtiği cüzdan

            if (selectedWallet) {
                await connector.connect({
                    universalLink: selectedWallet.universalLink,
                    bridgeUrl: selectedWallet.bridgeUrl
                }, {
                    tonProof: payload
                });
            }
        } catch (error) {
            console.error("Bağlantı hatası:", error);
            alert("Cüzdan bağlantısı sırasında bir hata oluştu.");
        }
    });

    // Bağlantıyı kes
    disconnectBtn.addEventListener('click', async () => {
        try {
            await connector.disconnect();
            alert("Cüzdan bağlantısı kesildi.");
        } catch (error) {
            console.error("Bağlantı kesme hatası:", error);
            alert("Bağlantıyı kesme sırasında bir hata oluştu.");
        }
    });

    // Daha önce bağlanmış bir cüzdan varsa, bağlantıyı geri yükle
    try {
        await connector.restoreConnection();
    } catch (error) {
        console.log("Daha önce bağlantı yoktu:", error);
    }
});
