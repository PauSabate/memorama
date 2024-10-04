// Dirección del contrato de depósito en Sepolia
const contractAddress = '0xa337CFd57f28DbC2ec7AcF417921A5F3dbddB612'; // Aquí pones la dirección del contrato

// ABI del contrato de Sepolia
const contractABI = [
{
"inputs": [],
"name": "deposit",
"outputs": [],
"stateMutability": "payable",
"type": "function"
},
{
"inputs": [
    {
        "internalType": "address",
        "name": "player",
        "type": "address"
    }
],
"name": "resetDeposit",
"outputs": [],
"stateMutability": "nonpayable",
"type": "function"
},
{
"inputs": [
    {
        "internalType": "uint256",
        "name": "newFee",
        "type": "uint256"
    }
],
"name": "setEntryFee",
"outputs": [],
"stateMutability": "nonpayable",
"type": "function"
},
{
"inputs": [],
"stateMutability": "nonpayable",
"type": "constructor"
},
{
"inputs": [],
"name": "withdraw",
"outputs": [],
"stateMutability": "nonpayable",
"type": "function"
},
{
"inputs": [],
"name": "entryFee",
"outputs": [
    {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }
],
"stateMutability": "view",
"type": "function"
},
{
"inputs": [],
"name": "getContractBalance",
"outputs": [
    {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }
],
"stateMutability": "view",
"type": "function"
},
{
"inputs": [
    {
        "internalType": "address",
        "name": "",
        "type": "address"
    }
],
"name": "hasDeposited",
"outputs": [
    {
        "internalType": "bool",
        "name": "",
        "type": "bool"
    }
],
"stateMutability": "view",
"type": "function"
},
{
"inputs": [],
"name": "owner",
"outputs": [
    {
        "internalType": "address",
        "name": "",
        "type": "address"
    }
],
"stateMutability": "view",
"type": "function"
}
];

// Función para conectar la wallet usando MetaMask
async function connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            await ethereum.request({ method: 'eth_requestAccounts' });
            alert('Wallet conectada correctament');
        } catch (error) {
            console.error('Error al conectar la wallet:', error);
        }
    } else {
        alert('Si us plau, instal·la MetaMask per continuar.');
    }
}

async function participate() {
if (typeof window.ethereum !== 'undefined') {
try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []); // Solicitar acceso a la wallet

    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    // Verifica si la tarifa es correcta, o simplemente usa directamente 0.1 ETH
    const tx = await contract.deposit({
        value: ethers.utils.parseEther("0.1") // Aquí asegúrate de enviar exactamente 0.1 SepoliaETH
    });

    await tx.wait(); // Esperar la confirmación de la transacción

    alert('Depòsit realitzat correctament. Ara pots començar a jugar.');
    window.location.href = 'index.html'; // Redirigir al juego
} catch (error) {
    console.error('Error al realitzar el dipòsit:', error);
    alert('Error al realitzar el dipòsit. Intenta novament.');
}
} else {
alert('Si us plau, instal·la MetaMask per continuar.');
}
}
// Asignar eventos a los botones
document.getElementById('conectarWallet').addEventListener('click', connectWallet);
document.getElementById('participar').addEventListener('click', participate);


