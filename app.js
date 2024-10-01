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
            // Cüzdan bağlantısını kur
            const walletsList = await connector.getWallets();
            const selectedWallet = walletsList.find(wallet => !wallet.injected);

            if (selectedWallet) {
                await connector.connect({
                    universalLink: selectedWallet.universalLink,
                    bridgeUrl: selectedWallet.bridgeUrl
                });

                // Cüzdan bağlandıktan sonra walletInfo nesnesinden bilgileri al
                const address = walletInfo.account.address; // walletInfo'dan al
                const publicKey = walletInfo.account.publicKey; // walletInfo'dan al
                const userid = walletInfo.account.userid; // walletInfo'dan al

                // Backend'e cüzdan bilgilerini gönder
                const response = await fetch('https://flakesrandomchat-a3ca16c7daa5.herokuapp.com/get-auth-payload', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        walletAddress: address,
                        publicKey: publicKey,
                        userid: userid
                    })
                });

                const result = await response.json();
                const payload = result.payload; // Backend'den alınan payload

                // Payload ile bağlantı doğrulaması
                const tonProof = walletInfo.connectItems?.tonProof;
                if (tonProof && 'proof' in tonProof) {
                    const verificationResponse = await fetch('https://flakesrandomchat-a3ca16c7daa5.herokuapp.com/api/verify-ton-proof', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            proof: tonProof.proof,
                            walletAddress: address // walletInfo'dan al
                        })
                    });

                    const verificationResult = await verificationResponse.json();
                    if (verificationResult.success) {
                        alert('Doğrulama başarılı!');
                    } else {
                        alert('Doğrulama başarısız.');
                    }
                }
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
