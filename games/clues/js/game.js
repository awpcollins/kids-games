(() => {
  const ROUND_SECONDS = 60;

  const categoryScreen = document.getElementById("categoryScreen");
  const playScreen = document.getElementById("playScreen");
  const resultsScreen = document.getElementById("resultsScreen");
  const categoryList = document.getElementById("categoryList");
  const playAgainBtn = document.getElementById("playAgainBtn");
  const changeCategoryBtn = document.getElementById("changeCategoryBtn");
  const successBtn = document.getElementById("successBtn");
  const skipBtn = document.getElementById("skipBtn");
  const itemImage = document.getElementById("itemImage");
  const itemName = document.getElementById("itemName");
  const statsBar = document.getElementById("statsBar");
  const timerValue = document.getElementById("timerValue");
  const scoreValue = document.getElementById("scoreValue");
  const finalScore = document.getElementById("finalScore");
  const finalMessage = document.getElementById("finalMessage");
  const timerEl = document.querySelector(".timer");
  const resultsTitle = resultsScreen.querySelector(".title");

  let selectedCategoryId = null;
  let deck = [];
  let index = 0;
  let score = 0;
  let secondsLeft = ROUND_SECONDS;
  let timerId = null;
  let roundActive = false;
  let finishedEarly = false;

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

  function bumpScore() {
    scoreValue.parentElement.classList.remove("bump");
    void scoreValue.parentElement.offsetWidth;
    scoreValue.parentElement.classList.add("bump");
  }

  function updateHud() {
    timerValue.textContent = String(secondsLeft);
    scoreValue.textContent = String(score);
    timerEl.classList.toggle("urgent", secondsLeft <= 10);
  }

  function buildDeck() {
    deck = shuffle(CATEGORIES[selectedCategoryId].items);
    index = 0;
  }

  function showCurrentItem() {
    const item = deck[index];
    itemName.textContent = item.name;
    itemImage.alt = item.name;
    itemImage.classList.remove("refresh");
    void itemImage.offsetWidth;
    itemImage.src = item.image;
    itemImage.classList.add("refresh");
    requestAnimationFrame(() => {
      itemImage.classList.remove("refresh");
    });
  }

  function advance() {
    index += 1;
    if (index >= deck.length) {
      finishedEarly = true;
      endRound();
      return;
    }
    showCurrentItem();
  }

  function clearTimer() {
    if (timerId !== null) {
      window.clearInterval(timerId);
      timerId = null;
    }
  }

  function endRound() {
    if (!roundActive) {
      return;
    }

    roundActive = false;
    clearTimer();
    statsBar.hidden = true;
    showScreen(resultsScreen);

    resultsTitle.textContent = finishedEarly ? "All done!" : "Time’s up!";
    finalScore.textContent = `${score} correct`;

    if (finishedEarly) {
      finalMessage.textContent =
        score === deck.length
          ? "You got every one — perfect!"
          : "You made it through the whole category!";
    } else if (score === 0) {
      finalMessage.textContent = "No worries — try another round!";
    } else if (score < 5) {
      finalMessage.textContent = "Nice start. Can you beat that score?";
    } else if (score < 10) {
      finalMessage.textContent = "Great teamwork!";
    } else {
      finalMessage.textContent = "Amazing — you two are unstoppable!";
    }
  }

  function tick() {
    secondsLeft -= 1;
    updateHud();
    if (secondsLeft <= 0) {
      finishedEarly = false;
      endRound();
    }
  }

  function startRound() {
    clearTimer();
    score = 0;
    secondsLeft = ROUND_SECONDS;
    roundActive = true;
    finishedEarly = false;
    buildDeck();
    updateHud();
    statsBar.hidden = false;
    showScreen(playScreen);
    showCurrentItem();
    timerId = window.setInterval(tick, 1000);
  }

  function gotIt() {
    if (!roundActive) {
      return;
    }
    score += 1;
    updateHud();
    bumpScore();
    advance();
  }

  function skip() {
    if (!roundActive) {
      return;
    }
    advance();
  }

  function showCategorySelect() {
    clearTimer();
    roundActive = false;
    statsBar.hidden = true;
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
        startRound();
      });
      categoryList.appendChild(button);
    });
  }

  renderCategoryList();
  showCategorySelect();

  playAgainBtn.addEventListener("click", startRound);
  changeCategoryBtn.addEventListener("click", showCategorySelect);
  successBtn.addEventListener("click", gotIt);
  skipBtn.addEventListener("click", skip);
})();
