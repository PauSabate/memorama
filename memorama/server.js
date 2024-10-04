const express = require('express');
const ethers = require('ethers');

const app = express();
app.use(express.json());

// Configuración de la red y la clave privada
const PRIVATE_KEY = process.env.PRIVATE_KEY || 'TU_CLAVE_PRIVADA';  // Reemplazar por la clave privada del propietario
const provider = new ethers.providers.JsonRpcProvider('https://zksync2-testnet.zksync.dev');  // RPC de zkSync Lite
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

// Endpoint para transferir el NFT
app.post('/send-nft', async (req, res) => {
    const { playerAddress, tokenId } = req.body;

    try {
        // Transacción de transferencia del NFT usando el contrato ERC-721 o similar
        const tx = {
            to: playerAddress,
            value: ethers.utils.parseEther("0"),  // Sin transferencia de ETH, solo el NFT
            data: ethers.utils.defaultAbiCoder.encode(
                ['address', 'uint256'],  // Parámetros de transferencia del NFT
                [playerAddress, tokenId]
            ),
            gasLimit: 300000  // Limite de gas para la transacción
        };

        // Firmar y enviar la transacción con la wallet del backend
        const transactionResponse = await wallet.sendTransaction(tx);
        await transactionResponse.wait();  // Esperar la confirmación

        console.log('Transacción enviada:', transactionResponse.hash);
        res.status(200).send({ success: true, transactionHash: transactionResponse.hash });
    } catch (error) {
        console.error('Error al enviar el NFT:', error);
        res.status(500).send({ success: false, error: error.message });
    }
});

// Iniciar el servidor en el puerto 3000
app.listen(3000, () => {
    console.log('Servidor de transferencia de NFTs escuchando en el puerto 3000');
});
