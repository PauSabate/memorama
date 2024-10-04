const totalCards = 18; // Total de cartas
const availableImages = [
   'img1.jpg', 'img2.jpg', 'img3.jpg', 'img4.jpg', 'img5.jpg',
   'img6.jpg', 'img7.jpg', 'img8.jpg', 'img9.jpg'
];
let cards = [];
let selectedCards = [];
let valuesUsed = [];
let currentMove = 0;
let currentAttempts = 0;

let cardTemplate = '<div class="card"><div class="back"></div><div class="face"></div></div>';

function activate(e) {
   if (currentMove < 2) {
      if ((!selectedCards[0] || selectedCards[0] !== e.target) && !e.target.classList.contains('active')) {
         e.target.classList.add('active');
         selectedCards.push(e.target);

         if (++currentMove == 2) {
            currentAttempts++;
            document.querySelector('#stats').innerHTML = currentAttempts + ' intentos';

            if (selectedCards[0].querySelector('.face img').src === selectedCards[1].querySelector('.face img').src) {
               selectedCards = [];
               currentMove = 0;
            } else {
               setTimeout(() => {
                  selectedCards[0].classList.remove('active');
                  selectedCards[1].classList.remove('active');
                  selectedCards = [];
                  currentMove = 0;
               }, 600);
            }
         }
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
   cards[i].querySelector('.card').addEventListener('click', activate);
}

