const COLORS = ['#e63946', '#f4a261', '#ffd23f', '#2a9d8f', '#4cc9f0', '#4361ee', '#9b5de5', '#f15bb5'];

const boardEl = document.getElementById('board');
const scoreEl = document.getElementById('score');
const movesEl = document.getElementById('moves');
const messageEl = document.getElementById('message');

let first = null;      // первая открытая карточка
let locked = false;    // true, пока проверяется пара
let score = 0;
let moves = 0;

// Тасование Фишера—Йетса (равномерное, в отличие от sort(() => Math.random() - 0.5))
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function createCard(color) {
  const card = document.createElement('button');
  card.type = 'button';
  card.className = 'card';
  card.dataset.color = color;
  card.setAttribute('aria-label', 'Закрытая карточка');
  card.innerHTML = '<div class="card-inner"><div class="face back"></div>' +
                   '<div class="face front" style="--c:' + color + '"></div></div>';
  card.addEventListener('click', () => onCardClick(card));
  return card;
}

function onCardClick(card) {
  if (locked) return;                                   // третью карточку открыть нельзя
  if (card === first) return;                           // повторный клик по той же карточке
  if (card.classList.contains('matched')) return;       // найденные пары не реагируют

  card.classList.add('flipped');

  if (!first) {
    first = card;
    return;
  }

  moves++;
  movesEl.textContent = moves;

  if (first.dataset.color === card.dataset.color) {
    first.classList.add('matched');
    card.classList.add('matched');
    score++;
    scoreEl.textContent = score;
    first = null;
    if (score === COLORS.length) {
      messageEl.textContent = 'Победа! Ходов: ' + moves;
    }
  } else {
    locked = true;
    const a = first;
    first = null;
    setTimeout(() => {
      a.classList.remove('flipped');
      card.classList.remove('flipped');
      locked = false;
    }, 1000);
  }
}

function startGame() {
  first = null;
  locked = false;
  score = 0;
  moves = 0;
  scoreEl.textContent = 0;
  movesEl.textContent = 0;
  messageEl.textContent = '';
  boardEl.innerHTML = '';
  shuffle(COLORS.concat(COLORS)).forEach(c => boardEl.appendChild(createCard(c)));
}

document.getElementById('restart').addEventListener('click', startGame);
startGame();
