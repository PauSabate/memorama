const totalCards = 18;
const availableImages = [
    'img1.jpg', 'img2.jpg', 'img3.jpg', 'img4.jpg', 'img5.jpg',
    'img6.jpg', 'img7.jpg', 'img8.jpg', 'img9.jpg'
];
let cards = [];
let selectedCards = [];
let valuesUsed = [];
let currentMove = 0;
let currentAttempts = 0;
const maxAttempts = 20;
let playerWon = false;
let playerAddress = localStorage.getItem('playerAddress');
let cardTemplate = '<div class="card"><div class="back"></div><div class="face"></div></div>';

async function activate(e) {
    if (currentMove < 2) {
        if ((!selectedCards[0] || selectedCards[0] !== e.target) && !e.target.classList.contains('active')) {
            e.target.classList.add('active');
            selectedCards.push(e.target);
            if (++currentMove === 2) {
                currentAttempts++;
                document.querySelector('#stats').innerHTML = currentAttempts + ' intentos';
                const img1 = selectedCards[0].querySelector('.face img').src.split('/').pop();
                const img2 = selectedCards[1].querySelector('.face img').src.split('/').pop();
                if (img1 === img2) {
                    selectedCards[0].classList.add('matched');
                    selectedCards[1].classList.add('matched');
                    selectedCards = [];
                    currentMove = 0;
                    if (currentAttempts <= maxAttempts && allPairsMatched()) {
                        playerWon = true;
                        await rewardPlayer();  
                    }
                } else {
                    setTimeout(() => {
                        selectedCards[0].classList.remove('active');
                        selectedCards[1].classList.remove('active');
                        selectedCards = [];
                        currentMove = 0;
                    }, 600);
                }
                if (currentAttempts >= maxAttempts) {
                    alert("Has excedit el número máxim d'intents.");
                    return;
                }
            }
        }
    }
}

async function rewardPlayer() {
    const nftContractAddress = '0x4421f19bec9e81bb31214a91d309c03eac0740df'; 
    const nftTokenId = 1;  
    const amount = 1;  
    const data = '0x';  
    const contractABI = [
        "function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes data)",
        "function balanceOf(address account, uint256 id) view returns (uint256)"
    ];    
    const ownerPrivateKey = 'dotenv'; 
    try {
        const provider = new ethers.providers.InfuraProvider('sepolia', '9fb950985dcd4a1db29007478b3001af');
        const wallet = new ethers.Wallet(ownerPrivateKey, provider);
        const ownerAddress = await wallet.getAddress();
        const contract = new ethers.Contract(nftContractAddress, contractABI, wallet);
        if (!ethers.utils.isAddress(playerAddress)) {
            alert('Direcció de wallet del jugador no válida.');
            return;
        }
        const balance = await contract.balanceOf(ownerAddress, nftTokenId);
        if (balance < 1) {
            alert('El propietari no té suficients tokens para transferir.');
            return;
        }
        const tx = await contract.safeTransferFrom(
            ownerAddress, 
            playerAddress,  
            nftTokenId,      
            amount,          
            data,          
            { gasLimit: 100000 }  
        );
        await tx.wait();
        alert("¡Has guanyat el NFT! S'ha transferit a la teva wallet.");
    } catch (error) {
        if (error.code === ethers.errors.CALL_EXCEPTION) {
            console.error('Error en la transferencia:', error);
            alert("Error: La funció de transferencia no s'ha pogut executar. Verifica l'ABI y la direcció del contracte.");
        } else {
            console.error('Error al transferir el NFT:', error);
            alert('Error al transferir el NFT. Torna-ho a intentar.');
        }
    }
}

function randomValue() {
    let rnd;
    do {
        rnd = Math.floor(Math.random() * availableImages.length);
    } while (valuesUsed.filter(value => value === rnd).length >= 2);
    valuesUsed.push(rnd);
    return rnd;
}
function getImageValue(value) {
    return availableImages[value];
}
function allPairsMatched() {
    return document.querySelectorAll('.card.matched').length === totalCards;
}
for (let i = 0; i < totalCards; i++) {
    let div = document.createElement('div');
    div.innerHTML = cardTemplate;
    cards.push(div);
    document.querySelector('#game').append(cards[i]);
    let imageIndex = randomValue();
    const img = document.createElement('img');
    img.src = `images/${getImageValue(imageIndex)}`; 
    img.style.width = "100%";  
    img.style.height = "100%";
    cards[i].querySelector('.face').appendChild(img);
    cards[i].addEventListener('click', activate);  
}