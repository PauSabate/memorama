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
let playerAddress = localStorage.getItem('playerAddress');  // Recuperar la dirección de la wallet conectada

let cardTemplate = '<div class="card"><div class="back"></div><div class="face"></div></div>';

// Función para activar las cartas cuando el jugador las selecciona
async function activate(e) {
    if (currentMove < 2) {
        if ((!selectedCards[0] || selectedCards[0] !== e.target) && !e.target.classList.contains('active')) {
            e.target.classList.add('active');
            selectedCards.push(e.target);

            if (++currentMove === 2) {
                currentAttempts++;
                document.querySelector('#stats').innerHTML = currentAttempts + ' intentos';

                // Comparar las imágenes correctamente
                const img1 = selectedCards[0].querySelector('.face img').src.split('/').pop();
                const img2 = selectedCards[1].querySelector('.face img').src.split('/').pop();

                if (img1 === img2) {
                    selectedCards[0].classList.add('matched');
                    selectedCards[1].classList.add('matched');
                    selectedCards = [];
                    currentMove = 0;

                    if (currentAttempts <= maxAttempts && allPairsMatched()) {
                        playerWon = true;
                        await rewardPlayer();  // Transferir NFT al ganador
                    }
                } else {
                    setTimeout(() => {
                        selectedCards[0].classList.remove('active');
                        selectedCards[1].classList.remove('active');
                        selectedCards = [];
                        currentMove = 0;
                    }, 600);
                }

                // Comprobación si ha superado el número máximo de intentos
                if (currentAttempts >= maxAttempts) {
                    alert('Has excedido el número máximo de intentos.');
                    return;
                }
            }
        }
    }
}

// Función para transferir el NFT al jugador ganador (ERC-1155)
async function rewardPlayer() {
    const nftContractAddress = '0x4421f19bec9e81bb31214a91d309c03eac0740df';  // Dirección del contrato del NFT
    const nftTokenId = 1;  // El ID del token del NFT que estás transfiriendo
    const amount = 1;  // Cantidad de tokens a transferir (para ERC-1155)
    const data = '0x';  // Datos adicionales (puede ser vacío)
    const contractABI = [
        "function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes data)",
        "function balanceOf(address account, uint256 id) view returns (uint256)"
    ];    

    // Clave privada del propietario del NFT (Usar solo en un entorno seguro)
    const ownerPrivateKey = 'dotenv';  // ¡No compartas ni uses esto en producción!

    try {
        // Comprobar si la dirección del jugador es la misma que la del propietario
        const provider = new ethers.providers.InfuraProvider('sepolia', '9fb950985dcd4a1db29007478b3001af');
        const wallet = new ethers.Wallet(ownerPrivateKey, provider);
        const ownerAddress = await wallet.getAddress();

        // Crear una instancia del contrato NFT usando la ABI y la dirección del contrato
        const contract = new ethers.Contract(nftContractAddress, contractABI, wallet);

        // Verificar si la dirección del jugador está correctamente configurada
        if (!ethers.utils.isAddress(playerAddress)) {
            alert('Dirección de wallet del jugador no válida.');
            return;
        }

        // Verificar el balance del NFT para asegurarse de que el propietario tiene al menos 1 token
        const balance = await contract.balanceOf(ownerAddress, nftTokenId);
        if (balance < 1) {
            alert('El propietario no tiene suficientes tokens para transferir.');
            return;
        }

        // Llamar a la función `safeTransferFrom` para transferir el NFT al jugador (ERC-1155)
        const tx = await contract.safeTransferFrom(
            ownerAddress,  // Dirección del propietario actual del NFT
            playerAddress,   // Dirección de la wallet del jugador ganador
            nftTokenId,      // ID del token NFT que estás transfiriendo
            amount,          // Cantidad de tokens a transferir
            data,            // Datos adicionales (puede ser '0x')
            { gasLimit: 100000 }  // Agregar manualmente un límite de gas
        );

        // Esperar la confirmación de la transacción
        await tx.wait();

        alert('¡Has ganado el NFT! Se ha transferido a tu wallet.');
    } catch (error) {
        if (error.code === ethers.errors.CALL_EXCEPTION) {
            console.error('Error en la transferencia:', error);
            alert('Error: La función de transferencia no se puede ejecutar. Verifica la ABI y el contrato.');
        } else {
            console.error('Error al transferir el NFT:', error);
            alert('Error al transferir el NFT. Inténtalo de nuevo.');
        }
    }
}

// Función para generar un valor aleatorio para las imágenes de las cartas
function randomValue() {
    let rnd;
    do {
        rnd = Math.floor(Math.random() * availableImages.length);
    } while (valuesUsed.filter(value => value === rnd).length >= 2);
    valuesUsed.push(rnd);
    return rnd;
}

// Asigna la imagen a la carta correspondiente
function getImageValue(value) {
    return availableImages[value];
}

// Verificar si todas las parejas han sido encontradas
function allPairsMatched() {
    return document.querySelectorAll('.card.matched').length === totalCards;
}

// Inicialización del juego
for (let i = 0; i < totalCards; i++) {
    let div = document.createElement('div');
    div.innerHTML = cardTemplate;
    cards.push(div);
    document.querySelector('#game').append(cards[i]);

    // Obtener valor de imagen y asignarlo
    let imageIndex = randomValue();

    const img = document.createElement('img');
    img.src = `images/${getImageValue(imageIndex)}`; // Asigna la imagen correspondiente
    img.style.width = "100%";  // Ajustar tamaño de la imagen
    img.style.height = "100%";

    cards[i].querySelector('.face').appendChild(img);
    cards[i].addEventListener('click', activate);  // Corregido el selector del evento click
}
