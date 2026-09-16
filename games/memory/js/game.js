(() => {
  const PAIR_COUNT = 8;

  const categoryScreen = document.getElementById("categoryScreen");
  const playScreen = document.getElementById("playScreen");
  const resultsScreen = document.getElementById("resultsScreen");
  const categoryList = document.getElementById("categoryList");
  const board = document.getElementById("board");
  const movesDisplay = document.getElementById("movesDisplay");
  const movesValue = document.getElementById("movesValue");
  const playAgainBtn = document.getElementById("playAgainBtn");
  const changeCategoryBtn = document.getElementById("changeCategoryBtn");
  const finalScore = document.getElementById("finalScore");
  const finalMessage = document.getElementById("finalMessage");

  let selectedCategoryId = null;
  let cards = [];
  let flipped = [];
  let matchedCount = 0;
  let moves = 0;
  let locked = false;

  function shuffle(list) {
    const copy = [...list];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function showScreen(screen) {
    categoryScreen.hidden = screen !== categoryScreen;
    playScreen.hidden = screen !== playScreen;
    resultsScreen.hidden = screen !== resultsScreen;
  }

  function updateMoves() {
    movesValue.textContent = String(moves);
  }

  function buildDeck() {
    const items = shuffle(CATEGORIES[selectedCategoryId].items).slice(
      0,
      PAIR_COUNT
    );
    const pairs = items.flatMap((item) => [
      { id: item.id, name: item.name, image: item.image, key: `${item.id}-a` },
      { id: item.id, name: item.name, image: item.image, key: `${item.id}-b` },
    ]);
    return shuffle(pairs);
  }

  function createCardElement(card, index) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "memory-card";
    button.dataset.index = String(index);
    button.setAttribute("aria-label", "Hidden card");
    button.innerHTML = `
      <span class="memory-card-inner">
        <span class="memory-card-face memory-card-back" aria-hidden="true">?</span>
        <span class="memory-card-face memory-card-front">
          <img src="${card.image}" alt="" width="96" height="96" />
        </span>
      </span>
    `;
    button.addEventListener("click", () => onCardClick(index));
    return button;
  }

  function renderBoard() {
    board.innerHTML = "";
    cards.forEach((card, index) => {
      board.appendChild(createCardElement(card, index));
    });
  }

  function getCardButton(index) {
    return board.querySelector(`[data-index="${index}"]`);
  }

  function flipUp(index) {
    const button = getCardButton(index);
    button.classList.add("is-flipped");
    button.setAttribute("aria-label", cards[index].name);
  }

  function flipDown(index) {
    const button = getCardButton(index);
    button.classList.remove("is-flipped");
    button.setAttribute("aria-label", "Hidden card");
  }

  function markMatched(index) {
    const button = getCardButton(index);
    button.classList.add("is-matched");
    button.disabled = true;
  }

  function onCardClick(index) {
    if (locked) {
      return;
    }

    const card = cards[index];
    if (!card || card.matched) {
      return;
    }
    if (flipped.includes(index)) {
      return;
    }
    if (flipped.length >= 2) {
      return;
    }

    flipUp(index);
    flipped.push(index);

    if (flipped.length < 2) {
      return;
    }

    moves += 1;
    updateMoves();
    locked = true;

    const [firstIndex, secondIndex] = flipped;
    const first = cards[firstIndex];
    const second = cards[secondIndex];

    if (first.id === second.id) {
      first.matched = true;
      second.matched = true;
      markMatched(firstIndex);
      markMatched(secondIndex);
      matchedCount += 1;
      flipped = [];
      locked = false;

      if (matchedCount >= PAIR_COUNT) {
        window.setTimeout(endGame, 450);
      }
      return;
    }

    window.setTimeout(() => {
      flipDown(firstIndex);
      flipDown(secondIndex);
      flipped = [];
      locked = false;
    }, 850);
  }

  function startGame() {
    cards = buildDeck().map((card) => ({ ...card, matched: false }));
    flipped = [];
    matchedCount = 0;
    moves = 0;
    locked = false;
    updateMoves();
    movesDisplay.hidden = false;
    renderBoard();
    showScreen(playScreen);
  }

  function endGame() {
    movesDisplay.hidden = true;
    showScreen(resultsScreen);
    finalScore.textContent = `${moves} moves`;
    if (moves <= PAIR_COUNT + 2) {
      finalMessage.textContent = "Incredible memory!";
    } else if (moves <= PAIR_COUNT * 2) {
      finalMessage.textContent = "Great job — sharp remembering!";
    } else {
      finalMessage.textContent = "Nice work. Try again for fewer moves!";
    }
  }

  function showCategorySelect() {
    movesDisplay.hidden = true;
    showScreen(categoryScreen);
  }

  function renderCategoryList() {
    categoryList.innerHTML = "";
    getCategoryList().forEach((category) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "category-card";
      button.innerHTML = `
        <img src="${category.icon}" alt="" width="72" height="72" />
        <span class="category-card-title">${category.name}</span>
      `;
      button.addEventListener("click", () => {
        selectedCategoryId = category.id;
        startGame();
      });
      categoryList.appendChild(button);
    });
  }

  renderCategoryList();
  showCategorySelect();

  playAgainBtn.addEventListener("click", startGame);
  changeCategoryBtn.addEventListener("click", showCategorySelect);
})();
